// The feed. Order is story order. Every post is open at any time; dates are just timestamps.
// seq steps: 'r01_1' = voice clip · {s:'whinny'} = sound effect · {w:600} = wait ms · {f:1} = cut to frame 1

export const ACCOUNTS = {
  edward: { name: 'King Edward', handle: 'KingEdward', bio: 'King of England. Builder of abbeys. Promiser of thrones. 🙏', followers: '2.1M' },
  harold: { name: 'Harold Godwinson', handle: 'HaroldGodwinson', bio: 'Earl of Wessex · Hawk dad · Would like a sit down', followers: '3.4M' },
  william: { name: 'William', handle: 'WilliamTheBastard', handle2: 'WilliamTheConqueror', bio: 'Duke of Normandy. Founder. Visionary. England is a mindset. 🦁', followers: '5.9M' },
  odo: { name: 'Bishop Odo', handle: 'BishopOdo', bio: 'Bishop of Bayeux · Content creator · Currently making a 70m tapestry about my brother (mostly me)', followers: '880K' },
  comet: { name: "Halley's Comet", handle: 'HalleysComet', bio: 'Just passing. Next post: 1145.', followers: '76M' },
  guy: { name: 'Guy of Ponthieu', handle: 'GuyOfPonthieu', bio: 'Hospitality. Rates on request.', followers: '12K' },
  cook: { name: 'Norman Kitchen', handle: 'NormanKitchen', bio: 'Invasion catering 🔥 Skewers, stews and blessings (Bish insists)', followers: '440K' },
  horse: { name: 'horse_47', handle: 'horse_47', bio: 'Horse. Not a boat person.', followers: '1.2M' },
  turold: { name: 'Turold', handle: 'Turold', bio: "I'm in it 😁", followers: '9' },
  aelfgyva: { name: 'Ælfgyva', handle: 'aelfgyva', bio: '…', followers: '900K' },
  border: { name: 'the border', handle: 'the.border', bio: 'we live at the bottom. we see everything.', followers: '66K' },
  news: { name: '1066 News', handle: '1066NEWS', bio: 'Breaking news since 1066. Possibly earlier.', followers: '4.4M' },
  hawk: { name: "Harold's hawk", handle: 'harolds.hawk', bio: '👁', followers: '310K' },
  nautical: { name: 'Norman Nautical', handle: 'NormanNautical', bio: 'Boats for every invasion.', followers: '18K' },
  conan: { name: 'Conan of Brittany', handle: 'ConanOfBrittany', bio: 'Duke of Brittany. Not a fan of sieges. Owns a rope.', followers: '96K' },
  farmer: { name: 'Just A Farmer', handle: 'JustAFarmer', bio: 'Ploughing. Harrowing. Not getting involved. 🌾', followers: '3.2M' },
  archer: { name: 'The Only English Archer', handle: 'TheOnlyEnglishArcher', bio: 'English archery division (all of it). One bow. Eleven arrows.', followers: '8.8M' },
  barber: { name: 'Norman Cuts', handle: 'NormanCuts', bio: 'Short at the front. Nothing at the back.', followers: '51K' },
  motte: { name: 'Motte-in-a-Box', handle: 'MotteInABox', bio: 'Conquer with confidence.', followers: '7K' },
};

export const CHAPTERS = [
  { n: 'I', title: 'The Errand', sub: 'MLXIV', start: 'p01' },
  { n: 'II', title: 'The Crown', sub: 'January MLXVI', start: 'p13' },
  { n: 'III', title: 'The Build', sub: 'Summer MLXVI', start: 'p18' },
  { n: 'IV', title: 'The Crossing', sub: 'September MLXVI', start: 'p22' },
  { n: 'V', title: 'The Battle', sub: '14 October MLXVI', start: 'p32' },
  { n: 'VI', title: 'The Lost Ending', sub: 'Christmas MLXVI', start: 'p40' },
];

