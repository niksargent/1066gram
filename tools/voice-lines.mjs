// Every voiced line in 1066gram. One clip per line so the app can animate whoever is speaking.
// Direction in [brackets] is read by Eleven v4 as performance notes.

export const VOICES = {
  edward: '7p1Ofvcwsv7UBPoFNcpI',   // Julian
  harold: 'Fahco4VZzobUeiPqni1S',   // Archer
  william: 'pNInz6obpgDQGcFmaJgB',  // Adam
  odo: 'jfIS2w2yJi0grJZPyEsk',      // Oliver Silk
  comet: 'mfxPGiKweaQEsXJix2Ve',    // Zane
  guy: 'N2lVS1w4EtoT3dr4eOWO',      // Callum
  cook: 'IKne3meq5aSn9XLyUdCD',     // Charlie
  aelfgyva: 'pFZP5JQG7iQjIQuC4Bku', // Lily
  news: 'onwK4e9ZLuTAKqWW03F9',     // Daniel
  teller: 'JBFqnCBsd6RMkjVDRZzb',   // George
  ad: 'XrExE9yKIg1WjnnlVkGX',       // Matilda
  turold: 'WSEJLwlQzAUmls3eIxMX',   // Nik (cameo)
  soldier: 'Wd24BnnL8cN03gMjwWf3',  // Male Middle British
  eustace: 'Yg7C1g7suzNt5TisIqkZ',  // Jude
  conan: 'jRAAK67SEFE9m7ci5DhD',    // Ollie
  ghost: '1cxc5c3E9K6F1wlqOJGV',    // Emily (the border, being spooky)
  archer: 'Wd24BnnL8cN03gMjwWf3',   // Male Middle British
  farmer: 'ZpRP4VT5tELqNw2fovTd',   // Welcoming Brit
};

