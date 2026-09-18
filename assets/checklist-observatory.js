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
    none:'No stop — arrive early', 'moletai-food':'Molėtai food / warm-up', mindunai:'Mindūnai tower + Labanoras lakes', dubingiai:'Dubingiai + Asveja lake route', rumsiskes:'Rumšiškės Open-Air Museum', taujenai:'Taujėnai Manor autumn event', ukmerge:'Ukmergė food / photo stop',
    fulltour:'Guided museum tour + observation deck', outdoor:'Outdoor exhibition only',
    picnic:'Pack snacks / picnic from Kaunas', 'moletai-cafe':'Molėtai café / restaurant', 'route-meal':'Ukmergė / Taujėnai route meal',
    'one-driver':'One rested return driver', 'driver-swap':'Driver swap plan', 'emergency-hotel':'Emergency nearby stay (standby)',
    strict:'Strict sky-first', 'go-anyway':'Go anyway',
    thermos:'Thermos / hot chocolate', photo:'Photo challenge: tower / dome / sky', playlist:'Shared drive playlist', bestthing:'"Best thing today" lap'
  };
  function lab(v){ return L[v]||v; }
  function arr(x){ return Array.isArray(x)?x:[]; }
  function fmt(h){ h=((h%24)+24)%24; var hh=Math.floor(h), mm=Math.round((h-hh)*60); if(mm===60){hh++;mm=0;} return (hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm; }

  var STOPH={ none:0, mindunai:1.25, dubingiai:1.5, rumsiskes:2.5, taujenai:1.5 };
  var DAYH={ fulltour:1.5, outdoor:0.75 };
  var FOODH={ picnic:0.5, 'moletai-cafe':1, 'route-meal':1 };

  function model(plan){
    plan=plan||{}; var s=Object.assign({routeStyle:'direct',mainStop:'none',dayProgram:'outdoor',food:'picnic'},plan.sel||{}, {anchor:'80cm',seasonWindow:'oct',dateStrategy:'best-sky',weatherPlan:'strict'});
    var deckChanged=!!(plan.sel&&plan.sel.dayProgram==='deck');
    if(deckChanged) s.dayProgram='outdoor';
    if(s.mainStop==='moletai-food'||s.mainStop==='ukmerge') s.mainStop='none';
    if(['none','mindunai','dubingiai','rumsiskes','taujenai'].indexOf(s.mainStop)<0) s.mainStop='none';
    if(['picnic','moletai-cafe'].indexOf(s.food)<0) s.food='picnic';
    if(['outdoor','fulltour'].indexOf(s.dayProgram)<0) s.dayProgram='outdoor';
    var validTime=/^([01]\d|2[0-3]):[0-5]\d$/.test(plan.slotTime||'');
    var night = validTime?(Number(plan.slotTime.slice(0,2))+Number(plan.slotTime.slice(3))/60+(Number(plan.slotTime.slice(0,2))<12?24:0)):null;
    var route=window.WTC_routeFacts(s.mainStop);
    var driveUp = route.upMinutes/60;
    var stopH = STOPH[s.mainStop]||0, dayH=DAYH[s.dayProgram]||0, foodH=FOODH[s.food]||0;

    // backward schedule from the slot
    var arriveMuseum = night==null?null:night - 0.75;
    var dayStart = arriveMuseum==null?null:arriveMuseum - dayH;
    var foodStart = dayStart==null?null:dayStart - foodH;
    var stopStart = foodStart==null?null:foodStart - stopH;
    var depart = stopStart==null?null:stopStart - driveUp;
    var progEnd = night==null?null:night + 1.5;

    var tl=[];
    tl.push([depart==null?'Time TBC':fmt(depart),'Depart Kaunas — allow ~'+Math.round(driveUp*60)+' min driving', false]);
    if(s.mainStop && s.mainStop!=='none'){ tl.push([stopStart==null?'Allow ~'+Math.round(stopH*60)+' min':fmt(stopStart),lab(s.mainStop), false]); }
    if(s.food){ tl.push([foodStart==null?'Allow ~'+Math.round(foodH*60)+' min':fmt(foodStart), (s.food==='picnic'?'Picnic / snacks':lab(s.food)), false]); }
    tl.push([dayStart==null?'Allow ~'+Math.round(dayH*60)+' min':fmt(dayStart), (s.dayProgram?lab(s.dayProgram):'Arrive Kulionys'), false]);
    tl.push([arriveMuseum==null?'45 min early':fmt(arriveMuseum),'Arrive museum — warm clothes and booking ready', false]);
    tl.push([validTime?plan.slotTime:'Time TBC', '80 cm telescope night observation — confirm booking and weather', true]);
    tl.push([progEnd==null?'After ~1–1.5 h':fmt(progEnd),'Program ends · pack up', false]);

    var openWarning=night!=null&&route.open!=null&&(stopStart<route.open||stopStart+stopH>route.close);
    var feas = openWarning?'red':depart==null?'amber':depart < 9.5 ? 'red' : depart < 11.5 ? 'amber' : 'green';

    var bookings = arr(plan.bookings).filter(function(b){
      if(!b||!b.id) return false;
      if(b.id==='dayprogram') return s.dayProgram==='fulltour';
      if(b.id==='rumsiskes') return s.mainStop==='rumsiskes';
      if(b.id==='taujenai') return s.mainStop==='taujenai';
      if(b.id==='restaurant') return s.food==='moletai-cafe';
      if(b.id==='statepark') return false;
      if(b.id==='english') return false;
      return true;
    }).map(function(b){
      if(b.id==='telescope') return Object.assign({},b,{name:'80 cm telescope night observation'});
      if(b.id==='taujenai') return Object.assign({},b,{name:'Taujėnai Manor autumn event',where:'11:00–21:00; ticket range €4–8, budget €8.'});
      if(b.id==='rumsiskes') return Object.assign({},b,{where:'10:00–17:00 in early October; adult €10.'});
      return b;
    });
    if(!bookings.some(function(b){return b.id==='telescope';})) bookings.unshift({id:'telescope',name:'80 cm telescope night observation',where:'Museum registration · +370 6 152 0688',must:true});
    var countdown=[
      ['Now','Ask the museum for the 80 cm night observation on 10 October · confirm the actual start time, group size and booking (+370 6 152 0688).'],
      ['−1 wk','Confirm the booking and any daytime stop · check the forecast · reserve a food stop if needed.'],
      ['−2 days','Watch the forecast · pack warm layers, thermos, power bank, headlamp (red mode) · charge phones.'],
      ['trip day','Keep the phone reachable for the weather decision by 14:00 · follow the confirmed program time.']
    ];

    var facts=window.WTC_tripFacts();
    var priceStop=route.entry||0, priceDay=s.dayProgram==='fulltour'?facts.prices.dayTour:0;
    var priceFood=s.food==='picnic'?facts.prices.picnicAllowance:facts.prices.restaurantAllowance;
    var total=facts.prices.telescope+window.WTC_fuelPerPerson(s.mainStop)+priceStop+priceDay+priceFood;
    return { sel:s, night:night, slotTime:validTime?plan.slotTime:'', total:total, timeline:tl, feas:feas, depart:depart, openWarning:openWarning, bookings:bookings, countdown:countdown, lab:lab, fmt:fmt, deckChanged:deckChanged, route:route };
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
      '<p class="note"><b>Target date; confirm the museum booking.</b> '+(m.slotTime?'Start time entered: <b>'+esc(m.slotTime)+'</b>. Verify it against the museum confirmation.':'Start time unknown: ask the museum before setting departure.')+' The 80 cm observation requires advance booking and clear skies. Keep the booking phone reachable for the same-day weather decision by 14:00. The optional guided daytime tour includes the deck if a Saturday slot is available.</p>'+
      '<h2>Book and confirm</h2><ul>'+bk+'</ul><p>Museum: <b>+370 6 152 0688</b> · registracija@lemuziejus.lt</p>'+
      '<h2>Your day choices</h2><ul>'+rows+'</ul><p>Estimated per person: <b>€'+esc(m.total)+'</b> (three sharing; food and fuel estimates).</p>'+
      '<h2>Day sequence</h2><ul>'+m.timeline.map(function(t){return '<li><b>'+esc(t[0])+'</b> — '+esc(t[1])+'</li>';}).join('')+'</ul>'+
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
