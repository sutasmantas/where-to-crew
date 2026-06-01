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
  var TRIP = CFG.trip || 'poland';
  var API  = (CFG.apiUrl && CFG.apiUrl.indexOf('<') < 0) ? CFG.apiUrl : '';   // '' until a real URL is set
  var CACHEKEY = 'wtc-crew-' + TRIP;
  var PENDKEY  = 'wtc-pending-' + TRIP;
  var MEKEY    = 'wtc-me';

  function ls(k,f){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):f; }catch(e){ return f; } }
  function save(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }

  function meName(){ try{ return localStorage.getItem(MEKEY) || ''; }catch(e){ return ''; } }
  function setMe(n){ try{ localStorage.setItem(MEKEY, n||''); }catch(e){} }
  function keyFor(n){ return (n||'').trim().toLowerCase().replace(/\s+/g,' '); }

  function readCache(){ return ls(CACHEKEY, {}) || {}; }
  function writeCache(o){ save(CACHEKEY, o||{}); }

  /* ---- reads ---- */
  function fetchAll(){
    if(!API) return Promise.resolve(readCache());
    return fetch(API + '?trip=' + encodeURIComponent(TRIP), { headers:{ 'Accept':'application/json' } })
      .then(function(r){ return r.ok ? r.json() : {}; })
      .then(function(o){ var crew = (o && o.crew) || o || {}; writeCache(crew); return crew; })
      .catch(function(){ return readCache(); });            // offline → last-known cache
  }

  /* ---- writes (upsert my own entry; optimistic + offline queue) ---- */
  function saveMine(patch){
    var name = meName();
    if(!name && patch && patch.name){ name = patch.name; setMe(name); }
    var k = keyFor(name);
    if(!k) return Promise.resolve(null);                    // no identity yet → nothing to save
    var crew = readCache();
    var entry = Object.assign({}, crew[k], patch, { name:name, updated:Date.now() });
    crew[k] = entry; writeCache(crew);                      // optimistic local update
    if(!API) return Promise.resolve(crew);
    return postEntry(k, entry)
      .then(function(){ flushPending(); return crew; })
      .catch(function(){ queuePending(k, entry); return crew; });   // offline → queue
  }

  function postEntry(k, entry){
    return fetch(API, { method:'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ trip:TRIP, key:k, entry:entry }) })
      .then(function(r){ if(!r.ok) throw new Error('bad'); return r; });
  }
  function queuePending(k, entry){ var p=ls(PENDKEY,{})||{}; p[k]=entry; save(PENDKEY,p); }
  function flushPending(){
    if(!API) return; var p=ls(PENDKEY,{})||{}; var keys=Object.keys(p); if(!keys.length) return;
    keys.forEach(function(k){
      postEntry(k, p[k]).then(function(){ var q=ls(PENDKEY,{})||{}; delete q[k]; save(PENDKEY,q); }).catch(function(){});
    });
  }
  window.addEventListener('online', flushPending);

  window.Store = {
    enabled: !!API,
    trip: TRIP,
    me: meName,
    setMe: setMe,
    key: keyFor,
    all: fetchAll,        // → Promise(crewObj)  (network, falls back to cache)
    cached: readCache,    // → crewObj  (synchronous, last-known)
    saveMine: saveMine,   // → Promise
    flush: flushPending
  };

  if(API) fetchAll();     // warm the cache on load
  flushPending();
})();
