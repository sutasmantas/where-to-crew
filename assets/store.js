/* Where To, Crew? — shared data layer (swappable backend).
   ONE small API the whole site uses, so people's decisions go to a shared,
   durable store everyone sees — and each person can come back and EDIT their own.

   • Backend = a Cloudflare Worker (KV) keyed per trip (see config.js). KV is
     durable for years and the Worker URL is the only thing to swap if you ever
     move backends.
   • OFFLINE-FIRST: reads fall back to a local cache; writes are optimistic and
     queue locally when offline, flushing automatically when you're back online.
   • LOCAL-ONLY fallback: if apiUrl isn't set, everything still works on-device.

   Entry shape per person:
     { name, going, signup:{dates,vibes,activities,stops,length,budget,notes},
       plan:{sel,total,days,nights,bookings}, updated }
*/
(function(){
  var CFG  = window.WTC_CFG || {};
  var TRIP = CFG.trip;
  if(!/^[a-z0-9-]+$/.test(TRIP||'')) throw new Error('Trip namespace missing: load config.js before store.js');
  var API  = (CFG.apiUrl && CFG.apiUrl.indexOf('<') < 0) ? CFG.apiUrl : '';   // '' until a real URL is set
  var CACHEKEY = 'wtc-crew-' + TRIP;
  var PENDKEY  = 'wtc-pending-' + TRIP;
  var MEKEY    = 'wtc-me';

  function ls(k,f){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):f; }catch(e){ return f; } }
  function save(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }

  function meName(){ try{ return localStorage.getItem(MEKEY) || ''; }catch(e){ return ''; } }
  function setMe(n){ try{ localStorage.setItem(MEKEY, n||''); }catch(e){} }
  // The Worker removes non-ASCII characters from keys. Use its exact key shape
  // here, and treat accented/unaccented spellings of a name as one identity.
  function serverKey(n){ return String(n||'').replace(/\s+/g,' ').replace(/[^a-z0-9_\- ]/gi,'').trim().slice(0,80).toLowerCase(); }
  function personId(n){ return String(n||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim(); }
  function canonicalCrew(input){
    var groups={};
    Object.keys(input||{}).forEach(function(k){
      var e=input[k]; if(!e || typeof e!=='object') return;
      var id=personId(e.name||k); if(!id) return;
      (groups[id]=groups[id]||[]).push({key:serverKey(k)||serverKey(e.name),entry:e});
    });
    var out={};
    Object.keys(groups).forEach(function(id){
      var rows=groups[id].sort(function(a,b){ return Number(a.entry.updated||0)-Number(b.entry.updated||0); });
      var key=rows[0].key, merged={};
      rows.forEach(function(row){ merged=Object.assign(merged,row.entry); });
      if(key) out[key]=merged;
    });
    return out;
  }
  function readCache(){ return canonicalCrew(ls(CACHEKEY, {}) || {}); }
  function keyFor(n){
    var id=personId(n), crew=readCache();
    return Object.keys(crew).find(function(k){ return personId(crew[k].name||k)===id; }) || serverKey(n);
  }
  function changed(){ window.dispatchEvent(new CustomEvent('wtc:crew-updated', {detail:{trip:TRIP}})); }
  function writeCache(o){ save(CACHEKEY, o||{}); changed(); }

  /* ---- reads ---- */
  function fetchAll(){
    if(!API) return Promise.resolve(readCache());
    return fetch(API + '?trip=' + encodeURIComponent(TRIP), { headers:{ 'Accept':'application/json' } })
      .then(function(r){ if(!r.ok) throw new Error('store read failed: '+r.status); return r.json(); })
      .then(function(o){ var crew = canonicalCrew((o && o.crew) || o || {}), local=readCache(), pending=ls(PENDKEY,{})||{};
        Object.keys(local).forEach(function(k){
          var entry=local[k], id=personId(entry.name||k);
          var remoteKey=Object.keys(crew).find(function(rk){ return personId(crew[rk].name||rk)===id; });
          if(remoteKey){
            var remote=crew[remoteKey], newer=Number(entry.updated||0)>Number(remote.updated||0);
            crew[remoteKey]=Object.assign({},newer?remote:entry,newer?entry:remote,{name:remote.name||entry.name});
          } else if(Object.keys(pending).some(function(pk){ return personId(pending[pk].name||pk)===id; }) || Date.now()-Number(entry.updated||0)<120000){ crew[k]=entry; }
        });
        writeCache(crew); return crew; })
      .catch(function(){ return readCache(); });            // offline → last-known cache
  }

  /* ---- writes (upsert my own entry; optimistic + offline queue) ---- */
  var initialRead = API ? fetchAll() : Promise.resolve(readCache());
  function saveMine(patch){
    return initialRead.then(function(){ return saveMineReady(patch); });
  }
  function saveMineReady(patch){
    var name = meName();
    if(!name && patch && patch.name){ name = patch.name; setMe(name); }
    var k = keyFor(name);
    if(!k) return Promise.resolve(null);                    // no identity yet → nothing to save
    var crew = readCache();
    var displayName=crew[k] && personId(crew[k].name)===personId(name) ? crew[k].name : name;
    var entry = Object.assign({}, crew[k], patch, { name:displayName, updated:Date.now() });
    crew[k] = entry; writeCache(crew);                      // optimistic local update
    if(!API) return Promise.resolve({crew:crew,synced:false});
    return postEntry(k, entry)
      .then(function(){ clearPending(k); flushPending(); return {crew:crew,synced:true}; })
      .catch(function(){ queuePending(k, entry); return {crew:crew,synced:false}; });   // offline → queue
  }

  function postEntry(k, entry){
    return fetch(API, { method:'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ trip:TRIP, key:k, entry:entry }) })
      .then(function(r){ if(!r.ok) throw new Error('bad'); return r; });
  }
  function queuePending(k, entry){ var p=ls(PENDKEY,{})||{}; p[k]=entry; save(PENDKEY,p); }
  function clearPending(k){
    var p=ls(PENDKEY,{})||{}, current=readCache()[k], id=personId((current&&current.name)||meName());
    Object.keys(p).forEach(function(pk){ if(pk===k || personId(p[pk].name||pk)===id) delete p[pk]; });
    save(PENDKEY,p);
  }
  function flushPending(){
    if(!API) return;
    initialRead.then(function(){
      var p=ls(PENDKEY,{})||{};
      Object.keys(p).forEach(function(k){
        var target=keyFor(p[k].name||k), current=readCache()[target];
        if(current && Number(current.updated||0)>Number(p[k].updated||0)){
          delete p[k]; save(PENDKEY,p); return;
        }
        postEntry(target, p[k]).then(function(){ var q=ls(PENDKEY,{})||{}; delete q[k]; save(PENDKEY,q); }).catch(function(){});
      });
    });
  }
  window.addEventListener('online', flushPending);
  window.addEventListener('focus', fetchAll);
  window.addEventListener('storage', function(e){ if(e.key===CACHEKEY) changed(); });

  window.Store = {
    enabled: !!API,
    trip: TRIP,
    me: meName,
    setMe: setMe,
    key: keyFor,
    all: fetchAll,        // → Promise(crewObj)  (network, falls back to cache)
    cached: readCache,    // → crewObj  (synchronous, last-known)
    saveMine: saveMine,   // → Promise({crew,synced}) or null when no name is set
    flush: flushPending
  };

  flushPending();
})();
