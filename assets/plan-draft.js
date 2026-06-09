/* ============================================================
   Where To, Crew? — Poland plan-draft engine
   Day-by-day branching, ONE plan-state object, live total +
   per-day TIME meter + bookings. Implements:
     Content §A · PlanDraft-Logic §2 reveal · §3 compute · §4 bookings · §6 time
   State persists to localStorage 'wtc-poland-plan' as a TEMPORARY adapter —
   it's a single object so swapping to the shared sheet later is trivial.
   ============================================================ */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- plan-state (one object) ---------- */
  var TYPE = {};                 // group -> 'single' | 'multi'
  var sel  = {};                 // the picks
  document.querySelectorAll('.opt[data-group]').forEach(function(opt){
    var g = opt.getAttribute('data-group'), t = opt.getAttribute('data-type');
    TYPE[g] = t;
    sel[g] = (t === 'multi') ? [] : null;
  });
  // Resume the CURRENT person's own saved draft so they can EDIT it (returning user).
  // Prefer the shared store (so they edit the crew-visible version), fall back to local.
  var myKey = (window.Store ? window.Store.key(window.Store.me()) : '');
  var shared = (window.Store && myKey) ? (window.Store.cached()[myKey] || null) : null;
  var saved = (shared && shared.plan) ? shared.plan : WTC.load('wtc-poland-plan', null);
  var bookingStatus = (saved && saved.bookingStatus) || {};   // bookingId -> 'todo'|'booked'
  // Fresh user → blank (NO preselections). Returning user → load their own picks to edit.
  if(saved && saved.sel){
    Object.keys(sel).forEach(function(g){
      if(saved.sel[g]==null) return;
      sel[g] = (TYPE[g]==='multi') ? (Array.isArray(saved.sel[g])?saved.sel[g].slice():[]) : saved.sel[g];
    });
  }

  /* ---------- short labels for breakdown / leaning / bookings ---------- */
  var LABEL = {
    '4d':'4-day trip','3d':'3-day trip (−€31)',
    skip:'Skip Day 4', bochnia:'Bochnia Salt Mine', wieliczka:'Wieliczka Salt Mine', warsaw:'Warsaw stopover',
    none:'No queue pass', fast:'Fast Pass', energy:'Energy Pass',
    '1day':'Energylandia',
    zakopane:'Zakopane base', zator:'Zator base',
    morskie:'Morskie Oko', koscieliska:'Dolina Kościeliska', rusinowa:'Rusinowa Polana', fivelakes:'Five Lakes Valley',
    pieniny:'Pieniny + Dunajec', chill:'Chill lake day', slovak:'Slovak-side day', strazyska:'Dolina Strążyska', chocholowska:'Dolina Chochołowska', gesia:'Gęsia Szyja',
    minibus:'Morskie Oko minibus', 'drive-park':'Morskie Oko drive + park',
    zakrzowek:'Zakrzówek', czorsztyn:'Czorsztyn + SUP',
    kasprowy:'Kasprowy Wierch', gubalowka:'Gubałówka funicular', dunajec:'Dunajec raft', 'czorsztyn-toboggan':'Czorsztyn toboggan', skijump:'Ski-jump slide',
    baths:'Thermal baths', 'cook-bacowka':'Cook at a bacówka', 'lodge-bbq':'Lodge BBQ', karczma:'Karczma dinner', 'gubalowka-dusk':'Gubałówka at dusk',
    augustow:'Augustów swim', raj:'Jaskinia Raj cave', swietokrzyski:'Świętokrzyski ridge', krzemionki:'Krzemionki mines', tykocin:'Tykocin', cisowa:'Cisowa Góra', wigry:'Lake Wigry', 'augustow-canal':'Augustów Canal cruise', kadzielnia:'Kadzielnia zip-line', debno:'Dębno church', 'warsaw-break':'Warsaw break',
    oldtown:'Old Town + Wawel', cruise:'Vistula cruise', arcadebee:'Arcade Bee', vr:'VR park', underground:'Rynek Underground', krakus:'Krakus Mound', bernatka:'Bernatka bridge', forum:'Forum Przystań', nowahuta:'Nowa Huta tour', streetart:'Kazimierz street-art', bars:'Kazimierz bars',
    gregtom:'Greg & Tom', atlantis:'Atlantis', 'apt-kazimierz':'Apartment-Kazimierz',
    'stara-polana':'Hostel Stara Polana','wielka-krokiew':'Hostel Wielka Krokiew', niko:'Apartamenty Niko','energylandia-noclegi':'Noclegi Energylandia',
    through:'Straight through', 'warsaw-night':'Warsaw overnight', 'warsaw-hostel':'Warsaw hostel',
    add:'Buffer day', no:'No buffer', 'night-before':'Arrive night before', 'same-evening':'Arrive for the evening',
    ojcow:'Ojców NP', 'chill-krakow':'Chill Kraków day', auschwitz:'Auschwitz', rest:'Just rest',
    trigger:'Storm trigger', wing:'Wing the weather', aqualantis:'Aqualantis',
    krakow:'Around Kraków'
  };
  function lab(v){ return LABEL[v] || v; }

  /* ---------- DOM helpers ---------- */
  function groupEl(g){ return document.querySelector('.opt[data-group="'+g+'"]'); }
  function choices(g){ return groupEl(g) ? [].slice.call(groupEl(g).querySelectorAll('.choice')) : []; }
  function choiceEl(g,v){ return groupEl(g) ? groupEl(g).querySelector('.choice[data-val="'+v+'"]') : null; }
  function num(c,attr){ return c ? (parseFloat(c.getAttribute(attr))||0) : 0; }
  function priceOf(g,v){ return num(choiceEl(g,v),'data-price'); }
  function hoursOf(g,v){ return num(choiceEl(g,v),'data-hours'); }
  function driveOf(g,v){ return num(choiceEl(g,v),'data-drive'); }
  function has(g,v){ return TYPE[g]==='multi' ? sel[g].indexOf(v)>=0 : sel[g]===v; }

  function show(el){ if(!el) return; if(el.hasAttribute('hidden')){ el.removeAttribute('hidden'); if(!reduce){ el.classList.remove('reveal-anim'); void el.offsetWidth; el.classList.add('reveal-anim'); } } }
  function hide(el){ if(el) el.setAttribute('hidden',''); }

  /* ---------- visual selection sync ---------- */
  function paint(){
    document.querySelectorAll('.opt[data-group]').forEach(function(opt){
      var g=opt.getAttribute('data-group');
      opt.querySelectorAll('.choice').forEach(function(c){
        c.classList.toggle('sel', has(g, c.getAttribute('data-val')));
      });
    });
  }

  /* ---------- selection handlers ---------- */
  document.querySelectorAll('.opt[data-group]').forEach(function(opt){
    var g=opt.getAttribute('data-group');
    opt.addEventListener('click', function(e){
      if(e.target.closest('a')) return;   // let "see rooms" links through without toggling
      var c=e.target.closest('.choice'); if(!c || c.classList.contains('greyed')) return;
      var v=c.getAttribute('data-val');
      if(TYPE[g]==='multi'){
        var i=sel[g].indexOf(v);
        if(i>=0) sel[g].splice(i,1); else sel[g].push(v);
      } else {
        sel[g] = (sel[g]===v) ? null : v;   // toggle off if re-clicked
      }
      onPick(g);
    });
  });

  /* couplings + cascade clears, then re-render everything */
  function onPick(g){
    clearPreset();
    // day4 = warsaw  <->  breakDrive = warsaw-night  (one coupled night)
    if(g==='day4'){
      if(sel.day4==='warsaw') sel.breakDrive='warsaw-night';
      else if(sel.breakDrive==='warsaw-night') sel.breakDrive='through';
    }
    if(g==='breakDrive'){
      if(sel.breakDrive==='warsaw-night' && sel.length!=='3d' && sel.day4 && sel.day4!=='warsaw'){ /* keep their day4 mine, just add the night */ }
      if(sel.breakDrive!=='warsaw-night' && sel.day4==='warsaw') sel.day4=null;
    }
    render();
  }

  /* ============================================================
     §2 — REVEAL / HIDE rules + cascade clears + geography greying
     ============================================================ */
  function applyReveals(){
    // length 4d -> show the whole Day-4 block + night3 ; otherwise hide Day 4 entirely
    // (Day 4 only exists on a 4-day trip — don't show it greyed, just remove it.)
    var day4block = document.querySelector('[data-day4-block]');
    var night3 = groupEl('night3');
    if(sel.length==='4d'){
      day4block.style.display='';
      show(night3);
    } else {
      day4block.style.display='none';
      sel.day4=null; sel.night3=null;
      hide(night3);
    }

    // buffer = add -> bufferWhere, bufferActivity, bufferNight
    var bAdd = sel.buffer==='add';
    [['bufferWhere'],['bufferActivity'],['bufferNight']].forEach(function(x){
      var el=groupEl(x[0]); if(bAdd) show(el); else { hide(el); sel[x[0]]=null; }
    });
    // bufferNight options depend on bufferWhere
    if(bAdd){
      var bw=sel.bufferWhere;
      choices('bufferNight').forEach(function(c){
        var isK=c.classList.contains('bn-krakow'), isZ=c.classList.contains('bn-zakopane');
        var ok = (bw==='krakow'&&isK) || (bw==='zakopane'&&isZ);
        c.style.display = ok ? '' : 'none';
        if(!ok && sel.bufferNight===c.getAttribute('data-val')) sel.bufferNight=null;
      });
      var bp=document.querySelector('[data-buffernight-prompt]');
      if(bp) bp.style.display = bw ? 'none' : '';
    }

    // breakDrive = warsaw-night (or day4=warsaw) -> warsawNight line
    var warsawNight = groupEl('warsawNight');
    if(wantsWarsawNight()) show(warsawNight); else { hide(warsawNight); sel.warsawNight=null; }

    // arrival = night-before : note handled inline (no extra picker)

    // base2 -> night2 list
    var night2 = groupEl('night2');
    if(sel.base2){
      show(night2);
      choices('night2').forEach(function(c){
        var ok = c.classList.contains('n2-'+sel.base2);
        c.style.display = ok ? '' : 'none';
        if(!ok && sel.night2===c.getAttribute('data-val')) sel.night2=null;
      });
      var np=document.querySelector('[data-night2-prompt]'); if(np) np.style.display='none';
    } else { hide(night2); sel.night2=null; }

    // hike = morskie -> mokAccess ; else hide+clear
    var mok=groupEl('mokAccess');
    if(sel.hike==='morskie') show(mok); else { hide(mok); sel.mokAccess=null; }
    // hike = chill -> chillLake ; else hide+clear
    var cl=groupEl('chillLake');
    if(sel.hike==='chill') show(cl); else { hide(cl); sel.chillLake=null; }

    // geography greying of Day-3 add-ons
    applyGreying();
  }
  function wantsWarsawNight(){ return sel.breakDrive==='warsaw-night' || sel.day4==='warsaw'; }

  function applyGreying(){
    var grey = {};   // val -> why
    if(sel.hike==='slovak'){
      ['kasprowy','gubalowka','dunajec','czorsztyn-toboggan','skijump'].forEach(function(v){ grey[v]="You're across the Slovak border that day — Tatra add-ons can't fit."; });
    } else if(sel.hike==='pieniny'){
      grey.kasprowy="Too far from the gorge — Zakopane-side."; grey.gubalowka="Too far from the gorge — Zakopane-side."; grey.skijump="Too far from the gorge — Zakopane-side.";
      grey.dunajec="The Pieniny day already includes the Dunajec raft — no double-charge.";
      // (Czorsztyn toboggan is right by the Pieniny gorge, so it stays available.)
    }
    choices('addons').forEach(function(c){
      var v=c.getAttribute('data-val');
      var why=grey[v];
      if(why){
        c.classList.add('greyed');
        if(sel.addons.indexOf(v)>=0) sel.addons.splice(sel.addons.indexOf(v),1);
        var note=c.querySelector('.cnote');
        if(!note){ note=document.createElement('span'); note.className='cnote'; c.querySelector('.cmeta').insertAdjacentElement('afterend', note); }
        note.dataset.grey='1'; note.textContent='⚠️ '+why;
      } else {
        c.classList.remove('greyed');
        var n=c.querySelector('.cnote[data-grey]'); if(n) n.remove();
      }
    });
  }

  /* ============================================================
     §3 — COMPUTE (total · days · nights)
     ============================================================ */
  var lastTotal=null;
  function extraNights(){ return (sel.arrival==='night-before'?1:0) + (sel.buffer==='add'?1:0) + (wantsWarsawNight()?1:0); }

  function compute(){
    var L=sel.length, has4=(L==='4d');
    var ex=extraNights();
    var st=document.getElementById('sum-total'), sd=document.getElementById('sum-days');
    var mbT=document.getElementById('mb-total'), mbD=document.getElementById('mb-days');
    var bdEl=document.getElementById('breakdown');

    if(!L){
      st.textContent='≈ €215–435'; sd.textContent='Pick a trip length to start your total';
      mbT.textContent='€215–435'; mbD.textContent='pick your options';
      bdEl.innerHTML='<div class="row"><span>Choose a trip length to begin</span><span class="v">≈ €215–435</span></div>';
      lastTotal=null;
      persist(null,null,null);
      return;
    }
    // Realistic MINIMUM — built bottom-up from real May-2026 costs (split 3 ways), NOT padded
    // to a target. No souvenirs/discretionary spend (add your own buffer). Beds ~€16/night.
    // The hike + its access are NOT here — they're your Day-3 choice below, so the base assumes nothing.
    var core = has4
      ? [['Fuel — round trip ~1,700 km, ~7 L/100 ÷ 3', 62], ['Tolls + parking — A4 gate + Kraków/Zakopane', 8], ['Energylandia 1-day ticket (229 zł)', 53], ['Beds — 3 nights × ~€16', 48], ['Food — cheap eats + groceries, ~€15/day × 4', 60], ['Travel insurance + EHIC', 15]]
      : [['Fuel — round trip ~1,700 km, ~7 L/100 ÷ 3', 62], ['Tolls + parking — A4 gate + Kraków/Zakopane', 8], ['Energylandia 1-day ticket (229 zł)', 53], ['Beds — 2 nights × ~€16', 32], ['Food — cheap eats + groceries, ~€15/day × 3', 45], ['Travel insurance + EHIC', 15]];
    var BASE = core.reduce(function(s,c){ return s+c[1]; }, 0);   // base = the honest sum (4d €246 · 3d €215)
    var total = BASE + 16*ex;                                      // each extra night ≈ €16 (a bed ÷3), same as the core
    var rows = [{ label:(has4?'4-day core trip':'3-day core trip')+' · '+(has4?3:2)+' nights', v:'€'+BASE, base:true },
                { label:'realistic minimum · est. ÷3 · no souvenirs', grouphead:true }];
    core.forEach(function(c){ rows.push({ label:c[0], v:'€'+c[1], sub:true }); });

    // sum every selected option delta EXCEPT length (its −35 is already in BASE)
    var addRows=[];
    Object.keys(sel).forEach(function(g){
      if(g==='length') return;
      var vals = TYPE[g]==='multi' ? sel[g] : (sel[g]?[sel[g]]:[]);
      vals.forEach(function(v){
        var p=priceOf(g,v);
        if(p>0){ total+=p; addRows.push({ label:lab(v), v:'+€'+p }); }
      });
    });
    if(ex>0) addRows.push({ label:ex+' extra night'+(ex>1?'s':'')+' (~€16 each)', v:'+€'+(16*ex) });
    if(addRows.length){ rows.push({ label:'your add-ons', grouphead:true }); rows=rows.concat(addRows); }

    var days=(has4?4:3)+ex, nights=(has4?3:2)+ex;
    // animate total
    if(window.gsap && lastTotal!=null){ var o={v:lastTotal}; gsap.to(o,{v:total,duration:.5,ease:'power2.out',onUpdate:function(){ st.textContent='€'+Math.round(o.v); }}); }
    else st.textContent='€'+total;
    if(lastTotal!=null && total!==lastTotal){ st.classList.remove('flash'); void st.offsetWidth; st.classList.add('flash'); }
    lastTotal=total;
    sd.innerHTML='<b>'+days+' days</b> · '+nights+' nights';
    mbT.textContent='€'+total; mbD.textContent=days+' days · per person';
    bdEl.innerHTML = rows.map(function(r){ var cls=r.base?' base':(r.sub?' sub':(r.grouphead?' grouphead':'')); return '<div class="row'+cls+'"><span>'+r.label+'</span><span class="v">'+(r.v||'')+'</span></div>'; }).join('');
    return { total:total, days:days, nights:nights };
  }

  /* ============================================================
     §6 — TIME / feasibility meter
     ============================================================ */
  function fmtClock(h){ var hh=Math.floor(h), mm=Math.round((h-hh)*60); if(mm===60){hh++;mm=0;} return (hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm; }
  function colorClass(used,usable){ if(used>usable) return 'red'; if(used>usable-1) return 'amber'; return 'green'; }

  function dayMeters(){
    var out=[];
    // return rest-stop hours feed the drive-home day's time
    var rbH=0; sel.returnStops.forEach(function(v){ rbH += hoursOf('returnStops',v); });
    var rbTxt = rbH ? ' + '+rbH.toFixed(1).replace(/\.0$/,'')+' h stops' : '';

    /* ---- Day 1: drive down + Kraków evening (stops set arrival; evening picks fill the night) ---- */
    var EVE_H={oldtown:2,cruise:1,arcadebee:2,vr:1.5,underground:1.5,krakus:.75,zakrzowek:1,bernatka:.5,forum:1.5,nowahuta:2.5,streetart:1,bars:2};
    var stopH=0; sel.stops.forEach(function(v){ stopH += hoursOf('stops',v)+driveOf('stops',v); });
    // Depart ~06:00 + ~7.5 h driving + one fuel stop ≈ arrive 14:00 with no sightseeing stops;
    // every stop you pick adds its time on top (so the drive breaks aren't double-counted).
    var arrival = 14.0 + stopH;
    var eveUsed=0, eveNames=[]; sel.krakowEve.forEach(function(v){ eveUsed += (EVE_H[v]||0); eveNames.push(lab(v)); });
    var nightBefore = sel.arrival==='night-before';
    var eveStart = nightBefore ? 18 : Math.max(arrival, 17.5);   // when the evening can begin
    var eveWindow = Math.max(0.5, Math.min(4.5, 22.5 - eveStart)); // a realistic single evening, ~4–4.5 h max (early Day-2 gate next morning)
    var d1={ key:'Day 1', name:'Drive down → Kraków eve' };
    d1.h = (nightBefore?'fresh start':'arrive ~'+fmtClock(arrival)) + ' · evening '+(eveUsed||0).toFixed(1).replace(/\.0$/,'')+'/'+eveWindow.toFixed(1).replace(/\.0$/,'')+' h';
    d1.fill = Math.max(6, Math.min(100, Math.max((nightBefore?0:(arrival-14.0)/7), eveUsed/Math.max(eveWindow,1))*100));
    if(!nightBefore && arrival>21){
      d1.color='red'; d1.warn='These stops delay Kraków to ~'+fmtClock(arrival)+' — you’d lose the Old Town evening.'; d1.fix=[['Drop the furthest stop','dropStop'],['Arrive a day earlier','arrEarly']];
    } else if(eveUsed > eveWindow + 0.01){
      d1.color='red'; d1.warn='⚠️ You’ve planned ~'+eveUsed.toFixed(1).replace(/\.0$/,'')+' h of evening ('+eveNames.join(' + ')+') but only ~'+eveWindow.toFixed(1).replace(/\.0$/,'')+' h after arriving ~'+fmtClock(eveStart)+'. Drop one'+(nightBefore?'':', or arrive a day earlier')+'.'; d1.fix=nightBefore?[['Drop an evening pick','dropEve']]:[['Drop an evening pick','dropEve'],['Arrive a day earlier','arrEarly']];
    } else if((!nightBefore && arrival>18.5) || eveUsed > eveWindow-0.5){
      d1.color='amber'; d1.warn = (!nightBefore&&arrival>18.5) ? ('Evening’s tight — you reach Kraków ~'+fmtClock(arrival)+', golden hour ~20:30.') : ('Evening’s nearly full — '+eveNames.join(' + ')+'.');
      if(!nightBefore && arrival>18.5) d1.fix=[['Drop a stop','dropStop']];
    } else {
      d1.color='green';
      if(nightBefore) d1.note='You arrive the night before — a relaxed drive and a fresh, full Kraków evening.';
      else if(!eveUsed) d1.note='Roll into Kraków ~'+fmtClock(arrival)+' — add an evening or two below.';
    }
    out.push(d1);

    /* ---- Day 2: Energylandia is the whole day ---- */
    out.push({ key:'Day 2', name:'Energylandia', fill:96, color:'green', h:'10:00–20:00 + ~2 h drive',
      note: (sel.aqualantis.length||sel.pass) ? 'Aqualantis + the pass fit inside the one day.' : 'The park is the whole day — nothing else stacks on it.' });

    /* ---- Day 3: the chosen hike ---- */
    var usable = sel.base2==='zator' ? 9 : 12;
    var d3={ key:'Day 3', name:'The mountains' };
    if(!sel.hike){
      d3.fill=0; d3.color='green'; d3.h='—'; d3.note='Pick a mountain day to see if it fits.';
    } else {
      var hikeH=hoursOf('hike',sel.hike);
      var addH=0, addNames=[]; sel.addons.forEach(function(v){ var c=choiceEl('addons',v); if(c && !c.classList.contains('greyed')){ addH+=hoursOf('addons',v); addNames.push(lab(v)); } });
      var eveH=0; sel.mtnEvening.forEach(function(v){ eveH+=hoursOf('mtnEvening',v); });
      // On a 3-day trip there's no Day 4 — the long drive home lands on this day too.
      var threeDay = sel.length==='3d';
      var baseDrive = threeDay ? (wantsWarsawNight() ? 5.5 : 11) : 0;
      var driveHome = baseDrive ? baseDrive + rbH : 0;   // return stops add to the drive-home day
      var used=hikeH+addH+driveHome;
      d3.fill=Math.max(6,Math.min(100, used/usable*100));
      d3.color=colorClass(used,usable);
      d3.h=used.toFixed(1).replace(/\.0$/,'')+'/'+usable+' h'+(driveHome?' (incl. ~'+baseDrive+' h home'+rbTxt+')':'')+(sel.base2==='zator'?' · Zator −3 h':'');
      if(threeDay && baseDrive===11 && used>usable){
        d3.warn='⚠️ 3 days means the ~11 h drive home lands on your mountain day — a hike + the full drive won’t fit. Go 4 days, split the return with a Warsaw overnight, or keep Day 3 short.';
        d3.fix=[['Go 4 days','go4day'],['Split with a Warsaw night','addWarsaw'],['Shorter hike','halfHike']];
      } else if(used>usable){
        var over=(used-usable).toFixed(1).replace(/\.0$/,'');
        d3.warn='⚠️ Won’t fit — '+(addNames.length?addNames.join(' + ')+' on top of ':'')+lab(sel.hike)+(driveHome?' + the drive home':'')+' runs ~'+over+' h over. It cuts '+lab(sel.hike)+' short.';
        d3.fix=threeDay?[['Go 4 days','go4day'],['Split with a Warsaw night','addWarsaw'],['Shorter hike','halfHike']]:[['Drop add-ons','dropAddons'],['Add a buffer day','addBuffer'],['Zakopane base','zakBase'],['Half-day hike','halfHike']];
      } else if(used>usable-1 && (addNames.length||driveHome)){
        d3.warn='Tight — '+lab(sel.hike)+(addNames.length?' + '+addNames.join(' + '):'')+(driveHome?' + the drive home':'')+' nearly fills the day.';
      }
      if(eveH>0 && !driveHome){ d3.note='+ ~'+eveH.toFixed(1).replace(/\.0$/,'')+' h evening (baths/cook) sits after — pushes into the dark.'; }
      else if(driveHome) d3.note='No Night 3 on a 3-day trip — you drive home this day (the return is included above).';
      // gubałówka twice soft-warn
      if(sel.addons.indexOf('gubalowka')>=0 && sel.mtnEvening.indexOf('gubalowka-dusk')>=0){
        d3.note=(d3.note?d3.note+' ':'')+'You’ve got Gubałówka twice (day + dusk) — keep one?';
      }
    }
    out.push(d3);

    /* ---- Day 4: only on 4-day trips ---- */
    if(sel.length==='4d'){
      var d4={ key:'Day 4', name:'Drive home' };
      var saltH = (sel.day4==='bochnia'||sel.day4==='wieliczka') ? 3 : 0;
      if(sel.day4==='warsaw' || wantsWarsawNight()){
        d4.fill=52; d4.color='green'; d4.h='split over 2 days'; d4.note='Warsaw overnight splits the ~11 h drive into two easy halves.';
      } else {
        var drive=11, tot=drive+saltH+rbH;
        d4.fill=Math.min(100, tot/13*100); d4.color = tot>12 ? 'red' : tot>10.5 ? 'amber' : 'green';
        d4.h='~'+tot.toFixed(1).replace(/\.0$/,'')+' h'+(rbH?' (drive + '+(saltH?'mine + ':'')+'stops)':'');
        if(tot>12){ d4.warn='⚠️ '+tot.toFixed(0)+'+ h day — '+(saltH?'a salt mine + ':'')+'the drive home'+(rbH?' + your '+rbH.toFixed(1).replace(/\.0$/,'')+' h of stops':'')+' is brutal in one go. Split it with a Warsaw overnight.'; d4.fix=[['Split with a Warsaw overnight','addWarsaw']]; }
        else if(tot>10.5) d4.note = 'A long ~'+tot.toFixed(1).replace(/\.0$/,'')+' h day — share the driving, swap every ~2 h.';
        else d4.note = saltH? 'Salt mine in the morning, then the long haul — leave before the Zakopianka clogs.' : 'A relaxed morning drive home.';
      }
      out.push(d4);
    }
    return out;
  }

  function renderMeters(meters){
    document.getElementById('daymeter').innerHTML = meters.map(function(d){
      var fix = d.fix ? '<div class="dm-fix">'+d.fix.map(function(f){ return '<button type="button" class="fixbtn" data-fix="'+f[1]+'">'+f[0]+'</button>'; }).join('')+'</div>' : '';
      return '<div class="dm"><div class="dm-top"><span>'+d.key+' · '+d.name+'</span>'+(d.h?'<span class="dm-h">'+d.h+'</span>':'')+'</div>'+
        '<div class="bar"><div class="fill '+d.color+'" style="width:'+d.fill+'%"></div></div>'+
        (d.warn?'<div class="dm-warn">'+d.warn+'</div>':'')+
        (d.note&&!d.warn?'<div class="dm-warn" style="color:var(--paper-soft)">'+d.note+'</div>':'')+
        (d.note&&d.warn?'<div class="dm-warn" style="color:var(--paper-soft)">'+d.note+'</div>':'')+
        fix+'</div>';
    }).join('');
    // feasline summary
    var worst=null; meters.forEach(function(d){ if(d.color==='red') worst=worst||d; });
    if(!worst) meters.forEach(function(d){ if(d.color==='amber') worst=worst||d; });
    var fl=document.getElementById('feasline');
    if(worst && worst.color==='red'){ fl.className='feasline warn'; fl.textContent='⚠️ '+worst.key+' won’t fit — see the meter.'; }
    else if(worst){ fl.className='feasline warn'; fl.textContent='• '+worst.key+' is tight.'; }
    else if(sel.length){ fl.className='feasline ok'; fl.textContent='✓ Every day fits.'; }
    else fl.textContent='';
    // wire fix buttons
    document.querySelectorAll('#daymeter .fixbtn').forEach(function(b){
      b.addEventListener('click', function(){ doFix(b.getAttribute('data-fix')); });
    });
  }

  function doFix(kind){
    if(kind==='dropAddons') sel.addons=[];
    else if(kind==='addBuffer'){ sel.buffer='add'; }
    else if(kind==='zakBase') sel.base2='zakopane';
    else if(kind==='halfHike') sel.hike='koscieliska';
    else if(kind==='addWarsaw'){ sel.breakDrive='warsaw-night'; }
    else if(kind==='arrEarly') sel.arrival='night-before';
    else if(kind==='go4day') sel.length='4d';
    else if(kind==='dropEve'){ if(sel.krakowEve.length) sel.krakowEve.pop(); }
    else if(kind==='dropStop'){
      // drop the most time-costly selected stop
      var worst=null, wh=-1; sel.stops.forEach(function(v){ var h=hoursOf('stops',v)+driveOf('stops',v); if(h>wh){wh=h;worst=v;} });
      if(worst) sel.stops.splice(sel.stops.indexOf(worst),1);
    }
    clearPreset(); render();
  }

  /* ============================================================
     §4 — BOOKINGS list
     ============================================================ */
  function bookingRows(){
    var r=[];
    function add(id,name,where,sells){ r.push({id:id,name:name,where:where,sells:!!sells}); }
    if(sel.energylandia) add('energylandia','Energylandia e-tickets (~€53)','ticket.energylandia.pl — online beats the gate');
    if(sel.pass==='fast'||sel.pass==='energy') add('pass','Queue pass ('+lab(sel.pass)+')','ticket.energylandia.pl, with tickets');
    if((sel.hike==='morskie' && sel.mokAccess==='drive-park') || sel.hike==='fivelakes') add('mokParking','Trailhead: Bar Fis minibus (no booking, ~15–20 zł) — Five Lakes / Morskie Oko','from Zakopane, ul. Kościuszki 22; only book TPN parking if you drive',false);
    if(sel.addons.indexOf('kasprowy')>=0) add('kasprowy','Kasprowy Wierch timed slot','pkl.pl',true);
    if(sel.hike==='slovak') add('slovak','Lomnický štít cable-car slot + passport/ID','vt.sk',true);
    if(sel.addons.indexOf('dunajec')>=0 || sel.hike==='pieniny') add('dunajec','Dunajec raft (seasonal)','book once');
    if(sel.day4==='bochnia') add('bochnia','Bochnia salt-mine tour slot','English tour 10:30 only',true);
    if(sel.day4==='wieliczka') add('wieliczka','Wieliczka salt-mine tour slot','bilety.kopalnia.pl',true);
    if(sel.stops.indexOf('raj')>=0) add('raj','Jaskinia Raj cave timed slot','pre-book');
    if(sel.krakowEve.indexOf('nowahuta')>=0) add('nowahuta','Nowa Huta Trabant tour','book the slot');
    if(sel.krakowEve.indexOf('arcadebee')>=0) add('arcadebee','Arcade Bee — reserve a room','arcadebee.pl — fills on evenings');
    if(sel.bufferActivity==='auschwitz') add('auschwitz','Auschwitz timed pass (free)','book weeks ahead',true);
    // lodging
    if(sel.night1) add('night1','Night 1 — Kraków lodging','free-cancellation',true);
    if(sel.night2) add('night2','Night 2 — '+(sel.base2==='zator'?'Zator':'Zakopane')+' lodging','free-cancellation',true);
    if(sel.length==='4d') add('night3','Night 3 — mountain lodging','free-cancellation',true);
    if(wantsWarsawNight()) add('warsawNight','Warsaw return-night lodging','one night, one booking',true);
    if(sel.buffer==='add') add('bufferNight','Buffer-night lodging ('+(sel.bufferWhere==='zakopane'?'Zakopane':'Kraków')+')','free-cancellation',true);
    if(sel.arrival==='night-before') add('arrivalNight','Arrival-night lodging (Day-1 start)','free-cancellation',true);
    return r;
  }
  function renderBookings(rows){
    var el=document.getElementById('bookings');
    document.getElementById('bk-count').textContent = rows.length ? rows.length+'' : '';
    if(!rows.length){ el.innerHTML='<div class="empty">Pick options that need reserving — they’ll collect here with where to book and a status.</div>'; return; }
    el.innerHTML = rows.map(function(b){
      var stt=bookingStatus[b.id]||'todo';
      return '<div class="bk"><div class="bk-t"><span><span class="bk-name">'+b.name+'</span><span class="bk-where">'+b.where+'</span></span>'+
        (b.sells?'<span class="sells">sells out</span>':'')+'</div>'+
        '<div class="bk-status"><button type="button" class="stbtn '+(stt==='todo'?'on':'')+'" data-bk="'+b.id+'" data-st="todo">To-do</button>'+
        '<button type="button" class="stbtn '+(stt==='booked'?'on':'')+'" data-bk="'+b.id+'" data-st="booked">Booked ✓</button></div></div>';
    }).join('');
    el.querySelectorAll('.stbtn').forEach(function(b){
      b.addEventListener('click', function(){ bookingStatus[b.getAttribute('data-bk')]=b.getAttribute('data-st'); render(); });
    });
  }

  /* ============================================================
     Decision progress + jump-list
     ============================================================ */
  var KEY = [
    ['dates','Dates'],['length','Trip length'],['breakDrive','Return drive'],['buffer','Buffer day'],
    ['weather','Weather plan-B'],['arrival','Arrival'],['night1','Night 1'],['energylandia','Energylandia'],['pass','Queue pass'],
    ['base2','Night-2 base'],['night2','Night 2'],['hike','Mountain day']
  ];
  function renderProgress(){
    var keys=KEY.slice();
    if(sel.length==='4d') keys.push(['day4','Day 4'],['night3','Night 3']);
    var made=keys.filter(function(k){ var v=sel[k[0]]; return TYPE[k[0]]==='multi'?v.length>0:!!v; });
    var pct=Math.round(made.length/keys.length*100);
    document.getElementById('prog-pct').textContent=made.length+' / '+keys.length;
    document.getElementById('prog-fill').style.width=pct+'%';
    var unmade=keys.filter(function(k){ var v=sel[k[0]]; return TYPE[k[0]]==='multi'?v.length===0:!v; });
    document.getElementById('prog-jump').innerHTML = unmade.length
      ? unmade.slice(0,8).map(function(k){ return '<button type="button" class="jbtn" data-jump="'+k[0]+'">'+k[1]+' →</button>'; }).join('')
      : '<span class="lean" style="color:#8fb98f;font-family:var(--mono);font-size:.66rem;">All key decisions made ✓</span>';
    document.querySelectorAll('#prog-jump .jbtn').forEach(function(b){
      b.addEventListener('click', function(){
        var el=groupEl(b.getAttribute('data-jump')); if(el){ var y=el.getBoundingClientRect().top+window.scrollY-110;
          if(window.WTCM && window.WTCM.lenis) window.WTCM.lenis.scrollTo(y,{duration:1}); else window.scrollTo({top:y,behavior:'smooth'}); }
      });
    });
  }

  /* ============================================================
     Crew leaning (real sign-up votes only) + consensus
     ============================================================ */
  var people = (window.CREW ? window.CREW.all() : []).filter(function(p){ return p.plan; });
  var PALETTE=['#c0613f','#3f7a52','#9a7b2e','#7a5a86','#36707f'];
  function colorFor(n){ var h=0; for(var i=0;i<n.length;i++) h=(h*31+n.charCodeAt(i))>>>0; return PALETTE[h%PALETTE.length]; }
  function initials(n){ return n.replace(/\(you\)/,'').trim().slice(0,1).toUpperCase(); }
  function votesFor(g,v){ return people.filter(function(p){ return TYPE[g]==='multi' ? (p.plan[g]||[]).indexOf(v)>=0 : p.plan[g]===v; }).map(function(p){return p.name;}); }
  function refreshCrew(){ people = (window.CREW ? window.CREW.all() : []).filter(function(p){ return p.plan; }); injectVotes(); renderLean(); }
  function injectVotes(){
    document.querySelectorAll('.choice .votes').forEach(function(v){ v.remove(); });   // clear before re-render (shared data arrives async)
    document.querySelectorAll('.choice').forEach(function(c){
      var opt=c.closest('.opt'); if(!opt) return; var g=opt.getAttribute('data-group'), v=c.getAttribute('data-val');
      if(c.querySelector('.votes')) return;
      var names=votesFor(g,v); if(!names.length) return;
      var avs=names.map(function(n){ return '<span class="av" style="background:'+colorFor(n)+'" title="'+n+'">'+initials(n)+'</span>'; }).join('');
      var label=names.map(function(n){ return n.replace(' (you)',''); }).join(', ');
      c.querySelector('.ctext').insertAdjacentHTML('beforeend','<span class="votes"><span class="av-stack">'+avs+'</span><span class="vlabel">'+label+' picked this</span></span>');
    });
  }
  function renderLean(){
    var groups=[['length','Trip length'],['hike','Mountain day'],['pass','Queue pass'],['base2','Night-2 base'],['day4','Day 4']];
    var voters=people.length;
    var rows=groups.map(function(g){
      var tally=window.CREW.tally(people, function(p){ return p.plan[g[0]]?[p.plan[g[0]]]:[]; });
      if(!tally.length) return '';
      var top=tally[0];
      var agreed = voters>1 && top[1]===voters;
      return '<div class="lr"><span>'+g[1]+'</span><span class="pick">'+lab(top[0])+' <span class="av av-sm" style="background:var(--terra)">'+top[1]+'</span>'+(agreed?'<span class="agreed">agreed ✓</span>':(tally.length>1?'<span class="agreed" style="color:var(--terra-2)">split</span>':''))+'</span></div>';
    }).join('');
    document.getElementById('lean').innerHTML = rows || '<span class="muted" style="font-size:.86rem;">No crew picks yet — be the first.</span>';
  }

  /* ============================================================
     Suggested chips + why-popovers (from data-suggest)
     ============================================================ */
  function injectSuggest(){
    document.querySelectorAll('.choice[data-suggest]').forEach(function(c){
      if(c.querySelector('.suggest-chip')) return;
      var why=c.getAttribute('data-suggest');
      var clabel=c.querySelector('.clabel');
      clabel.insertAdjacentHTML('beforeend',' <span class="suggest-chip">★ Suggested</span><span class="whyi" tabindex="0">i<span class="pop">'+why+'</span></span>');
    });
  }

  /* ============================================================
     Compare tables (hike · pass · day4)
     ============================================================ */
  var CMP_EXTRA = {
    hike:{ morskie:['Busy','~8 h','Iconic lake + Czarny Staw'], koscieliska:['Quiet','~4 h','Easy valley + show-cave'], rusinowa:['Quiet','~3 h','Most view for least effort'], fivelakes:['Moderate','~8 h','5 lakes + Poland’s tallest waterfall'], pieniny:['Moderate','~9 h','Clifftop summit + gorge raft'], chill:['Calm','~4 h','Lake + SUP'], slovak:['Varies','~9 h','Cross-border day — passport'], strazyska:['Quiet','~3 h','Short waterfall walk'], chocholowska:['Quiet','~5 h','Longest wild valley'], gesia:['Empty','~4 h','Meadow summit'] },
    pass:{ none:['Busiest','—','Rope-drop discipline'], fast:['Skips 5','—','One skip each coaster'], energy:['Skips ~14','—','The works, busy days'] },
    day4:{ skip:['—','0 h','Relaxed drive home'], bochnia:['Fewer','~3 h','Slide + salt-lake boat'], wieliczka:['Busiest','~3 h','Famous carved chapel'], warsaw:['—','split','Overnight halves the drive'] }
  };
  function buildCompare(g){
    var ex=CMP_EXTRA[g]||{};
    var rows=choices(g).map(function(c){
      var v=c.getAttribute('data-val');
      var p=priceOf(g,v); var pr = p>0?'+€'+p : (p<0?'−€'+Math.abs(p):'€0');
      var e=ex[v]||['','',''];
      return '<tr><td>'+lab(v)+'</td><td>'+pr+'</td><td>'+(e[1]||'')+'</td><td>'+(e[0]||'')+'</td><td>'+(e[2]||'')+'</td></tr>';
    }).join('');
    return '<table><thead><tr><th>Option</th><th>Price</th><th>Time</th><th>Crowds/diff.</th><th>Why</th></tr></thead><tbody>'+rows+'</tbody></table>';
  }
  document.querySelectorAll('.cmp-toggle').forEach(function(btn){
    var g=btn.getAttribute('data-compare');
    var tbl=document.querySelector('[data-compare-table="'+g+'"]');
    btn.addEventListener('click', function(){
      if(tbl.hasAttribute('hidden')){ tbl.innerHTML=buildCompare(g); tbl.removeAttribute('hidden'); btn.textContent='Hide compare'; }
      else { tbl.setAttribute('hidden',''); btn.textContent='Compare ⇄'; }
    });
  });

  /* ============================================================
     Presets
     ============================================================ */
  // Picksets per Enhancements §1 (kept in sync with the Logic §3 deltas; the live total is the source of truth).
  // Lodging picks (night1/base2/night2/night3) are €0 deltas — they only feed the bookings list, never the price.
  var PRESETS={
    lowest:{ length:'3d', pass:'none', hike:'rusinowa', stops:['augustow','suwalki-plaza'], krakowEve:['oldtown','krakus'], night1:'atlantis', base2:'zakopane', night2:'wielka-krokiew', mtnEvening:['karczma'], day4:null, addons:[], breakDrive:'through', buffer:'no', arrival:'same-evening', weather:'trigger', energylandia:'1day' },        // ≈ €233
    balanced:{ length:'4d', pass:'none', hike:'morskie', mokAccess:'minibus', stops:['augustow','raj','kielce-echo'], krakowEve:['oldtown','cruise'], night1:'gregtom', base2:'zakopane', night2:'stara-polana', night3:'n3-stara-polana', addons:['gubalowka'], mtnEvening:['baths'], day4:'bochnia', breakDrive:'through', buffer:'no', arrival:'same-evening', weather:'trigger', energylandia:'1day' },  // ≈ €323
    thrill:{ length:'4d', energylandia:'1day', pass:'energy', hike:'morskie', mokAccess:'minibus', addons:['kasprowy','gubalowka','dunajec','czorsztyn-toboggan'], krakowEve:['arcadebee','vr'], night1:'gregtom', base2:'zakopane', night2:'stara-polana', night3:'n3-stara-polana', day4:'bochnia', breakDrive:'through', buffer:'no', arrival:'same-evening', weather:'trigger' },  // ≈ €433 — overloads Day 3 on purpose
    chill:{ length:'4d', pass:'none', hike:'koscieliska', krakowEve:['oldtown','cruise','forum'], mtnEvening:['baths','cook-bacowka'], buffer:'add', bufferWhere:'krakow', bufferActivity:'chill-krakow', bufferNight:'bn-gregtom', day4:'skip', night1:'gregtom', base2:'zakopane', night2:'stara-polana', night3:'n3-stara-polana', stops:['augustow'], breakDrive:'through', arrival:'same-evening', weather:'trigger', energylandia:'1day' }  // ≈ €301
  };
  var activePreset=null;
  function clearPreset(){ activePreset=null; document.querySelectorAll('.preset').forEach(function(p){ p.classList.remove('active'); }); }
  function applyPreset(name){
    // reset all
    Object.keys(sel).forEach(function(g){ sel[g]=TYPE[g]==='multi'?[]:null; });
    var P=PRESETS[name];
    Object.keys(P).forEach(function(g){ if(g in sel) sel[g]= TYPE[g]==='multi' ? P[g].slice() : P[g]; });
    if(sel.day4==='warsaw') sel.breakDrive='warsaw-night';
    render();
    activePreset=name;
    document.querySelectorAll('.preset').forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-preset')===name); });
  }
  document.querySelectorAll('.preset').forEach(function(b){ b.addEventListener('click', function(){ applyPreset(b.getAttribute('data-preset')); }); });

  /* ---------- persistence (local mirror + shared store, debounced) ---------- */
  function persist(total,days,nights){
    WTC.save('wtc-poland-plan', { sel:sel, total:total, days:days, nights:nights, bookingStatus:bookingStatus, ts:Date.now() });
  }
  var saveTimer=null;
  function pushShared(){
    if(!window.Store || !window.Store.me()) return;   // no identity yet → local only
    clearTimeout(saveTimer);
    saveTimer=setTimeout(function(){
      var p=WTC.load('wtc-poland-plan',{})||{};
      window.Store.saveMine({ going:'in', plan:{ sel:sel, total:p.total, days:p.days, nights:p.nights, bookings:p.bookings, bookingStatus:bookingStatus } });
    }, 900);
  }

  /* ============================================================
     MASTER render
     ============================================================ */
  function render(){
    applyReveals();
    paint();
    var c=compute();
    var meters=dayMeters(); renderMeters(meters);
    var rows=bookingRows(); renderBookings(rows);
    renderProgress();
    // attach time-meter summary + bookings to persisted state for the Plan page / download
    var plan=WTC.load('wtc-poland-plan',{})||{};
    plan.sel=sel; plan.bookingStatus=bookingStatus;
    plan.total=c?c.total:null; plan.days=c?c.days:null; plan.nights=c?c.nights:null;
    plan.bookings=rows; plan.meters=meters; plan.ts=Date.now();
    WTC.save('wtc-poland-plan', plan);
    pushShared();
  }

  /* ---------- download (shared generator) ---------- */
  var dlBtn=document.getElementById('dlMini');
  if(dlBtn) dlBtn.addEventListener('click', function(){ if(window.WTC_downloadChecklist) window.WTC_downloadChecklist(); });
  var shBtn=document.getElementById('shareMini');
  if(shBtn) shBtn.addEventListener('click', function(){ if(window.WTC_sharePlan) window.WTC_sharePlan(); });

  /* ---------- identity (whose picks these are; lets them edit/share) ---------- */
  function renderIdentity(){
    var sum=document.getElementById('summary'); if(!sum) return;
    var bar=document.getElementById('whoami');
    if(!bar){ bar=document.createElement('div'); bar.id='whoami';
      bar.style.cssText='font-family:var(--mono);font-size:.72rem;color:var(--paper-soft);margin-bottom:12px;line-height:1.5;';
      sum.insertBefore(bar, sum.firstChild); }
    var me=window.Store?window.Store.me():'';
    if(me){
      bar.innerHTML='Saving as <b style="color:var(--terra-2)">'+me.replace(/</g,'')+'</b> · <a href="#" id="who-change" style="color:var(--paper-soft);text-decoration:underline;">not you?</a>';
      var ch=document.getElementById('who-change'); if(ch) ch.addEventListener('click',function(e){ e.preventDefault(); window.Store.setMe(''); renderIdentity(); });
    } else {
      bar.innerHTML='<span>Add your name so your picks save &amp; show to the crew:</span>'+
        '<span style="display:flex;gap:6px;margin-top:6px;"><input id="who-input" type="text" placeholder="your name" style="flex:1;min-width:0;background:var(--forest-2);border:1px solid var(--line);color:var(--paper);border-radius:7px;padding:.5em .6em;font-family:var(--sans);font-size:.85rem;"><button type="button" id="who-save" class="fixbtn" style="white-space:nowrap;">Save</button></span>';
      var go=function(){ var v=(document.getElementById('who-input').value||'').trim(); if(!v) return; window.Store.setMe(v); pushShared(); renderIdentity(); refreshCrew(); };
      var sv=document.getElementById('who-save'); if(sv) sv.addEventListener('click',go);
      var inp=document.getElementById('who-input'); if(inp) inp.addEventListener('keydown',function(e){ if(e.key==='Enter') go(); });
    }
  }

  /* ---------- init ---------- */
  injectSuggest();
  injectVotes();
  renderLean();
  renderIdentity();
  render();
  // shared data arrives async — refresh leaning/votes once the cache warms from the network
  if(window.Store && window.Store.all){ window.Store.all().then(function(){ refreshCrew(); }); }
})();