export const LINES = [
  // R1 — Edward's errand
  ['r01_1', 'edward', "[old, warm, a touch vague, like a grandfather asking you to pop to the shops] Harold. My dear boy. A small favour. I need you to pop over to Normandy."],
  ['r01_2', 'harold', "[flatly] Normandy."],
  ['r01_3', 'edward', "[cheerful, vague] Lovely time of year."],
  ['r01_4', 'harold', "[patient, probing] What's the message?"],
  ['r01_5', 'edward', "[sweetly, dodging the question] Safe travels, Harold."],

  // R2 — 1066 News: wrong country
  ['r02_1', 'news', "[crisp BBC newsreader, completely deadpan] Breaking news. The Earl of Wessex has landed in the wrong country. Harold Godwinson, who was sailing to Normandy, has arrived instead in Ponthieu, where he has been immediately arrested. [tiny pause] He is reported to be 'fine', and still holding a hawk. More on that as we get it."],

  // R2b — Guy of Ponthieu
  ['r02b_1', 'guy', "[sly, smooth, a dodgy salesman, delighted with himself] Welcome to Ponthieu! You'll love it here. Lovely beach. Lovely dungeon. [beat] You're free to leave whenever someone pays me."],

  // R2c — Quicksand
  ['r02c_1', 'harold', "[straining, carrying a man on his back, still polite] Right. Anyone else? [beat] No? Just me then. [grunts with effort] Fine."],
  ['r02c_2', 'william', "[from a distance, applauding, smug podcast voice] Love this energy, Harold! Leadership!"],

  // R3 — The Oath
  ['r03_1', 'odo', "[booming, ceremonial, enjoying himself enormously] Harold Godwinson. Place your hands upon these boxes."],
  ['r03_2', 'harold', "[cautious] What's in the boxes?"],
  ['r03_3', 'odo', "[breezy, dismissive] Don't worry about the boxes."],
  ['r03_4', 'william', "[smooth, casual, podcast bro] Just a quick promise, bro. Super casual."],
  ['r03_5', 'harold', "[suspicious] What am I promising?"],
  ['r03_6', 'william', "[warm, salesy] That you'll support my vision."],
  ['r03_7', 'harold', "[flat] What's your vision?"],
  ['r03_8', 'william', "England.", 'eleven_multilingual_v2'], // v4 doubles single-word lines
  ['r03_9', 'harold', "[long pause, resigned] ...Right."],
  ['r03_10', 'odo', "[triumphant, booming] And he's touched the boxes! Witnessed!"],
  ['r03_11', 'harold', "[quietly, to himself, haunted] What was in the boxes."],

  // R4 — The deathbed (Edward's mumble is replayed by the app)
  ['r04_1', 'news', "[solemn newsreader] We can now bring you the final words of King Edward."],
  ['r04_2', 'edward', "[very weak, a dying whisper, mumbling, trailing off] ...the kingdom... to... Har... Har..."],
  ['r04_3', 'news', "[deadpan] We'll play that again."],
  ['r04_4', 'edward', "[very weak whisper] ...Har..."],
  ['r04_5', 'news', "[deadpan, precise] Some are saying 'Harold'. Others are saying 'Harrow', which is not a person. The Duke of Normandy says it sounded like 'William'. [pause] [drily] It did not sound like William."],

  // R5 — The comet (straight)
  ['r05_1', 'teller', "[hushed, slow, full of wonder] In the spring of ten sixty-six, a light appeared in the sky. It burned for a week. People stood in the streets and pointed. They had no word for it, except one. [long pause] Omen."],
  ['r05_2', 'comet', "[enormous, slow, cosmic, echoing, almost kind] Hello. [pause] I'll be back. [pause] Not for you."],

  // R6 — William's morning routine
  ['r06_1', 'william', "[motivational, fast, influencer cadence, very pleased with himself] Four a.m. Cold plunge. The English Channel. Cold plunges build discipline. Four fifteen. Journalling. Today I wrote 'England' forty times. That's called manifesting. Five a.m. Council meeting. My brother Odo points at things. That's his whole role. He's very good at it."],
  ['r06_2', 'william', "[slowing down, leaning in] People ask me, 'William, why do you want England?' And I say... [intense whisper] 'Why don't you?'"],

  // R7 — Sponsored: Norman Nautical
  ['r07_1', 'ad', "[upbeat American infomercial, bright and sincere] Planning an invasion? You'll need boats. Norman Nautical! We fell the trees. We shape the planks. We haul them to the sea. Seven hundred ships. One summer. No questions asked."],
  ['r07_2', 'ad', "[very fast, quieter, legal disclaimer gabble] Norman Nautical is not responsible for weather, horses, Saxons, or the long-term consequences of conquest. Ships may contain horses."],

  // R8 — The crossing
  ['r08_1', 'william', "[epic, deadly serious, raising his voice over the wind] Tonight, seven hundred ships cross the sea. Tomorrow, England."],
  ['r08_2', 'william', "[weary, flat] Not now, Gerald."],

  // R9 — Invasion BBQ
  ['r09_1', 'cook', "[Australian, hyped TV cooking host] G'day, Normans! Welcome back to Invasion Barbie! Today we're doing a classic. Meat, on a stick, on a fire. Simple. Rustic. Conquest-ready. Bit of chicken. Bit of mystery meat. [conspiratorial] Don't ask."],
  ['r09_2', 'cook', "[shouting happily] And that's the bell! Grub's up!"],
  ['r09_3', 'odo', "[from off, booming, outraged] WAIT. I HAVEN'T BLESSED IT."],
  ['r09_4', 'cook', "[deflated, sulky] Aw, Bish."],

  // R10 — Sponsored: Flat-pack castles
  ['r10_1', 'ad', "[upbeat infomercial] Just arrived in a hostile country? You need a castle. Fast. Introducing: the Motte-in-a-Box! Pre-cut timber. One mound. Some assembly required."],
  ['r10_2', 'william', "[satisfied, smug] We put it up in a day."],
  ['r10_3', 'ad', "[cheerful, reassuring] Two men may hit each other with shovels during construction. That's normal. Motte-in-a-Box. Conquer with confidence!"],

  // R11 — Pre-battle TED talk
  ['r11_1', 'william', "[TED talk, slow, warm, insincere, big pauses] I want you to close your eyes. [beat] Actually, don't. There's a battle."],
  ['r11_2', 'william', "[TED talk, building] I want you to think about what you want. Not what the English want. Not what God wants. [aside] Okay, partly what God wants. Odo, nod."],
  ['r11_3', 'william', "[soft, sincere] Today isn't about winning. [beat] [suddenly blunt] It is entirely about winning. [shouts] Charge!"],

  // R12 — Hastings live
  ['r12_1', 'news', "[live sports commentator, quick, rising excitement] And we're live from Senlac Hill, where the English shield wall is holding, it is holding, the Normans charging up the hill for the third time this morning! Harold's men are not moving. They are a wall. They are a very tired wall."],
  ['r12_2', 'news', "[commentator, confused then horrified] And the Normans are... retreating? Are they retreating? The English are going after them. Oh no. They're going after them. [groans] Don't go after them. [deflated] They've gone after them."],

  // R13 — #NotAWeapon
  ['r13_1', 'odo', "[on horseback, booming, righteous] Bishops do not carry swords! We do not shed blood!"],
  ['r13_2', 'odo', "[reasonable, explaining] This is a club. It's very different."],
  ['r13_3', 'odo', "[firm] It's pastoral."],
  ['r13_4', 'odo', "[rallying roar] Courage, boys! God is watching! [beat] [quieter, menacing] So am I."],

  // R14 — I'm not dead
  ['r14_1', 'soldier', "[panicked shouting on a battlefield] The Duke is dead! William is dead!"],
  ['r14_2', 'william', "[furious shouting] I'M NOT DEAD! [beat] LOOK AT MY FACE. THIS IS MY FACE."],
  ['r14_3', 'eustace', "[helpful, eager, pointing] That's him! That's the Duke!"],
  ['r14_4', 'william', "[calm, an aside] Note to self: helmet with a face hole."],

  // R15 — Harold (straight)
  ['r15_1', 'teller', "[quiet, unhurried, no performance, grave] Late in the afternoon, the shield wall broke. Somewhere in the scrum, Harold, King of England for nine months and nine days, fell."],
  ['r15_2', 'teller', "[quiet, gentle] The Tapestry shows a man with an arrow at his eye, and a man being cut down by a horseman. It writes his name above them both. It doesn't say which one was him. [long pause] Perhaps that's the kindest thing it does."],

  // R16 — The lost ending
  ['r16_1', 'news', "[newsreader, slightly baffled] And finally. We've lost the ending. The final part of the Bayeux Tapestry, thought to show William's coronation on Christmas Day, is missing. It may have been cut off. It may have worn away. It may never have been finished. Nobody knows how it ends. [beat] [drily] We're told that's your problem now."],

  // R17 — Outro
  ['r17_1', 'teller', "[warm, a smile in the voice] Seventy metres of linen. Nine hundred and sixty years. And here you are. Still scrolling. [beat] Go on, then. Finish it."],

  // R18 — Turold (cameo)
  ['r18_1', 'turold', "[cheerful, delighted with himself] Hiya. Turold. That's me, up there, in the actual stitching."],
  ['r18_2', 'turold', "[matter of fact] Do I do anything important? I hold horses. [beat] Am I a king? No. A bishop? No."],
  ['r18_3', 'turold', "[proud, beaming] And yet. Seventy metres of tapestry, and they spelled my name right."],
  ['r18_4', 'turold', "[shouting excitedly from far away, waving] I'M IN THE BACKGROUND! HIYA!"],

  // Ælfgyva
  ['r19_1', 'aelfgyva', "[a slow, velvety, conspiratorial whisper, close to the microphone] You'll never know."],

  // R20 — Conan's French exit at Dol
  ['r20_1', 'conan', "[casual, quiet, sneaking, very pleased with his plan] Right. Normans at the front door. Not a problem. I've got a rope."],
  ['r20_2', 'conan', "[sliding down a rope, wobbling, trying to sound relaxed and failing] This is fine. Totally planned. Very dignified. Very, very dignified."],
  ['r20_3', 'conan', "[slightly out of breath, brushing himself off, smug] And that, lads, is what we call a French exit."],
  ['r20_4', 'william', "[distant, confused, podcast voice] Conan? Conan? We had a meeting booked."],

  // R21 — The funeral before the death
  ['r21_1', 'news', "[newsreader, slightly embarrassed, clearing throat] A correction. Earlier, we showed you the funeral of King Edward. We then showed you King Edward, in bed, very much talking."],
  ['r21_2', 'news', "[apologetic, precise] The Tapestry has put these the wrong way round. We'd like to make clear that the King was not, at the time of his funeral, alive."],
  ['r21_3', 'edward', "[faint, frail, slightly offended old man] I was a bit alive."],
  ['r21_4', 'news', "[flat, resigned] He was a bit alive."],

  // R22 — The phantom fleet
  ['r22_1', 'ghost', "[a playful ghostly whisper, slow and spooky, stretching the vowels] Boats... Lots... of... boats..."],

  // R23 — The ditch
  ['r23_1', 'news', "[live sports commentator, wincing] Oh. Oh no. And the horses have found the ditch."],
  ['r23_2', 'news', "[commentator, deadpan] That's a ten for artistic impression. And a zero for everything else."],

  // R24 — The only English archer
  ['r24_1', 'archer', "[cheerful, plucky ordinary bloke, slightly overwhelmed] Hiya. I'm the English archery division. [beat] All of it."],
  ['r24_2', 'archer', "[counting, getting worried] The Normans have brought thirty-four archers. [beat] Plus one bloke on a horse with a bow. Showing off."],
  ['r24_3', 'archer', "[determined, chin up] Doesn't matter. I've got one bow, eleven arrows, and a can-do attitude."],
  ['r24_4', 'archer', "[small voice, as arrows whoosh overhead] I'd like to request backup."],
  ['r24_5', 'harold', "[exhausted, flat] There is no backup. You are the backup."],

  // R25 — The farmer (still farming)
  ['r25_1', 'farmer', "[calm, completely unbothered rural Englishman] Morning. Bit of harrowing today. Then, if there's time, a bit more harrowing."],
  ['r25_2', 'farmer', "[calm, unbothered, as a huge battle rages in the distance] Still farming."],
  ['r25_3', 'farmer', "[calm, then quietly furious] One fewer sheep, mind."],

  // R26 — Sponsored: The Norman haircut
  ['r26_1', 'ad', "[upbeat American infomercial] Tired of looking English? Introducing: The Norman! Short at the front. And at the back? [beat] Nothing at the back."],
  ['r26_2', 'ad', "[very fast, quieter, legal disclaimer gabble] Moustache removal included. Neck may get cold. Not suitable for Saxons unless you are planning to change sides."],

  // R27 — Farm to fork
  ['r27_1', 'cook', "[Australian, hyped TV cooking host] Farm to fork, Normans! Today's sheep is locally sourced. Very locally. From that bloke's field."],
  ['r27_2', 'farmer', "[calm, then quietly furious] Oi. That's my sheep, that is."],
];

