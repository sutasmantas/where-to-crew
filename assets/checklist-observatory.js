/* ============================================================
   Where To, Crew? — OBSERVATORY plan model + printable checklist
   Reads the ONE plan-state ('wtc-observatory-plan') and derives a backward-
   scheduled night timeline (protecting the slot), the game-plan, bookings,
   a pre-trip countdown, Plan-B, packing and an emergency one-pager.
   Content from Observatory-Trip-Research.md §12 (final Plan page).
   Used by BOTH plan.html (dynamic cards) and the download.
   ============================================================ */
(function(){
  var L={
    sept:'Early fall · September', oct:'Mid fall · October', nov:'Late fall · November',
    'best-sky':'Best sky window (near new moon)', 'easy-saturday':'Easiest group Saturday', custom:'Custom date',
    '80cm':'80 cm telescope night observation', '40cm':'40 cm telescope night observation',
    direct:'Direct · observatory-first', nature:'Nature route', culture:'Culture route',
    none:'No stop — arrive early', 'moletai-food':'Molėtai food / warm-up', mindunai:'Mindūnai tower + Labanoras lakes', dubingiai:'Dubingiai + Asveja lake route', rumsiskes:'Rumšiškės Open-Air Museum', taujenai:'Taujėnai Manor + park', ukmerge:'Ukmergė food / photo stop',
    fulltour:'Full museum day tour', deck:'Observation deck only', outdoor:'Outdoor exhibition only',
    picnic:'Pack snacks / picnic from Kaunas', 'moletai-cafe':'Molėtai café / restaurant', 'route-meal':'Ukmergė / Taujėnai route meal',
    'one-driver':'One rested return driver', 'driver-swap':'Driver swap plan', 'emergency-hotel':'Emergency nearby stay (standby)',
    strict:'Strict sky-first', 'go-anyway':'Go anyway',
    thermos:'Thermos / hot chocolate', photo:'Photo challenge: tower / dome / sky', playlist:'Shared drive playlist', bestthing:'"Best thing today" lap'
  };
  function lab(v){ return L[v]||v; }
  function arr(x){ return Array.isArray(x)?x:[]; }
  function fmt(h){ h=((h%24)+24)%24; var hh=Math.floor(h), mm=Math.round((h-hh)*60); if(mm===60){hh++;mm=0;} return (hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm; }

  var DRIVE={ direct:0, nature:0.4, culture:0.5 };
  var STOPH={ none:0, 'moletai-food':1, mindunai:1.25, dubingiai:1.5, rumsiskes:2.5, taujenai:1.5, ukmerge:1.25 };
  var DAYH={ fulltour:1.5, deck:0.5, outdoor:0.75 };
  var FOODH={ picnic:0.5, 'moletai-cafe':1, 'route-meal':1 };

  function model(plan){
    plan=plan||{}; var s=plan.sel||{};
    var night = plan.night || ({sept:21.25,oct:20.0,nov:18.5}[s.seasonWindow]) || 20.0;
    var driveUp = 2.1 + (DRIVE[s.routeStyle]||0);
    var stopH = STOPH[s.mainStop]||0, dayH=DAYH[s.dayProgram]||0, foodH=FOODH[s.food]||0;

    // backward schedule from the slot
    var arriveMuseum = night - 0.75;
    var dayStart = arriveMuseum - dayH;
    var foodStart = dayStart - foodH;
    var stopStart = foodStart - stopH;
    var depart = stopStart - driveUp;
    var progEnd = night + 1.4, leave = progEnd + 0.3, home = leave + 2.1;

    var tl=[];
    tl.push([fmt(depart),'Depart Kaunas', false]);
    if(s.mainStop && s.mainStop!=='none'){ tl.push([fmt(stopStart),lab(s.mainStop), false]); }
    if(s.food){ tl.push([fmt(foodStart), (s.food==='picnic'?'Picnic / snacks':lab(s.food)), false]); }
    tl.push([fmt(dayStart), (s.dayProgram?lab(s.dayProgram):'Arrive Kulionys'), false]);
    tl.push([fmt(arriveMuseum),'Arrive museum — warm clothes, phones charged, buffer', false]);
    tl.push([fmt(night), (s.anchor?lab(s.anchor):'Night telescope observation')+' — the anchor', true]);
    tl.push([fmt(progEnd),'Program ends · '+ (arr(s.rituals).indexOf('bestthing')>=0?'one "best thing" lap, then go':'pack up'), false]);
    tl.push([fmt(home),'Home in Kaunas'+(s.returnSafety==='emergency-hotel'?' (or stay over if too tired)':''), false]);

    var feas = depart < 9.5 ? 'red' : depart < 11.5 ? 'amber' : 'green';

    var bookings = arr(plan.bookings);
    var countdown=[
      ['−3 wks','Lock the fall date (near new moon if best-sky) · register the night telescope slot (+370 6 152 0688 / registracija@lemuziejus.lt) · book any lodging if staying over.'],
      ['−2 wks','Confirm the telescope group size · request English if needed (not guaranteed) · check Rumšiškės/Taujėnai fall hours if on the route.'],
      ['−1 wk','Re-check sunset + program start for the date · re-check moon phase · reserve the Molėtai/route table if a weekend.'],
      ['−2 days','Watch the forecast · pack warm layers, thermos, power bank, headlamp (red mode) · charge phones.'],
      ['trip day','Keep the phone reachable for the ~14:00 weather call · fuel up · leave Kaunas by ~'+fmt(depart)+' · driver stays alcohol-free.']
    ];

    return { sel:s, night:night, total:plan.total, timeline:tl, feas:feas, depart:depart, home:home, bookings:bookings, countdown:countdown, lab:lab, fmt:fmt };
  }

  function picksList(s){
    var single=[['seasonWindow','Season'],['dateStrategy','Date strategy'],['anchor','Telescope'],['routeStyle','Route'],['mainStop','Main stop'],['dayProgram','Daytime'],['food','Food'],['returnSafety','Drive home'],['weatherPlan','Weather plan-B']];
    var out=[]; single.forEach(function(k){ if(s[k[0]]) out.push([k[1],lab(s[k[0]])]); });
    var rit=arr(s.rituals); if(rit.length) out.push(['Rituals', rit.map(lab).join(', ')]);
    return out;
  }

  function buildHTML(plan){
    var m=model(plan), s=m.sel;
    var picks=picksList(s);
    var picksHTML = picks.length? picks.map(function(p){ return '<li><b>'+p[0]+':</b> '+p[1]+'</li>'; }).join('') : '<li><i>No draft saved yet — build it on the Plan-draft page.</i></li>';
    if(m.total) picksHTML+='<li><b>Estimated per person:</b> ≈ €'+m.total+' (one fall day, 3 sharing)</li>';
    var tlHTML=m.timeline.map(function(t){ return '<li><b>'+t[0]+'</b> — '+t[1]+'</li>'; }).join('');
    var bk = m.bookings.length ? m.bookings.map(function(b){ var st=(plan.bookingStatus&&plan.bookingStatus[b.id])||'todo'; return '<li>[ '+(st==='booked'?'x':' ')+' ] <b>'+b.name+'</b> — '+b.where+(b.must?' · <i>must-have</i>':(b.sells?' · <i>sells out</i>':''))+'</li>'; }).join('') : '<li>Register the night telescope · the rest depends on your picks.</li>';
    var cd=m.countdown.map(function(c){ return '<li><b>'+c[0]+':</b> '+c[1]+'</li>'; }).join('');

    var css='body{font-family:Georgia,serif;color:#16201c;max-width:760px;margin:30px auto;padding:0 26px;line-height:1.5}'+
      'h1{font-size:27px;margin-bottom:2px}h2{font-size:15px;text-transform:uppercase;letter-spacing:.12em;border-bottom:2px solid #6a8a60;padding-bottom:5px;margin-top:30px;color:#23362b}'+
      'h3{font-size:16px;margin:18px 0 4px}ul{padding-left:20px;margin:6px 0}li{margin:4px 0}.tl li{list-style:none;margin-left:-16px}'+
      '.pb{font-size:13px;color:#5a6a4a;margin:4px 0 8px;background:#eef2e8;padding:7px 10px;border-left:3px solid #6a8a60}'+
      '.sub{color:#666;font-size:13px}.cols{column-count:2;column-gap:34px}@media print{a{color:#000;text-decoration:none}}';

    return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Where To, Crew? — Observatory night plan</title><style>'+css+'</style></head><body>'+
      '<h1>Where To, Crew? — Observatory Night Run</h1>'+
      '<p class="sub">Kaunas → Molėtai → Kulionys · Lithuanian Museum of Ethnocosmology · one fall night'+(m.total?' · ≈ €'+m.total+'/person':'')+'</p>'+
      '<h2>1 · The night, hour by hour</h2><h3 style="margin-top:8px">Your picks</h3><ul>'+picksHTML+'</ul>'+
      '<ul class="tl">'+tlHTML+'</ul>'+
      '<p class="pb"><b>The slot is the anchor:</b> the program starts ~1.5 h after sunset and needs clear skies. Arrive ~45 min early, warm clothes ready.</p>'+
      '<h2>2 · Your bookings (tick when done)</h2><ul>'+bk+'</ul>'+
      '<p class="sub">Time-sensitive: the night telescope (small groups, weather-confirmed by ~14:00). Phone: +370 6 152 0688 · registracija@lemuziejus.lt.</p>'+
      '<h2>3 · Route &amp; driving</h2><ul>'+
        '<li>Kaunas → Museum of Ethnocosmology: ~128 km / ~2 h 04 each way (direct).</li>'+
        '<li>Return after the program is a dark ~2 h drive — one rested driver minimum, better with a swap. No alcohol if driving.</li>'+
        '<li>Dipped headlights required day &amp; night. Normal passenger cars need no Lithuanian road toll/vignette.</li></ul>'+
      '<h2>4 · Observatory game-plan</h2><ul>'+
        '<li>Telescope: '+(s.anchor?lab(s.anchor):'register the night observation')+' — clear-sky dependent, register ahead.</li>'+
        '<li>Arrival buffer ~45 min; the tower is outdoor-cold — pack warm fall layers.</li>'+
        '<li>Keep the museum phone/email reachable for the ~14:00 weather call.</li>'+
        '<li>80 cm = headline (cap. 16); 40 cm = backup (cap. 18).</li></ul>'+
      '<h2>5 · Plan-B</h2><ul>'+
        '<li>Night cancelled by 14:00 → '+(s.weatherPlan==='go-anyway'?'go anyway: day tour / deck / outdoor exhibition / Mindūnai / Molėtai food.':'strict sky-first: reschedule the night, or do a shorter day Plan-B.')+'</li>'+
        '<li>Rain / wind → skip tower / Asveja; museum indoor + food.</li>'+
        '<li>Running late → drop the daytime stop first, never the observatory.</li>'+
        '<li>Driver too tired → driver swap, or the emergency nearby stay.</li></ul>'+
      '<h2>6 · Pre-trip countdown</h2><ul>'+cd+'</ul>'+
      '<h2>7 · Packing</h2><ul class="cols">'+
        '<li>Warm coat + layers</li><li>Hat / gloves (Oct–Nov)</li><li>Waterproof jacket</li><li>Comfortable shoes</li>'+
        '<li>Thermos / water / snacks</li><li>Phone power bank</li><li>Headlamp — red-light mode</li><li>Saved booking confirmation</li>'+
        '<li>Tissues / wet wipes</li><li>Motion-sickness tablets if needed</li></ul>'+
      '<h2>8 · Emergency one-pager</h2><ul>'+
        '<li><b>112</b> — emergency.</li>'+
        '<li>Museum registration: <b>+370 6 152 0688</b> · registracija@lemuziejus.lt.</li>'+
        '<li>Crew driver phone numbers + meeting point: museum entrance / the car.</li>'+
        '<li>Route-home address pinned · emergency nearby stay on standby.</li></ul>'+
      '<p class="sub" style="margin-top:28px">Wait for the call. Then look up. — re-check the date\u2019s sunset, moon and weather before you go.</p>'+
      '</body></html>';
  }

  function download(plan){
    plan=plan || WTC.load('wtc-observatory-plan', {});
    var html=buildHTML(plan);
    var w=window.open('','_blank');
    if(w){ w.document.write(html); w.document.close(); setTimeout(function(){ try{w.print();}catch(e){} },400); }
    else { var blob=new Blob([html],{type:'text/html'}); var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='observatory-night-plan.html'; a.click(); }
  }

  window.WTC_obsModel=model;
  window.WTC_obsPicks=picksList;
  window.WTC_buildObsChecklist=buildHTML;
  window.WTC_obsDownload=download;
})();
