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
    fulltour:'Guided museum tour + observation deck', outdoor:'Outdoor exhibition only',
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
  var DAYH={ fulltour:1.5, outdoor:0.75 };
  var FOODH={ picnic:0.5, 'moletai-cafe':1, 'route-meal':1 };

  function model(plan){
    plan=plan||{}; var s=Object.assign({routeStyle:'direct',mainStop:'none',dayProgram:'outdoor',food:'picnic'},plan.sel||{}, {anchor:'80cm',seasonWindow:'oct',dateStrategy:'best-sky',weatherPlan:'strict'});
    var deckChanged=!!(plan.sel&&plan.sel.dayProgram==='deck');
    if(deckChanged) s.dayProgram='outdoor';
    var night = 20.0; // illustrative until the museum confirms the actual program time
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
    tl.push(['Time TBC', '80 cm telescope night observation — confirm start time with museum', true]);
    tl.push([fmt(progEnd),'Program ends · '+ (arr(s.rituals).indexOf('bestthing')>=0?'one "best thing" lap, then go':'pack up'), false]);

    var feas = depart < 9.5 ? 'red' : depart < 11.5 ? 'amber' : 'green';

    var bookings = arr(plan.bookings).filter(function(b){return !(deckChanged&&b.id==='dayprogram');}).map(function(b){ return b.id==='telescope'?Object.assign({},b,{name:'80 cm telescope night observation'}):b; });
    if(!bookings.some(function(b){return b.id==='telescope';})) bookings.unshift({id:'telescope',name:'80 cm telescope night observation',where:'Museum registration · +370 6 152 0688',must:true});
    var countdown=[
      ['Now','Ask the museum for the 80 cm night observation on 10 October · confirm the actual start time, group size and booking (+370 6 152 0688).'],
      ['−1 wk','Confirm the booking and any daytime stop · check the forecast · reserve a food stop if needed.'],
      ['−2 days','Watch the forecast · pack warm layers, thermos, power bank, headlamp (red mode) · charge phones.'],
      ['trip day','Keep the phone reachable for the weather decision by 14:00 · follow the confirmed program time.']
    ];

    var total=plan.total==null?null:Number(plan.total)+(plan.sel&&plan.sel.anchor==='40cm'?2:0)-(deckChanged?4:0);
    return { sel:s, night:night, total:total, timeline:tl, feas:feas, depart:depart, home:home, bookings:bookings, countdown:countdown, lab:lab, fmt:fmt, deckChanged:deckChanged };
  }

  function picksList(s){
    var single=[['routeStyle','Route'],['mainStop','Main stop'],['dayProgram','Daytime'],['food','Food']];
    var out=[]; single.forEach(function(k){ if(s[k[0]]) out.push([k[1],lab(s[k[0]])]); });
    return out;
  }

  function esc(x){ return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function buildHTML(plan){
    plan=plan||{}; var m=model(plan), picks=picksList(m.sel);
    var rows=picks.map(function(p){return '<li><b>'+esc(p[0])+':</b> '+esc(p[1])+'</li>';}).join('');
    var bookings=m.bookings; if(!bookings.some(function(x){return x.id==='weathercall';})) bookings.push({id:'weathercall',name:'Same-day weather confirmation',where:'Phone or SMS by 14:00'});
    var bk=bookings.map(function(x){var booked=plan.bookingStatus&&plan.bookingStatus[x.id]==='booked';return '<li>['+(booked?'x':' ')+'] <b>'+esc(x.name)+'</b> — '+esc(x.where)+'</li>';}).join('');
    var css='body{font:16px/1.5 Arial,sans-serif;max-width:740px;margin:30px auto;padding:0 24px;color:#16201c}h1{font-size:30px;margin-bottom:2px}h2{font-size:15px;text-transform:uppercase;letter-spacing:.1em;border-bottom:2px solid #6a8a60;padding-bottom:5px;margin-top:28px}ul{padding-left:20px}li{margin:6px 0}.note{background:#eef2e8;border-left:3px solid #6a8a60;padding:10px 12px}a{color:#23362b}@media print{a{color:#000}}';
    return '<!doctype html><html><head><meta charset="utf-8"><title>Observatory trip checklist</title><style>'+css+'</style></head><body>'+
      '<h1>Observatory night · 10 October 2026</h1><p>Kaunas → Museum of Ethnocosmology, Kulionys · 80 cm telescope</p>'+
      '<p class="note"><b>Target date; museum slot unconfirmed.</b> The 80 cm observation requires advance booking and clear skies. Confirm its actual start time with the museum. Keep the booking phone reachable for the weather decision by 14:00. Stand-alone observation deck visits are weekdays only; the optional guided daytime tour includes the deck if a Saturday slot is available.</p>'+
      '<h2>Book and confirm</h2><ul>'+bk+'</ul><p>Museum: <b>+370 6 152 0688</b> · registracija@lemuziejus.lt</p>'+
      '<h2>Your day choices</h2><ul>'+rows+'</ul>'+(m.total!=null?'<p>Estimated per person: <b>€'+esc(m.total)+'</b> (three sharing; excludes unpriced extras).</p>':'')+
      '<h2>Before leaving Kaunas</h2><ul><li>Save the museum booking and confirmed time.</li><li>Save the route offline and agree to meet at the museum main entrance.</li><li>Pack warm layers, waterproof jacket, water or thermos, snacks and a charged phone or power bank.</li><li>If the museum cancels for weather, call to reschedule the telescope visit.</li></ul>'+
      '<h2>Quick help</h2><p><b>112</b> for emergencies in Lithuania. Museum: <b>+370 6 152 0688</b>.<br>Museum address: Kulionių k., Žvaigždžių g. 10, Čiulėnų sen., Molėtų r.</p>'+
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