export const POSTS = [
  // ---------------- I · THE ERRAND ----------------
  { id: 'p01', acc: 'edward', date: '1064', loc: 'Westminster', type: 'reel', likes: '1.2M',
    caption: 'Sending my best man on a quick trip to Normandy. Nothing to worry about. 🙏',
    seq: [{ w: 400 }, 'r01_1', { w: 250 }, 'r01_2', { w: 300 }, 'r01_3', { w: 300 }, 'r01_4', { w: 1100 }, 'r01_5'],
    comments: [['harold', 'What exactly am I delivering'], ['edward', 'A message'], ['harold', 'What message'], ['edward', '🙏'], ['border', "he doesn't know what the message is lads"]] },

  { id: 'p02', acc: 'harold', date: '1064', loc: 'Bosham', type: 'photo', likes: '640K',
    caption: 'Road trip. Brought the hawk. Obviously.', seq: [{ s: 'hawk' }],
    comments: [['hawk', '👁'], ['border', 'man brings a bird to a diplomatic mission'], ['edward', 'Is the hawk necessary Harold'], ['harold', 'The hawk is non-negotiable']] },

  { id: 'p03', acc: 'harold', date: '1064', loc: 'Bosham', type: 'carousel', likes: '980K',
    caption: 'Pre-sail dinner with the lads, then off. Swipe for the glamour. ⛵',
    comments: [['edward', 'Lovely legs Harold'], ['harold', 'Thank you your majesty'], ['edward', 'That was a blessing not a compliment'], ['harold', 'Understood'], ['border', 'slide 3 should be illegal']] },

  { id: 'p04', acc: 'news', date: '1064', loc: 'The English Channel', type: 'immersive', d3: 'storm', likes: '2.3M', amb: 'storm',
    news: { head: 'ENGLISH EARL LANDS IN WRONG COUNTRY', ticker: 'HAWK UNHARMED · WIND "UNHELPFUL" · PONTHIEU TOURISM BOARD DECLINES TO COMMENT · ' },
    caption: 'BREAKING: Earl of Wessex lands in the wrong country. More as we get it.',
    seq: [{ s: 'storm' }, { w: 500 }, 'r02_1'],
    comments: [['harold', "It wasn't the wrong country it was the wrong bit of the right coast"], ['news', 'Noted'], ['guy', 'Welcome!! 👋💰']] },

  { id: 'p05', acc: 'guy', date: '1064', loc: 'Ponthieu', type: 'reel', likes: '88K',
    caption: 'Welcome to Ponthieu! Our guests stay as long as they like. ✨\n\n(They do not like.)',
    seq: [{ w: 300 }, 'r02b_1'],
    comments: [['harold', 'This is a kidnapping'], ['guy', "It's hospitality with a fee"], ['william', 'Hey Guy. Release him. I\'ll DM you.'], ['guy', '👀💰'], ['hawk', '👁']] },

  { id: 'p06', acc: 'william', date: '1064', loc: 'Rouen', type: 'photo', likes: '3.1M',
    caption: 'Grateful to host @HaroldGodwinson in Rouen. Great energy. Great guy. Going to be a big part of my journey. 🤝',
    comments: [['harold', "I'm just here till the boat's fixed"], ['william', 'Love that for you'], ['odo', 'Blessed.'], ['border', '"big part of my journey" is a threat']] },

  { id: 'p07', acc: 'aelfgyva', date: '1064', loc: '???', type: 'reel', likes: '9.0M',
    caption: '…', seq: [{ w: 1200 }, 'r19_1'],
    pinned: 'Historians have been arguing about this post since 1729.',
    comments: [['border', '???'], ['border', 'context??'], ['border', '900 years and still no context'], ['border', 'why is the guy under her naked'], ['border', 'he lives here']] },

  { id: 'p08', acc: 'harold', date: '1064', loc: 'Mont-Saint-Michel', type: 'reel', likes: '4.8M', amb: 'wind',
    caption: 'Did a thing.',
    seq: [{ w: 300 }, 'r02c_1', { w: 300 }, { s: 'applause' }, 'r02c_2'],
    comments: [['william', 'Leadership is about lifting others up 💯'], ['harold', 'You were standing right there'], ['william', 'Delegation is also leadership'], ['horse', 'we were not going in there']] },

  { id: 'p08b', acc: 'conan', date: '1064', loc: 'Dol', type: 'reel', likes: '2.4M',
    caption: 'Leaving the party early 🪢 #frenchexit',
    seq: [{ w: 300 }, 'r20_1', { w: 200 }, { f: 1 }, { s: 'rope' }, 'r20_2', { w: 300 }, { f: 2 }, 'r20_3', { w: 700 }, 'r20_4'],
    comments: [['william', 'You left before the siege'], ['conan', 'I left DURING the siege. Important difference'], ['border', 'the rope is doing a lot of work'], ['guy', 'Should have charged him for the rope']] },

  { id: 'p09', acc: 'odo', date: '1064', loc: 'Dinan', type: 'story', likes: '210K',
    story: 'When you want to surrender but also maintain boundaries.',
    caption: 'Conan of Brittany handing over the keys. On a stick. From a distance. Respect.',
    comments: [['border', 'keys on a lance is a mood'], ['guy', 'Should have charged a fee']] },

  { id: 'p10', acc: 'william', date: '1064', loc: 'Normandy', type: 'photo', likes: '2.2M',
    caption: 'Gave Harold some gear. No strings attached.\n\n<small>strings attached</small>',
    comments: [['harold', "What's the small print"], ['william', 'Nothing bro. Wear it in good health.'], ['odo', '🙏 (strings)']] },

  { id: 'p11', acc: 'odo', date: '1064', loc: 'Bayeux', type: 'immersive', d3: 'oath', likes: '6.6M', key: true,
    caption: 'Harold just made a promise in front of God and everyone. Love to see it. 🙏 #Bayeux #MyTown',
    seq: [{ w: 300 }, 'r03_1', { w: 200 }, 'r03_2', { w: 150 }, 'r03_3', { w: 250 }, 'r03_4', { w: 200 }, 'r03_5', { w: 150 }, 'r03_6', { w: 200 }, 'r03_7', { w: 900 }, 'r03_8', { w: 1300 }, 'r03_9', { w: 300 }, 'r03_10', { w: 900 }, 'r03_11'],
    comments: [['harold', "I didn't know what was in the boxes"], ['odo', 'Saints.'], ['harold', 'You said they were for the bake sale'], ['odo', 'Saints are a bake sale for the soul'], ['border', "he's toast"]] },

  { id: 'p12', acc: 'harold', date: '1065', loc: 'Westminster', type: 'photo', likes: '1.9M',
    caption: 'Back. How was it? It was fine.',
    comments: [['edward', 'Harold what did you do'], ['harold', 'Nothing binding'], ['edward', 'Harold.'], ['border', 'he did something binding']] },

  // ---------------- II · THE CROWN ----------------
  { id: 'p13', acc: 'edward', date: '5 Jan 1066', loc: 'Westminster Abbey', type: 'photo', likes: '3.3M',
    caption: 'Finished my abbey. Feeling very at peace. Might lie down.', seq: [{ s: 'crowd' }],
    comments: [['border', 'oh no'], ['border', 'king said "might lie down" 😟'], ['turold', "I'M ON THE ROOF"], ['border', 'turold get down']] },

  { id: 'p14', acc: 'news', date: '5 Jan 1066', loc: 'Westminster', type: 'reel', likes: '8.1M',
    news: { head: 'THE KING’S LAST WORDS', ticker: 'SUCCESSION "UNCLEAR" · DUKE OF NORMANDY "LISTENING CAREFULLY" · ABBEY OPENS TO MIXED REVIEWS · ' },
    caption: 'The final words of King Edward. We have listened to them several times.',
    seq: [{ w: 300 }, 'r04_1', { w: 400 }, { s: 'click' }, { w: 300 }, 'r04_2', { w: 600 }, 'r04_3', { w: 300 }, { s: 'click' }, { w: 300 }, 'r04_4', { w: 700 }, 'r04_5'],
    comments: [['william', 'It said William'], ['news', 'It did not'], ['harold', "Can we not do this right now"], ['border', 'har']] },

  { id: 'p14b', acc: 'news', date: '6 Jan 1066', loc: 'Westminster', type: 'reel', likes: '4.4M',
    news: { head: 'CORRECTION: FUNERAL SHOWN BEFORE DEATH', ticker: 'TAPESTRY "NOT CHRONOLOGICAL" · KING "A BIT ALIVE" · BISHOP ODO: "IT’S ART" · ' },
    caption: "CORRECTION: The Tapestry shows King Edward's funeral before it shows him dying. This is genuinely the order it's stitched in.",
    seq: [{ s: 'bells' }, { w: 700 }, 'r21_1', { w: 300 }, 'r21_2', { w: 900 }, 'r21_3', { w: 700 }, 'r21_4'],
    comments: [['edward', 'I attended my own funeral and it was lovely'], ['odo', "It's called non-linear storytelling"], ['border', 'spoilers'], ['harold', 'Can everyone stop posting about this']] },

  { id: 'p15', acc: 'harold', date: '6 Jan 1066', loc: 'Westminster Abbey', type: 'photo', likes: '7.7M', crowned: true,
    caption: 'Funeral this morning, coronation this afternoon. Busy one. Grateful. 👑',
    comments: [['william', 'Interesting.'], ['william', 'Very interesting.'], ['odo', 'Remember the boxes Harold'], ['harold', "I've blocked you"], ['odo', "You can't block a bishop"]] },

  { id: 'p16', acc: 'comet', date: 'April 1066', loc: 'Everywhere', type: 'immersive', likes: '4.2B', music: 'solemn', d3: 'comet',
    caption: 'hi',
    seq: [{ s: 'shimmer' }, { w: 1200 }, 'r05_1', { w: 900 }, 'r05_2'],
    comments: [['harold', 'Is that a bad sign'], ['comet', 'Yes'], ['harold', 'Could you be more specific'], ['comet', 'See you in 1145'], ['border', 'ISTI MIRANT STELLA (they are amazed at the star)']] },

  { id: 'p17', acc: 'harold', date: 'April 1066', loc: 'Westminster', type: 'story', likes: '2.8M',
    story: 'Me finding out the comet was about me',
    caption: '🙂',
    comments: [['comet', '👋'], ['hawk', '👁']] },

  // ---------------- III · THE BUILD ----------------
  { id: 'p17b', acc: 'border', date: 'April 1066', loc: 'The bottom bit', type: 'reel', likes: '1.6M', amb: 'ghostly',
    caption: "while harold hears about the comet up there, down here someone has stitched a fleet of ghost ships. no reason. 👻⛵ (this is real, look under the comet scene)",
    seq: [{ w: 900 }, 'r22_1'],
    comments: [['harold', 'What are those'], ['border', "nothing. don't worry about it"], ['william', '👀⛵'], ['comet', 'told you']] },

  { id: 'p18', acc: 'william', date: 'Summer 1066', loc: 'Normandy', type: 'reel', likes: '5.5M', amb: 'sea',
    caption: 'My morning routine. Discipline is just love for your future self (and your future kingdom). 🧊📓👑 #grindset',
    seq: [{ w: 300 }, 'r06_1', { f: 1, at: 0.36 }, { f: 2, at: 0.66 }, { w: 500 }, 'r06_2'],
    comments: [['harold', 'Who are you talking to'], ['william', 'My audience'], ['odo', 'I point at things 👉'], ['border', 'he wrote england 40 times like a stalker']] },

  { id: 'p19', acc: 'nautical', date: 'Summer 1066', loc: 'Sponsored', type: 'reel', sponsored: true, likes: '120K', amb: 'saw',
    caption: 'Planning an invasion? We can help. ⚓ 700 ships, one summer, no questions asked.',
    seq: [{ w: 200 }, 'r07_1', { f: 1, at: 0.4 }, { f: 2, at: 0.72 }, { w: 200 }, 'r07_2'],
    comments: [['horse', 'what do you mean "may contain horses"'], ['nautical', 'Horses are standard on all models'], ['horse', 'I want to speak to a manager']] },

  { id: 'p20', acc: 'odo', date: 'Summer 1066', loc: 'Dives-sur-Mer', type: 'carousel', likes: '730K',
    caption: 'Packing list for the trip. Prioritise. 📦',
    comments: [['cook', 'WINE IS ON THE CART MATE 🍷'], ['odo', 'Blessed the wine'], ['odo', 'Twice'], ['william', 'Odo how much wine'], ['odo', 'Pastoral amounts']] },

  { id: 'p20b', acc: 'farmer', date: 'Summer 1066', loc: 'The bottom bit', type: 'reel', likes: '2.0M', amb: 'farm',
    caption: 'Lovely day for it. Heard someone over the water is building seven hundred boats? Anyway. 🌾',
    seq: [{ w: 400 }, 'r25_1', { s: 'sling' }],
    comments: [['border', "he's in the actual tapestry btw. down here with us. ploughing"], ['william', 'Sir, are you aware of current events'], ['farmer', 'No'], ['horse', 'respect']] },

  { id: 'p21', acc: 'turold', date: 'Summer 1066', loc: 'The Tapestry', type: 'reel', likes: '41',
    caption: 'Got my name in it 😁',
    seq: [{ w: 300 }, 'r18_1', { w: 400 }, 'r18_2', { w: 500 }, 'r18_3'],
    pinned: 'Historians still have no idea who Turold is.',
    comments: [['border', 'who are you'], ['turold', 'Turold'], ['border', 'but who ARE you'], ['turold', 'Turold!!'], ['horse', "he's alright actually"]] },

  // ---------------- IV · THE CROSSING ----------------
  { id: 'p21b', acc: 'barber', date: 'Summer 1066', loc: 'Sponsored', type: 'reel', sponsored: true, likes: '730K',
    caption: 'Tired of looking English? 💈 The Norman: short at the front, nothing at the back. Moustache removal included.',
    seq: [{ w: 300 }, 'r26_1', { f: 1, at: 0.7 }, { w: 300 }, 'r26_2'],
    comments: [['border', "if you paint a face on the back of your head you look like you're facing everyone at once"], ['guy', "Mate, I can't tell if you're coming or going"], ['border', 'that is the point. 360° intimidation'], ['harold', 'Absolutely not'], ['news', 'Fact check: the Tapestry really does give the Normans shaved backs of heads, and the English moustaches. You can tell the sides apart by hair.']] },

  { id: 'p22', acc: 'harold', date: '25 Sep 1066', loc: 'Stamford Bridge', type: 'tracker', likes: '6.0M', crowned: true,
    tracker: { title: 'Morning Battle', stats: [['Result', 'Won'], ['Vikings', 'No longer a problem'], ['Mood', 'Sit down pending']] },
    caption: 'Won a battle against the Norwegians this morning. Feeling good. Going to have a sit down.',
    comments: [['news', 'HAROLD WE NEED TO TALK'], ['harold', "I'm having a sit down"], ['news', 'HAROLD']] },

  { id: 'p23', acc: 'william', date: '27 Sep 1066', loc: 'The English Channel', type: 'immersive', likes: '9.9M', d3: 'crossing', amb: 'sea', music: 'crossing',
    caption: 'Tonight we sail. Tomorrow: the dream. ⛵🇬🇧 #manifesting',
    seq: [{ s: 'horn' }, { w: 1500 }, 'r08_1', { w: 1200 }, { s: 'whinny' }, { w: 600 }, 'r08_2'],
    comments: [['horse', "who's gerald"], ['horse', "oh no I'm gerald"], ['odo', 'Blessed the boats. And the wine. Again.'], ['border', 'the little guy with the horn is the hero of this post']] },

  { id: 'p24', acc: 'horse', date: '27 Sep 1066', loc: 'The English Channel', type: 'story', likes: '3.6M',
    story: 'nobody said there’d be a boat', story2: 'nobody said there’d be a BOAT',
    caption: '🤢', seq: [{ s: 'whinny' }],
    comments: [['nautical', 'It was in the small print'], ['horse', 'I CANNOT READ']] },

  { id: 'p25', acc: 'william', date: '28 Sep 1066', loc: 'Pevensey', type: 'photo', likes: '8.8M',
    caption: 'Landed. 📍Pevensey. Wheels up.',
    comments: [['harold', "I'm literally in York"], ['william', 'Not my problem king 👑'], ['harold', 'It is quite literally your problem'], ['border', 'typed "king" in lowercase. disrespectful']] },

  { id: 'p26', acc: 'horse', date: '28 Sep 1066', loc: 'Pevensey', type: 'photo', likes: '12M',
    caption: 'Yes, every one of us is, ahem, anatomically complete. The embroiderers were very thorough. We will not be taking questions.',
    comments: [['border', '👀'], ['odo', 'Comments have been limited on this post.']], limited: true },

  { id: 'p27', acc: 'cook', date: '29 Sep 1066', loc: 'Pevensey', type: 'reel', likes: '2.7M', amb: 'sizzle',
    caption: 'Invasion Barbie ep. 1 🔥🍢 Nothing says "hello England" like meat on a stick.',
    seq: [{ w: 200 }, 'r09_1', { w: 300 }, { f: 1 }, { s: 'bell' }, 'r09_2', { w: 200 }, 'r09_3', { w: 400 }, 'r09_4'],
    comments: [['odo', 'Unblessed meat is just meat'], ['cook', 'THAT IS WHAT MEAT IS BISH'], ['william', 'Where are the prawns']] },

  { id: 'p27b', acc: 'cook', date: '29 Sep 1066', loc: 'Somebody’s farm, Sussex', type: 'reel', likes: '3.9M',
    caption: 'The ORIGINAL farm to fork 🐑🍴 Locally sourced. Very locally.',
    seq: [{ s: 'baa' }, { w: 300 }, 'r27_1', { w: 400 }, 'r27_2'],
    comments: [['farmer', "THAT'S MY SHEEP"], ['cook', 'Was your sheep'], ['odo', 'Blessed the sheep 🙏'], ['border', 'the farmer from the border has entered the chat'], ['news', 'Fact check: the Tapestry really shows Normans rushing off to seize food on arrival. Caption and all.']] },

  { id: 'p28', acc: 'odo', date: '29 Sep 1066', loc: 'Hastings', type: 'immersive', d3: 'feast', likes: '5.2M',
    caption: "Grace before meals. Some say it looks like a famous painting. That painting hasn't been painted yet. I was first. 🙏",
    comments: [['william', 'Can we eat'], ['odo', "I'm not finished"], ['cook', 'THE PRAWNS ARE GOING COLD, BISH'], ['border', 'the last supper but everyone has a sword']] },

  { id: 'p29', acc: 'motte', date: '30 Sep 1066', loc: 'Sponsored', type: 'reel', sponsored: true, likes: '310K',
    caption: 'Just arrived in a hostile country? Motte-in-a-Box: pre-cut timber, one mound, some assembly required. 🏰',
    seq: [{ w: 200 }, 'r10_1', { w: 200 }, { f: 1 }, 'r10_2', { w: 200 }, { f: 0 }, { s: 'spade' }, 'r10_3'],
    comments: [['william', 'We put it up in a day. 10/10.'], ['motte', 'Thanks William!'], ['border', 'the two guys hitting each other with shovels are the real stars']] },

  { id: 'p30', acc: 'harold', date: '6 Oct 1066', loc: 'London', type: 'tracker', likes: '7.4M', crowned: true,
    tracker: { title: 'Bit of a march', stats: [['Distance', '190 mi'], ['Time', '5 days'], ['Avg pace', 'please']] },
    caption: 'Bit of a march.',
    comments: [['news', 'HAROLD YOU JUST WON A BATTLE'], ['harold', "I'm aware"], ['william', "Rest is for people who don't want it enough 💯"], ['harold', 'I will come down there']] },

  { id: 'p31', acc: 'news', date: '13 Oct 1066', loc: 'Senlac Hill', type: 'story', likes: '5.0M',
    story: 'BOTH ARMIES HAVE SEEN EACH OTHER. AWKWARD.',
    caption: 'Developing.', seq: [{ s: 'wind' }],
    comments: [['border', 'eye contact across a valley 😬']] },

  // ---------------- V · THE BATTLE ----------------
  { id: 'p32', acc: 'william', date: '14 Oct 1066 · 07:00', loc: 'Hastings', type: 'reel', likes: '11M',
    caption: 'Pre-game talk with the team. Mindset is everything. 🗣️',
    seq: [{ w: 300 }, 'r11_1', { w: 400 }, 'r11_2', { w: 600 }, 'r11_3', { s: 'cheer' }],
    comments: [['odo', '*nods*'], ['border', 'TED talk to men holding lances'], ['horse', 'can we go home']] },

  { id: 'p33', acc: 'news', date: '14 Oct 1066', loc: 'Senlac Hill', type: 'immersive', live: true, likes: '66M', d3: 'battle', music: 'battle', amb: 'battle',
    caption: '🔴 LIVE: Hastings.',
    seq: [{ s: 'horn' }, { w: 800 }, 'r12_1', { w: 600 }, 'r12_2'],
    livechat: [['border', 'first'], ['horse', "I didn't sign up for this"], ['turold', "I'M IN THE BACKGROUND"], ['odo', '🙏🙏🙏'], ['cook', 'pies at half time'], ['hawk', '👁'], ['border', 'the shield wall is so tired'], ['guy', 'anyone want to buy a hostage'], ['border', "DON'T GO AFTER THEM"], ['comet', 'told you']],
    comments: [['border', 'they went after them'], ['harold', 'Not now']] },

  { id: 'p33b', acc: 'horse', date: '14 Oct 1066', loc: 'A ditch', type: 'immersive', d3: 'tumble', likes: '19M',
    caption: 'nobody mentioned the ditch.',
    seq: [{ s: 'tumble' }, { w: 900 }, 'r23_1', { w: 300 }, 'r23_2'],
    comments: [['border', '10/10 dismount'], ['odo', 'Blessed the ditch. Retrospectively.'], ['horse', "we don't talk about the ditch"], ['news', 'For the record: the Tapestry really does show horses going head over heels here.']] },

  { id: 'p33c', acc: 'archer', date: '14 Oct 1066', loc: 'The English line (left bit)', type: 'reel', likes: '41M', score: ['NOR', 35, 1, 'ENG'],
    caption: 'Archery update 🏹',
    seq: [{ w: 300 }, 'r24_1', { w: 400 }, 'r24_2', { w: 400 }, 'r24_3', { s: 'arrows' }, { w: 900 }, 'r24_4', { w: 700 }, 'r24_5'],
    comments: [['news', 'Fact check: the Tapestry shows 34 Norman archers on foot, one on horseback, and exactly one English archer. This is real.'], ['william', 'lol'], ['odo', 'One archer. Blessed is he.'], ['border', "he's doing his best"], ['archer', 'I would still like backup']] },

  { id: 'p34', acc: 'harold', date: '14 Oct 1066', loc: 'Senlac Hill', type: 'photo', likes: '—', crowned: true, commentsOff: true, hideLikes: true,
    caption: '' },

  { id: 'p35', acc: 'odo', date: '14 Oct 1066', loc: 'Senlac Hill', type: 'reel', likes: '7.0M',
    caption: 'Pastoral care comes in many forms. #notaweapon',
    seq: [{ w: 200 }, 'r13_1', { s: 'thwack' }, { w: 200 }, 'r13_2', { s: 'thwack' }, { w: 200 }, 'r13_3', { s: 'thwack' }, { w: 300 }, 'r13_4'],
    comments: [['border', '"encouraging"'], ['odo', 'Pastoral care comes in many forms.'], ['border', 'HIC ODO EPS BACULU TENENS CONFORTAT PUEROS = "here bishop odo, holding a club, encourages the boys". this is real']] },

  { id: 'p35b', acc: 'farmer', date: '14 Oct 1066', loc: 'The bottom bit', type: 'reel', likes: '12M', amb: 'farm',
    caption: 'still farming. 🌾',
    seq: [{ s: 'battle', v: 0.35 }, { w: 1200 }, 'r25_2', { w: 1500 }, 'r25_3'],
    comments: [['border', 'the greatest battle in english history is happening RIGHT THERE'], ['farmer', 'Ground needs harrowing either way'], ['william', 'Sir'], ['farmer', 'Busy'], ['cook', 'Sheep was lovely by the way']] },

  { id: 'p36', acc: 'william', date: '14 Oct 1066', loc: 'Senlac Hill', type: 'reel', live: true, likes: '14M',
    caption: '🔴 quick update',
    seq: [{ s: 'battle' }, { w: 300 }, 'r14_1', { w: 200 }, 'r14_2', { w: 200 }, 'r14_3', { w: 600 }, 'r14_4'],
    pinnedBy: ['william', 'Rumours of my death have been greatly exaggerated'],
    comments: [['border', "that's not even your quote"], ['william', 'It will be'], ['border', 'it will not']] },

  { id: 'p37', acc: 'border', date: '14 Oct 1066', loc: 'The bottom bit', type: 'photo', likes: '410K',
    caption: "while everyone up there is busy with the battle, down here in the border it's the January sales. this is genuinely in the tapestry",
    comments: [['guy', 'Does this come in a medium'], ['border', 'no refunds'], ['cook', 'Swords 3 for 2 👀'], ['odo', 'Tasteful.']] },

  { id: 'p38', acc: 'teller', date: '14 Oct 1066', loc: '', type: 'straight', music: 'solemn',
    caption: '', seq: [{ w: 1200 }, 'r15_1', { w: 1400 }, 'r15_2'] },

  { id: 'p39', acc: 'william', handle2: true, date: '15 Oct 1066', loc: 'England (mine)', type: 'photo', likes: '22M',
    caption: 'New chapter. New name. Grateful for the journey. 🦁👑',
    comments: [['border', 'he changed his name lol'], ['border', '@WilliamTheBastard aged badly'], ['odo', 'Proud of you brother. Also I made a tapestry about it.'], ['william', 'How long is it'], ['odo', 'Seventy metres'], ['william', 'Odo.']] },

  // ---------------- VI · THE LOST ENDING ----------------
  { id: 'p40', acc: 'news', date: '25 Dec 1066', loc: 'Bayeux', type: 'reel', likes: '3.0M',
    news: { head: 'TAPESTRY ENDING MISSING', ticker: 'NOBODY KNOWS HOW IT ENDS · BISHOP ODO "NOT RESPONSIBLE" · THREADS "VERY LOOSE" · ' },
    caption: 'We have lost the ending.', seq: [{ w: 300 }, 'r16_1'],
    comments: [['odo', "It's not lost it's minimalist"], ['turold', 'Am I in the ending'], ['border', 'nobody is in the ending turold']] },

  { id: 'p41', acc: 'william', handle2: true, date: '25 Dec 1066', loc: 'Westminster Abbey', type: 'photo', likes: '30M', crowned: true,
    caption: "Crowned. Christmas Day. Huge. Wish someone had finished embroidering it. 🎄👑",
    comments: [['odo', 'Budget ran out'], ['william', 'You spent 70 metres on yourself'], ['odo', "And I'd do it again"], ['hawk', '👁']] },

  { id: 'p42', acc: 'teller', type: 'stitched', date: '', loc: '', music: 'finale' },
];

// Who holds the crown (and so the verified tick) at a given post.
export function crownHolder(id) {
  const n = parseInt(id.slice(1), 10);
  if (n <= 14) return 'edward';
  if (n <= 38) return 'harold';
  return 'william';
}
