/* ============================================================
   Where To, Crew? — CAR GAMES DATA (v2, audited & hardened)
   Road-trip games for 4 guys (~26) on an ~8-hour drive.
   v2 fixes (from a full design audit): exploit patches, silent-lock
   to stop guess-leaks, phone-note locks for secret answers, a
   standard no-moderator secret-deal method, objective fail calls
   (fast majority, ties favour the accused), complete card rules,
   first-player / scoring / tie-breaks throughout, and bigger banks.
   No money stakes anywhere. Driver stays safe (talk-only / excluded).
   Page "Play tools": ⏱ Timer · 🎯 Who goes first · 🎲 Dice.
   tags: cold | laughs | compete | deduce | chill | stops | stakes | system
   ============================================================ */
window.CAR_GAMES = [

/* ─────────── Whole-trip systems ─────────── */
{ id:'trip-scoreboard', name:`Trip Scoreboard`, section:`Whole-trip systems`, tags:['system','chill'],
  meta:{players:`All`, where:`In car`, driver:`Plays (a passenger keeps the note)`, energy:`Low`, setup:`Phone (shared note)`, type:`Scoring`},
  how:[`Keep a shared phone note. Through the trip, award small points (1–3, to keep it casual) for the things in the bank below.`,`Points are only added by group agreement, said out loud — the note-keeper reads the running total at every stop so it stays honest. Cap any single award at 3 points.`],
  win:`Most points by arrival wins. Locked the moment the handbrake goes on at the destination; if two are level, the tied players each take one Trip Award nomination and the car votes the winner.`,
  banks:[{label:`What to award points for`, items:[`winning games`,`closest arrival-time prediction`,`best song pick`,`best snack pick`,`funniest quote`,`spotting something rare`,`best photo`,`best roast`,`best stop choice`,`worst take of the trip`]}] },

{ id:'prediction-league', name:`Prediction League`, section:`Whole-trip systems`, tags:['system','compete'],
  meta:{players:`All`, where:`In car`, driver:`Plays (a passenger tracks answers)`, energy:`Low`, setup:`Phone (note)`, type:`Guessing`},
  how:[`Before each segment, pick something to predict from the bank.`,`Everyone locks their prediction silently with the tracker (say it quietly or text it) BEFORE any guess is read aloud — no open bidding, so nobody can just bracket the last guess.`,`The tracker reveals all guesses, then checks them when they resolve.`],
  win:`Yes/no calls: everyone who got it right scores 1. Number/time calls: the single closest scores 1 (an exact tie splits — both score 1).`,
  banks:[{label:`Things to predict`, items:[`arrival time at the next stop`,`number of police cars before the next stop`,`first fast-food chain spotted`,`next country/region/city on a number plate`,`whether the next bathroom will be decent`,`how many red cars in 10 minutes`,`how many times someone says they're hungry`,`what song will randomly come up first`,`whether the next gas station has decent coffee`,`number of trucks before the next exit`,`how many tunnels before the next stop`,`the price of fuel at the next station`,`how many minutes until someone needs the toilet`,`whether we hit traffic before the next junction`,`the colour of the next car that overtakes us`,`how many roundabouts before the next town`,`what the next song's genre will be`,`how long until someone brings up food again`,`whether the next services has a Burger King / McDonald's / KFC`,`the outside temperature at the next stop`]}] },

{ id:'trip-awards', name:`Trip Awards`, section:`Whole-trip systems`, tags:['system','chill'],
  meta:{players:`All`, where:`In car (end of trip)`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Scoring`},
  how:[`At the end of the trip, go award by award. For each one, anyone can shout a nominee; then vote between the names raised.`,`You can't win more than two awards — once you've taken two you're out of the running, so it spreads around. The driver breaks any 2–2 tie.`],
  win:`No single winner — it's the closing ceremony.`,
  banks:[{label:`Awards`, items:[`best snack`,`worst snack`,`best song`,`worst song that still worked`,`best quote`,`worst take`,`best stop`,`worst bathroom`,`best navigator`,`most useless passenger`,`best prediction`,`worst prediction`,`best photo`,`most dramatic complaint`,`MVP of the drive`]}] },

/* ─────────── Funny and chaotic ─────────── */
{ id:'hot-takes-court', name:`Hot Takes Court`, section:`Funny & chaotic`, tags:['laughs'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`High`, setup:`None`, type:`Debate`},
  how:[`One person gives a strong opinion (pull one from the bank, or one you can argue is true).`,`The take-giver then SITS OUT — the other three split into prosecute/defend and argue it for 3–5 minutes. Then all four vote the verdict.`,`Pass the take-giver role left; one take each is a full game.`],
  win:`The group votes one of: valid take · criminal take · insane but interesting · never speak again. No elimination — it's for laughs.`,
  banks:[{label:`Takes`, items:[`fries are better without ketchup`,`airport food is underrated`,`winter is better than summer`,`sleeping in jeans is acceptable`,`coffee is mostly placebo`,`most expensive restaurants are not worth it`,`movie trailers are too long`,`working from the office is sometimes better`,`sparkling water is a scam`,`breakfast is overrated`,`showering at night is the only correct time`,`texting back instantly is a red flag`,`most films would be better 20 minutes shorter`,`cereal was never meant to be eaten dry`,`group holidays ruin friendships`,`a hot dog is objectively a sandwich`,`people who don't like dogs can't be trusted`,`the window seat is overrated`,`tipping culture has gone too far`,`pineapple on pizza is fine and you're all cowards`,`voice notes longer than 30 seconds should be illegal`,`the snooze button should be removed from all phones`]}] },

{ id:'bad-movie-pitch', name:`Bad Movie Pitch`, section:`Funny & chaotic`, tags:['laughs'],
  meta:{players:`2+`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Performance`},
  how:[`Draw a title and pick who pitches (rotate left). They pitch the film — genre, main character, villain, plot twist, final scene, and a Rotten Tomatoes score.`,`A FRESH title is drawn for the next pitcher, so there's nothing to copy.`],
  win:`Score each pitch 1–5 (you don't score your own). After everyone's pitched, highest average wins the round; a tie is broken by a 10-second re-pitch face-off.`,
  banks:[{label:`Titles`, items:[`The Last Sandwich`,`Exit 47`,`Fuel Stop`,`The Man From Kaunas`,`Bathroom Key`,`Four Men And A Map`,`No Signal`,`The Fifth Coffee`,`Tire Pressure`,`The Wrong Playlist`,`Diesel Heart`,`The Long Way Round`,`Roadworks`,`Two Stars Out of Five`,`The Glovebox`,`Midnight Toll Booth`,`The Spare Tyre`,`Detour`,`Cruise Control`,`The Last Charge (10%)`,`Lane Assist`,`Sat Nav Says No`]}] },

{ id:'explain-drunk', name:`Explain It Like You Are Drunk`, section:`Funny & chaotic`, tags:['laughs','cold'],
  meta:{players:`2+`, where:`In car`, driver:`Plays`, energy:`High`, setup:`None`, type:`Performance`},
  how:[`Draw a topic. One explainer per lap (rotate left) explains it in the most rambling, sideways way they can — but it must still be recognisable.`,`You may not say the topic's name or an obvious synonym.`],
  win:`Others score 1–10 on how funny-yet-still-correct it was — but if the listeners genuinely can't tell what you described, you score 0. You don't score your own. Highest total after a lap wins; tie → a sudden-death topic both must explain.`,
  banks:[{label:`Things to explain`, items:[`taxes`,`football`,`dating apps`,`airplanes`,`cryptocurrency`,`gym memberships`,`insurance`,`traffic lights`,`coffee machines`,`LinkedIn`,`how the internet works`,`why the sky is blue`,`what a mortgage is`,`how a fridge keeps things cold`,`what electricity is`,`how phones make calls`,`why we have leap years`,`what the stock market is`,`how planes stay up`,`what Wi-Fi actually is`,`how a car engine works`,`what taxes pay for`]}] },

{ id:'group-chat-trial', name:`The Group Chat Trial`, section:`Funny & chaotic`, tags:['laughs'],
  meta:{players:`4`, where:`In car`, driver:`Judges only`, energy:`High`, setup:`None`, type:`Performance`},
  how:[`Put someone on trial for a harmless habit. Roles: accused, prosecutor, defence, judge (the driver judges — talk-only).`,`The accused does NOT argue — they sit and only answer direct questions. Prosecutor and defence get 60 seconds each, then the judge rules with a one-sentence reason.`,`Rotate the accused every round; nobody's tried twice until everyone's had a turn.`],
  win:`Acquitted = the accused wins; guilty = they draw a Punishment Bank punishment.`,
  banks:[{label:`Charges`, items:[`bad playlist habits`,`always being late`,`ordering the exact same food everywhere`,`using too many emojis`,`catastrophic parking`,`always saying "we'll see"`,`refusing all vegetables`,`never putting their phone on silent`,`taking forever to get ready`,`replying to texts three days later`,`talking through every film`,`leaving voice notes that are too long`,`being weird about how the dishwasher is loaded`,`never offering to drive`,`always "knowing a shortcut"`,`double-dipping`,`stealing fries but never ordering their own`,`being too loud on speakerphone`,`never having cash`,`claiming they "called it" after the fact`]}] },

/* ─────────── Competitive games ─────────── */
{ id:'playlist-battle', name:`Playlist Battle`, section:`Competitive`, tags:['compete'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays (says pick aloud, a passenger queues it)`, energy:`Medium`, setup:`Phone (music)`, type:`Scoring`},
  how:[`Pick a theme for the round.`,`All players lock one song silently with the queue-keeper (the driver says theirs privately) BEFORE anything plays — so nobody hears the others first.`,`Play the first 30 seconds of each pick in random order. Sell-pitches (ten words max) happen only after every song has played.`,`Score each song 1–5 — never your own. An obvious all-5s-for-friends / all-1s-for-rivals spread can be called by the car and voided to straight 3s.`],
  win:`Best of three themes; highest combined score wins, ties broken by the driver's casting vote.`,
  banks:[{label:`Themes`, items:[`best driving song`,`song that goes hard but you're embarrassed to admit it`,`best song to scream in a car`,`a song that instantly takes you back to school`,`worst song that is somehow still a banger`,`song most likely to start an argument`,`best one-hit wonder`,`a song your dad would love`,`best song under two minutes`,`song that should be illegal to skip`]}] },

{ id:'auction-game', name:`Auction Game`, section:`Competitive`, tags:['compete'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays (a passenger tracks budgets)`, energy:`Medium`, setup:`None`, type:`Scoring`},
  how:[`One person is auctioneer (rotate each round) and first reads the whole item list once so everyone knows what's coming.`,`Everyone has 100 imaginary euros; min opening bid 5, no single bid over 40. Auction items one at a time; highest bidder wins and pays from their budget. A neutral passenger calls out remaining budgets.`,`Tied top bids → one 5-second re-bid between them. You can win at most 3 items; an item nobody bids on goes unsold. When all are sold, each owner makes a 10-second case for their best item.`],
  win:`The car votes for the single best item of the round (not their own); its owner takes the point. Bid nothing all round and you can't win the vote. The auctioneer breaks a tied vote.`,
  note:`Money is imaginary — nobody spends anything real.`,
  banks:[
    {label:`Superpowers`, items:[`flight`,`invisibility`,`super strength`,`reading minds`,`teleportation`,`stopping time`]},
    {label:`Best thing to have for free forever`, items:[`fuel`,`coffee`,`flights`,`pizza`,`concert tickets`,`taxis`]},
    {label:`Apocalypse teammates`, items:[`a doctor`,`a mechanic`,`a chef`,`a fighter`,`a farmer`,`a comedian`]},
    {label:`Best car to own`, items:[`an old reliable hatchback`,`a sports car`,`a massive pickup`,`a camper van`,`a classic 90s car`,`an electric luxury sedan`]},
    {label:`Best decade to live in`, items:[`60s`,`70s`,`80s`,`90s`,`2000s`,`2010s`]},
    {label:`Dinner-party guests (any era)`, items:[`a famous comedian`,`a world leader`,`a scientist`,`a footballer`,`a rockstar`,`a chef`]},
    {label:`Best fast food`, items:[`burger`,`pizza`,`fried chicken`,`kebab`,`sushi`,`tacos`]},
    {label:`Best pet`, items:[`dog`,`cat`,`parrot`,`snake`,`hamster`,`fish`]},
    {label:`Best holiday`, items:[`beach resort`,`city break`,`ski trip`,`road trip`,`safari`,`festival`]},
    {label:`Best movie franchise`, items:[`Star Wars`,`Marvel`,`James Bond`,`Lord of the Rings`,`Fast & Furious`,`Harry Potter`]}
  ] },

{ id:'guess-the-price', name:`Guess The Price`, section:`Competitive`, tags:['compete'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays (a passenger looks up)`, energy:`Low`, setup:`Phone (look up)`, type:`Guessing`},
  how:[`A passenger finds a random item online and reads it out without the price. The person who looked it up sits out that round (no leaking); rotate who looks up each item.`,`Everyone else locks a guess and says it on a count of three (so nobody can just guess one euro above the leader).`,`Pre-load a few items at a stop in case signal drops on the motorway.`],
  win:`Closest to the real price wins 1; an exact tie splits the point. Play a fixed number of items (say 5) or to a target score.`,
  banks:[{label:`Items to look up`, items:[`a weird boutique hotel room for one night`,`a used car from the year you were born`,`the most expensive watch on the first page of results`,`genuinely ugly designer shoes`,`a ridiculous Airbnb (treehouse, castle, igloo)`,`a retro game console, boxed`,`a suspicious gadget off a marketplace app`,`a single bottle of very expensive whisky`,`a celebrity's house that's for sale`,`the most expensive item on a fast-food menu somewhere abroad`,`a first-class flight to the other side of the world`,`a gaming PC built to the max`,`a designer hoodie that looks like a normal hoodie`,`a vintage football shirt`,`a kilo of the world's most expensive coffee`,`a parking spot in a major city centre`,`a meal at a 3-Michelin-star restaurant (per person)`,`the newest folding phone`]}] },

/* ─────────── Deduction & social ─────────── */
{ id:'spyfall', name:`Spyfall-Style Location`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`Phone (app or texts)`, type:`Deduction`},
  how:[`Deal roles secretly: easiest is a free Spyfall app so all four play; with no app, one passenger sits out as dealer and texts the same location to three players and "YOU ARE THE SPY" to the fourth.`,`Take turns asking each other questions about the place. Answers must prove you know where you are without naming it. If an answer names nothing specific, the asker can demand a concrete one — dodge twice and you look like the spy.`,`Run a 5-minute timer (use the ⏱ Timer tool).`],
  win:`Anyone can call a vote: everyone points on a count of three (not at yourself); most fingers is accused, a tie = no elimination and play continues. Catch the spy → group wins. Accuse an innocent → spy wins. The spy may declare and guess the location at any time (right = spy wins, wrong = group wins). Timer runs out with no catch → spy wins.`,
  note:`Best with the app so nobody has to sit out. Teach it once at a stop, not cold.`,
  banks:[
    {label:`Probe questions`, items:[`"Would you bring a kid here?"`,`"How are you dressed right now?"`,`"Roughly how much money do you have on you?"`,`"Is it loud or quiet where you are?"`,`"Have you been here before?"`,`"Are you here for work or for fun?"`,`"What's the smell like?"`,`"Could you fall asleep here?"`,`"Are there a lot of people around?"`,`"What time of day is it, would you say?"`,`"Is there anyone here you'd want to avoid?"`,`"How did you get here?"`]},
    {label:`Locations`, items:[`airport`,`gym`,`hospital`,`prison`,`wedding`,`casino`,`music festival`,`university`,`football stadium`,`car repair shop`,`nightclub`,`supermarket`,`military base`,`sauna`,`office party`,`ski resort`]}
  ] },

{ id:'20-questions-hard', name:`20 Questions: Hard Mode`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`2+`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Deduction`},
  how:[`One person thinks of a person, place, object, brand, movie, game, event or food — and types it into a phone note first so the answer can't quietly drift.`,`Add one hard-mode rule from the bank. Questions go round the car in order; the thinker answers strictly yes / no / irrelevant — no extra hints.`,`A specific "is it a banana?" guess counts as a GUESS, not a question, and you only get 3 guesses total.`],
  win:`Name it within the limit → guessers win; run the questions out → the thinker wins.`,
  banks:[{label:`Hard modes`, items:[`no "is it alive?" as the first question`,`only 15 questions`,`only 3 guesses, and a wrong guess wastes a question`,`you must ask one deliberately weird question before any guess`,`the answer must be something visible from the car right now`,`no questions about size, colour or shape`,`the thinker may lie exactly once — guessers must catch it`,`questions must alternate broad / specific`,`you lose a question every time a guesser says "um"`,`only 12 questions, no refunds`]}] },

{ id:'liar-round', name:`Liar Round`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`Phone (deal the liar)`, type:`Bluffing`},
  how:[`Pick a category. Deal the liar secretly: everyone draws from a shuffled phone-note (one slip says LIAR) or a quick card cut.`,`Everyone tells a short story from their life; the liar's is invented and must include three concrete specifics (a name, a place, a number) so there's something to interrogate.`,`At least one question each before the vote, then everyone points on a count of three (you may point at yourself as a bluff).`],
  win:`Most votes is the accused: if that's the liar, the truth-tellers each score 1; if it's an innocent (or a tie), the liar scores 2.`,
  banks:[{label:`Categories`, items:[`worst purchase`,`weirdest night out`,`travel story`,`embarrassing school story`,`workplace story`,`childhood story`,`"I almost got in trouble"`,`strange food experience`,`worst date`,`a time you got lost`,`a celebrity encounter`,`a near-miss / lucky escape`,`the worst job you've had`,`a time you broke something`,`a sports or fitness story`,`a story about a pet or animal`,`a time technology completely failed you`,`an awkward neighbour story`,`a time you got caught lying`,`the most you've ever spent in one day`]}] },

{ id:'mafia-lite', name:`Mafia-Lite`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`4+ (better with 5+)`, where:`In car`, driver:`Plays (an app moderates)`, energy:`Medium`, setup:`Phone (app)`, type:`Deduction`},
  how:[`At exactly 4 this is thin — one elimination and the mafia is obvious. Use a Mafia/Werewolf phone app to deal roles and run the night actions out loud, so nobody has to close their eyes in a car.`,`Setup at 4: 1 mafia, 1 detective, 2 civilians. Each night the mafia (in the app) picks someone and the detective checks one person; each day everyone argues and votes someone out. A tied day vote = no elimination, on to night.`],
  win:`Mafia wins if last standing; town wins if it votes out the mafia.`,
  note:`Honestly, at exactly four The Faker and Spyfall are the better hidden-role picks — save Mafia for when you're five or more, or always run it through the app.` },

{ id:'alibi', name:`Alibi`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Bluffing`},
  how:[`Two suspects are accused of the same crime and claim they were together elsewhere. They get 60 seconds to quietly agree their story.`,`The other two are detectives. Keep the suspects from hearing each other: one puts in earbuds with loud music (or steps out at a stop) while the other is questioned. Ask each suspect the SAME questions — at least 6.`],
  win:`The detectives jointly decide if any answer pair clearly conflicts; a vague-but-consistent pair still counts as a match. A clear contradiction = guilty (detectives score 1 each); consistent all the way = innocent (suspects score 1 each).`,
  banks:[
    {label:`Crimes`, items:[`ate the last snack`,`scratched the car`,`broke the aux cable`,`got us lost on purpose`,`set the alarm for the wrong time`,`left the fuel tank empty`,`ate someone else's reserved sandwich`,`hid the phone charger`,`booked the wrong hotel`,`lost the spare key`,`reversed into a bin`,`left the lights on and killed the battery`,`"borrowed" someone's hoodie and never gave it back`,`spilled coffee on the seat`,`deleted the road-trip playlist`]},
    {label:`Detective questions (ask both, compare)`, items:[`Whose idea was it to go there?`,`Who drove / who paid?`,`What was the weather doing?`,`What were you wearing?`,`What's the last thing you said to each other before you split up?`,`Who else was there?`,`What did you have to eat or drink?`,`What song was playing?`,`How long were you there, exactly?`,`What did you touch / pick up?`]}
  ] },

{ id:'secret-rule', name:`Secret Rule`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Deduction`},
  how:[`Youngest starts as keeper and silently picks a secret rule from the bank. Going round, each other player says a word; the keeper replies only "pass" or "fail."`,`The rule is always checkable from the SPELLING of the word alone (never its meaning), so there's never an argument.`,`From the second lap on, you may state a rule guess on your own turn, after your word — one guess per lap. If anyone thinks the keeper misjudged a word, it's checked against the stated rule at round's end; a keeper caught misjudging loses the round.`],
  win:`First to correctly state the rule wins and becomes the next keeper. Three full laps with no correct guess → the keeper reveals, then re-keeps or passes it on.`,
  banks:[{label:`Rules`, items:[`the word has a double letter (ba-ll, co-ff-ee)`,`the word starts and ends with the same letter (level, area)`,`the word starts with a vowel (apple, igloo)`,`the word ends in a vowel (pizza, radio)`,`the word contains the letter A`,`the word contains the letter S`,`the word has no letter from the word "ten" (no T, E or N)`,`the word is exactly four letters long`,`the word is longer than six letters`,`the word ends in "-ing"`,`the word contains a double vowel (book, rain)`,`your word starts with the same letter the previous word ended on`,`the word starts with the same letter as the keeper's first name`,`the word contains two of the same vowel (banana, igloo)`,`the word's first and last letters are both consonants`,`the word contains the letter pair "TH"`,`the word has more vowels than consonants`]}] },

{ id:'guess-the-ranking', name:`Guess The Ranking`, section:`Deduction & social`, tags:['compete'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`Phone (note)`, type:`Guessing`},
  how:[`One person picks a prompt and locks the 5 specific items aloud, then writes their personal top-to-bottom order into a phone note BEFORE the group discusses — and shows the note at reveal, no editing.`,`The others discuss and lock in a single guess at that order, then reveal. (For an open free-for-all with no secret answer, use Ranking Random Things.)`],
  win:`1 point for every item the group placed in the correct position (5 = perfect). Rotate the ranker; play a round each and total the points, highest wins.`,
  banks:[{label:`Prompts (narrow each to 5 specific items)`, items:[`favourite fast food chains`,`countries you most want to visit`,`music genres`,`movie franchises`,`sports to watch`,`car brands`,`crisp/chip flavours`,`cities you've been to`,`superpowers you'd actually use`,`pizza toppings`,`ways to die of old age (dark but funny)`,`people in this car, most to least likely to survive the apocalypse`,`decades for music`,`breakfast foods`,`holiday types (beach, city, ski, etc.)`,`seasons`,`types of weather`,`chores, least to most hated`,`fictional villains`,`biscuits`]}] },

{ id:'one-word-clue-chain', name:`One Word Clue Chain`, section:`Deduction & social`, tags:['cold'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Word`},
  how:[`One Guesser looks out the window and stays quiet. The other three agree a secret word on a phone screen the Guesser can't see.`,`Going round, each clue-giver says one single word linked to it. No proper nouns, no foreign words, no synonyms or homophones of the target, no part of the word, no rhyming, no gestures — the Guesser or any giver may veto a clue as too obvious and it must be replaced.`,`After each full lap the Guesser gets one guess.`],
  win:`Guesser names the word within 3 laps → the car scores 1 and a new Guesser takes over; otherwise the word stumped them. (Come at it from different angles — near-identical clues make the Guesser lock on too fast.)`,
  example:`Secret word "pirate" → "ship," "treasure," "eyepatch," "parrot," "ocean."`,
  banks:[{label:`Words`, items:[`pirate`,`dentist`,`volcano`,`wedding`,`penguin`,`library`,`thunder`,`cowboy`,`vampire`,`airport`,`snowman`,`detective`,`pancake`,`robot`,`lighthouse`,`dragon`,`beekeeper`,`astronaut`]}] },

/* ─────────── Card games ─────────── */
{ id:'rummy', name:`Rummy`, section:`Card games`, tags:['stops'],
  meta:{players:`2–4`, where:`In car if smooth, better at a stop`, driver:`Excluded`, energy:`Low`, setup:`Deck of cards`, type:`Card · 15–30 min`},
  how:[`Pick a dealer (rotate each round); deal 7 cards each. The player to the dealer's left goes first. Put the rest as a draw pile and turn one card face up as the discard.`,`On your turn, draw the top of the draw pile or the top discard, then discard one card. Build melds in your hand — sets (three 8s) or runs (4-5-6 of hearts, aces low only, no wrap K-A-2). You never lay melds down mid-game and can't lay off on others — you hold everything.`,`Go out when all your cards form valid melds except one final discard, and lay them face up to prove it. If the draw pile empties, shuffle the discard (except its top card) into a new draw pile.`],
  win:`Everyone else scores penalty points for cards left in hand — J/Q/K = 10, Ace = 1, number cards = face value. Lowest total after an agreed number of rounds (or first to 100) wins.`,
  note:`Calm and strategic; needs a small draw/discard pile on a lap or console. Skip if people want fast laughs.` },

{ id:'crazy-eights', name:`Crazy Eights`, section:`Card games`, tags:['cold','stops'],
  meta:{players:`2–4`, where:`In car`, driver:`Excluded`, energy:`Low`, setup:`Deck of cards`, type:`Card · 5–15 min`},
  how:[`Deal 5 cards each (deal clockwise; player left of the dealer plays first). Flip one card to start the discard pile — if it's an 8, the first player names the suit.`,`On your turn, play a card matching the top discard by suit or rank. Any 8 is wild — play it and name any suit (including the current one). If you can't play, draw one, then play it if possible or pass.`,`If the draw pile runs out, reshuffle the discard (keeping its top card) into a new draw pile.`],
  win:`First player with no cards wins. Optional scoring: losers count card values left in hand — 8s = 50, J/Q/K = 10, Ace = 1, others = face value; first to an agreed total loses, or play a fixed number of hands.`,
  note:`The best moving-car card game — almost everything stays in hand and the shared piles are small.` },

{ id:'hearts', name:`Hearts`, section:`Card games`, tags:['stops'],
  meta:{players:`4`, where:`Best at a stop`, driver:`Excluded`, energy:`Medium`, setup:`Deck of cards (people who know it)`, type:`Card · 25–45 min`},
  how:[`Deal all 13 cards each. Each hand, choose and pass 3 cards simultaneously before looking to play (rotate left, right, across, then no pass).`,`The player with the 2 of clubs leads it to the first trick; you may not play a heart or the queen of spades on the first trick unless you have nothing else. Follow the led suit if you can; otherwise play anything. Highest card of the led suit wins the trick and leads next.`,`Hearts are "broken" once any heart gets played because someone couldn't follow suit — only then may a heart be led. Each heart = 1 penalty point, queen of spades = 13. Take all hearts and the queen ("shoot the moon") and everyone else gets 26.`],
  win:`Play until someone hits 100 points; lowest score wins. If two tie for lowest, play one more hand.`,
  note:`Keep tricks as small face-down stacks. Only for players who already know trick-taking.` },

{ id:'spades', name:`Spades`, section:`Card games`, tags:['stops'],
  meta:{players:`4 (2v2 teams)`, where:`Best at a stop`, driver:`Excluded`, energy:`Medium`, setup:`Deck of cards (people who know it)`, type:`Card · 30–45 min`},
  how:[`Two teams of 2, partners alternating. Deal all 52 cards, 13 each. Bidding goes in turn starting left of the dealer — each player bids how many tricks they'll win; team bids combine (a combined zero isn't allowed unless playing Nil). The player left of the dealer leads first.`,`Follow suit if possible; otherwise play anything, including a spade. Highest card of the led suit wins unless a spade is played, then highest spade wins. Spades can't be led until "broken" (played because you couldn't follow) — unless you only have spades.`,`Each overtrick beyond your bid is a "bag" worth 1 point — but every 10 bags you accumulate costs 100, so don't routinely over-take. Optional: a player may bid Nil (zero tricks) for +100 if they take none, −100 if they take any.`],
  win:`Make your team bid → 10 points per bid trick + 1 per extra (bag); miss → lose 10 per bid trick. First team to 200 (or 500) wins; if both pass it the same hand, the higher total wins.`,
  note:`Rules-heavy — too much to teach casually in a moving car. A stop game.` },

/* ─────────── Phone-friendly ─────────── */
{ id:'photo-challenge', name:`Photo Challenge`, section:`Phone-friendly`, tags:['stops'],
  meta:{players:`All`, where:`In car`, driver:`Excluded (passengers shoot)`, energy:`Low`, setup:`Phone (camera)`, type:`Photo`},
  how:[`Call a prompt. Passengers grab candid shots out the window — only shots taken AFTER the prompt is called count, one photo each per prompt. (For posed/setup photos, see Photo Stop Challenge.)`,`Run a set number of prompts over a leg.`],
  win:`Judge at the next stop, one prompt at a time — you don't vote your own; the driver breaks ties.`,
  banks:[{label:`Prompts`, items:[`worst sign`,`best car`,`weirdest building`,`most cinematic view`,`saddest gas station`,`most cursed object`,`best candid moment in the car`,`funniest bumper sticker or number plate`,`bleakest stretch of road`,`most aggressive roadworks`,`a cloud that looks like something`,`best animal spotted`,`ugliest building`,`most middle-of-nowhere house`,`a sign with a typo or a weird name`,`the most "nothing" photo possible`]}] },

{ id:'mini-research-battle', name:`Mini Research Battle`, section:`Phone-friendly`, tags:['compete'],
  meta:{players:`4 (2 debate, 2 judge)`, where:`In car`, driver:`Plays (as a judge)`, energy:`Medium`, setup:`Phone (research)`, type:`Debate`},
  how:[`Draw a topic; the two debaters flip a phone coin for sides, get 3 minutes to research opposite sides (real facts allowed), then argue 90 seconds each.`,`Any cited fact must be shown on-screen to a judge if challenged — an unbacked "fact" that's challenged is struck. Debaters and judges swap roles next round so everyone argues. Pre-pick topics at a stop in case signal drops.`],
  win:`The two judges vote by secret thumbs (eyes shut, point at the winner) on who argued better, not who they agree with; the driver breaks a tied jury.`,
  banks:[{label:`Topics`, items:[`best gas station chain`,`most overrated city in Europe`,`worst car design ever made`,`most suspicious snack on a shelf`,`best country for a road trip`,`the most pointless invention that caught on`,`best decade for music`,`the most overrated tourist attraction`,`which animal would win, a fully grown one vs. 100 small ones`,`the best fast-food breakfast`,`is a hot dog a sandwich`,`the worst common phone habit`,`best superpower for everyday life (not fighting)`,`the most overrated "healthy" food`]}] },

/* ─────────── Chill conversation ─────────── */
{ id:'life-drafts', name:`Life Drafts`, section:`Chill conversation`, tags:['chill'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Conversation`},
  how:[`Go category by category. Each round, name the category and everyone locks in one pick, then reveal. Play 6–8 categories, then everyone makes a 20-second case for the life they built.`],
  win:`The car votes for the best life (not their own). If the vote ties, re-vote between only the tied lives.`,
  banks:[{label:`Categories (one pick each)`, items:[`one city to live in`,`one job`,`one car`,`one hobby`,`one food to eat forever`,`one celebrity friend`,`one useless luxury`,`one pet`,`one country to holiday in every year`,`one skill you instantly master`,`one app you're allowed to keep`,`one drink forever`,`one fictional world to visit`,`one person to have dinner with`,`one era to live in`,`one house (anywhere, any kind)`,`one band/artist for the rest of your life`,`one sport you become a pro at`,`one room of your dream home`,`one thing that's always free for you`]}] },

{ id:'desert-island-picks', name:`Desert Island Picks`, section:`Chill conversation`, tags:['chill'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Conversation`},
  how:[`Name a category; going clockwise, each person names their 3 picks, then the car argues about whose set is best.`],
  win:`No scoring — it's an argument starter.`,
  banks:[{label:`Categories (pick 3 each)`, items:[`albums`,`movies`,`foods`,`video games`,`drinks`,`tools to survive`,`people to be stuck with`,`TV shows`,`snacks`,`apps`,`books or audiobooks`,`comfort films you've seen a hundred times`,`things to bring to a desert island`,`songs you'd never get sick of`,`board games`,`people from history`,`fictional characters as teammates`,`condiments`,`smells`,`things you'd save from a fire`]}] },

{ id:'ranking-random-things', name:`Ranking Random Things`, section:`Chill conversation`, tags:['cold','chill'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Conversation`},
  how:[`As a group, argue your way to one agreed order, best to worst. (No secret answer — this is the open-debate ranking game.)`,`If you can't agree within ~3 minutes, everyone ranks solo and you compare — the disagreement is the fun.`],
  win:`No scoring — the debate is the point.`,
  banks:[{label:`Things to rank`, items:[`breakfast foods`,`fast food chains`,`pizza toppings`,`movie genres`,`seasons`,`public holidays`,`sports to watch`,`sports to play`,`car colours`,`phone apps`,`countries for a holiday`,`hangover foods`,`types of crisps`,`ways to spend a day off`,`decades for music`,`chocolate bars`,`forms of transport`,`biscuits`,`weather types`,`fast-food side dishes`]}] },

/* ─────────── Stop activities ─────────── */
{ id:'weird-item-hunt', name:`Local Weird Item Hunt`, section:`Stop activities`, tags:['stops'],
  meta:{players:`All`, where:`At a stop`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Stop`},
  how:[`At a stop, everyone has 3 minutes to find the weirdest item on the shelves (no need to buy it), then meet back at the car and present it.`],
  win:`Vote in the categories below; on a tie the finder gives one more 10-second pitch and the car re-votes.`,
  banks:[{label:`Vote categories`, items:[`weirdest`,`most useless`,`most tempting`,`most suspicious`,`best gift`,`most "why does this exist"`,`best regional speciality`,`most aggressively packaged`,`most cursed flavour`,`one you'd actually buy`]}] },

{ id:'one-coin-challenge', name:`One-Euro / One-Dollar Challenge`, section:`Stop activities`, tags:['stops'],
  meta:{players:`All`, where:`At a stop`, driver:`Plays`, energy:`Medium`, setup:`One coin each`, type:`Stop`},
  how:[`Everyone gets the same tiny fixed budget and has 3 minutes to buy the best possible item for it, then present at the car.`],
  win:`Vote in the categories below.`,
  note:`Costs a little money — skip it if anyone would rather not spend; everything else here is free.`,
  banks:[{label:`Categories`, items:[`best taste`,`funniest`,`most useful`,`worst but funny`,`best value`,`most regrettable`,`weirdest local thing`,`best emergency snack`]}] },

{ id:'photo-stop-challenge', name:`Photo Stop Challenge`, section:`Stop activities`, tags:['stops'],
  meta:{players:`All`, where:`At a stop`, driver:`Plays`, energy:`Low`, setup:`Phone (camera)`, type:`Photo`},
  how:[`At one stop, everyone has 3 minutes to set up and take one posed photo on the theme.`],
  win:`Vote in the car; on a tie, re-vote between the tied photos only.`,
  banks:[{label:`Themes`, items:[`album cover`,`crime scene but legal`,`travel brochure but depressing`,`LinkedIn profile photo`,`dramatic movie poster`,`evidence photo`,`band promo shot`,`the "before" photo in an infomercial`,`perfume or aftershave ad`,`the saddest stock photo imaginable`,`a power stance`,`estate-agent listing photo`,`"we don't talk anymore" music video still`,`prison visit`,`catalogue model who's having a great time`]}] },

/* ─────────── Prepared prompt lists ─────────── */
{ id:'would-you-rather', name:`Would You Rather`, section:`Prepared prompts`, tags:['cold'],
  meta:{players:`All`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Conversation`},
  how:[`Pose two options; each person picks one and defends it.`],
  win:`No winner — it's a talker.`,
  banks:[{label:`Prompts`, items:[`only eat gas station food for a month or airport food for a month?`,`never choose music again or never choose food again?`,`drive 12 hours with no music or 12 hours with only one song?`,`live in a tiny perfect apartment or huge ugly house?`,`always be 20 minutes early or 10 minutes late?`,`never drink coffee again or never eat pizza again?`,`win free flights for life or free hotels for life?`,`have perfect navigation sense or perfect memory?`,`only visit cities or only visit nature places?`,`be famous for something dumb or unknown but rich?`,`always have to sing instead of talk, or dance everywhere you walk?`,`have a permanent clown face or permanently clown shoes?`,`fight one horse-sized duck or a hundred duck-sized horses?`,`know the date you'll die or the way you'll die?`,`always be slightly too hot or slightly too cold?`,`have free taxis for life or free food at one chosen restaurant forever?`,`be unable to lie or unable to tell the truth?`,`have every red light on your commute or every traffic jam, forever?`,`only whisper or only shout for the rest of your life?`,`swap lives with the person to your left for a year, or never see them again?`,`be the funniest or the smartest person in every room?`,`have a rewind button you can use 3 times a year or a pause button once a year?`]}] },

{ id:'debate-prompts', name:`Debate Prompts`, section:`Prepared prompts`, tags:['cold'],
  meta:{players:`All`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Conversation`},
  how:[`Name the topic and let the car argue it out.`],
  win:`No winner — it's a talker.`,
  banks:[{label:`Topics`, items:[`best fast food chain`,`most overrated travel destination`,`best sport to watch live`,`best country for food`,`best movie franchise`,`worst common dating advice`,`best car brand if money matters`,`best age to be`,`most useful superpower`,`most annoying modern app`,`best breakfast`,`most overrated job perk`,`the most useless subject they taught us in school`,`best season, no compromises`,`the worst texture for a food to have`,`most overrated band or artist`,`coffee or energy drinks`,`the best city you've actually been to`,`worst chore in a shared flat`,`the most overrated movie everyone praises`,`best decade to have been a teenager`,`is cereal a soup`,`the most pointless luxury rich people buy`,`best pizza topping and the one that should be banned`,`the most annoying type of driver`]}] },

/* ─────────── Party & bluffing ─────────── */
{ id:'the-faker', name:`The Faker`, section:`Party & bluffing`, tags:['deduce'],
  meta:{players:`3–4 (4 with an app)`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`Phone (app or texts)`, type:`Bluffing`},
  how:[`Deal a category + secret word to everyone except one player (the Faker), who only gets the category. Easiest is a Chameleon/Faker app so all four play; with no app, a passenger sits out and texts the word to three and "FAKER" to one.`,`Each player says one word relating to the secret word. A passenger or the app calls a random start-player each lap (or use the 🎲 Dice) so the Faker can't always go last and copy. Clues must be a single common word — no synonyms or the word itself; too-obvious clues hand it to the Faker.`,`After one or two laps, everyone votes (point on three, not at yourself).`],
  win:`Catch the Faker → each innocent scores 1, and only then does the Faker get one shot to steal it by naming the word. Accuse the wrong person, or a tied vote → the Faker scores 2.`,
  banks:[
    {label:`Jobs`, items:[`firefighter`,`surgeon`,`chef`,`pilot`,`teacher`,`plumber`,`lawyer`,`farmer`]},
    {label:`Animals`, items:[`elephant`,`penguin`,`shark`,`kangaroo`,`owl`,`crocodile`,`hedgehog`,`dolphin`]},
    {label:`Places`, items:[`airport`,`hospital`,`beach`,`casino`,`gym`,`church`,`prison`,`zoo`]},
    {label:`Foods`, items:[`pizza`,`sushi`,`burger`,`pancakes`,`curry`,`ice cream`,`kebab`,`lasagne`]},
    {label:`Sports`, items:[`football`,`boxing`,`tennis`,`golf`,`swimming`,`skiing`,`darts`,`basketball`]},
    {label:`Films/TV`, items:[`Titanic`,`Breaking Bad`,`Star Wars`,`The Office`,`Harry Potter`,`Game of Thrones`]}
  ] },

{ id:'wavelength-dial', name:`Wavelength Dial`, section:`Party & bluffing`, tags:['cold','compete'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Guessing`},
  how:[`One clue-giver imagines a spectrum between two extremes and secretly picks a target number 1–10 — written into a phone note before the clue, revealed at scoring, no changing it.`,`They name one thing they think sits at that number (on "useless ←→ essential" they might say "a phone charger").`,`Everyone else confers and locks ONE shared guess for where on the 1–10 scale it sits (or, for more competition, each locks a private guess), then reveal.`],
  win:`Score by closeness — exact = 3, within 1 = 2, within 2 = 1. The clue-giver scores the SAME points as the guessers, so they're motivated to give a fair clue. Rotate the clue-giver a full lap; highest total wins.`,
  banks:[{label:`Spectrums`, items:[`useless ↔ essential`,`boring ↔ exciting`,`overrated ↔ underrated`,`cheap ↔ luxury`,`normal ↔ cursed`,`safe ↔ reckless`,`child food ↔ adult food`,`comfortable ↔ painful`,`healthy ↔ unhealthy`,`embarrassing ↔ impressive`,`weak ↔ powerful`,`ugly ↔ beautiful`,`calm ↔ stressful`,`trashy ↔ classy`,`forgettable ↔ iconic`,`harmless ↔ dangerous`,`cheap date ↔ expensive date`,`beginner ↔ expert`,`quiet ↔ annoying`,`basic ↔ elite`]}] },

{ id:'sixty-seconds', name:`Sixty Seconds`, section:`Party & bluffing`, tags:['laughs','compete'],
  meta:{players:`2+`, where:`In car`, driver:`Plays`, energy:`High`, setup:`Phone (timer)`, type:`Performance`},
  how:[`One person talks about a topic for 60 seconds (use the ⏱ Timer) without three faults: hesitation (a clear pause or filler — "um", "er"), repetition (repeating any noticeable word except a/the/and), or deviation (leaving the topic).`,`Anyone can buzz on a suspected fault. A buzz is upheld only if a MAJORITY of the OTHER players agree (the speaker may briefly defend); a frivolous buzz that fails means that buzzer can't buzz again for 15 seconds.`,`On a valid buzz the timer does NOT reset — the buzzer takes over and finishes the remaining seconds.`],
  win:`Whoever is talking when the 60 seconds ends scores 1; a correct buzz also scores 1.`,
  banks:[{label:`Topics`, items:[`gas stations`,`your morning routine`,`why this car is the best car`,`traffic`,`breakfast`,`the concept of Tuesdays`,`parking`,`socks`,`the motorway you're on`,`queues`,`the perfect sandwich`,`why dogs are better than cats`,`airports`,`your worst habit`,`the weather`,`why we should've left earlier`,`shoes`,`the snack situation in this car`,`mondays`,`the last film you watched`,`your phone's battery life`,`roundabouts`]}] },

{ id:'devils-advocate', name:`Devil's Advocate Tribunal`, section:`Party & bluffing`, tags:['compete'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Debate`},
  how:[`The assigned-side version of Mini Research Battle — you're often forced to argue the side you disagree with, with no prep. Pick a topic and two positions; a phone coin-flip assigns two players to the sides (you can't pick your side) and decides who speaks first.`,`Each side argues 90 seconds; then the first speaker gets a 20-second rebuttal at the end, to balance going first. Rotate so everyone debates.`],
  win:`The two non-debaters are the jury and vote on who argued better, not which side they agree with. A tied jury → replay with sides swapped.`,
  banks:[{label:`Topics`, items:[`cereal is a soup`,`the aisle seat is better than the window`,`pineapple belongs on pizza`,`mornings are better than nights`,`cash is better than card`,`summer is overrated`,`this trip should have been a train`,`tea is better than coffee`,`dogs are overrated`,`the book is never better than the film`,`sandwiches should be cut into squares not triangles`,`winter holidays beat summer holidays`,`texting is better than calling`,`the city beats the countryside`,`takeaway beats home cooking`,`electric cars are a mistake`,`social media made life better`,`breakfast is the worst meal`,`board games are better than video games`,`flying is better than driving`]}] },

{ id:'hidden-agenda', name:`Hidden Agenda`, section:`Party & bluffing`, tags:['deduce','chill'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`Phone (assign words)`, type:`Bluffing`},
  how:[`Each player is secretly given a random word — one passenger texts each player privately, or use a random-word app and screenshot to each (re-draw any word nobody could plausibly work in).`,`Set a 5-minute timer and a starting topic ("the worst holiday you've had," "your dream car"). Just talk, and try to slip your word in so smoothly nobody clocks it.`,`If you think someone forced their word, call "FORCED!" and name it. You get ONE call total, used before or after you land your own word — spend it wisely.`],
  win:`When the timer ends, reveal all words. +1 if you landed yours unbusted · +1 for each word you correctly FORCED-called · −1 for a wrong call (you can go negative) · 0 if you never landed your word, whatever your calls. Highest total wins.`,
  banks:[{label:`Words`, items:[`banana`,`Belgium`,`moisturiser`,`hamster`,`trampoline`,`pineapple`,`helicopter`,`dentist`,`avalanche`,`walrus`,`karaoke`,`cucumber`,`volcano`,`referee`,`eyebrow`,`parsley`,`gravy`,`sunburn`,`passport`,`pothole`,`snoring`,`seagull`]}] },

/* ─────────── Fast competitive ─────────── */
{ id:'mind-meld', name:`Mind Meld`, section:`Fast competitive`, tags:['compete'],
  meta:{players:`2 at a time`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Word`},
  how:[`The pair counts "1, 2, 3" and each blurts one word — no planning, no talking between blurts.`,`Next round, both simultaneously say a word that BRIDGES the two previous words (if it was "fire" and "ocean," both might aim for "steam") — a genuine bridge, not a plain synonym of either, and never a word already said this round.`,`Keep going, reading each other and converging.`],
  win:`The pair matches → win; no match within 6 rounds → score 7 and the next pair goes. Score = rounds taken (fewer is better); run an even number of rounds per pair, lowest total across the trip wins, ties → a sudden-death pairing.` },

{ id:'contact', name:`Contact`, section:`Fast competitive`, tags:['deduce'],
  meta:{players:`4`, where:`In car (best taught at a stop)`, driver:`Excluded (listens only); passengers run it`, energy:`Medium`, setup:`Phone (timer)`, type:`Deduction`},
  how:[`The Keeper silently picks a secret word and says only its first letter (e.g. "B"). Keeper rotates clockwise each word.`,`Guessers think of words starting with that letter and clue them without naming them: "it's a yellow fruit." If another guesser thinks they know it, they say "Contact!"; both count "3, 2, 1" and say their word at once.`,`If they match AND the clue-giver confirms that was their actual target AND it's not the Keeper's word, the Keeper must reveal the next letter ("BA"). The Keeper can defend by saying the clued word before the count finishes — that kills the clue, but the Keeper must keep engaging, not just stall.`],
  win:`Guessers win (score 1 as a team) by saying the full word or forcing every letter out; the Keeper wins (scores 1) by surviving a 4-minute timer. Rotate until everyone's kept once; most points wins.`,
  example:`Keeper says "B." Guesser 1 clues "it's a yellow fruit" (thinking banana). Guesser 2 shouts "Contact!", they count 3-2-1 and both say "banana." It matches, the clue-giver confirms banana, and it isn't the Keeper's word, so the Keeper reveals "BL." Now everyone re-clues for a word starting "BL."` },

{ id:'dont-say-it', name:`Don't Say It`, section:`Fast competitive`, tags:['cold','stakes'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`High`, setup:`Phone (timer)`, type:`Challenge`},
  how:[`One person sits in the hot seat. The group picks 2–3 forbidden words — always "yes" and "no," plus one wildcard ("I," a colour, "car"). For 60 seconds the group rapid-fires questions; the hot-seat player must answer every one with a FULL spoken sentence within 3 seconds.`,`A grunt, a single word, or silence counts as caught (no dodging by barely answering).`],
  win:`Say a forbidden word or get caught not answering → you draw from the Punishment Bank; note how long you lasted. Everyone takes a turn; longest survivor wins. A tie on time → a sudden-death 30-second round.` },

{ id:'pass-the-take', name:`Pass The Take`, section:`Fast competitive`, tags:['laughs'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`High`, setup:`None`, type:`Performance`},
  how:[`The topic-namer picks a topic and JUDGES the round (they sit out). One person starts a strong opinion; anyone can shout "switch!" and the next person continues the exact same argument mid-sentence, same stance and momentum, as one continuous escalating rant.`,`A "switch!" is only valid 3+ seconds after the last one, so the new ranter gets a fair window.`],
  win:`Stall, contradict the stance, repeat a point, or break the sentence (the topic-namer calls it) → you're out. Last one ranting wins; rotate the topic-namer and start a new topic.`,
  banks:[{label:`Topics`, items:[`why mornings are a scam`,`the correct way to load a dishwasher`,`why this is the best gas station snack`,`airports`,`why we should have left earlier`,`the problem with modern shoes`,`why this playlist is genius`,`the case against socks`,`why the back seat is the best seat`,`the truth about breakfast`,`why roundabouts are superior`,`the problem with other drivers`,`why we deserve a longer break`,`the dark side of group chats`,`why this is the last road trip we plan like this`]}] },

/* ─────────── Classic word & memory ─────────── */
{ id:'ghost', name:`Ghost`, section:`Classic word & memory`, tags:['compete'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Word`},
  how:[`Each player adds one letter to a growing fragment, always heading toward a real word of 4+ letters. The first three letters can never complete a word — a word only "completes" from the 4th letter on.`,`You don't want to complete a real word — add letters that keep a word possible but push the finishing letter onto the next person.`,`Instead of adding a letter you can challenge the previous player to name a real word starting with the fragment; if they can, you lose the round, if they can't, they do. Disputes are settled by a phone dictionary — not in it, doesn't count.`],
  win:`Completing a word, or losing a challenge, earns you a letter — G, H, O, S, T. Spell GHOST and you're out; last standing wins. The loser of a round starts the next.`,
  example:`C → CL → CLO → CLOU (nearly forced to CLOUD/CLOUT) → next player must add D or T and completes the word.`,
  note:`Mixed-skill house rule: a 4+ letter real word ends the round even if a longer word exists — stops one player steering every fragment into obscure long words. Harder version (Superghost): add a letter to either end of the fragment (ERA → bERA or ERAd).` },

{ id:'fizz-buzz', name:`Fizz Buzz`, section:`Classic word & memory`, tags:['cold'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Reflex`},
  how:[`Count up out loud around the car (clockwise unless a variant reverses it). Divisible by 3 → "Fizz." By 5 → "Buzz." By both (15, 30, 45…) → "Fizz Buzz." So: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, Fizz Buzz, 16…`],
  win:`Say the wrong thing or break the rhythm (about a 2-second pause, the car judges) and you're out. When someone's out, restart from 1 with the person after them. Last player in wins.`,
  banks:[{label:`Harder variants (pick one)`, items:[`add a third rule: divisible by 7 → "Bang"`,`any number that just contains a 3 (13, 23, 30–39) also becomes "Fizz," not only multiples`,`reverse the direction of play on every "Buzz"`,`put everyone on a half-second answer clock`]}] },

{ id:'picnic', name:`I'm Going on a Picnic`, section:`Classic word & memory`, tags:['cold'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Memory`},
  how:[`First player (chosen freely, then clockwise): "I'm going on a picnic and I'm bringing apples." Each next player repeats the whole list in order and adds one new item.`],
  win:`Miss an item, get the order wrong, or stall (more than ~5 seconds to start your recital) → you're out. On a disputed miss, the last correct recital is the reference and the car judges. Last player standing wins.`,
  banks:[{label:`Frames & harder version`, items:[`"In my suitcase I packed…"`,`"At the festival I saw…"`,`"On the road we passed…"`,`Harder: items must be added in alphabetical order (apples, bread, cheese, dates…)`]}] },

/* ─────────── Challenges & punishments ─────────── */
{ id:'punishment-bank', name:`Punishment Bank`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`1 (drawn by whoever failed)`, where:`In car / at a stop`, driver:`Draws 1–5 only`, energy:`Medium`, setup:`Dice (1–8)`, type:`Punishment`},
  how:[`When someone fails a challenge they roll the 🎲 Dice (1–8) or the catcher picks. Every punishment is demanding to keep up or something to do — never a one-off sentence. No punishment costs money, and none is about ranking or roasting each other.`,`Driver only ever draws 1–5 (talk-only) — if the driver rolls 6–8, reroll until 1–5 (or use the Dice tool's "driver-safe" toggle). 6–7 are passenger-only. 8 is stop-only.`,`Keep a failure tally on the Trip Scoreboard; most failures by arrival does the Finale — the group picks one Walk of Shame look (#8) to wear for the first hour at the destination, or the loser does the Narrator (#5) on the group for the first 15 minutes after parking. Tie on failures → the tied players each draw one arrival punishment.`],
  win:`No winner — this is the consequences table the other challenges point to.`,
  banks:[{label:`The 8 punishments (roll 1–8)`, items:[
    `1 · Voice for a leg (driver-safe) — until the next stop talk only in an assigned voice; slipping = re-draw. Pick: movie-trailer narrator, GPS sat-nav lady, football commentator, toddler, Bond villain, nature-doc narrator, 1920s radio announcer, Shakespearean actor, ASMR whisper, robot/TTS, pirate, news anchor, gym coach, gravelly action hero.`,
    `2 · The Catchphrase (driver-safe) — until the next stop end every sentence with an assigned tag: "…and I stand by that," "…allegedly," "…as a man of culture," "…sadly," "…for legal reasons," "…probably," "…like my father before me," "…and that's the tea," "…no further questions," "…respectfully," "…in this economy?", "…God willing," "…as the prophecy foretold," "…but that's none of my business," "…trust the process," "…and I won't apologise."`,
    `3 · The Trigger (driver-safe) — do an assigned reaction every time you pass a trigger (truck / bridge or tunnel / fuel or fast-food sign / roundabout / sign for another city / police car), until the next stop; miss one and the clock resets. Reaction (driver = voice only): cheer "LET'S GO," say "thank you for your service," gasp, mutter "…and there it is," or boo. Passengers may add hands up, a salute, or a knee drumroll.`,
    `4 · Sound-Effects Guy (driver-safe) — for 10 minutes add a mouth sound effect to every action in the car (door creak, a glug when someone drinks, tick-tock for the blinker, a whoosh for a phone grab). Miss an obvious one and the 10 minutes restart.`,
    `5 · The Narrator (driver-safe) — for 10 minutes narrate the car like a hushed nature documentary. Go quiet more than 30 seconds or break = restart.`,
    `6 · One-Handed (passenger-only) — tuck your dominant hand under your leg; everything one-handed until the next stop. Caught using both = re-draw.`,
    `7 · Frozen (passenger-only) — sit on both hands for 5 minutes while the others bait you (offer snacks, fake-toss things). Move your arms = fail.`,
    `8 · Walk of Shame (stop-only) — walk into the next stop wearing an assigned look (using only what's in the car) and keep it until you're back inside. Pick one: sunglasses indoors, hood up with the drawstring fully shut, jacket backwards, collar pulled over your head, trousers tucked into socks, or an exaggerated catwalk strut.`
  ]}] },

{ id:'the-interrogation', name:`The Interrogation`, section:`Challenges & punishments`, tags:['cold','laughs','stakes'],
  meta:{players:`4 (one in the chair)`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`One person is in the chair; the others read questions off the list, fast. You must answer out loud within 3 seconds, may not say "I don't know," "pass," "maybe," change the subject, or repeat an earlier answer verbatim. The answer needn't be good — just instant.`,`The person to the asker's left counts the 3-count aloud and rules.`],
  win:`Stall past the 3-count, dodge, or non-answer → draw from the Punishment Bank, next person takes the chair.`,
  banks:[{label:`Questions`, items:[`What's a food you pretend to like?`,`If you had to delete one app forever, which?`,`What's the worst movie you secretly enjoy?`,`Weirdest thing you've ever eaten?`,`What's the last thing you searched on your phone?`,`What animal would you fight for 1000 euros?`,`Worst haircut you've ever had?`,`What's your most useless talent?`,`What's a word you can never spell right?`,`Worst gift you've ever received?`,`What's massively overrated?`,`What's your comfort meal at 2am?`,`What chore do you hate the most?`,`What trend do you completely not get?`,`Pineapple on pizza — defend your answer?`,`Cats or dogs, and why is the other one worse?`,`Dumbest way you've ever injured yourself?`,`What skill do you wish you had?`,`Window or aisle, no hesitating?`,`What's the worst advice you've ever followed?`,`A famous person you find weirdly annoying?`,`What would you do with a completely free Saturday?`,`What's something you're irrationally scared of?`,`Best thing you've ever eaten at a gas station?`,`What's a hill you'd genuinely die on?`]}] },

{ id:'questions-only', name:`Questions Only`, section:`Challenges & punishments`, tags:['laughs'],
  meta:{players:`2 at a time`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`Two players act out a quick scene, speaking only in questions, back and forth. The two players NOT in the scene judge.`],
  win:`Say a statement, hesitate over 3 seconds, repeat a question, or throw a non-question ("uh, what?") → out. A statement dressed as a tag-question ("nice day, isn't it?") counts as out. Loser draws a punishment; winner faces a new challenger.`,
  banks:[
    {label:`Opening lines`, items:[`"Do you come here often?"`,`"Is that really what you're wearing?"`,`"Have you seen my keys?"`,`"Why are you in my house?"`,`"Are you going to finish that?"`,`"Did you just take my parking spot?"`]},
    {label:`Scenarios`, items:[`two strangers at a bus stop`,`a terrible job interview`,`a couple lost and arguing about directions`,`two spies who half-recognise each other`,`a customer and the world's worst waiter`,`two people who both think the other called the meeting`]}
  ] },

{ id:'forbidden-letter', name:`The Forbidden Letter`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`1–2`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`Phone (timer)`, type:`Challenge`},
  how:[`You're assigned a common letter. For 5 minutes (use the ⏱ Timer) you may not say any word containing it, while everyone else asks you questions to trip you up. Spelling counts, not sound — "knife" contains a K. Best as a duel: two people under the same letter, last to slip wins.`],
  win:`Say a word containing the letter and get caught → draw a punishment. If both duellists survive the timer, ban S for a 90-second sudden-death.`,
  banks:[{label:`Letters by difficulty`, items:[`Warm-up: B, F, K, P, G, V`,`Real challenge: D, H, M, W, L, C`,`Nightmare: S, T, R, N`,`Don't ban a vowel — that makes speech impossible. Hardest fair version: ban S for a 90-second burst.`]}] },

{ id:'rhyme-chain', name:`The Rhyme Chain`, section:`Challenges & punishments`, tags:['cold','compete','stakes'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`Someone calls a starting word; going round, each person says a new word that rhymes, within a 3-second count (the starter counts).`,`No repeating any word used earlier in the same chain.`],
  win:`Can't produce one in time, repeat a word, or try a fake rhyme → out for the round. A fake-rhyme challenge is settled by instant simple majority — no dictionary arguments. Last standing wins; whoever went out first draws a punishment.`,
  banks:[{label:`Starter words`, items:[`cat`,`light`,`day`,`four`,`blue`,`sound`,`name`,`cold`,`train`,`line`,`top`,`bear`,`cake`,`hill`,`ring`,`sing`,`gold`,`mad`,`school`,`tall`]}] },

{ id:'keep-straight-face', name:`Keep a Straight Face`, section:`Challenges & punishments`, tags:['laughs','stakes'],
  meta:{players:`2+ (one target)`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`Phone (timer)`, type:`Challenge`},
  how:[`One person is the target and holds a straight face for 60 seconds while a challenger reads the lines below in the most deadpan voice possible. The target must keep facing the reader.`,`The driver is NEVER the target (eyes stay on the road) — the driver can be the deadpan reader.`],
  win:`The target laughs, smiles, or cracks a grin → draws a punishment. Any non-reader may call the crack and the call stands.`,
  banks:[{label:`Deadpan lines`, items:[`"I have never once trusted a man who folds his pizza."`,`"My greatest enemy in this world is the second sock."`,`"I would like to formally apologise to every escalator I have ever stood still on."`,`"Sometimes I clap when the plane lands. Alone. In my apartment."`,`"I believe geese know exactly what they did."`,`"My five-year plan begins with buying a slightly bigger spoon."`,`"Every cloud is just a sky burrito waiting to happen."`,`"I once lost a staring contest to a fish and I think about it daily."`,`"I don't believe in Tuesdays and I never have."`,`"A pigeon looked me in the eye last week and I haven't felt safe since."`,`"I keep my cereal in the fridge and my milk in my heart."`,`"I have a complicated relationship with revolving doors."`,`"I would trust a horse to do my taxes before I'd trust most men."`,`"Sometimes I whisper 'good luck' to my food before I eat it."`,`"I have never finished a tube of lip balm and I never will."`,`"My greatest fear is being asked to guess someone's age."`]}] },

{ id:'order-roulette', name:`Order Roulette`, section:`Challenges & punishments`, tags:['stops','stakes'],
  meta:{players:`1 (rest witness)`, where:`At a stop`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`At a food or coffee stop, draw an order style and keep it up for the whole order, with the group within earshot to rule.`],
  win:`Drop the style, laugh out of it, or order normally → punishment. Bailing out of politeness to busy or unamused staff is never a fail.`,
  banks:[{label:`Order styles`, items:[`Order entirely in a whisper.`,`Call the cashier "captain" at least twice.`,`Order your drink by describing it, never its name — "the dark hot bean water," "the cold yellow fizzy one."`,`Add "…if you'd be so kind" to the end of every request.`,`Order like it's the most important decision of your life, then change your mind twice.`,`Order for an imaginary table of ten, then finish with "actually, just the one."`,`Refer to every item as "the usual."`,`Speak only in a hushed, dramatic movie-trailer voice.`,`Be aggressively, suspiciously over-polite about everything.`,`Pretend you're a regular and act mildly hurt they don't recognise you.`,`Ask one genuine but very specific question about every item before ordering.`,`Treat the cashier like a long-lost friend you're thrilled to see.`]}] },

{ id:'no-complaint-stretch', name:`No-Complaint Stretch`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`All`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Challenge`},
  how:[`Pick one leg between stops; nobody may complain. A complaint = a clearly negative statement about the trip, comfort, music, food, timing, traffic, other drivers, weather, or saying you're tired/hungry/bored/need the toilet. Neutral questions are fine; silence is allowed (it's self-restraint, not a talking quota).`],
  win:`First person to complain → punishment. Borderline calls go to a quick majority and a tie favours the accused. If nobody complains the whole leg, everyone passes — no punishment.`},

{ id:'banned-word', name:`The Banned Word`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`All`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Challenge`},
  how:[`The group picks one extremely common word that's hard to avoid for the whole leg. Anyone may call a slip the instant they hear it; if challenged, a quick majority confirms.`],
  win:`Single-catch mode: first confirmed slip draws a punishment and the leg resets. Tally mode: most confirmed slips by the next stop draws.`,
  banks:[{label:`Banned-word options`, items:[`like`,`literally`,`actually`,`honestly`,`basically`,`bro`,`dude`,`just`,`so`,`I think`,`kind of`,`you know`,`no cap`,`everyone's first names`]}] },

{ id:'tongue-twister', name:`Tongue Twister Gauntlet`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`1 at a time`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`You're assigned a tongue twister and must say it three times fast in a row.`],
  win:`Success = three clean run-throughs, no restart and every word intelligible; a restart or a clearly garbled word = fail → punishment. The group calls it.`,
  banks:[{label:`Twisters`, items:[`red lorry, yellow lorry`,`unique New York`,`Irish wristwatch`,`toy boat (say it five times)`,`truly rural`,`pad kid poured curd pulled cod`,`she sells seashells by the seashore`,`Peter Piper picked a peck of pickled peppers`,`a proper copper coffee pot`,`thin sticks, thick bricks`,`which witch wished which wicked wish`,`six slippery snails slid slowly seaward`,`crisp crusts crackle crunchily`,`eleven benevolent elephants`,`how much wood would a woodchuck chuck if a woodchuck could chuck wood`,`Greek grapes`]}] },

{ id:'ministers-cat', name:`The Minister's Cat`, section:`Challenges & punishments`, tags:['cold'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`Going round the car, describe "the minister's cat" with an adjective, all on the same letter, starting at A ("an angry cat," "an awesome cat"). Once everyone's gone, move to B, then C, through the alphabet. The next player clockwise counts the 3-count.`],
  win:`Can't produce an adjective within a 3-count, or repeat one already used → out (or draw a punishment). A challenged word must be a genuine adjective; a quick majority settles it instantly. Last player standing wins.`,
  note:`Harder version: cumulative — repeat every adjective said so far, in order, then add the next letter's.` },

{ id:'counting-game-21', name:`The Counting Game (21)`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`Dice / phone (target)`, type:`Challenge`},
  how:[`Each round, draw a random target from 15–30 (use the 🎲 Dice tool) so the game can't be "solved" and memorised. The previous round's loser starts the next.`,`Count upward around the car; on your turn say one, two, or three numbers in a row.`],
  win:`Saying a number above the target, or being forced to say the target itself, is out → draw a punishment; restart with a new random target.`,
  note:`Harder version: each round's winner adds a rule replacing a number with an action (7 = a clap, 14 = "moo", any multiple of 5 = reverse direction). Break a rule = out. Rules stack into chaos.` }

];

/* quick-pick groups (the file's "Best ___" lists) */
window.CAR_GROUPS = [
  { key:'cold',    label:'Easiest cold',     hint:'tired, zero setup, no thinking' },
  { key:'laughs',  label:'Best for laughs',  hint:'loud and stupid' },
  { key:'compete', label:'Competition',      hint:'clear winner' },
  { key:'deduce',  label:'Deduction & bluff',hint:'work out who/what' },
  { key:'chill',   label:'Chill sections',   hint:'low energy talkers' },
  { key:'stops',   label:'For stops',        hint:'out of the car' },
  { key:'stakes',  label:'Stakes & dares',   hint:'fail → punishment' },
  { key:'system',  label:'Whole-trip',       hint:'runs across the drive' }
];
