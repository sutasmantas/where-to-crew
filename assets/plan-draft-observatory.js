/* ============================================================
   Where To, Crew? — OBSERVATORY plan-draft engine  ("Orbit To The Telescope")
   One plan-state object, live per-person total, a TIME meter that PROTECTS the
   registered night-telescope slot, a bookings panel, decision progress and crew
   leaning. Mirrors the Poland engine's mechanics; content from
   Observatory-Trip-Research.md §8 (decision layer) / §9 (cost) / §10 (time) / §11 (bookings).
   State persists to 'wtc-observatory-plan' (own bucket) + the shared store.
   ============================================================ */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- plan-state (one object) ---------- */
  var TYPE={}, sel={};
  document.querySelectorAll('.opt[data-group]').forEach(function(opt){
    var g=opt.getAttribute('data-group'), t=opt.getAttribute('data-type');
    TYPE[g]=t; sel[g]=(t==='multi')?[]:null;
  });
  var myKey=(window.Store?window.Store.key(window.Store.me()):'');
  var shared=(window.Store&&myKey)?(window.Store.cached()[myKey]||null):null;
  var saved=(shared&&shared.plan)?shared.plan:WTC.load('wtc-observatory-plan',null);
  var bookingStatus=(saved&&saved.bookingStatus)||{};
  if(saved&&saved.sel){ Object.keys(sel).forEach(function(g){ if(saved.sel[g]==null) return; sel[g]=(TYPE[g]==='multi')?(Array.isArray(saved.sel[g])?saved.sel[g].slice():[]):saved.sel[g]; }); }
  sel.routeStyle=sel.routeStyle||'direct';
  sel.mainStop=sel.mainStop||'none';
  sel.dayProgram=sel.dayProgram==='deck'?'outdoor':(sel.dayProgram||'outdoor');
  sel.food=sel.food||'picnic';
  sel.seasonWindow='oct'; sel.dateStrategy='best-sky'; sel.anchor='80cm'; sel.weatherPlan='strict';

  /* ---------- labels ---------- */
  var LABEL={
    sept:'Early fall · September', oct:'Mid fall · October', nov:'Late fall · November',
    'best-sky':'Best sky window', 'easy-saturday':'Easiest Saturday', custom:'Custom date',
    '80cm':'80 cm telescope', '40cm':'40 cm telescope',
    direct:'Direct route', nature:'Nature route', culture:'Culture route',
    none:'No stop — arrive early', 'moletai-food':'Molėtai food / warm-up', mindunai:'Mindūnai tower + Labanoras', dubingiai:'Dubingiai + Asveja', rumsiskes:'Rumšiškės Open-Air Museum', taujenai:'Taujėnai Manor', ukmerge:'Ukmergė food stop',
    fulltour:'Guided museum tour + observation deck', outdoor:'Outdoor exhibition',
    picnic:'Pack snacks / picnic', 'moletai-cafe':'Molėtai café / restaurant', 'route-meal':'Ukmergė / Taujėnai meal',
    'one-driver':'One rested driver', 'driver-swap':'Driver swap plan', 'emergency-hotel':'Emergency nearby stay',
    strict:'Strict sky-first', 'go-anyway':'Go anyway',
    thermos:'Thermos / hot chocolate', photo:'Photo challenge', playlist:'Shared playlist', bestthing:'Best-thing lap'
  };
  function lab(v){ return LABEL[v]||v; }

  /* ---------- DOM helpers ---------- */
  function groupEl(g){ return document.querySelector('.opt[data-group="'+g+'"]'); }
  function choices(g){ return groupEl(g)?[].slice.call(groupEl(g).querySelectorAll('.choice')):[]; }
  function choiceEl(g,v){ return groupEl(g)?groupEl(g).querySelector('.choice[data-val="'+v+'"]'):null; }
  function num(c,a){ return c?(parseFloat(c.getAttribute(a))||0):0; }
  function priceOf(g,v){ return num(choiceEl(g,v),'data-price'); }
  function hoursOf(g,v){ return num(choiceEl(g,v),'data-hours'); }
  function driveOf(g,v){ return num(choiceEl(g,v),'data-drive'); }
  function has(g,v){ return TYPE[g]==='multi'?sel[g].indexOf(v)>=0:sel[g]===v; }
  function show(el){ if(!el) return; if(el.hasAttribute('hidden')){ el.removeAttribute('hidden'); if(!reduce){ el.classList.remove('reveal-anim'); void el.offsetWidth; el.classList.add('reveal-anim'); } } }
  function hide(el){ if(el) el.setAttribute('hidden',''); }

  function paint(){
    document.querySelectorAll('.opt[data-group]').forEach(function(opt){
      var g=opt.getAttribute('data-group');
      opt.querySelectorAll('.choice').forEach(function(c){ c.classList.toggle('sel', has(g,c.getAttribute('data-val'))); });
    });
  }

  document.querySelectorAll('.opt[data-group]').forEach(function(opt){
    var g=opt.getAttribute('data-group');
    opt.addEventListener('click', function(e){
      if(e.target.closest('a')) return;
      var c=e.target.closest('.choice'); if(!c||c.classList.contains('greyed')) return;
      var v=c.getAttribute('data-val');
      if(TYPE[g]==='multi'){ var i=sel[g].indexOf(v); if(i>=0) sel[g].splice(i,1); else sel[g].push(v); }
      else sel[g]=v;
      onPick(g);
    });
  });
  function onPick(g){ render(); }

  /* ============================================================
     Reveal / greying
     ============================================================ */
  function applyReveals(){
    var ms=groupEl('mainStop');
    if(sel.routeStyle){
      show(ms);
      var rs=sel.routeStyle;
      choices('mainStop').forEach(function(c){
        var cls=c.classList;
        var ok = cls.contains('ms-any') || cls.contains('ms-'+rs);
        c.style.display = ok?'':'none';
        if(!ok && sel.mainStop===c.getAttribute('data-val')) sel.mainStop=null;
      });
      var p=document.querySelector('[data-mainstop-prompt]'); if(p) p.style.display='none';
    } else { hide(ms); sel.mainStop=null; }

    // food: route-meal only on culture route
    var rm=choiceEl('food','route-meal');
    if(rm){ var allowRM=sel.routeStyle==='culture';
      rm.classList.toggle('greyed', !allowRM);
      var note=rm.querySelector('.cnote');
      if(!allowRM){ if(sel.food==='route-meal') sel.food=null;
        if(!note){ note=document.createElement('span'); note.className='cnote'; rm.querySelector('.cmeta').insertAdjacentElement('afterend',note); }
        note.dataset.grey='1'; note.textContent='⚠️ Only on the culture route.';
      } else { var n=rm.querySelector('.cnote[data-grey]'); if(n) n.remove(); }
    }
  }

  /* ============================================================
     §9 — COMPUTE total
     ============================================================ */
  var lastTotal=null;
  function compute(){
    var st=document.getElementById('sum-total'), sd=document.getElementById('sum-days');
    var mbT=document.getElementById('mb-total'), mbD=document.getElementById('mb-days');
    var bdEl=document.getElementById('breakdown');
    var total=12, rows=[{label:'80 cm telescope · admission',v:'€12',base:true}];
    var order=['routeStyle','dayProgram','food','mainStop'];
    order.forEach(function(g){
      var v=sel[g]; if(!v) return; var p=priceOf(g,v);
      if(g==='routeStyle'){ total+=p; rows.push({label:'Fuel · '+lab(v).replace(' route',''), v:'€'+p, base:true}); }
      else if(p>0){ total+=p; rows.push({label:lab(v), v:'+€'+p}); }
    });
    // rituals / safety are €0 — not shown in money breakdown
    var ppl='per person · 3 sharing';
    if(window.gsap && lastTotal!=null){ var o={v:lastTotal}; gsap.to(o,{v:total,duration:.5,ease:'power2.out',onUpdate:function(){ st.textContent='€'+Math.round(o.v); }}); }
    else st.textContent='€'+total;
    if(lastTotal!=null && total!==lastTotal){ st.classList.remove('flash'); void st.offsetWidth; st.classList.add('flash'); }
    lastTotal=total;
    sd.innerHTML='<b>Sat 10 Oct target</b> · '+ppl+' · museum booking unconfirmed';
    mbT.textContent='€'+total; mbD.textContent='one day · per person';
    bdEl.innerHTML=rows.map(function(r){ return '<div class="row'+(r.base?' base':'')+'"><span>'+r.label+'</span><span class="v">'+r.v+'</span></div>'; }).join('');
    return { total:total };
  }

  /* ============================================================
     §10 — TIME meter (protect the night slot)
     ============================================================ */
  function fmt(h){ h=((h%24)+24)%24; var hh=Math.floor(h), mm=Math.round((h-hh)*60); if(mm===60){hh++;mm=0;} return (hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm; }
  function nightStart(){ return 20.0; } // planning placeholder; confirm actual time with museum

  function meters(){
    var out=[];
    var night=nightStart();
    var nlabel = 'planning estimate ~'+fmt(night);
    var driveUp = 2.1 + (sel.routeStyle?driveOf('routeStyle',sel.routeStyle):0);
    var stopH = sel.mainStop?hoursOf('mainStop',sel.mainStop):0;
    var dayH = sel.dayProgram?hoursOf('dayProgram',sel.dayProgram):0;
    var foodH = sel.food?hoursOf('food',sel.food):0;
    var dayUsed = driveUp + stopH + dayH + foodH;

    /* ---- Meter 1: the way up → arrive before the slot ---- */
    var latestDepart = night - 0.75 - dayUsed;   // leave by this to keep a 45-min buffer
    var d1={ key:'Daytime', name:'Drive up → arrive' };
    var winMax = (night - 0.75 - 9.5); if(winMax<1) winMax=1;
    d1.fill = Math.max(6, Math.min(100, dayUsed/winMax*100));
    d1.h = dayUsed.toFixed(1).replace(/\.0$/,'')+' h day · leave by ~'+fmt(latestDepart);
    if(latestDepart < 9.5){
      d1.color='red';
      d1.warn='⚠️ This route needs an early departure to keep a buffer before the estimated night slot. Drop the stop, choose a lighter day, or go direct.';
      d1.fix=[['Drop the stop','dropStop'],['Lighter day program','lightDay'],['Go direct','goDirect']];
    } else if(latestDepart < 11.5){
      d1.color='amber';
      d1.warn='Early start — leave Kaunas by ~'+fmt(latestDepart)+' to keep a 45-min buffer before the telescope.';
      d1.fix=[['Drop the stop','dropStop']];
    } else {
      d1.color='green';
      d1.note = sel.routeStyle ? 'Comfortable — leave by ~'+fmt(latestDepart)+', outdoor exhibition is free if you arrive early.' : 'Pick a route to size the drive up.';
    }
    out.push(d1);

    /* ---- Meter 2: the night anchor (fixed) ---- */
    out.push({ key:'Night anchor', name:(sel.anchor?lab(sel.anchor):'Telescope'), fill:100, color:'green',
      h: nlabel+' · 1–1.5 h', note: '80 cm booking and actual start time still need museum confirmation. Clear skies required.' });

    return out;
  }

  function renderMeters(ms){
    document.getElementById('daymeter').innerHTML=ms.map(function(d){
      var fix=d.fix?'<div class="dm-fix">'+d.fix.map(function(f){ return '<button type="button" class="fixbtn" data-fix="'+f[1]+'">'+f[0]+'</button>'; }).join('')+'</div>':'';
      return '<div class="dm"><div class="dm-top"><span>'+d.key+' · '+d.name+'</span>'+(d.h?'<span class="dm-h">'+d.h+'</span>':'')+'</div>'+
        '<div class="bar"><div class="fill '+d.color+'" style="width:'+d.fill+'%"></div></div>'+
        (d.warn?'<div class="dm-warn">'+d.warn+'</div>':'')+
        (d.note?'<div class="dm-warn" style="color:var(--paper-soft)">'+d.note+'</div>':'')+fix+'</div>';
    }).join('');
    var worst=null; ms.forEach(function(d){ if(d.color==='red') worst=worst||d; }); if(!worst) ms.forEach(function(d){ if(d.color==='amber') worst=worst||d; });
    var fl=document.getElementById('feasline');
    if(worst&&worst.color==='red'){ fl.className='feasline warn'; fl.textContent='⚠️ '+worst.key+' risks the night — see the meter.'; }
    else if(worst){ fl.className='feasline warn'; fl.textContent='• '+worst.key+' is tight.'; }
    else if(sel.anchor){ fl.className='feasline ok'; fl.textContent='✓ Route fits the estimated night slot; confirm the museum time.'; }
    else fl.textContent='';
    document.querySelectorAll('#daymeter .fixbtn').forEach(function(b){ b.addEventListener('click', function(){ doFix(b.getAttribute('data-fix')); }); });
  }
  function doFix(k){
    if(k==='dropStop') sel.mainStop='none';
    else if(k==='lightDay') sel.dayProgram='outdoor';
    else if(k==='goDirect'){ sel.routeStyle='direct'; }
    render();
  }

  /* ============================================================
     §11 — BOOKINGS
     ============================================================ */
  function bookingRows(){
    var r=[];
    function add(id,name,where,opt){ opt=opt||{}; r.push({id:id,name:name,where:where,sells:!!opt.sells,must:!!opt.must}); }
    if(sel.anchor){
      add('telescope', lab(sel.anchor)+' night observation', 'Museum reg · +370 6 152 0688 · registracija@lemuziejus.lt', {sells:true, must:true});
      add('weathercall','Weather confirmation by ~14:00','Same-day SMS/phone — keep the phone reachable', {must:true});
      add('english','English-language request (optional)','Call/email several days ahead — not guaranteed');
    }
    if(sel.dayProgram==='fulltour') add('dayprogram', lab(sel.dayProgram)+' (daytime)', 'Ask museum for a Saturday slot · +370 6 152 0688', {sells:false});
    if(sel.mainStop==='rumsiskes') add('rumsiskes','Rumšiškės Open-Air Museum','Check fall hours / tickets for the date', {sells:true});
    if(sel.mainStop==='taujenai') add('taujenai','Taujėnai Manor','Verify opening / private events / tickets', {sells:true});
    if(sel.mainStop==='mindunai'||sel.mainStop==='dubingiai') add('statepark','State-park visitor ticket (optional)','€0–1 · saugoma.lt if you use the system');
    if(sel.food==='moletai-cafe'||sel.food==='route-meal'||sel.mainStop==='moletai-food'||sel.mainStop==='ukmerge') add('restaurant','Restaurant / warm-up table','Reserve if a weekend');
    return r;
  }
  function renderBookings(rows){
    var el=document.getElementById('bookings');
    document.getElementById('bk-count').textContent=rows.length?rows.length+'':'';
    if(!rows.length){ el.innerHTML='<div class="empty">Pick the telescope and the rest — anything to reserve collects here with where to book and a status.</div>'; return; }
    el.innerHTML=rows.map(function(b){
      var stt=bookingStatus[b.id]||'todo';
      return '<div class="bk'+(b.must?' anchor':'')+'"><div class="bk-t"><span><span class="bk-name">'+b.name+'</span><span class="bk-where">'+b.where+'</span></span>'+
        (b.must?'<span class="sells musthave">must</span>':(b.sells?'<span class="sells">sells out</span>':''))+'</div>'+
        '<div class="bk-status"><button type="button" class="stbtn '+(stt==='todo'?'on':'')+'" data-bk="'+b.id+'" data-st="todo">To-do</button>'+
        '<button type="button" class="stbtn '+(stt==='booked'?'on':'')+'" data-bk="'+b.id+'" data-st="booked">Booked ✓</button></div></div>';
    }).join('');
    el.querySelectorAll('.stbtn').forEach(function(b){ b.addEventListener('click', function(){ bookingStatus[b.getAttribute('data-bk')]=b.getAttribute('data-st'); render(); }); });
  }

  /* ============================================================
     Progress + jump
     ============================================================ */
  var KEY=[['routeStyle','Route'],['mainStop','Main stop'],['dayProgram','Day program'],['food','Food']];
  function renderProgress(){
    var keys=KEY.filter(function(k){ return k[0]!=='mainStop' || sel.routeStyle; });
    var made=keys.filter(function(k){ var v=sel[k[0]]; return TYPE[k[0]]==='multi'?v.length>0:!!v; });
    var pct=Math.round(made.length/keys.length*100);
    document.getElementById('prog-pct').textContent=made.length+' / '+keys.length;
    document.getElementById('prog-fill').style.width=pct+'%';
    var unmade=keys.filter(function(k){ var v=sel[k[0]]; return TYPE[k[0]]==='multi'?v.length===0:!v; });
    document.getElementById('prog-jump').innerHTML = unmade.length
      ? unmade.slice(0,8).map(function(k){ return '<button type="button" class="jbtn" data-jump="'+k[0]+'">'+k[1]+' →</button>'; }).join('')
      : '<span style="color:var(--sage);font-family:var(--mono);font-size:.66rem;">All key decisions made ✓</span>';
    document.querySelectorAll('#prog-jump .jbtn').forEach(function(b){
      b.addEventListener('click', function(){ var el=groupEl(b.getAttribute('data-jump')); if(el){ var y=el.getBoundingClientRect().top+window.scrollY-110; if(window.WTCM&&window.WTCM.lenis) window.WTCM.lenis.scrollTo(y,{duration:1}); else window.scrollTo({top:y,behavior:'smooth'}); } });
    });
  }

  /* ============================================================
     Crew leaning
     ============================================================ */
  var people=(window.CREW?window.CREW.all():[]).filter(function(p){ return p.plan; });
  var PAL=['#a9c5a0','#e09a63','#8fb6d6','#c0613f','#cdbfa8'];
  function colorFor(n){ var h=0; for(var i=0;i<n.length;i++) h=(h*31+n.charCodeAt(i))>>>0; return PAL[h%PAL.length]; }
  function initials(n){ return n.replace(/\(you\)/,'').trim().slice(0,1).toUpperCase(); }
  function votesFor(g,v){ return people.filter(function(p){ return TYPE[g]==='multi'?(p.plan[g]||[]).indexOf(v)>=0:p.plan[g]===v; }).map(function(p){return p.name;}); }
  function refreshCrew(){ people=(window.CREW?window.CREW.all():[]).filter(function(p){ return p.plan; }); injectVotes(); renderLean(); }
  function injectVotes(){
    document.querySelectorAll('.choice .votes').forEach(function(v){ v.remove(); });
    document.querySelectorAll('.choice').forEach(function(c){
      var opt=c.closest('.opt'); if(!opt) return; var g=opt.getAttribute('data-group'), v=c.getAttribute('data-val');
      var names=votesFor(g,v); if(!names.length) return;
      var avs=names.map(function(n){ return '<span class="av" style="background:'+colorFor(n)+'" title="'+n+'">'+initials(n)+'</span>'; }).join('');
      var label=names.map(function(n){ return n.replace(' (you)',''); }).join(', ');
      c.querySelector('.ctext').insertAdjacentHTML('beforeend','<span class="votes"><span class="av-stack">'+avs+'</span><span class="vlabel">'+label+' picked this</span></span>');
    });
  }
  function renderLean(){
    var groups=[['routeStyle','Route'],['mainStop','Main stop'],['dayProgram','Day program'],['food','Food']];
    var voters=people.length;
    var rows=groups.map(function(g){
      var tally=window.CREW.tally(people, function(p){ return p.plan[g[0]]?[p.plan[g[0]]]:[]; });
      if(!tally.length) return '';
      var top=tally[0]; var agreed=voters>1&&top[1]===voters;
      return '<div class="lr"><span>'+g[1]+'</span><span class="pick">'+lab(top[0])+' <span class="av av-sm" style="background:var(--sage);color:var(--forest-3)">'+top[1]+'</span>'+(agreed?'<span class="agreed">agreed ✓</span>':(tally.length>1?'<span class="agreed" style="color:var(--star-warm)">split</span>':''))+'</span></div>';
    }).join('');
    document.getElementById('lean').innerHTML=rows||'<span class="muted" style="font-size:.86rem;">No crew picks yet — be the first.</span>';
  }

  /* ---------- suggest chips ---------- */
  function injectSuggest(){
    document.querySelectorAll('.choice[data-suggest]').forEach(function(c){
      if(c.querySelector('.suggest-chip')) return;
      var why=c.getAttribute('data-suggest'); var clabel=c.querySelector('.clabel');
      clabel.insertAdjacentHTML('beforeend',' <span class="suggest-chip">★ Suggested</span><span class="whyi" tabindex="0">i<span class="pop">'+why+'</span></span>');
    });
  }

  /* ---------- persistence ---------- */
  function persistTotals(total){ var p=WTC.load('wtc-observatory-plan',{})||{}; p.total=total; WTC.save('wtc-observatory-plan',p); }
  var saveTimer=null;
  var syncSeq=0;
  function pushShared(){
    var foot=document.getElementById('draft-sync');
    if(!window.Store||!window.Store.me()){ if(foot) foot.textContent='Saved on this device. Add your name to share with the crew.'; return; }
    clearTimeout(saveTimer);
    var seq=++syncSeq;
    if(foot) foot.textContent='Saved on this device. Syncing with the crew…';
    saveTimer=setTimeout(function(){ var p=WTC.load('wtc-observatory-plan',{})||{};
      window.Store.saveMine({ going:'in', plan:{ sel:sel, total:p.total, bookings:p.bookings, bookingStatus:bookingStatus, meters:p.meters } }).then(function(result){
        if(foot&&seq===syncSeq) foot.textContent=result&&result.synced?'Saved on this device and with the crew.':'Saved on this device; crew sync will retry when the connection returns.';
      }); }, 900);
  }

  /* ---------- master render ---------- */
  function render(){
    applyReveals(); paint();
    var c=compute();
    var ms=meters(); renderMeters(ms);
    var rows=bookingRows(); renderBookings(rows);
    renderProgress();
    var plan=WTC.load('wtc-observatory-plan',{})||{};
    plan.sel=sel; plan.bookingStatus=bookingStatus; plan.total=c?c.total:null; plan.bookings=rows; plan.meters=ms; plan.night=nightStart(); plan.ts=Date.now();
    WTC.save('wtc-observatory-plan',plan); pushShared();
  }

  /* ---------- download ---------- */
  var dlBtn=document.getElementById('dlMini');
  if(dlBtn) dlBtn.addEventListener('click', function(){ if(window.WTC_obsDownload) window.WTC_obsDownload(); });
  var shareBtn=document.getElementById('shareMini');
  if(shareBtn) shareBtn.addEventListener('click', function(){ if(window.WTC_sharePlan) window.WTC_sharePlan(); });

  /* ---------- identity ---------- */
  function renderIdentity(){
    var sum=document.getElementById('summary'); if(!sum) return;
    var bar=document.getElementById('whoami');
    if(!bar){ bar=document.createElement('div'); bar.id='whoami'; bar.style.cssText='font-family:var(--mono);font-size:.72rem;color:var(--paper-soft);margin-bottom:12px;line-height:1.5;'; sum.insertBefore(bar,sum.firstChild); }
    var me=window.Store?window.Store.me():'';
    if(me){ bar.innerHTML='Saving as <b style="color:var(--sage)">'+me.replace(/</g,'')+'</b> · <a href="#" id="who-change" style="color:var(--paper-soft);text-decoration:underline;">not you?</a>';
      var ch=document.getElementById('who-change'); if(ch) ch.addEventListener('click',function(e){ e.preventDefault(); window.Store.setMe(''); renderIdentity(); }); }
    else { bar.innerHTML='<span>Add your name so your picks save &amp; show to the crew:</span><span style="display:flex;gap:6px;margin-top:6px;"><input id="who-input" type="text" placeholder="your name" style="flex:1;min-width:0;background:var(--forest-2);border:1px solid var(--line);color:var(--paper);border-radius:7px;padding:.5em .6em;font-family:var(--sans);font-size:.85rem;"><button type="button" id="who-save" class="fixbtn" style="white-space:nowrap;">Save</button></span>';
      var go=function(){ var v=(document.getElementById('who-input').value||'').trim(); if(!v) return; window.Store.setMe(v); pushShared(); renderIdentity(); refreshCrew(); };
      var sv=document.getElementById('who-save'); if(sv) sv.addEventListener('click',go);
      var inp=document.getElementById('who-input'); if(inp) inp.addEventListener('keydown',function(e){ if(e.key==='Enter') go(); }); }
  }

  /* ---------- init ---------- */
  injectSuggest(); injectVotes(); renderLean(); renderIdentity(); render();
  if(window.Store && window.Store.all){ window.Store.all().then(function(){ refreshCrew(); }); }
})();
