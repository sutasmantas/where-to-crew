/* Sourced, trip-specific facts. Add the next trip under its own key. The
   draft estimator and final model share these figures; visible comparison copy
   is reviewed against them before each trip. Recheck mutable prices/hours. */
(function(){
  var facts={
    observatory:{
      checked:'18 September 2026',
      fuel:{perLitre:1.94,litresPer100Km:6.5,people:3,returnKm:128,
        source:'https://www.ena.lt/Naujiena/kdk-20260918/'},
      prices:{telescope:12,dayTour:8,picnicAllowance:6,restaurantAllowance:14},
      sources:{
        telescope:'https://etnokosmomuziejus.lt/en/events/at-the-80-cm-telescope-night-sky-observations/',
        nightPrograms:'https://etnokosmomuziejus.lt/en/night-programs/',
        registration:'https://etnokosmomuziejus.lt/en/registration/',
        museumPrices:'https://etnokosmomuziejus.lt/en/tickets-info/',
        museumFAQ:'https://etnokosmomuziejus.lt/en/faq/',
        dayTour:'https://etnokosmomuziejus.lt/en/events/ethnocosmology-links-with-the-cosmic-world/',
        deck:'https://etnokosmomuziejus.lt/en/events/entry-to-the-observation-deck/',
        outdoor:'https://etnokosmomuziejus.lt/en/registration/',
        mindunai:'https://www.saugoma.lt/en/objects/labanoras-regional-park-mindunai-observation-tower',
        dubingiai:'https://saugoma.lt/en/objects/objects-dubingiai-castle-site-cognitive-trail',
        dubingiaiVisitor:'https://saugoma.lt/en/objects/objects-asveja-regional-park-visitor-center',
        rumsiskes:'https://lemu.lt/lankytojams/susiplanuokite-apsilankyma/',
        rumsiskesTickets:'https://bilietai.lemu.lt/',
        taujenai:'https://taujenudvaras.lt/',
        taujenaiPark:'https://taujenudvaras.lt/pramogos/parkas/',
        taujenaiEvent:'https://taujenudvaras.lt/event/siurpnakcio-pasakos/',
        taujenaiTickets:'https://tickets.paysera.com/lt/event/siurpnakcio-pasakos'
      },
      // Driving estimates: OSRM car routing from Kaunas through the named stop
      // to Kulionys on 18 Sep 2026. Rumšiškės uses the town, so allow slack.
      routes:{
        none:{upKm:128,upMinutes:125,entry:0,visitHours:0},
        mindunai:{upKm:146,upMinutes:149,entry:0,visitHours:1.25},
        dubingiai:{upKm:169,upMinutes:145,entry:0,visitHours:1.5},
        rumsiskes:{upKm:165,upMinutes:140,entry:10,visitHours:2.5,open:10,close:17},
        taujenai:{upKm:162,upMinutes:153,entry:8,visitHours:1.5,open:11,close:21}
      }
    }
  };
  function current(){ return facts[(window.WTC_CFG&&window.WTC_CFG.trip)||'']||null; }
  function route(id){ var f=current(); return f&&(Object.prototype.hasOwnProperty.call(f.routes,id)?f.routes[id]:f.routes.none); }
  function fuelPerPerson(id,people){ var f=current(); if(!f) return null; var n=Math.max(1,Number(people)||f.fuel.people), r=route(id);
    return Math.round((r.upKm+f.fuel.returnKm)*f.fuel.litresPer100Km/100*f.fuel.perLitre/n); }
  window.WTC_TRIP_FACTS=facts;
  window.WTC_tripFacts=current;
  window.WTC_routeFacts=route;
  window.WTC_fuelPerPerson=fuelPerPerson;
})();
