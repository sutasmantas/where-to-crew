/* ============================================================
   Where To, Crew? — shared plan model + personalised checklist
   Reads the ONE plan-state object ('wtc-poland-plan') and derives:
     • readable picks   • per-day clock TIMELINE   • Plan-B per day
     • bookings (with status)   • pre-trip countdown   • budget
   Used by BOTH the Plan page (dynamic day cards) and the download.
   Content §B/§C/§D + Enhancements (timeline, plan-B, countdown,
   shared-gear, emergency one-pager).
   ============================================================ */
(function(){
  var L = {
    '4d':'4 days / 3 nights','3d':'3 days / 2 nights',
    skip:'Skip Day 4 — relaxed drive home', bochnia:'Bochnia Salt Mine', wieliczka:'Wieliczka Salt Mine', warsaw:'Warsaw stopover',
    none:'No queue pass (rope-drop)', fast:'Fast Pass', energy:'Energy Pass',
    '1day':'Energylandia (1-day)',
    zakopane:'Zakopane', zator:'Zator',
    morskie:'Morskie Oko (+ Czarny Staw)', koscieliska:'Dolina Kościeliska + Mroźna Cave', rusinowa:'Rusinowa Polana', fivelakes:'Five Lakes Valley + Wielka Siklawa',
    pieniny:'Pieniny: Trzy Korony + Dunajec', chill:'Chill lake day', slovak:'Slovak-side day', strazyska:'Dolina Strążyska + Siklawica', chocholowska:'Dolina Chochołowska', gesia:'Gęsia Szyja',
    minibus:'minibus from Bar Fis', 'drive-park':'drive + pre-booked TPN parking',
    zakrzowek:'Zakrzówek quarry', czorsztyn:'Czorsztyn lake + SUP',
    kasprowy:'Kasprowy Wierch cable car', gubalowka:'Gubałówka funicular + slide + zipline', dunajec:'Dunajec raft / kayak', 'czorsztyn-toboggan':'Czorsztyn 1000 m toboggan', skijump:'Wielka Krokiew ski-jump slide',
    baths:'Thermal baths', 'cook-bacowka':'Cook together — grill oscypek at a bacówka', 'lodge-bbq':'Lodge BBQ', karczma:'Karczma dinner', 'gubalowka-dusk':'Gubałówka at dusk',
    augustow:'Augustów / Lake Necko swim', raj:'Jaskinia Raj cave + Chęciny Castle', swietokrzyski:'Świętokrzyski — Łysa Góra', krzemionki:'Krzemionki flint mines', tykocin:'Tykocin', cisowa:'Cisowa Góra viewpoints', wigry:'Lake Wigry monastery', 'augustow-canal':'Augustów Canal cruise', kadzielnia:'Kadzielnia zip-line', debno:'Dębno wooden church', 'warsaw-break':'Warsaw 2–3 h break',
    'suwalki-plaza':'Suwałki Plaza break', 'lomza-veneda':'Łomża Veneda break', 'kielce-echo':'Kielce Echo break', bonarka:'Bonarka (Kraków-south) break', nowytarg:'Nowy Targ reset',
    'rb-bonarka':'Bonarka fuel', 'rb-kielce':'Kielce Echo', 'rb-warsaw':'Warsaw leg-stretch', 'rb-lomza':'Łomża Veneda', 'rb-suwalki':'Suwałki Plaza', 'rb-augustow':'Augustów swim',
    oldtown:'Old Town + Wawel at golden hour', cruise:'Vistula sunset cruise', arcadebee:'Arcade Bee', vr:'VRepublic VR park', underground:'Rynek Underground museum', krakus:'Krakus Mound sunset', bernatka:'Bernatka love-lock bridge', forum:'Forum Przystań riverside', nowahuta:'Nowa Huta Trabant tour', streetart:'Kazimierz street-art walk', bars:'Kazimierz bars (aside)',
    gregtom:'Greg & Tom Hostel', atlantis:'Atlantis Hostel', 'apt-kazimierz':'Apartment-Kazimierz',
    'stara-polana':'Hostel Stara Polana','wielka-krokiew':'Hostel Wielka Krokiew', niko:'Apartamenty Niko','energylandia-noclegi':'Noclegi Energylandia',
    'bn-gregtom':'Greg & Tom Hostel','bn-atlantis':'Atlantis Hostel','bn-stara-polana':'Hostel Stara Polana','bn-wielka-krokiew':'Hostel Wielka Krokiew',
    'n3-stara-polana':'Hostel Stara Polana','n3-wielka-krokiew':'Hostel Wielka Krokiew','n3-nearer-krakow':'nearer Kraków/Warsaw',
    through:'Straight through', 'warsaw-night':'Warsaw overnight on the way home', 'warsaw-hostel':'Warsaw hostel',
    add:'Buffer day added', no:'No buffer', 'night-before':'Arrive the night before', 'same-evening':'Arrive Kraków for the evening',
    ojcow:'Ojców NP + Pieskowa Skała', 'chill-krakow':'Chill Kraków day', auschwitz:'Auschwitz-Birkenau', rest:'Just rest',
    trigger:'Storm trigger set', wing:'Wing the weather', aqualantis:'Aqualantis water park', krakow:'Kraków', playlist:'Shared playlist', photo:'Photo challenge', bestthing:'Nightly best-thing'
  };
  function lab(v){ return L[v]||v; }
  function arr(x){ return Array.isArray(x)?x:[]; }

  function fmt(h){ var hh=Math.floor(h), mm=Math.round((h-hh)*60); if(mm===60){hh++;mm=0;} return (hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm; }

  /* ---------- the model ---------- */
  function model(plan){
    plan = plan || {};
    var s = plan.sel || {};
    var len = s.length; var has4 = len==='4d';
    var ex = (s.arrival==='night-before'?1:0)+(s.buffer==='add'?1:0)+((s.breakDrive==='warsaw-night'||s.day4==='warsaw')?1:0);
    var days = (has4?4:3)+ex, nights=(has4?3:2)+ex;

    /* per-day clock timeline */
    var HIKE_H={morskie:8,fivelakes:8,pieniny:9,slovak:9,koscieliska:4,rusinowa:3,chill:4,strazyska:3,chocholowska:5,gesia:4};
    var dayblocks=[];

    // Day 1
    var d1=[];
    if(s.arrival==='night-before') d1.push(['prev day','Drive Kaunas → Kraków the day before — arrive fresh']);
    d1.push(['06:00','Depart Kaunas']);
    d1.push(['08:30','LT–PL border (Budzisko) — passports out, cross mid-morning']);
    var stops=arr(s.stops).filter(function(v){return v!=='warsaw-break';});
    if(stops.length) d1.push(['en route','Stops: '+stops.map(lab).join(' · ')]);
    if(arr(s.stops).indexOf('warsaw-break')>=0) d1.push(['~12:30','Warsaw 2–3 h break (≈ halfway)']);
    d1.push(['~13:00','Kielce — Galeria Echo food-court break']);
    var stopH=0; arr(s.stops).forEach(function(v){ stopH += ({augustow:.75,raj:2.3,swietokrzyski:3.5,krzemionki:3.5,tykocin:1.8,cisowa:2,wigry:1.5,'augustow-canal':3,kadzielnia:.75,debno:.3,'warsaw-break':2.5,'suwalki-plaza':.5,'lomza-veneda':.5,'kielce-echo':.5,bonarka:.5,nowytarg:.5})[v]||0; });
    d1.push([fmt(14.0+stopH), 'Arrive Kraków (Kazimierz)'+(14.0+stopH>21?' — late, evening tight':'')]);
    var eve=arr(s.krakowEve); if(eve.length) d1.push(['evening', eve.map(lab).join(' · ')]); else d1.push(['evening','Old Town walk + zapiekanka at Plac Nowy']);
    dayblocks.push({ day:'Day 1', title:'Drive down + Kraków evening', timeline:d1,
      planB:'Stops running late → drop the furthest. Arrive after dark → skip the evening, do it another night.' });

    // Day 2
    var d2=[['07:30','Checkout + drive to Zator (~1 h)'],['10:00','Energylandia gate — Zadra → Hyperion → Abyssus → Formuła → Speed Water']];
    if(s.pass==='fast'||s.pass==='energy') d2.push(['—', lab(s.pass)+' active — skip the big queues']);
    d2.push(['~15:00','Lunch off-peak (leave & re-enter to eat cheaper)']);
    if(arr(s.aqualantis).length) d2.push(['afternoon','Aqualantis water park (swimwear) when it’s hot']);
    d2.push(['~18:00','Leave park → drive to '+(s.base2==='zator'?'Zator base':'Zakopane (~2 h scenic)')]);
    d2.push(['evening','Highlander dinner / settle in']);
    dayblocks.push({ day:'Day 2', title:'Energylandia → the mountains', timeline:d2,
      planB:'Ride closed in a storm → re-ride / Aqualantis / indoor. Brutal queues → that’s the Fast/Energy-pass call.' });

    // Day 3
    var d3=[['06:30','Dawn start — June afternoons storm, be high early']];
    var hk=s.hike;
    if(hk){ var hh=HIKE_H[hk]||5; d3.push([fmt(7)+'–'+fmt(7+hh), lab(hk)+(hk==='morskie'&&s.mokAccess?' ('+lab(s.mokAccess)+')':'')+' — ~'+hh+' h door-to-door']); }
    else d3.push(['day','Pick a mountain day on the draft']);
    arr(s.addons).forEach(function(v){ d3.push(['add-on', lab(v)]); });
    var me=arr(s.mtnEvening); if(me.length) d3.push(['evening', me.map(lab).join(' · ')]);
    var splitReturn = (s.breakDrive==='warsaw-night'||s.day4==='warsaw');
    var rbPicks = arr(s.returnStops).map(lab);
    var rbLine = rbPicks.length ? rbPicks.join(' → ')+' → border' : 'Bonarka → Kielce Echo → Łomża Veneda → Suwałki Plaza → border';
    if(!has4){   // 3-day: the drive home lands on this day — show it, with the way-back breaks
      if(splitReturn){ d3.push(['~PM','Drive Zakopane → Warsaw (~5.5 h) — break at Kraków/Kielce']); d3.push(['night','Warsaw overnight, finish the drive tomorrow']); }
      else { d3.push(['~PM','⚠️ Drive home ~11 h — a hike + the full drive is brutal']); d3.push(['breaks back', rbLine]); }
    }
    dayblocks.push({ day:'Day 3', title:'The mountains'+(hk?' — '+lab(hk):'')+(!has4?' + drive home':''), timeline:d3,
      planB:'Morskie Oko parking full → minibus from Bar Fis. Storm → baths / Dolina Kościeliska / town. Too tired → Rusinowa / Gubałówka.' });

    // Day 4 (return day on a 4-day trip)
    if(has4){
      var d4=[];
      if(s.day4==='bochnia'||s.day4==='wieliczka'){ d4.push(['10:30', lab(s.day4)+' tour'+(s.day4==='bochnia'?' (English 10:30 only)':'')]); d4.push(['~13:00','Start the drive home']); }
      else if(s.day4==='warsaw'){ d4.push(['morning','Drive to Warsaw, easy half']); d4.push(['evening','Warsaw overnight — second half tomorrow']); }
      else d4.push(['morning','Relaxed drive home from Zakopane']);
      if(splitReturn) d4.push(['split','Warsaw overnight splits the ~11 h drive']);
      else { d4.push(['~11 h','Long haul north — share driving, swap every ~2 h']); d4.push(['breaks back', rbLine]); }
      dayblocks.push({ day:'Day 4', title:'Salt mine + drive home', timeline:d4,
        planB:'Too tired for the long drive → Warsaw overnight. Mine slot sold out → the other mine / skip.' });
    }
    // buffer day note
    if(s.buffer==='add'){
      dayblocks.push({ day:'Buffer day', title:(s.bufferActivity?lab(s.bufferActivity):'Rest day')+' · '+(s.bufferWhere==='zakopane'?'Zakopane':'Kraków'), timeline:[['flex', (s.bufferActivity?lab(s.bufferActivity):'Rest, absorb slippage')]],
        planB:'This day is itself the buffer — slide a squeezed day into it.' });
    }

    /* bookings — prefer the saved list (computed on the draft); else minimal */
    var bookings = arr(plan.bookings);

    /* countdown (dated when the date window is known) */
    var dep = s.dates==='25-28' ? {label:'Thu 25 Jun 2026'} : s.dates==='26-29' ? {label:'Fri 26 Jun 2026'} : null;
    var countdown = [
      ['−3 wks','Lock dates · book all lodging (free-cancel) · register the car in Kraków’s LEZ (ztp.krakow.pl) if you’ll drive in'],
      ['−2 wks','Energylandia e-tickets (~€53; Energy Pass ~€56 if you want it) · Kasprowy Wierch slot (sells out) · salt-mine slot (Bochnia English tour / Wieliczka)'],
      ['−1 wk','Car service + tyres + legal kit · EHIC + travel + breakdown insurance · buy an EU eSIM (LT SIMs opted out of free roaming)'],
      ['−3 days','Morskie Oko TPN parking e-ticket — book ≥3 days out for the cheapest rate (~35–55 zł; no cash on site, sells out) OR plan the Bar Fis minibus · withdraw some złoty'],
      ['−24 h','Pack · fuel up (hypermarket station) · re-check weather + park hours · confirm departure + border-crossing window']
    ];

    return { sel:s, days:days, nights:nights, total:plan.total, dayblocks:dayblocks, bookings:bookings, countdown:countdown, dep:dep, lab:lab };
  }

  /* ---------- readable picks list ---------- */
  function picksList(s){
    var single=[['dates','Dates'],['length','Trip length'],['breakDrive','Return drive'],['buffer','Buffer day'],['bufferWhere','Buffer — where'],['bufferActivity','Buffer — activity'],['weather','Weather plan-B'],['arrival','Arrival'],['night1','Night 1'],['energylandia','Energylandia'],['pass','Queue pass'],['base2','Night-2 base'],['night2','Night 2'],['hike','Mountain day'],['mokAccess','Morskie Oko access'],['chillLake','Chill lake'],['night3','Night 3'],['day4','Day 4']];
    var multi=[['stops','Drive-down stops'],['krakowEve','Kraków evening'],['addons','Adventure add-ons'],['mtnEvening','Mountain evening'],['returnStops','Stops on the way home']];
    var out=[];
    single.forEach(function(k){ if(s[k[0]]) out.push([k[1], lab(s[k[0]])]); });
    multi.forEach(function(k){ var a=arr(s[k[0]]); if(a.length) out.push([k[1], a.map(lab).join(', ')]); });
    return out;
  }

  /* ---------- the printable checklist ---------- */
  function buildHTML(plan){
    var m=model(plan); var s=m.sel;
    var picks=picksList(s);
    var picksHTML = picks.length ? picks.map(function(p){ return '<li><b>'+p[0]+':</b> '+p[1]+'</li>'; }).join('') : '<li><i>No draft saved yet — build it on the Plan-draft page.</i></li>';
    if(m.total) picksHTML+='<li><b>Estimated per person:</b> ≈ €'+m.total+' ('+m.days+' days · '+m.nights+' nights)</li>';

    var daysHTML=m.dayblocks.map(function(d){
      var tl=d.timeline.map(function(t){ return '<li><b>'+t[0]+'</b> — '+t[1]+'</li>'; }).join('');
      return '<h3>'+d.day+' — '+d.title+'</h3><ul class="tl">'+tl+'</ul><p class="pb"><b>Plan-B:</b> '+d.planB+'</p>';
    }).join('');

    var bk = m.bookings.length
      ? m.bookings.map(function(b){ var st=(plan.bookingStatus&&plan.bookingStatus[b.id])||'todo'; return '<li>[ '+(st==='booked'?'x':' ')+' ] <b>'+b.name+'</b> — '+b.where+(b.sells?' · <i>sells out</i>':'')+'</li>'; }).join('')
      : '<li>Energylandia e-tickets · lodging (free-cancel) · the rest depends on your picks.</li>';

    var cd=m.countdown.map(function(c){ return '<li><b>'+c[0]+':</b> '+c[1]+'</li>'; }).join('');

    var css='body{font-family:Georgia,\'Times New Roman\',serif;color:#1c2a22;max-width:760px;margin:30px auto;padding:0 26px;line-height:1.5}'+
      'h1{font-size:27px;margin-bottom:2px}h2{font-size:15px;text-transform:uppercase;letter-spacing:.12em;border-bottom:2px solid #c0613f;padding-bottom:5px;margin-top:30px;color:#16241c}'+
      'h3{font-size:16px;margin:18px 0 4px}ul{padding-left:20px;margin:6px 0}li{margin:4px 0}.tl li{list-style:none;margin-left:-16px}'+
      '.pb{font-size:13px;color:#7a4a32;margin:4px 0 8px;background:#f6efe2;padding:7px 10px;border-left:3px solid #c0613f}'+
      '.sub{color:#666;font-size:13px}.cols{column-count:2;column-gap:34px}@media print{a{color:#000;text-decoration:none}}';

    return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Where To, Crew? — Poland trip checklist</title><style>'+css+'</style></head><body>'+
      '<h1>Where To, Crew? — Energylandia Thrill Road Trip</h1>'+
      '<p class="sub">Kaunas → Kraków → Energylandia → Tatra Mountains · late June 2026 · '+m.days+' days, '+m.nights+' nights'+(m.total?' · ≈ €'+m.total+'/person':'')+'</p>'+

      '<h2>1 · Your chosen plan, day by day</h2>'+
      '<h3 style="margin-top:8px">Your picks</h3><ul>'+picksHTML+'</ul>'+daysHTML+

      '<h2>2 · Your bookings (tick when done)</h2><ul>'+bk+'</ul>'+
      '<p class="sub">Time-sensitive (book first): Morskie Oko parking · Kasprowy slot · salt-mine slot · all lodging.</p>'+

      '<h2>3 · Plan-B — anytime</h2><ul>'+
        '<li><b>Breakdown</b> → roadside-assistance number (carry it offline).</li>'+
        '<li><b>Border jam</b> at Budzisko → fall back to <b>Ogrodniki–Lazdijai</b>.</li>'+
        '<li><b>Storm in the mountains</b> → baths / Dolina Kościeliska / GOjump / escape room.</li></ul>'+

      '<h2>4 · Pre-trip countdown</h2><ul>'+cd+'</ul>'+

      '<h2>5 · Packing</h2>'+
      '<h3>Shared kit — bring ONE between you</h3><ul class="cols">'+
        '<li>Power bank</li><li>First-aid kit</li><li>Dashcam</li><li>Warning triangle</li><li>Hi-vis vest</li><li>Fire extinguisher</li><li>Paper map</li><li>Phone mount</li><li>AUX cable</li></ul>'+
      '<h3>Per person</h3><ul class="cols">'+
        '<li>Road: chargers, snacks, water, bin bag</li><li>Park: swimwear, waterproof pouch, comfy shoes, cash for lockers</li>'+
        '<li>Tatra: boots, rain shell, warm layer, daypack, ≥1 L water, sun cream, blister plasters</li>'+
        '<li>Personal: meds, motion-sickness tablets, documents, EHIC, power bank, towel</li></ul>'+

      '<h2>6 · Documents &amp; insurance</h2><ul>'+
        '<li>Passport/ID carried on you — LT–PL border checks to Oct 2026.</li>'+
        '<li>EHIC + travel insurance (rides + medical + mountain rescue) + breakdown cover.</li>'+
        '<li>All 3 drivers named on the insurance; offline copies of every booking.</li></ul>'+

      '<h2>7 · Car readiness &amp; driving laws</h2><ul>'+
        '<li>Service: tyres (incl. spare), oil, coolant, washer, wipers, lights, brakes. Summer tyres OK for June.</li>'+
        '<li>Mandatory kit: warning triangle, fire extinguisher, hi-vis vest in the cabin.</li>'+
        '<li>Headlights 24/7. Alcohol ~0.0 — the driver doesn’t drink. S7 section cameras (Radom) + Zakopianka tunnel (90).</li>'+
        '<li>Kraków: Old Town is a Limited-Traffic Zone — base in Kazimierz. Low-Emission Zone is LIVE (2026): a petrol car Euro 4 / 2005+ may enter, but register your foreign car at ztp.krakow.pl first (even if it qualifies), or use Park &amp; Ride.</li></ul>'+

      '<h2>8 · Money &amp; apps</h2><ul>'+
        '<li>Some złoty cash for vendors/tolls/lockers (Poland’s currency); always pay/withdraw in złoty, not euro — decline DCC; use bank ATMs; Revolut/Wise. Exchange cash on ul. Sławkowska, not Rynek/airport kantors.</li>'+
        '<li>⚠️ Lithuanian SIMs (Tele2/Telia/Bite) have opted out of free EU roaming — buy a cheap EU eSIM before you go.</li>'+
        '<li>Apps: Yanosik, offline Google Maps, Bolt, Jakdojade, Autopay/SkyCash, Energylandia, Splitwise.</li></ul>'+

      '<h2>9 · Food &amp; drink</h2><ul>'+
        '<li>Supermarket run (Biedronka/Lidl) for car snacks + picnics; refill water bottles. Bring your own food into Energylandia.</li>'+
        '<li>Kraków cheap eats: zapiekanka at Plac Nowy (Okrąglak), Przystanek Pierogarnia, any bar mleczny, obwarzanek on the go.</li>'+
        '<li>Zakopane highlander food: grilled oscypek + cranberry, kwaśnica, placek po zbójnicku — eat one street off Krupówki (Bąkowo Zohylina Niźnio / Góralska Tradycja), under-order, portions are huge.</li>'+
        '<li>Real oscypek is summer-only and late June is borderline — buy from a trail farm, not a Krupówki stall.</li></ul>'+

      '<h2>10 · Emergency one-pager</h2><ul>'+
        '<li><b>112</b> — EU emergency · <b>TOPR mountain rescue 601 100 300</b> (save offline).</li>'+
        '<li>Insurer 24 h hotline + breakdown number: ____ · nearest hospitals: Kraków / Zakopane.</li>'+
        '<li>Lost passport → LT embassy in Warsaw. Crew numbers + a meeting point per stop.</li></ul>'+

      '<h2>11 · Per-person budget (chosen plan)</h2><ul>'+
        (m.total?'<li><b>Total ≈ €'+m.total+'</b> per person, split 3 ways ('+m.days+' days).</li>':'<li>Build the draft to compute your total.</li>')+
        '<li>Core covers fuel, tolls, beds, food, insurance, park ticket. Add-ons itemised on the draft.</li></ul>'+

      '<p class="sub" style="margin-top:28px">Plan the trip. Bring the crew. — re-check May-2026 prices at booking.</p>'+
      '</body></html>';
  }

  function download(plan){
    plan = plan || WTC.load('wtc-poland-plan', {});
    var html=buildHTML(plan);
    var w=window.open('','_blank');
    if(w){ w.document.write(html); w.document.close(); setTimeout(function(){ try{w.print();}catch(e){} }, 400); }
    else { var blob=new Blob([html],{type:'text/html'}); var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='poland-trip-checklist.html'; a.click(); }
  }

  /* ============================================================
     SHARE — a self-contained link that encodes the chosen plan.
     The picks ARE the plan, so we pack `sel` (+ total/bookings/status/who)
     into the URL hash → opening it reconstructs the plan read-only, no
     backend call, works offline. (#p= goes in the hash, never to a server.)
     ============================================================ */
  function b64urlEnc(str){ return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
  function b64urlDec(str){ str=String(str).replace(/-/g,'+').replace(/_/g,'/'); while(str.length%4) str+='='; return decodeURIComponent(escape(atob(str))); }

  function encodePlan(plan){
    plan = plan || WTC.load('wtc-poland-plan', {}) || {};
    var who = plan.who || (window.Store && window.Store.me && window.Store.me()) || '';
    var payload = { v:1, who:who, sel:plan.sel||{}, total:plan.total||null, bookings:plan.bookings||[], bookingStatus:plan.bookingStatus||{} };
    return b64urlEnc(JSON.stringify(payload));
  }
  function decodePlan(str){ try{ var o=JSON.parse(b64urlDec(str)); return (o && o.sel) ? o : null; }catch(e){ return null; } }
  function shareURL(plan){
    var path = location.pathname.replace(/[^/]*$/, 'plan.html');   // always point at the read-only Plan page
    return location.origin + path + '#p=' + encodePlan(plan);
  }
  function toast(msg){
    var t=document.createElement('div'); t.textContent=msg;
    t.style.cssText='position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:9999;background:#16241c;color:#f3ede1;border:1px solid rgba(243,237,225,.2);border-radius:10px;padding:.7em 1.1em;font-family:monospace;font-size:.8rem;box-shadow:0 10px 34px rgba(0,0,0,.4);opacity:0;transition:opacity .25s;';
    document.body.appendChild(t); requestAnimationFrame(function(){ t.style.opacity='1'; });
    setTimeout(function(){ t.style.opacity='0'; setTimeout(function(){ t.remove(); }, 320); }, 2300);
  }
  function sharePlan(plan){
    plan = plan || WTC.load('wtc-poland-plan', {}) || {};
    if(!plan.sel || !(plan.sel.length || plan.sel.hike)){ toast('Build your plan first — pick a few options.'); return; }
    var url = shareURL(plan);
    var who = plan.who || (window.Store && window.Store.me && window.Store.me()) || '';
    var title = 'Where To, Crew? — '+(who?who+'’s ':'')+'Poland plan';
    var text  = (who?who+'’s ':'My ')+'Energylandia road-trip plan'+(plan.total?' (≈ €'+plan.total+'/person)':'')+' — tap to see it:';
    if(navigator.share){ navigator.share({ title:title, text:text, url:url }).catch(function(){}); }
    else if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(function(){ toast('Plan link copied — paste it to the crew.'); }).catch(function(){ prompt('Copy your plan link:', url); }); }
    else { prompt('Copy your plan link:', url); }
  }

  window.WTC_planModel = model;
  window.WTC_planPicks = picksList;
  window.WTC_buildChecklist = buildHTML;
  window.WTC_downloadChecklist = download;
  window.WTC_encodePlan = encodePlan;
  window.WTC_decodePlan = decodePlan;
  window.WTC_shareURL = shareURL;
  window.WTC_sharePlan = sharePlan;
})();