export const SFX = [
  ['sea', 'gentle waves on a wooden ship at night, creaking timber, rope, calm sea ambience', 10],
  ['storm', 'stormy sea, waves crashing against a small wooden ship, wind howling', 6],
  ['wind', 'cold wind over an open hillside', 8],
  ['crowd', 'medieval crowd murmuring in a stone hall', 8],
  ['horn', 'a single long medieval war horn blast', 3],
  ['whinny', 'an unhappy horse whinny, complaining', 2],
  ['bell', 'a small handbell clanged rapidly by a cook', 2],
  ['sizzle', 'meat sizzling over an open wood fire, crackling', 6],
  ['thwack', 'a single heavy wooden club thwack, comedic', 1],
  ['cheer', 'medieval army cheering and banging shields', 4],
  ['battle', 'distant medieval battle, horses charging, swords clashing, shouting', 10],
  ['shimmer', 'a deep magical cosmic shimmer, slow rising whoosh, awe', 5],
  ['click', 'an old radio click followed by a crackle of static', 2],
  ['applause', 'a single person slow clapping', 3],
  ['saw', 'axes chopping wood and hand saws, busy shipyard', 6],
  ['spade', 'two shovels clanging together, comedic bonk', 1],
  ['stitch', 'needle and thread being pulled through linen, soft', 2],
  ['hawk', 'a single hawk screech', 2],
  ['ding', 'a soft wooden notification chime', 1],
  ['rope', 'a person sliding quickly down a rope, rope creaking and whizzing, then a soft comedic thud on grass', 3],
  ['bells', 'small handbells ringing slowly in a solemn funeral procession', 6],
  ['ghostly', 'eerie ghostly wind with a faint hollow whoosh, spooky but playful', 5],
  ['sling', 'a sling whirling then a small stone whizzing, then startled birds flapping away', 3],
  ['farm', 'peaceful countryside, birdsong, a horse snorting, distant cow', 8],
  ['baa', 'a single indignant sheep baa', 2],
  ['arrows', 'a huge volley of arrows whooshing overhead', 3],
  ['tumble', 'horses whinnying in surprise then a comedic crash and tumble into a ditch, thuds and clatter', 3],
];
