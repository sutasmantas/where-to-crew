/* Researched on 20 September 2026. Prices are provider prices; whole-trip ranges
   are planning estimates for four adults starting in Kaunas. Keep content here
   so future destination polls use the same UI and storage code. */
window.NEXT_TRIPS = [
  {
    id:'sweden', place:'Sweden', title:'Archipelago kayak expedition',
    strap:'Night ferry, your own car, then three self-guided days among Blekinge islands.',
    image:'../assets/img/next/sweden.jpg', imageAlt:'Rocky Swedish archipelago beneath a cloudy sky',
    credit:'Tommie Hansen · CC BY 3.0', creditUrl:'https://commons.wikimedia.org/wiki/File:Cloudy_and_kayaks_at_Fj%C3%A4rdl%C3%A5ng,_Stockholm_archipelago_(Sweden)_-_panoramio.jpg',
    estimate:'€280–430', budget:355, core:'Ferry from €122 return pp + kayak SEK 1,050',
    duration:'5 days / 2 ferry nights', timing:'3 full paddling days', season:'May–September', travel:'Own car + Klaipėda ferry', intensity:'Active', risk:'Sea weather and beginner paddling safety',
    plan:['Night ferry Klaipėda → Karlshamn','Collect kayaks; safety briefing; sheltered first paddle','Two island-to-island paddle and camp days','Return gear and take the night ferry home'],
    basis:'DFDS currently starts at €61 each way per person with a car when four share a cabin. A three-day single kayak is SEK 1,050. The trip estimate adds shared fuel, simple camps/cabins and food.',
    sources:[['DFDS fare & schedule','https://www.dfds.com/nb-no/ferge/batreise/ferge-sverige/klaipeda-karlshamn'],['2026 kayak prices','https://kajakparadiset.se/en/rent-kayak/kayak-rent-prices'],['Blekinge paddling guide','https://www.visitblekinge.se/en/canoeing-and-kayaking'],['Sweden access rules','https://visitsweden.com/what-to-do/nature-outdoors/nature/sustainable-and-rural-tourism/the-right-of-public-access/']]
  },
  {
    id:'slovenia', place:'Slovenia', title:'Three underground worlds',
    strap:'Kayak beneath Mount Peca, cycle through the mine and cross an underground lake by boat.',
    image:'../assets/img/next/slovenia.jpg', imageAlt:'Mining machinery inside the Peca underground mine in Slovenia',
    credit:'Wikimedia Commons contributor · licence on source', creditUrl:'https://commons.wikimedia.org/wiki/File:Podzemlje_Pece_16.jpg',
    estimate:'€380–560', budget:470, core:'€115–160 for the three core activities',
    duration:'5–6 days', timing:'Kayak 4–5 h · bike ~2.5 h · cave 1–4 h', season:'April–October', travel:'Long shared drive from Kaunas', intensity:'Moderate', risk:'Križna capacity: only four visitors on the long water tour',
    plan:['Drive south with one overnight split','Peca underground kayak expedition','Peca underground cycling route','Križna Jama boat tour; Ljubljana or lake stop','Drive home with overnight split'],
    basis:'Peca kayaking is €55 off peak or €75 June–September; underground cycling is €45. Križna is €13–15 for the short visit or about €60 for the limited long water tour. Estimate adds car costs, rooms and meals.',
    sources:[['Official kayak experience','https://www.slovenia.info/en/things-to-do/slovenia-unique-experiences/37-kayaking-adventure-through-the-underground-of-mount-peca'],['Peca 2026 price list','https://www.podzemljepece.com/?page_id=1519'],['Križna short tour','https://notranjski-park.si/en/plan-your-trip/experiences/visit-krizna-cave'],['Križna long tour details','https://www.exploreinslovenia.com/listings/krizna-cave/']]
  },
  {
    id:'malta', place:'Malta', title:'Earn a real dive qualification',
    strap:'A complete beginner course with theory, confined-water practice and four open-water dives.',
    image:'../assets/img/next/malta.jpg', imageAlt:'Scuba diver swimming beside a wreck in Malta',
    credit:'Michaela Yos Niki Loxa · CC BY 4.0', creditUrl:'https://commons.wikimedia.org/wiki/File:Malta,_wreck_diving,_diver.jpg',
    estimate:'€700–950', budget:825, core:'€510–520 all-in certification',
    duration:'5–6 days', timing:'2–3 course days + 1 no-fly day', season:'May–October', travel:'Flight + airport transfer', intensity:'Moderate', risk:'Medical form, swimming comfort and no-fly buffer after diving',
    plan:['Arrive; settle in; complete e-learning','Skills session and first training dives','Open-water dives and qualification work','Final dives; relaxed coast afternoon','Full non-diving buffer day before flying home'],
    basis:'Current complete beginner certification is €510–520 including equipment and learning materials. The original preliminary total was too low; this estimate adds flights, five nights, local transport and food.',
    sources:[['DiveShack complete price','https://divemalta.com/courses/recreational/open-water-diver/'],['Aquatica price list','https://scubadivingmalta.com/price-list/'],['Alternative PADI course','https://nds-malta.com/collections/learn-to-dive']]
  },
  {
    id:'portugal', place:'Portugal', title:'Five-day surf progression',
    strap:'Two coached sessions a day, equipment, video review and a bed near the breaks in Peniche.',
    image:'../assets/img/next/portugal.jpg', imageAlt:'Surfer looking across the water over a surfboard',
    credit:'Rob Bye · CC0', creditUrl:'https://commons.wikimedia.org/wiki/File:Surfer%27s_view_(Unsplash).jpg',
    estimate:'€550–800', budget:675, core:'€442–598 for 7 nights + 5 surf days',
    duration:'8 days / 7 nights', timing:'2 × 1.5 h lessons daily for 5 days', season:'April–June or September–November', travel:'Flight to Lisbon + transfer', intensity:'High', risk:'Ocean conditions; shoulders and stamina after repeated sessions',
    plan:['Fly to Lisbon and transfer to Baleal','Five days: morning lesson, recovery, afternoon lesson','Video review, surf-spot trip and one sightseeing block','Free final morning; transfer and fly home'],
    basis:'Baleal Surf Camp lists €442 low season, €498 mid season and €598 high season for seven nights and five lesson days. Estimate adds flights, airport travel and meals not in the package.',
    sources:[['Baleal 2026 package','https://www.balealsurfcamp.com/surfcamp-experience/'],['Alternative 5-night camp','https://www.ferrelsurfhouse.com/prices']]
  },
  {
    id:'finland', place:'Finland', title:'Drive a husky team',
    strap:'Run a self-driven husky cart in autumn or wait for reliable snow and take a sled.',
    image:'../assets/img/next/finland.jpg', imageAlt:'Husky team running through a snowy Finnish forest',
    credit:'Maarten · CC BY-SA 2.0', creditUrl:'https://commons.wikimedia.org/wiki/File:Huskysafarialappin.jpg',
    estimate:'€650–900', budget:775, core:'€169 autumn cart / €249 winter sled',
    duration:'5 days / 4 nights', timing:'2.5 h cart or 3 h winter program', season:'Late November–March for snow', travel:'Flight to Rovaniemi', intensity:'Moderate', risk:'Early November cannot promise snow; the confirmed product is a wheeled cart',
    plan:['Fly to Rovaniemi and collect winter gear','Self-drive husky program and kennel visit','Flexible snowmobile or reindeer day if conditions suit','Open evening for an aurora chase based on forecast','Town morning and flight home'],
    basis:'The operator lists the 4 km autumn cart at €169 through 29 November 2026 and the self-driven winter sled at €249 from 30 November. Estimate adds flights, four nights, meals and one optional activity.',
    sources:[['Husky tours, dates & prices','https://www.huskyadventuresrovaniemi.com/tours/']]
  },
  {
    id:'iceland', place:'Iceland', title:'Ice, lava and Silfra',
    strap:'Walk into a seasonal ice cave, explore a lava tube and snorkel between tectonic plates.',
    image:'../assets/img/next/iceland.jpg', imageAlt:'Blue ice roof inside an Icelandic glacier cave',
    credit:'Eric Kilby · CC BY-SA 2.0', creditUrl:'https://commons.wikimedia.org/wiki/File:Ice_Cave_Blue_Roof_-_Iceland.jpg',
    estimate:'€900–1,250', budget:1075, core:'ISK 46,890 for three standard tours',
    duration:'6 days / 5 nights', timing:'Ice 2.5 h · lava 1 h · Silfra ~3 h', season:'Mid-November–March', travel:'Flight + winter self-drive/tours', intensity:'Moderate', risk:'Road closures, weather cancellations and long distance to the glacier',
    plan:['Arrive Keflavík; Reykjavík night','Golden Circle and Silfra snorkel','South-coast drive with weather buffer','Vatnajökull ice cave with certified guide','Raufarhólshellir lava tunnel; Reykjavík','Buffer morning and fly home'],
    basis:'Current listed prices are ISK 18,000 for an ice cave, ISK 8,900 for the standard lava tunnel and ISK 19,990 for Silfra. Estimate adds flights, five nights, winter transport, food and insurance.',
    sources:[['Ice cave price & booking','https://www.icecaveiniceland.is/book-online'],['Official ice-cave season','https://www.visiticeland.com/article/ice-cave-exploration/'],['Lava Tunnel prices','https://thelavatunnel.is/'],['Silfra snorkel price','https://www.dive.is/']]
  },
  {
    id:'dakhla', place:'Dakhla, Morocco', title:'Desert lagoon kitesurf camp',
    strap:'A proper beginner course on a windy lagoon, with full-board camp life between sessions.',
    image:'../assets/img/next/dakhla.jpg', imageAlt:'Kitesurfers crossing the Dakhla lagoon beside the desert',
    credit:'Lärchenholz · CC BY-SA 4.0', creditUrl:'https://commons.wikimedia.org/wiki/File:Kitesurfing_in_Dakhla,_Western_Sahara.JPG',
    estimate:'€950–1,350', budget:1150, core:'€390–425 for a 12-hour beginner course',
    duration:'8 days / 7 nights', timing:'12 lesson hours over 4–6 days', season:'March–June or September–November', travel:'Two-leg flight + camp transfer', intensity:'High', risk:'Wind and remote flight connections; lessons move with conditions',
    plan:['Fly via Casablanca; camp transfer','Four to six flexible lesson days: kite control to board starts','Recovery blocks, lagoon/downwind excursion if ready','One weather reserve day','Transfer and flights home'],
    basis:'Current operators list 12-hour beginner instruction at €390–425. Estimate adds return flights, seven nights/full board and transfers; exact camp accommodation must be quoted for the chosen dates.',
    sources:[['Dakhla Camp price list','https://www.dakhlacamp.com/en/pricing'],['Alternative 12-hour course','https://kitesurfindakhla.com/courses/'],['Dakhla Attitude course','https://dakhla-attitude.ma/activities/kitesurf/']]
  },
  {
    id:'germany', place:'Germany', title:'Licence-free houseboat crew',
    strap:'Four friends operate one boat through the Mecklenburg lakes after the local charter briefing.',
    image:'../assets/img/next/germany.jpg', imageAlt:'Houseboat waters and boathouse at Malchow in Germany',
    credit:'Rüdiger Stehn · CC BY-SA 2.0', creditUrl:'https://commons.wikimedia.org/wiki/File:Hausboottour_(047)_Malchow_(20431065269).jpg',
    estimate:'€450–650', budget:550, core:'€326 pp boat + mandatory charges, before fuel',
    duration:'5 days / 4 nights', timing:'~3 h briefing + 3 cruising days', season:'May–September', travel:'Shared drive to Mecklenburg', intensity:'Low–moderate', risk:'One person must own the briefing and everyone shares boat duties',
    plan:['Drive to base; supplies and overnight','Three-hour induction; take over the boat','Three lake-and-canal cruising days with swimming and town stops','Return boat, settle fuel, drive home'],
    basis:'A current four-day 2026 boat is €915. Cleaning (€169), service (€55), charter briefing (€95) and linen (€68 for four) bring the fixed boat total to €1,302, or €325.50 each. Fuel, moorings, road fuel and food sit on top.',
    sources:[['Boat listing & mandatory fees','https://www.oceans-evasion.com/en/boat-rental/mecklenburgische-seenplatte/houseboat/waterbus-independent-10-ey46rg7'],['Germany charter rules','https://www.germany.travel/de/inspiring-germany/hausbooturlaub.html']]
  },
  {
    id:'uk', place:'United Kingdom', title:'Run a narrowboat through locks',
    strap:'Live aboard a four-berth boat and work the canal locks yourselves after practical training.',
    image:'../assets/img/next/uk.jpg', imageAlt:'A narrowboat moving along an English canal',
    credit:'Aethonatic · CC0', creditUrl:'https://commons.wikimedia.org/wiki/File:Cromford_Canal_narrowboat_-_30_May_2026.jpg',
    estimate:'€500–750', budget:625, core:'£809 boat total / £202.25 pp',
    duration:'5 days / 4 nights', timing:'Handover + 3 full cruising days', season:'April–October', travel:'Flight + rail/taxi to marina', intensity:'Moderate', risk:'Locks take coordination; UK travel can outweigh the boat price',
    plan:['Fly in and sleep near the marina','Boat handover, steering and lock training','Three slow cruising days; crews rotate helm, locks and meals','Return boat; ground transfer and flight home'],
    basis:'A real 12–16 October 2026 four-night boat for four is £809 including training, damage waiver and a fuel deposit. Estimate adds flights, ground transport, groceries and possible fuel adjustment.',
    sources:[['2026 boat offer','https://www.narrow-boating.com/Offers.html'],['Official lock handbook','https://canalrivertrust.org.uk/boating/go-boating/a-guide-to-boating/boaters-handbook/boating-through-locks'],['Alternative inclusive hire','https://ontheweynarrowboathire.co.uk/prices/']]
  },
  {
    id:'cappadocia', place:'Türkiye', title:'Cappadocia from above and below',
    strap:'Balloon at sunrise, descend into an underground city and sleep in a cave hotel.',
    image:'../assets/img/next/cappadocia.jpg', imageAlt:'Colourful hot-air balloon inflating in Cappadocia',
    credit:'Benh LIEU SONG · CC BY-SA 3.0', creditUrl:'https://commons.wikimedia.org/wiki/File:Cappadocia_Balloon_Inflating_Wikimedia_Commons.JPG',
    estimate:'€550–850', budget:700, core:'€113 low season–€333 autumn peak',
    duration:'5 days / 4 nights', timing:'Balloon ~3 h door-to-door + 2 touring days', season:'April–May or September–November', travel:'Flight via Istanbul + transfer', intensity:'Low–moderate', risk:'Balloons cancel in unsafe wind; book the first morning for a retry',
    plan:['Arrive and check into a cave hotel','Sunrise balloon; Göreme museum and valley walk','Kaymaklı underground city and viewpoint circuit','Weather retry slot or Ihlara/rock settlement day','Transfer and flights home'],
    basis:'The checked operator lists balloons at €80 in November–December and €300 from mid-September through October. Add roughly €13 for Kaymaklı and €20 for Göreme; estimate includes flights, four cave-hotel nights, transfers and food.',
    sources:[['Balloon 2026 seasonal prices','https://www.unacapadocia.com/en/cappadocia-hot-air-balloon-tour.asp'],['Museum & city prices','https://www.visitcappadocia.net/en/cappadocia-prices'],['Official Cappadocia guide','https://goturkiye.com/cappadocia/see-cappadocia']]
  },
  {
    id:'azores', place:'Azores, Portugal', title:'Whales, lava and hot earth',
    strap:'Use São Miguel as a base for whale watching, a lava tube and the geothermal Furnas valley.',
    image:'../assets/img/next/azores.jpg', imageAlt:'Whale watching boat near a sperm whale off São Miguel',
    credit:'Jules Verne Times Two · CC BY-SA', creditUrl:'https://commons.wikimedia.org/wiki/File:Sperm_whale_(Physeter_macrocephalus)_near_a_whale_watching_boat,_S%C3%A3o_Miguel_Island,_Azores,_Portugal_(PPL1-Corrected).jpg',
    estimate:'€650–950', budget:800, core:'€100 for whale trip + long lava-cave tour',
    duration:'6 days / 5 nights', timing:'Whales 3 h · long cave 2–3 h', season:'April–October', travel:'Connecting flight + rental car', intensity:'Moderate', risk:'Sea state can cancel boats and sightings are never guaranteed',
    plan:['Fly to Ponta Delgada and collect car','Three-hour whale and dolphin trip','Long Gruta do Carvão lava-tube visit','Furnas geothermal day and thermal soak','Sete Cidades/coast day with weather flexibility','Fly home'],
    basis:'A current three-hour whale trip starts at €65. The limited long Gruta do Carvão tour is €35 and needs a reservation. Estimate adds connecting flights, five nights, shared car, food and thermal entry.',
    sources:[['Whale tour price','https://whalewatchingazores.com/en/whale-dolphin-watching-tours/whale-and-dolphin-watching-in-ponta-delgada/'],['Lava cave tours','https://grutadocarvao.pt/es'],['Official cave guide','https://turismo.azores.gov.pt/en/pin/gruta-do-carvao/']]
  }
];
