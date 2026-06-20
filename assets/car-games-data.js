/* ============================================================
   Where To, Crew? — CAR GAMES DATA
   Faithful transcription of car_trip_activities.md.
   For 4 guys (~26) on an ~8-hour drive. Verbal / card / phone /
   deduction games, challenges and stop activities.
   tags: cold | laughs | compete | deduce | chill | stops | stakes | system
   ============================================================ */
window.CAR_GAMES = [

/* ─────────── Whole-trip systems ─────────── */
{ id:'trip-scoreboard', name:`Trip Scoreboard`, section:`Whole-trip systems`, tags:['system','chill'],
  meta:{players:`All`, where:`In car`, driver:`Plays (a passenger keeps the note)`, energy:`Low`, setup:`Phone (shared note)`, type:`Scoring`},
  how:[`Keep a shared note with points and award small points (1–3, to keep it casual) through the trip.`],
  win:`Most points by arrival wins.`,
  banks:[{label:`What to award points for`, items:[`winning games`,`closest arrival-time prediction`,`best song pick`,`best snack pick`,`funniest quote`,`spotting something rare`,`best photo`,`best roast`,`best stop choice`,`worst take of the trip`]}] },

{ id:'prediction-league', name:`Prediction League`, section:`Whole-trip systems`, tags:['system','compete'],
  meta:{players:`All`, where:`In car`, driver:`Plays (a passenger tracks answers)`, energy:`Low`, setup:`Phone (note)`, type:`Guessing`},
  how:[`Before each segment everyone predicts one or more things; a passenger records the guesses and checks them when they resolve.`],
  win:`Closest guess gets points.`,
  banks:[{label:`Things to predict`, items:[`arrival time at the next stop`,`number of police cars before the next stop`,`first fast-food chain spotted`,`next country/region/city on a number plate`,`whether the next bathroom will be decent`,`how many red cars in 10 minutes`,`how many times someone says they're hungry`,`what song will randomly come up first`,`whether the next gas station has decent coffee`,`number of trucks before the next exit`,`how many tunnels before the next stop`,`the price of fuel at the next station`,`how many minutes until someone needs the toilet`,`whether we hit traffic before the next junction`,`the colour of the next car that overtakes us`,`how many roundabouts before the next town`,`what the next song's genre will be`,`how long until someone brings up food again`,`whether the next services has a Burger King / McDonald's / KFC`,`the outside temperature at the next stop`]}] },

{ id:'trip-awards', name:`Trip Awards`, section:`Whole-trip systems`, tags:['system','chill'],
  meta:{players:`All`, where:`In car (end of trip)`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Scoring`},
  how:[`At the end of the trip, hand out awards by group vote.`],
  win:`No single winner — it's the closing ceremony.`,
  banks:[{label:`Awards`, items:[`best snack`,`worst snack`,`best song`,`worst song that still worked`,`best quote`,`worst take`,`best stop`,`worst bathroom`,`best navigator`,`most useless passenger`,`best prediction`,`worst prediction`,`best photo`,`most dramatic complaint`,`MVP of the drive`]}] },

/* ─────────── Funny and chaotic ─────────── */
{ id:'hot-takes-court', name:`Hot Takes Court`, section:`Funny & chaotic`, tags:['laughs'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`High`, setup:`None`, type:`Debate`},
  how:[`One person gives a strong opinion; the others prosecute or defend it for 3–5 minutes, then everyone votes a verdict.`],
  win:`The group votes one of: valid take · criminal take · insane but interesting · never speak again. No elimination — it's for laughs.`,
  banks:[{label:`Takes`, items:[`fries are better without ketchup`,`airport food is underrated`,`winter is better than summer`,`sleeping in jeans is acceptable`,`coffee is mostly placebo`,`most expensive restaurants are not worth it`,`movie trailers are too long`,`working from the office is sometimes better`,`sparkling water is a scam`,`breakfast is overrated`,`showering at night is the only correct time`,`texting back instantly is a red flag`,`most films would be better 20 minutes shorter`,`cereal was never meant to be eaten dry`,`group holidays ruin friendships`,`a hot dog is objectively a sandwich`,`people who don't like dogs can't be trusted`,`the window seat is overrated`,`tipping culture has gone too far`,`pineapple on pizza is fine and you're all cowards`,`voice notes longer than 30 seconds should be illegal`,`the snooze button should be removed from all phones`]}] },

{ id:'bad-movie-pitch', name:`Bad Movie Pitch`, section:`Funny & chaotic`, tags:['laughs'],
  meta:{players:`2+`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Performance`},
  how:[`Someone gives a random title; another person pitches the film — genre, main character, villain, plot twist, final scene, and a Rotten Tomatoes score.`],
  win:`Others rate the pitch 1–5 if a winner across the round is wanted; otherwise it's a laugh.`,
  banks:[{label:`Titles`, items:[`The Last Sandwich`,`Exit 47`,`Fuel Stop`,`The Man From Kaunas`,`Bathroom Key`,`Four Men And A Map`,`No Signal`,`The Fifth Coffee`,`Tire Pressure`,`The Wrong Playlist`,`Diesel Heart`,`The Long Way Round`,`Roadworks`,`Two Stars Out of Five`,`The Glovebox`,`Midnight Toll Booth`,`The Spare Tyre`,`Detour`,`Cruise Control`,`The Last Charge (10%)`,`Lane Assist`,`Sat Nav Says No`]}] },

{ id:'explain-drunk', name:`Explain It Like You Are Drunk`, section:`Funny & chaotic`, tags:['laughs','cold'],
  meta:{players:`2+`, where:`In car`, driver:`Plays`, energy:`High`, setup:`None`, type:`Performance`},
  how:[`Explain a simple thing in the worst but still understandable way.`],
  win:`Others rate clarity 1–10.`,
  banks:[{label:`Things to explain`, items:[`taxes`,`football`,`dating apps`,`airplanes`,`cryptocurrency`,`gym memberships`,`insurance`,`traffic lights`,`coffee machines`,`LinkedIn`,`how the internet works`,`why the sky is blue`,`what a mortgage is`,`how a fridge keeps things cold`,`what electricity is`,`how phones make calls`,`why we have leap years`,`what the stock market is`,`how planes stay up`,`what Wi-Fi actually is`,`how a car engine works`,`what taxes pay for`]}] },

{ id:'group-chat-trial', name:`The Group Chat Trial`, section:`Funny & chaotic`, tags:['laughs'],
  meta:{players:`4`, where:`In car`, driver:`Judges only`, energy:`High`, setup:`None`, type:`Performance`},
  how:[`Put someone on trial for a harmless habit. Roles: one accused, one prosecutor, one defence lawyer, one judge (the driver judges — talk-only). Both sides argue, then the judge rules.`],
  win:`Acquitted = the accused wins; guilty = they draw a Punishment Bank punishment.`,
  banks:[{label:`Charges`, items:[`bad playlist habits`,`always being late`,`ordering the exact same food everywhere`,`using too many emojis`,`catastrophic parking`,`always saying "we'll see"`,`refusing all vegetables`,`never putting their phone on silent`,`taking forever to get ready`,`replying to texts three days later`,`talking through every film`,`leaving voice notes that are too long`,`being weird about how the dishwasher is loaded`,`never offering to drive`,`always "knowing a shortcut"`,`double-dipping`,`stealing fries but never ordering their own`,`being too loud on speakerphone`,`never having cash`,`claiming they "called it" after the fact`]}] },

/* ─────────── Competitive games ─────────── */
{ id:'playlist-battle', name:`Playlist Battle`, section:`Competitive`, tags:['compete'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays (says pick aloud, a passenger queues it)`, energy:`Medium`, setup:`Phone (music)`, type:`Scoring`},
  how:[`Pick a theme for the round.`,`Each player has 90 seconds to queue one song that fits the theme, secretly. The driver says their pick to a passenger who queues it.`,`Play the first 30 seconds of each pick. The picker gets ten words max to sell it.`,`Everyone scores each song 1–5 (not their own).`],
  win:`Highest total wins the round and a Trip Scoreboard point.`,
  banks:[{label:`Themes`, items:[`best driving song`,`song that goes hard but you're embarrassed to admit it`,`best song to scream in a car`,`a song that instantly takes you back to school`,`worst song that is somehow still a banger`,`song most likely to start an argument`,`best one-hit wonder`,`a song your dad would love`,`best song under two minutes`,`song that should be illegal to skip`]}] },

{ id:'auction-game', name:`Auction Game`, section:`Competitive`, tags:['compete'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays (a passenger tracks budgets)`, energy:`Medium`, setup:`None`, type:`Scoring`},
  how:[`One person is the auctioneer (rotate each round) and reads a fixed list of items. Everyone has 100 imaginary euros and no single bid can exceed 40. Auction items one at a time; highest bidder wins each and pays from their budget. A passenger who isn't the auctioneer calls out remaining budgets. When all items are sold, each owner makes a 10-second case for their best item.`],
  win:`The car votes for the single best item of the round (not their own); its owner takes the point.`,
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
  how:[`A passenger finds a random item online and reads it out without the price. Everyone locks in a guess and says it on a count of three (no going in order, or the last person just guesses one euro above the leader).`],
  win:`Closest to the real price wins the round.`,
  banks:[{label:`Items to look up`, items:[`a weird boutique hotel room for one night`,`a used car from the year you were born`,`the most expensive watch on the first page of results`,`genuinely ugly designer shoes`,`a ridiculous Airbnb (treehouse, castle, igloo)`,`a retro game console, boxed`,`a suspicious gadget off a marketplace app`,`a single bottle of very expensive whisky`,`a celebrity's house that's for sale`,`the most expensive item on a fast-food menu somewhere abroad`,`a first-class flight to the other side of the world`,`a gaming PC built to the max`,`a designer hoodie that looks like a normal hoodie`,`a vintage football shirt`,`a kilo of the world's most expensive coffee`,`a parking spot in a major city centre`,`a meal at a 3-Michelin-star restaurant (per person)`,`the newest folding phone`]}] },

/* ─────────── Deduction & social ─────────── */
{ id:'spyfall', name:`Spyfall-Style Location`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`4`, where:`In car`, driver:`Sets up then plays (a passenger deals roles)`, energy:`Medium`, setup:`Phone (assign roles)`, type:`Deduction`},
  how:[`One player is the spy and doesn't know the location; everyone else shares the same location (a passenger deals it by phone message). Players take turns asking each other questions about the place. Answers must prove you know where you are without naming it — too vague and you look like the spy, too obvious and the spy learns the location. Run a 5-minute timer.`],
  win:`Any player can call a vote to accuse someone. Catch the spy → group wins. Accuse an innocent, or the spy correctly guesses the location → spy wins.`,
  note:`Needs everyone awake and a passenger to set up — teach it at a stop, not cold.`,
  banks:[
    {label:`Probe questions`, items:[`"Would you bring a kid here?"`,`"How are you dressed right now?"`,`"Roughly how much money do you have on you?"`,`"Is it loud or quiet where you are?"`,`"Have you been here before?"`,`"Are you here for work or for fun?"`,`"What's the smell like?"`,`"Could you fall asleep here?"`,`"Are there a lot of people around?"`,`"What time of day is it, would you say?"`,`"Is there anyone here you'd want to avoid?"`,`"How did you get here?"`]},
    {label:`Locations`, items:[`airport`,`gym`,`hospital`,`prison`,`wedding`,`casino`,`music festival`,`university`,`football stadium`,`car repair shop`,`nightclub`,`supermarket`,`military base`,`sauna`,`office party`,`ski resort`]}
  ] },

{ id:'20-questions-hard', name:`20 Questions: Hard Mode`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`2+`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Deduction`},
  how:[`One person thinks of a person, place, object, brand, movie, game, event, or food. Others get 20 yes/no questions, plus one of the hard-mode rules below.`],
  win:`Guess it within the limit → guessers win; run out → the thinker wins.`,
  banks:[{label:`Hard modes`, items:[`no "is it alive?" as the first question`,`only 15 questions`,`a wrong guess costs 2 questions`,`you must ask one weird question before guessing`]}] },

{ id:'liar-round', name:`Liar Round`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Bluffing`},
  how:[`Pick a category. Everyone tells a short story from their life, but one person (decided secretly beforehand) is lying. Question each other.`],
  win:`Everyone votes on the liar.`,
  banks:[{label:`Categories`, items:[`worst purchase`,`weirdest night out`,`travel story`,`embarrassing school story`,`workplace story`,`childhood story`,`"I almost got in trouble"`,`strange food experience`,`worst date`,`a time you got lost`,`a celebrity encounter`,`a near-miss / lucky escape`,`the worst job you've had`,`a time you broke something`,`a sports or fitness story`,`a story about a pet or animal`,`a time technology completely failed you`,`an awkward neighbour story`,`a time you got caught lying`,`the most you've ever spent in one day`]}] },

{ id:'mafia-lite', name:`Mafia-Lite`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`4+ (better with 5+)`, where:`In car`, driver:`Plays (a passenger or app moderates)`, energy:`Medium`, setup:`Phone (app or role messages)`, type:`Deduction`},
  how:[`Classic Mafia wants ~6+ players plus a moderator, so at 4 it's thin — one elimination and the mafia is obvious. Two fixes: use a Mafia/Werewolf phone app as the moderator so all four play, or save it for when you're more than four.`,`Setup at 4: 1 mafia, 1 detective, 2 civilians. Each night the mafia silently picks someone and the detective checks one person; each day everyone argues and votes someone out.`],
  win:`Mafia wins if last standing; town wins if it votes out the mafia.`,
  note:`For hidden-role fun at exactly four, The Faker and Spyfall are built for that count and need less setup.` },

{ id:'alibi', name:`Alibi`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Bluffing`},
  how:[`Two people are accused of the same crime and claim they were together elsewhere.`,`They get 60 seconds to quietly agree their story.`,`The other two are detectives and question each suspect separately (the other covers ears / hums), asking both the same questions.`],
  win:`Any clear contradiction between the two suspects = guilty; matching answers all the way through = innocent.`,
  banks:[
    {label:`Crimes`, items:[`ate the last snack`,`scratched the car`,`broke the aux cable`,`got us lost on purpose`,`set the alarm for the wrong time`,`left the fuel tank empty`,`ate someone else's reserved sandwich`,`hid the phone charger`,`booked the wrong hotel`,`lost the spare key`,`reversed into a bin`,`left the lights on and killed the battery`,`"borrowed" someone's hoodie and never gave it back`,`spilled coffee on the seat`,`deleted the road-trip playlist`]},
    {label:`Detective questions (ask both, compare)`, items:[`Whose idea was it to go there?`,`Who drove / who paid?`,`What was the weather doing?`,`What were you wearing?`,`What's the last thing you said to each other before you split up?`,`Who else was there?`,`What did you have to eat or drink?`,`What song was playing?`,`How long were you there, exactly?`,`What did you touch / pick up?`]}
  ] },

{ id:'secret-rule', name:`Secret Rule`, section:`Deduction & social`, tags:['deduce'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Deduction`},
  how:[`One person silently picks a secret rule. Going around, each other player says a word; the rule-keeper replies only "pass" or "fail." The rule must be checkable from the spelling of the word alone (never from what the word means), so there's never an argument — use the bank below.`],
  win:`First to correctly state the rule wins and becomes the next keeper.`,
  banks:[{label:`Rules`, items:[`the word has a double letter (ba-ll, co-ff-ee)`,`the word starts and ends with the same letter (level, area)`,`the word starts with a vowel (apple, igloo)`,`the word ends in a vowel (pizza, radio)`,`the word contains the letter A`,`the word contains the letter S`,`the word has no letter from the word "ten" (no T, E or N)`,`the word is exactly four letters long`,`the word is longer than six letters`,`the word ends in "-ing"`,`the word contains a double vowel (book, rain)`,`your word starts with the same letter the previous word ended on`,`the word starts with the same letter as the keeper's first name`]}] },

{ id:'guess-the-ranking', name:`Guess The Ranking`, section:`Deduction & social`, tags:['compete'],
  meta:{players:`3–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Guessing`},
  how:[`One person privately writes their personal top-to-bottom ranking of 5 specific things from a prompt (e.g. their 5 favourite snacks). The others discuss and lock in a single guess at that order, then reveal. (For an open free-for-all ranking with no secret answer, use Ranking Random Things.)`],
  win:`1 point for every item the group placed in the correct position (5 = perfect).`,
  banks:[{label:`Prompts (narrow each to 5 specific items)`, items:[`favourite fast food chains`,`countries you most want to visit`,`music genres`,`movie franchises`,`sports to watch`,`car brands`,`crisp/chip flavours`,`cities you've been to`,`superpowers you'd actually use`,`pizza toppings`,`ways to die of old age (dark but funny)`,`people in this car, most to least likely to survive the apocalypse`,`decades for music`,`breakfast foods`,`holiday types (beach, city, ski, etc.)`,`seasons`,`types of weather`,`chores, least to most hated`,`fictional villains`,`biscuits`]}] },

{ id:'one-word-clue-chain', name:`One Word Clue Chain`, section:`Deduction & social`, tags:['cold'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Word`},
  how:[`One Guesser looks out the window and stays quiet.`,`The rest agree on a secret word (say it quietly or show it on a phone).`,`Going around, each clue-giver says one single word linked to it. No repeating a clue, no part of the target word, no rhyming, no gestures.`,`After each full lap the Guesser gets one guess.`],
  win:`Guesser names the word within 3 laps → the car wins; otherwise the word stumped them. (If two clue-givers give near-identical clues, the Guesser locks on too fast — come at it from different angles.)`,
  example:`Secret word "pirate" → "ship," "treasure," "eyepatch," "parrot," "ocean."`,
  banks:[{label:`Words`, items:[`pirate`,`dentist`,`volcano`,`wedding`,`penguin`,`library`,`thunder`,`cowboy`,`vampire`,`airport`,`snowman`,`detective`,`pancake`,`robot`,`lighthouse`,`dragon`,`beekeeper`,`astronaut`]}] },

/* ─────────── Card games ─────────── */
{ id:'rummy', name:`Rummy`, section:`Card games`, tags:['stops'],
  meta:{players:`2–4`, where:`In car if smooth, better at a stop`, driver:`Excluded`, energy:`Low`, setup:`Deck of cards`, type:`Card · 15–30 min`},
  how:[`Deal 7 cards each. Put the rest as a draw pile and turn one card face up as the discard pile. On your turn, draw the top of the draw pile or the top discard, then discard one card. Build melds in your hand: sets (three 8s) or runs (4-5-6 of hearts), kept hidden until going out. A player goes out when all cards are in valid melds except one final discard.`],
  win:`Everyone else scores penalty points from cards left in hand; lowest total after a few rounds wins.`,
  note:`Calm and strategic; needs a small draw/discard pile on a lap or console. Skip if people want fast laughs.` },

{ id:'crazy-eights', name:`Crazy Eights`, section:`Card games`, tags:['cold','stops'],
  meta:{players:`2–4`, where:`In car`, driver:`Excluded`, energy:`Low`, setup:`Deck of cards`, type:`Card · 5–15 min`},
  how:[`Deal 5 cards each. Flip one card to start the discard pile. On your turn, play a card matching the top discard by suit or rank. Any 8 is wild — when you play it, name the next suit. If you can't play, draw one, then play it if possible or pass.`],
  win:`First player with no cards wins. Optional scoring: losers count card values left in hand (8s worth 50).`,
  note:`The best moving-car card game — almost everything stays in hand and the shared piles are small.` },

{ id:'hearts', name:`Hearts`, section:`Card games`, tags:['stops'],
  meta:{players:`4`, where:`Best at a stop`, driver:`Excluded`, energy:`Medium`, setup:`Deck of cards (people who know it)`, type:`Card · 25–45 min`},
  how:[`Deal all cards to 4 players. Each hand, pass 3 cards (rotate left, right, across, then no pass). The player with 2 of clubs leads. Follow the led suit if you can; otherwise play anything. Highest card of the led suit wins the trick and leads next. Hearts can't be led until "broken" by being discarded on another suit. Each heart = 1 penalty point, queen of spades = 13. Take all hearts and the queen ("shoot the moon") and everyone else gets 26.`],
  win:`Lowest score wins.`,
  note:`Keep tricks as small face-down stacks. Only for players who already know trick-taking.` },

{ id:'spades', name:`Spades`, section:`Card games`, tags:['stops'],
  meta:{players:`4 (2v2 teams)`, where:`Best at a stop`, driver:`Excluded`, energy:`Medium`, setup:`Deck of cards (people who know it)`, type:`Card · 30–45 min`},
  how:[`Two teams of 2, partners alternating. Deal all cards. Each player bids how many tricks they'll win; team bids combine. Follow suit if possible; otherwise play anything including a spade. Highest card of the led suit wins unless a spade is played, then highest spade wins. Spades can't be led until broken (unless you only have spades).`],
  win:`Make your team bid → 10 points per bid trick + 1 per extra; miss → lose 10 per bid trick. First to an agreed score wins.`,
  note:`Rules-heavy — too much to teach casually in a moving car.` },

/* ─────────── Phone-friendly ─────────── */
{ id:'photo-challenge', name:`Photo Challenge`, section:`Phone-friendly`, tags:['stops'],
  meta:{players:`All`, where:`In car`, driver:`Excluded (passengers shoot)`, energy:`Low`, setup:`Phone (camera)`, type:`Photo`},
  how:[`Passengers grab candid shots out the window on the prompt. (For posed/setup photos, see Photo Stop Challenge.)`],
  win:`Vote on the best later.`,
  banks:[{label:`Prompts`, items:[`worst sign`,`best car`,`weirdest building`,`most cinematic view`,`saddest gas station`,`most cursed object`,`best candid moment in the car`,`funniest bumper sticker or number plate`,`bleakest stretch of road`,`most aggressive roadworks`,`a cloud that looks like something`,`best animal spotted`,`ugliest building`,`most middle-of-nowhere house`,`a sign with a typo or a weird name`,`the most "nothing" photo possible`]}] },

{ id:'mini-research-battle', name:`Mini Research Battle`, section:`Phone-friendly`, tags:['compete'],
  meta:{players:`4 (2 debate, 2 judge)`, where:`In car`, driver:`Plays (as a judge)`, energy:`Medium`, setup:`Phone (research)`, type:`Debate`},
  how:[`Two players get 3 minutes to research opposite sides of a stupid debate (real facts allowed), then argue 90 seconds each. (This is the with-phones, pick-your-own-side version of Devil's Advocate Tribunal, which assigns sides and bans prep.)`],
  win:`The other two judge on who argued better, not who they agree with.`,
  banks:[{label:`Topics`, items:[`best gas station chain`,`most overrated city in Europe`,`worst car design ever made`,`most suspicious snack on a shelf`,`best country for a road trip`,`the most pointless invention that caught on`,`best decade for music`,`the most overrated tourist attraction`,`which animal would win, a fully grown one vs. 100 small ones`,`the best fast-food breakfast`,`is a hot dog a sandwich`,`the worst common phone habit`,`best superpower for everyday life (not fighting)`,`the most overrated "healthy" food`]}] },

/* ─────────── Chill conversation ─────────── */
{ id:'life-drafts', name:`Life Drafts`, section:`Chill conversation`, tags:['chill'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Conversation`},
  how:[`Go category by category. Each round, name the category and everyone locks in one pick, then reveal. After all rounds, everyone makes a 20-second case for the life they built.`],
  win:`The car votes for the best life (not their own).`,
  banks:[{label:`Categories (one pick each)`, items:[`one city to live in`,`one job`,`one car`,`one hobby`,`one food to eat forever`,`one celebrity friend`,`one useless luxury`,`one pet`,`one country to holiday in every year`,`one skill you instantly master`,`one app you're allowed to keep`,`one drink forever`,`one fictional world to visit`,`one person to have dinner with`,`one era to live in`,`one house (anywhere, any kind)`,`one band/artist for the rest of your life`,`one sport you become a pro at`,`one room of your dream home`,`one thing that's always free for you`]}] },

{ id:'desert-island-picks', name:`Desert Island Picks`, section:`Chill conversation`, tags:['chill'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Conversation`},
  how:[`Each person names their 3 picks for the category, then the car argues about whose set is best.`],
  win:`No scoring — it's an argument starter.`,
  banks:[{label:`Categories (pick 3 each)`, items:[`albums`,`movies`,`foods`,`video games`,`drinks`,`tools to survive`,`people to be stuck with`,`TV shows`,`snacks`,`apps`,`books or audiobooks`,`comfort films you've seen a hundred times`,`things to bring to a desert island`,`songs you'd never get sick of`,`board games`,`people from history`,`fictional characters as teammates`,`condiments`,`smells`,`things you'd save from a fire`]}] },

{ id:'ranking-random-things', name:`Ranking Random Things`, section:`Chill conversation`, tags:['cold','chill'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Conversation`},
  how:[`As a group, argue your way to one agreed order, best to worst. (No secret answer — this is the open-debate ranking game.)`],
  win:`No scoring — the debate is the point.`,
  banks:[{label:`Things to rank`, items:[`breakfast foods`,`fast food chains`,`pizza toppings`,`movie genres`,`seasons`,`public holidays`,`sports to watch`,`sports to play`,`car colours`,`phone apps`,`countries for a holiday`,`hangover foods`,`types of crisps`,`ways to spend a day off`,`decades for music`,`chocolate bars`,`forms of transport`,`biscuits`,`weather types`,`fast-food side dishes`]}] },

/* ─────────── Stop activities ─────────── */
{ id:'weird-item-hunt', name:`Local Weird Item Hunt`, section:`Stop activities`, tags:['stops'],
  meta:{players:`All`, where:`At a stop`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Stop`},
  how:[`At a stop, everyone finds the weirdest item on the shelves (no need to buy it) and presents it.`],
  win:`Vote in the categories below.`,
  banks:[{label:`Vote categories`, items:[`weirdest`,`most useless`,`most tempting`,`most suspicious`,`best gift`]}] },

{ id:'one-coin-challenge', name:`One-Euro / One-Dollar Challenge`, section:`Stop activities`, tags:['stops'],
  meta:{players:`All`, where:`At a stop`, driver:`Plays`, energy:`Medium`, setup:`One coin each`, type:`Stop`},
  how:[`Everyone gets a tiny fixed budget and buys the best possible item for it.`],
  win:`Vote in the categories below.`,
  note:`Costs a little money — skip if anyone would rather not spend.`,
  banks:[{label:`Categories`, items:[`best taste`,`funniest`,`most useful`,`worst but funny`]}] },

{ id:'photo-stop-challenge', name:`Photo Stop Challenge`, section:`Stop activities`, tags:['stops'],
  meta:{players:`All`, where:`At a stop`, driver:`Plays`, energy:`Low`, setup:`Phone (camera)`, type:`Photo`},
  how:[`At one stop, everyone has 3 minutes to set up and take one posed photo on the theme.`],
  win:`Vote in the car.`,
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
  meta:{players:`3–4 (4 with an app)`, where:`In car`, driver:`Sets up then plays (or app deals)`, energy:`Medium`, setup:`Phone (app or role messages)`, type:`Bluffing`},
  how:[`A host (or a Chameleon/Spyfall phone app) deals a category and a secret word to everyone except one player, who is told they are the Faker. Everyone knows the category; only the Faker doesn't know the word.`,`Each player says one word that relates to the secret word. Randomise who starts each lap so the Faker can't always go last and copy the vibe. The Faker bluffs a plausible word using only the category.`,`After one or two laps, everyone votes; the accused is revealed first.`],
  win:`Catch the Faker → group wins, and only then does the Faker get a shot to steal it by naming the word. Accuse the wrong person → the Faker wins.`,
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
  how:[`One clue-giver imagines a spectrum between two extremes and secretly picks a target number 1–10 on it.`,`They name one thing they think sits at that number (on "useless ←→ essential" they might say "a phone charger").`,`Everyone else agrees on a single guess for where on the 1–10 scale it sits, then reveal.`],
  win:`Score by closeness — exact = 3, within 1 = 2, within 2 = 1. Rotate the clue-giver.`,
  banks:[{label:`Spectrums`, items:[`useless ↔ essential`,`boring ↔ exciting`,`overrated ↔ underrated`,`cheap ↔ luxury`,`normal ↔ cursed`,`safe ↔ reckless`,`child food ↔ adult food`,`comfortable ↔ painful`,`healthy ↔ unhealthy`,`embarrassing ↔ impressive`,`weak ↔ powerful`,`ugly ↔ beautiful`,`calm ↔ stressful`,`trashy ↔ classy`,`forgettable ↔ iconic`,`harmless ↔ dangerous`,`cheap date ↔ expensive date`,`beginner ↔ expert`,`quiet ↔ annoying`,`basic ↔ elite`]}] },

{ id:'sixty-seconds', name:`Sixty Seconds`, section:`Party & bluffing`, tags:['laughs','compete'],
  meta:{players:`2+`, where:`In car`, driver:`Plays`, energy:`High`, setup:`None (timer)`, type:`Performance`},
  how:[`One person talks about a topic for 60 seconds without three faults — long hesitation, repeating a key word, or drifting off-topic. Anyone can "buzz" on a suspected fault; if the group agrees, the buzzer steals the topic and finishes the time.`],
  win:`Whoever is talking when the 60 seconds ends scores 1; a correct buzz also scores 1.`,
  banks:[{label:`Topics`, items:[`gas stations`,`your morning routine`,`why this car is the best car`,`traffic`,`breakfast`,`the concept of Tuesdays`,`parking`,`socks`,`the motorway you're on`,`queues`,`the perfect sandwich`,`why dogs are better than cats`,`airports`,`your worst habit`,`the weather`,`why we should've left earlier`,`shoes`,`the snack situation in this car`,`mondays`,`the last film you watched`,`your phone's battery life`,`roundabouts`]}] },

{ id:'devils-advocate', name:`Devil's Advocate Tribunal`, section:`Party & bluffing`, tags:['compete'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Debate`},
  how:[`The assigned-side version of Mini Research Battle — you're often forced to argue the side you disagree with, with no prep. Pick a topic and two positions; randomly assign two players to the sides (phone coin-flip). Each side argues 90 seconds.`],
  win:`The two non-debaters are the jury and vote on who argued better, not which side they agree with.`,
  banks:[{label:`Topics`, items:[`cereal is a soup`,`the aisle seat is better than the window`,`pineapple belongs on pizza`,`mornings are better than nights`,`cash is better than card`,`summer is overrated`,`this trip should have been a train`,`tea is better than coffee`,`dogs are overrated`,`the book is never better than the film`,`sandwiches should be cut into squares not triangles`,`winter holidays beat summer holidays`,`texting is better than calling`,`the city beats the countryside`,`takeaway beats home cooking`,`electric cars are a mistake`,`social media made life better`,`breakfast is the worst meal`,`board games are better than video games`,`flying is better than driving`]}] },

{ id:'hidden-agenda', name:`Hidden Agenda`, section:`Party & bluffing`, tags:['deduce','chill'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`Phone (assign words)`, type:`Bluffing`},
  how:[`Each player is secretly given a random word (one person reads them out privately, or texts them).`,`Set a 5-minute timer and a starting topic ("the worst holiday you've had," "your dream car"). Just talk.`,`Your goal: get your word into the conversation so smoothly nobody clocks it.`,`The moment anyone thinks someone forced their word, they call "FORCED!" and name it. Right → the slipper is busted; wrong → the accuser is "exposed." Once you've safely landed your own word you may make only one more FORCED call.`],
  win:`Score 1 if you landed your word and were never busted; score 1 for every other person's word you correctly call.`,
  banks:[{label:`Words`, items:[`banana`,`Belgium`,`moisturiser`,`lawsuit`,`hamster`,`trampoline`,`accountant`,`pineapple`,`helicopter`,`dentist`,`avalanche`,`spreadsheet`,`walrus`,`karaoke`,`mortgage`,`cucumber`,`volcano`,`referee`,`eyebrow`,`parsley`]}] },

/* ─────────── Fast competitive ─────────── */
{ id:'mind-meld', name:`Mind Meld`, section:`Fast competitive`, tags:['compete'],
  meta:{players:`2 at a time`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Word`},
  how:[`The pair counts "1, 2, 3" and each blurts one word — no planning.`,`They almost never match. Next round, both simultaneously say a word that bridges the two previous words (if it was "fire" and "ocean," both might aim for "steam"). You can't re-use any word already said this round.`,`Keep going, reading each other and converging.`],
  win:`The pair matches a word → win; no match within 6 rounds → fail, next pair up. Score = rounds taken (fewer is better).` },

{ id:'contact', name:`Contact`, section:`Fast competitive`, tags:['deduce'],
  meta:{players:`4`, where:`In car (best taught at a stop)`, driver:`Excluded (listens only); passengers run it`, energy:`Medium`, setup:`None (timer)`, type:`Deduction`},
  how:[`The Keeper silently picks a secret word and says only its first letter (e.g. "B").`,`Guessers think of words starting with that letter. A guesser gives a clue to their candidate without naming it: "it's a yellow fruit."`,`If another guesser thinks they know it, they say "Contact!" Both count "3, 2, 1" and say their word at once.`,`If they match and it's not the Keeper's word, the Keeper must reveal the next letter ("BA"). The Keeper can defend: if the Keeper says the clued word before the count finishes, the clue is killed.`],
  win:`Guessers win by saying the full word or forcing every letter out; the Keeper wins by running out a 4-minute timer.`,
  example:`Keeper says "B." Guesser 1 clues "it's a yellow fruit" (thinking banana). Guesser 2 shouts "Contact!", they count 3-2-1 and both say "banana." It matches and isn't the Keeper's word, so the Keeper reveals "BL." (Had the Keeper said "banana?" before the count ended, the clue would've died.) Now everyone re-clues for a word starting "BL."` },

{ id:'dont-say-it', name:`Don't Say It`, section:`Fast competitive`, tags:['cold','stakes'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`High`, setup:`None (timer)`, type:`Challenge`},
  how:[`One person sits in the hot seat. The group picks 2–3 forbidden words — always "yes" and "no," plus one wildcard ("I," a colour, "car"). For 60 seconds the group rapid-fires questions; the hot-seat player must answer every one, fast.`],
  win:`Say a forbidden word, or dodge so hard you stop answering, and you're caught — note how long you lasted. Everyone takes a turn; longest survivor wins.` },

{ id:'pass-the-take', name:`Pass The Take`, section:`Fast competitive`, tags:['laughs'],
  meta:{players:`4`, where:`In car`, driver:`Plays`, energy:`High`, setup:`None`, type:`Performance`},
  how:[`Someone names a topic and one person starts a strong opinion. Anyone can shout "switch!" and the next person must continue the exact same argument mid-sentence, same stance and momentum, as one continuous escalating rant.`],
  win:`Stall, contradict the stance, repeat a point, or break the sentence → you're out. Last one ranting wins.`,
  banks:[{label:`Topics`, items:[`why mornings are a scam`,`the correct way to load a dishwasher`,`why this is the best gas station snack`,`airports`,`why we should have left earlier`,`the problem with modern shoes`,`why this playlist is genius`,`the case against socks`,`why the back seat is the best seat`,`the truth about breakfast`,`why roundabouts are superior`,`the problem with other drivers`,`why we deserve a longer break`,`the dark side of group chats`,`why this is the last road trip we plan like this`]}] },

/* ─────────── Classic word & memory ─────────── */
{ id:'ghost', name:`Ghost`, section:`Classic word & memory`, tags:['compete'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Word`},
  how:[`Each player adds one letter to a growing fragment. Every letter must head toward a real word of 4+ letters.`,`You do not want to be the one who completes a real word — add letters that keep a word possible but push the completing letter onto the next person.`,`Instead of adding a letter you can challenge the previous player to name a real word starting with the fragment. If they can, you lose the round; if they can't, they do.`],
  win:`Completing a word, or losing a challenge, earns you a letter — G, then H, O, S, T. Spell GHOST and you're out; last player standing wins.`,
  example:`C → CL → CLO → CLOU (nearly forced to CLOUD/CLOUT) → next player must add D or T and completes the word.`,
  note:`Harder version — Superghost: add a letter to either end of the fragment (ERA → bERA or ERAd).` },

{ id:'fizz-buzz', name:`Fizz Buzz`, section:`Classic word & memory`, tags:['cold'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Reflex`},
  how:[`Count up out loud around the car. Any number divisible by 3 → "Fizz." Divisible by 5 → "Buzz." Divisible by both (15, 30, 45…) → "Fizz Buzz." The count goes: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, Fizz Buzz, 16…`],
  win:`Say the wrong thing or break the rhythm and you're out. Last player in wins; restart from 1.`,
  banks:[{label:`Harder variants (pick one)`, items:[`add a third rule: divisible by 7 → "Bang"`,`any number that just contains a 3 (13, 23, 30–39) also becomes "Fizz," not only multiples`,`reverse the direction of play on every "Buzz"`,`put everyone on a half-second answer clock`]}] },

{ id:'picnic', name:`I'm Going on a Picnic`, section:`Classic word & memory`, tags:['cold'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Memory`},
  how:[`First player: "I'm going on a picnic and I'm bringing apples." Each next player repeats the whole list in order and adds one new item.`],
  win:`Miss an item, get the order wrong, or stall → you're out. Last player standing wins.`,
  banks:[{label:`Frames & harder version`, items:[`"In my suitcase I packed…"`,`"At the festival I saw…"`,`"On the road we passed…"`,`Harder: items must be added in alphabetical order (apples, bread, cheese, dates…)`]}] },

/* ─────────── Challenges & punishments ─────────── */
{ id:'punishment-bank', name:`Punishment Bank`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`1 (drawn by whoever failed)`, where:`In car / at a stop`, driver:`Draws 1–5 only`, energy:`Medium`, setup:`Dice app (1–8)`, type:`Punishment`},
  how:[`When someone fails a challenge they roll a dice app set to 8 sides (or the catcher picks). Every punishment is demanding to keep up or something to do — never a one-off sentence. No punishment costs money, and none is about ranking or roasting each other.`,`Driver only ever draws 1–5 (talk-only). 6–7 are passenger-only. 8 is stop-only.`,`Keep a failure tally on the Trip Scoreboard; most failures by arrival does the Finale — the group picks one Walk of Shame look (#8) to wear for the first hour at the destination, or the loser does the Narrator (#5) on the group for the first 15 minutes after parking.`],
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
  how:[`One person is in the chair; the others read questions off the list, fast. You must answer out loud within 3 seconds, and may not say "I don't know," "pass," "maybe," or change the subject. The answer needn't be good — just instant.`],
  win:`Stall past a 3-count, dodge, or non-answer → punishment, next person takes the chair.`,
  banks:[{label:`Questions`, items:[`What's a food you pretend to like?`,`If you had to delete one app forever, which?`,`What's the worst movie you secretly enjoy?`,`Weirdest thing you've ever eaten?`,`What's the last thing you searched on your phone?`,`What animal would you fight for 1000 euros?`,`Worst haircut you've ever had?`,`What's your most useless talent?`,`What's a word you can never spell right?`,`Worst gift you've ever received?`,`What's massively overrated?`,`What's your comfort meal at 2am?`,`What chore do you hate the most?`,`What trend do you completely not get?`,`Pineapple on pizza — defend your answer?`,`Cats or dogs, and why is the other one worse?`,`Dumbest way you've ever injured yourself?`,`What skill do you wish you had?`,`Window or aisle, no hesitating?`,`What's the worst advice you've ever followed?`,`A famous person you find weirdly annoying?`,`What would you do with a completely free Saturday?`,`What's something you're irrationally scared of?`,`Best thing you've ever eaten at a gas station?`,`What's a hill you'd genuinely die on?`]}] },

{ id:'questions-only', name:`Questions Only`, section:`Challenges & punishments`, tags:['laughs'],
  meta:{players:`2 at a time`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`Two players act out a quick scene, speaking only in questions, back and forth.`],
  win:`Say a statement, hesitate over 3 seconds, repeat a question, or throw a non-question ("uh, what?") → out. Loser draws a punishment; winner faces a new challenger.`,
  banks:[
    {label:`Opening lines`, items:[`"Do you come here often?"`,`"Is that really what you're wearing?"`,`"Have you seen my keys?"`,`"Why are you in my house?"`,`"Are you going to finish that?"`,`"Did you just take my parking spot?"`]},
    {label:`Scenarios`, items:[`two strangers at a bus stop`,`a terrible job interview`,`a couple lost and arguing about directions`,`two spies who half-recognise each other`,`a customer and the world's worst waiter`,`two people who both think the other called the meeting`]}
  ] },

{ id:'forbidden-letter', name:`The Forbidden Letter`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`1–2`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None (timer)`, type:`Challenge`},
  how:[`You're assigned a common letter. For 5 minutes (set a timer) you may not say any word containing it, while everyone else asks you questions to trip you up. Best as a duel — two people under the same letter, last to slip wins.`],
  win:`Say a word containing the letter and get caught → punishment.`,
  banks:[{label:`Letters by difficulty`, items:[`Warm-up: B, F, K, P, G, V`,`Real challenge: D, H, M, W, L, C`,`Nightmare: S, T, R, N`,`Don't ban a vowel — that makes speech impossible. Hardest fair version: ban S for a 90-second burst.`]}] },

{ id:'rhyme-chain', name:`The Rhyme Chain`, section:`Challenges & punishments`, tags:['cold','compete','stakes'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`Someone calls a starting word; going around, each person says a new word that rhymes, within a 3-second count.`],
  win:`Can't produce one in time, repeat a word, or try a fake rhyme (group vetoes) → out for the round. Last standing wins; whoever went out first draws a punishment.`,
  banks:[{label:`Starter words`, items:[`cat`,`light`,`day`,`four`,`blue`,`sound`,`name`,`cold`,`train`,`line`,`top`,`bear`,`cake`,`hill`,`ring`,`sing`,`gold`,`mad`,`school`,`tall`]}] },

{ id:'keep-straight-face', name:`Keep a Straight Face`, section:`Challenges & punishments`, tags:['laughs','stakes'],
  meta:{players:`2+ (one target)`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None (timer)`, type:`Challenge`},
  how:[`One person holds a straight face for 60 seconds while a challenger reads the lines below in the most deadpan voice possible.`],
  win:`The target laughs, smiles, or cracks a grin (car judges) → punishment.`,
  banks:[{label:`Deadpan lines`, items:[`"I have never once trusted a man who folds his pizza."`,`"My greatest enemy in this world is the second sock."`,`"I would like to formally apologise to every escalator I have ever stood still on."`,`"Sometimes I clap when the plane lands. Alone. In my apartment."`,`"I believe geese know exactly what they did."`,`"My five-year plan begins with buying a slightly bigger spoon."`,`"Every cloud is just a sky burrito waiting to happen."`,`"I once lost a staring contest to a fish and I think about it daily."`,`"I don't believe in Tuesdays and I never have."`,`"A pigeon looked me in the eye last week and I haven't felt safe since."`,`"I keep my cereal in the fridge and my milk in my heart."`,`"I have a complicated relationship with revolving doors."`,`"I would trust a horse to do my taxes before I'd trust most men."`,`"Sometimes I whisper 'good luck' to my food before I eat it."`,`"I have never finished a tube of lip balm and I never will."`,`"My greatest fear is being asked to guess someone's age."`]}] },

{ id:'order-roulette', name:`Order Roulette`, section:`Challenges & punishments`, tags:['stops','stakes'],
  meta:{players:`1 (rest witness)`, where:`At a stop`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`At a food or coffee stop, draw an order style and keep it up for the whole order, with the group within earshot.`],
  win:`Drop the style, laugh out of it, or order normally → punishment.`,
  banks:[{label:`Order styles`, items:[`Order entirely in a whisper.`,`Call the cashier "captain" at least twice.`,`Order your drink by describing it, never its name — "the dark hot bean water," "the cold yellow fizzy one."`,`Add "…if you'd be so kind" to the end of every request.`,`Order like it's the most important decision of your life, then change your mind twice.`,`Order for an imaginary table of ten, then finish with "actually, just the one."`,`Refer to every item as "the usual."`,`Speak only in a hushed, dramatic movie-trailer voice.`,`Be aggressively, suspiciously over-polite about everything.`,`Pretend you're a regular and act mildly hurt they don't recognise you.`,`Ask one genuine but very specific question about every item before ordering.`,`Treat the cashier like a long-lost friend you're thrilled to see.`]}] },

{ id:'no-complaint-stretch', name:`No-Complaint Stretch`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`All`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Challenge`},
  how:[`Pick one leg between stops; nobody may complain. A complaint = any negative remark about the trip, comfort, music, food, timing, traffic, other drivers, weather, or saying you're tired/hungry/bored/need the toilet. Neutral questions are fine; whining is not.`],
  win:`First person to complain (group judges) → punishment.` },

{ id:'banned-word', name:`The Banned Word`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`All`, where:`In car`, driver:`Plays`, energy:`Low`, setup:`None`, type:`Challenge`},
  how:[`The group picks one extremely common word that's hard to avoid for the whole leg; anyone who says it gets caught.`],
  win:`Say the banned word and get caught → punishment, or run it as a tally where the most slips by the next stop draws.`,
  banks:[{label:`Banned-word options`, items:[`like`,`literally`,`actually`,`honestly`,`basically`,`bro`,`dude`,`just`,`so`,`I think`,`kind of`,`you know`,`no cap`,`everyone's first names`]}] },

{ id:'tongue-twister', name:`Tongue Twister Gauntlet`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`1 at a time`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`You're assigned a tongue twister and must say it three times fast in a row.`],
  win:`Stumble, mangle a word, or grind to a crawl (car judges) → punishment.`,
  banks:[{label:`Twisters`, items:[`red lorry, yellow lorry`,`unique New York`,`Irish wristwatch`,`toy boat (say it five times)`,`truly rural`,`pad kid poured curd pulled cod`,`she sells seashells by the seashore`,`Peter Piper picked a peck of pickled peppers`,`a proper copper coffee pot`,`thin sticks, thick bricks`,`which witch wished which wicked wish`,`six slippery snails slid slowly seaward`,`crisp crusts crackle crunchily`,`eleven benevolent elephants`,`how much wood would a woodchuck chuck if a woodchuck could chuck wood`,`Greek grapes`]}] },

{ id:'ministers-cat', name:`The Minister's Cat`, section:`Challenges & punishments`, tags:['cold'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`Going around the car, describe "the minister's cat" with an adjective, all on the same letter, starting at A ("an angry cat," "an awesome cat"). Once everyone's gone, move to B, then C, through the alphabet.`],
  win:`Can't produce an adjective within a 3-count, or repeat one already used → out (or draw a punishment). Last player standing wins.`,
  note:`Harder version: cumulative — repeat every adjective said so far, in order, then add the next letter's.` },

{ id:'counting-game-21', name:`The Counting Game (21)`, section:`Challenges & punishments`, tags:['stakes'],
  meta:{players:`2–4`, where:`In car`, driver:`Plays`, energy:`Medium`, setup:`None`, type:`Challenge`},
  how:[`Count upward around the car. On your turn say one, two, or three numbers in a row.`],
  win:`Whoever is forced to say 21 is out and draws a punishment; restart from 1.`,
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
