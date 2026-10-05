// Every post's artwork. Each scene takes an optional caption override (used by Get Stitched)
// and returns an SVG string, or { frames: [...] } for reels that cut between shots,
// or { slides: [...] } for carousels.
import {
  C, seed, rnd, wob, sh, ln, spin, bob, figure, horse, ship, tree, hall, throne, ground, sea, fire, comet,
  card, dog, table, sheep, birds, harrow, bed, blanket, reliquary, cart, cauldron, hill, motte, doorway, handOfGod, stars, england,
  border, portrait, oval, shield, CAST,
} from './art.js';

const G = 425;
const S = 1.75;
const fig = (o) => figure({ s: S, y: G, ...o });
const wave = (a = 20, d = 1.2) => spin(0, -84, [0, -a, 0], d);
const jab = (a = 14, d = 0.5) => spin(0, -84, [0, -a, 0, -a * 0.6, 0], d);

// ---------- Chapter I: the errand ----------
const s01 = (cap) => { seed(101); return card(
  hall({ x: 330, y: G, w: 130, h: 160, towers: false, c: 'blue', roof: 'red' }) + tree({ x: 200, y: G, h: 120, s: 0.9 }) + ground() +
  throne(305, G, 1.7) + fig({ who: 'edward', pose: 'sit', x: 305, dir: -1, armF: 80, armFAnim: wave(18, 1.6), s: 1.7 }) +
  fig({ who: 'harold', x: 115, armF: 25, armB: 10 }),
  { caption: cap ?? 'EDWARD REX', seed: 101 }); };

const s02 = (cap) => { seed(102); return card(
  tree({ x: 40, y: G, h: 160 }) + ground() +
  horse({ x: 175, y: G, s: 1.5, c: 'ochre', gait: 'trot', rider: { who: 'harold', armF: 70, propF: { t: 'hawk' } } }) +
  dog(310, G, 1.5, 'red') + dog(355, G - 4, 1.3, 'navy'),
  { caption: cap ?? 'UBI HAROLD DUX ANGLORUM ET SUI MILITES EQUITANT', seed: 102, capSize: 15 }); };

const s03 = () => ({ slides: [
  (() => { seed(131); return card(
    hall({ x: 200, y: G, w: 300, h: 150, towers: false, arches: 4, c: 'ochre', roof: 'blue' }) +
    fig({ who: 'harold', x: 110, armF: 80, propF: { t: 'cup', a: 0 }, s: 1.5 }) +
    fig({ who: 'cook', tunic: 'blue', apron: false, x: 170, dir: -1, armF: 70, propF: { t: 'horn', a: -30 }, s: 1.5 }) +
    fig({ who: 'guy', tunic: 'green', x: 235, armF: 90, propF: { t: 'cup', a: 0 }, s: 1.5 }) +
    fig({ who: 'turold', tunic: 'red', short: false, x: 300, dir: -1, armF: 120, armFAnim: wave(10, 0.8), s: 1.5 }) +
    table(200, G, 300, 'red'),
    { caption: 'HIC HAROLD ET SUI BIBUNT', seed: 131 }); })(),
  (() => { seed(132); return card(
    ship({ x: 340, y: 405, s: 0.9, crew: 2, sail: false, still: false }) +
    fig({ who: 'harold', legs: 'skin', garters: false, x: 170, y: 430, pose: 'walk', armF: 110, propF: { t: 'hawk' } }) +
    fig({ who: 'cook', apron: false, tunic: 'blue', legs: 'skin', garters: false, x: 80, y: 430, pose: 'walk', armF: 70, s: 1.5 }) +
    dog(80, 300, 1, 'ochre', 1, false) +
    sea(392, 70),
    { caption: 'HIC HAROLD MARE NAVIGAVIT', seed: 132 }); })(),
  (() => { seed(133); return card(
    figure({ who: 'harold', legs: 'skin', garters: false, x: 200, y: 486, s: 5, armF: 6, armB: 4, anim: bob(1.5, 2) }) + sea(424, 40),
    { caption: 'HAROLDI PEDES', seed: 133 }); })(),
] });

const s04 = () => { seed(104); return card(
  `<g opacity=".5">${[...Array(18)].map(() => { const x = rnd() * 420, y = 50 + rnd() * 250; return ln(`M${x | 0},${y | 0}l-12,30`, C.blue, 1.5); }).join('')}</g>` +
  `<g transform="translate(200,360)"><g>${ship({ x: 0, y: 0, s: 1.05, crew: 3, still: true, sailC: 'ochre' })}${spin(0, -40, [-10, 9, -10], 1.7)}${bob(10, 1.3)}</g></g>` +
  sea(330, 130),
  { caption: 'HIC TEMPESTAS', seed: 104 }); };

const s05 = (cap) => { seed(105); return card(
  ground(G, 'cream') +
  horse({ x: 315, y: G, s: 1.35, dir: -1, c: 'red', far: 'blue', rider: { who: 'guy', armF: 100, armFAnim: jab(10, 0.8) } }) +
  fig({ who: 'norman', x: 55, armF: 80, s: 1.6 }) +
  fig({ who: 'harold', x: 125, armF: 60, propF: { t: 'hawk' }, s: 1.6, anim: bob(1.5, 0.6, -1) }) +
  fig({ who: 'norman', helmet: 'ochre', x: 190, dir: -1, armF: 85, s: 1.6 }),
  { caption: cap ?? 'HIC APPREHENDIT WIDO HAROLDUM', seed: 105 }); };

const s06 = (cap) => { seed(106); return card(
  hall({ x: 270, y: G, w: 170, h: 170, towers: true, c: 'green', roof: 'red', arches: 2 }) + ground() +
  throne(270, G, 1.8) + fig({ who: 'william', pose: 'sit', x: 268, dir: -1, s: 1.8, armF: 95, armB: 40, armFAnim: wave(8, 2) }) +
  fig({ who: 'harold', x: 110, s: 1.5, armF: 55, propF: { t: 'hawk' } }),
  { caption: cap ?? 'HIC VENIT HAROLD AD WILLELMUM', seed: 106 }); };

const s07 = () => { seed(107); return card(
  ground() + doorway(240, G, 1.15, 'blue') +
  fig({ who: 'aelfgyva', x: 245, dir: -1, armF: 30, armB: 20, s: 1.7 }) +
  fig({ who: 'cleric', x: 150, armF: 108, s: 1.7 }),
  { caption: 'UBI UNUS CLERICUS ET ÆLFGYVA', seed: 107,
    over: figure({ tunic: 'skin', legs: 'skin', hair: 'ochre', garters: false, pose: 'kneel', s: 0.34, x: 200, y: 492, armF: 140, anim: bob(1, 1.4) }) }); };

const s08 = (cap) => { seed(108); return card(
  hill(305, G, 240, 130, 'sage') + hall({ x: 305, y: G - 128, s: 0.42, w: 120, h: 90, towers: false, dome: true, c: 'cream' }) +
  fig({ who: 'william', x: 48, s: 1.4, armF: 70, armB: 60, armFAnim: spin(0, -84, [0, -25, 0], 0.35), armBAnim: spin(0, -84, [0, 25, 0], 0.35) }) +
  fig({ who: 'norman', x: 300, y: G + 70, s: 1.5, armF: 160, armFAnim: wave(15, 0.6), cls: 'sinking' }) +
  fig({ who: 'harold', x: 185, pose: 'walk', armF: 95, armB: 150, anim: bob(2, 0.9) }) +
  figure({ who: 'norman', helmet: 'ochre', x: 178, y: G - 44, s: 1.3, rot: 84, still: true }) +
  sh(wob([[200, G - 8], [260, G - 14], [330, G - 6], [400, G - 12], [400, G + 20], [200, G + 20]], { j: 1 }), 'ochre') + ground(G + 6, 'sage').replace('M0', 'M0'),
  { caption: cap ?? 'HIC HAROLD DUX TRAHEBAT EOS DE ARENA', seed: 108 }); };

const s09 = () => { seed(109); return card(
  ground() + motte(285, G, 1.25) +
  figure({ who: 'guy', tunic: 'blue', x: 268, y: G - 86, s: 1.2, dir: -1, armF: 90, propF: { t: 'keys', a: 0 } }) +
  horse({ x: 95, y: G, s: 1.2, c: 'blue', far: 'ochre', rider: { who: 'norman', armF: 115, propF: { t: 'spear', a: 55, len: 70 } } }),
  { caption: 'ET CUNAN CLAVES PORREXIT', seed: 109 }); };

const s10 = () => { seed(110); return card(
  tree({ x: 45, y: G, h: 170 }) + ground() +
  fig({ who: 'william', x: 160, armF: 112, propF: { t: 'helmet', a: 0 }, armB: 20 }) +
  fig({ who: 'harold', tunic: 'mail', legs: 'mail', x: 255, dir: -1, armF: 20, propB: { t: 'spear', pennon: 'red', a: 0 }, armB: 30 }),
  { caption: 'HIC WILLELM DEDIT HAROLDO ARMA', seed: 110 }); };

const s11 = () => { seed(111); return card(
  ground() + throne(52, G, 1.25) + figure({ who: 'william', pose: 'sit', x: 54, y: G, s: 1.25, armF: 100, propF: { t: 'sword', a: 20 } }) +
  reliquary(150, G, 1.45, 'ochre') + reliquary(252, G, 1.45, 'red') +
  fig({ who: 'harold', x: 200, armF: 82, armB: -78, s: 1.8, anim: bob(0.5, 1.4) }) +
  fig({ who: 'odo', x: 345, dir: -1, s: 1.6, armF: 100, armFAnim: wave(14, 1.4), propB: { t: 'crozier' }, armB: 20 }),
  { caption: 'UBI HAROLD SACRAMENTUM FECIT WILLELMO DUCI', seed: 111, capSize: 15 }); };

const s12 = () => { seed(112); return card(
  hall({ x: 320, y: G, w: 120, h: 160, towers: false, c: 'red', roof: 'blue' }) + ground() +
  throne(300, G, 1.7) + fig({ who: 'edward', pose: 'sit', x: 300, dir: -1, s: 1.7, armF: 55, armFAnim: jab(8, 1.2) }) +
  fig({ who: 'harold', x: 150, pose: 'kneel', armF: 50, s: 1.7 }),
  { caption: 'HIC HAROLD REDIIT AD ANGLICAM TERRAM', seed: 112 }); };

// ---------- Chapter II: the crown ----------
const s13 = () => { seed(113); return card(
  hall({ x: 200, y: G, w: 230, h: 140, towers: true, cock: true, c: 'ochre', roof: 'red' }) + ground() +
  figure({ who: 'turold', short: false, x: 180, y: G - 172, s: 0.8, armF: 135, armFAnim: wave(10, 0.9) }) +
  handOfGod(80, 110, 1),
  { caption: 'HIC PORTATUR CORPUS EADWARDI AD ECCLESIAM', seed: 113, capSize: 14 }); };

const s14 = () => { seed(114); return card(
  hall({ x: 200, y: G, w: 300, h: 210, towers: false, arches: 3, c: 'blue', roof: 'red' }) + ground() +
  bed(200, G - 30, 1.5) +
  figure({ who: 'edward', x: 210, y: G - 18, s: 1.35, rot: -90, still: true, anim: bob(0.6, 3) }) + blanket(220, G - 72, 1.4) +
  fig({ who: 'aelfgyva', hood: 'blue', tunic: 'red', x: 85, s: 1.4, armF: 150 }) +
  fig({ who: 'stigand', x: 330, dir: -1, s: 1.4, armF: 70, armFAnim: wave(6, 2) }),
  { caption: 'HIC EADWARDUS REX IN LECTO ALLOQUITUR FIDELES', seed: 114, capSize: 14 }); };

const s15 = (cap) => { seed(115); return card(
  hall({ x: 200, y: G, w: 260, h: 180, towers: true, c: 'ochre', roof: 'blue', arches: 3 }) + ground() +
  throne(200, G, 1.8) + fig({ who: 'harold', crown: true, pose: 'sit', x: 200, s: 1.8, armF: 60, propF: { t: 'sceptre', a: 10 }, armB: 50, propB: { t: 'orb', a: 0 } }) +
  fig({ who: 'stigand', x: 330, dir: -1, s: 1.5, armF: 110, armFAnim: wave(8, 2) }) +
  fig({ who: 'english', helmet: null, tunic: 'green', legs: 'red', x: 75, s: 1.5, armF: 95, propF: { t: 'sword', a: 0 } }),
  { caption: cap ?? 'HIC RESIDET HAROLD REX ANGLORUM', seed: 115 }); };

// The comet: crowd pointing at the sky. Also used as the 2D fallback for the 3D post.
const s16 = (cap) => { seed(116); return card(
  hall({ x: 345, y: G, w: 90, h: 130, towers: false, c: 'blue', roof: 'red', arches: 1 }) + ground() +
  comet(250, 150, 1.1) +
  [50, 105, 160, 215].map((x, i) => fig({ who: i % 2 ? 'english' : 'harold', helmet: null, tunic: ['red', 'green', 'ochre', 'blue'][i], legs: ['blue', 'red', 'green', 'ochre'][i], hair: ['ochre', 'navy', 'red', 'ochre'][i], moustache: true, x, s: 1.45, armF: 150 + i * 4, armFAnim: jab(6, 0.9 + i * 0.13), anim: bob(1, 1 + i * 0.2) })).join(''),
  { caption: cap ?? 'ISTI MIRANT STELLA', seed: 116 }); };

const s17 = () => { seed(117); return card(
  hall({ x: 290, y: G, w: 150, h: 180, towers: true, c: 'red', roof: 'blue', arches: 2 }) + ground() +
  throne(290, G, 1.7) + fig({ who: 'harold', crown: true, pose: 'sit', x: 290, dir: -1, s: 1.7, armF: 30, propB: { t: 'sceptre', a: 0 }, armB: 60 }) +
  fig({ who: 'cleric', x: 175, s: 1.6, armF: 120, anim: bob(1, 0.5) }),
  { caption: 'HAROLD', seed: 117 }); };

// ---------- Chapter III: the build ----------
const s18 = () => ({ frames: [
  (() => { seed(181); return card(
    `<g>${fig({ who: 'william', x: 200, y: G + 62, s: 1.8, armF: 40, anim: bob(3, 0.25, 1.5) })}</g>` + sea(338, 120) +
    `<g opacity=".8">${ln('M150,300q-6,-10 0,-20t0,-20', C.grey, 2)}${ln('M250,300q-6,-10 0,-20t0,-20', C.grey, 2)}${bob(6, 1.8)}</g>`,
    { caption: 'HIC WILLELM IN MARE FRIGIDO', seed: 181 }); })(),
  (() => { seed(182); return card(
    hall({ x: 200, y: G, w: 300, h: 190, towers: false, c: 'green', roof: 'red', arches: 3 }) + ground() +
    fig({ who: 'william', pose: 'sit', x: 150, s: 1.6, armF: 80, propF: { t: 'scroll', a: 90 }, armFAnim: jab(5, 0.5) }) + table(240, G, 140, 'ochre') +
    `<text x="240" y="${G - 58}" text-anchor="middle" font-size="9" class="tcap" fill="${C.red}">ANGLIA ANGLIA ANGLIA</text>`,
    { caption: 'HIC SCRIBIT ANGLIA XL', seed: 182 }); })(),
  (() => { seed(183); return card(
    hall({ x: 200, y: G, w: 300, h: 190, towers: true, c: 'ochre', roof: 'blue', arches: 3 }) + ground() +
    throne(205, G, 1.6) + fig({ who: 'william', pose: 'sit', x: 205, s: 1.6, armF: 40 }) +
    fig({ who: 'odo', x: 85, s: 1.6, armF: 125, armFAnim: jab(18, 0.7) }) +
    fig({ who: 'guy', tunic: 'red', x: 330, dir: -1, s: 1.55, armF: 30 }),
    { caption: 'HIC ODO DIGITO MONSTRAT', seed: 183 }); })(),
] });

const s19 = () => ({ frames: [
  (() => { seed(191); return card(
    ground() + tree({ x: 220, y: G, h: 230, s: 1.1 }) +
    fig({ who: 'cook', apron: false, x: 140, armF: 100, propF: { t: 'axe', a: 60 }, armFAnim: spin(0, -84, [0, 40, 0], 0.6) }) +
    fig({ who: 'guy', tunic: 'blue', x: 305, dir: -1, armF: 100, propF: { t: 'axe', a: 60 }, armFAnim: spin(0, -84, [0, 40, 0], 0.6, 'begin="0.3s"') }),
    { caption: 'HIC WILLELM DUX IUSSIT NAVES EDIFICARE', seed: 191, capSize: 15 }); })(),
  (() => { seed(192); return card(
    ground() + ship({ x: 200, y: 395, s: 1.05, sail: false, crew: 0, shields: false, still: true }) +
    figure({ who: 'cook', apron: false, x: 52, y: G, s: 1.3, armF: 120, propF: { t: 'axe', a: 80 }, armFAnim: spin(0, -84, [0, 30, 0], 0.45) }) +
    figure({ who: 'turold', short: false, x: 352, y: G, dir: -1, s: 1.3, armF: 120, propF: { t: 'axe', a: 80 }, armFAnim: spin(0, -84, [0, 30, 0], 0.5) }),
    { caption: 'HIC CARPENTARII', seed: 192 }); })(),
  (() => { seed(193); return card(
    ground(G, 'cream') + sea(392, 70, 230, 420) +
    ship({ x: 330, y: 410, s: 0.8, crew: 0, sail: false, shields: false }) +
    ln(wob([[250, 360], [180, 372], [60, 380]], { closed: false, j: 1 }), C.ochre, 3) +
    [80, 135, 190].map((x, i) => fig({ who: 'cook', apron: false, tunic: ['red', 'green', 'blue'][i], x, s: 1.4, dir: -1, armF: 80, rot: -12, anim: bob(1.5, 0.7, -2, i * 0.2) })).join(''),
    { caption: 'HIC TRAHUNT NAVES AD MARE', seed: 193 }); })(),
] });

const s20 = () => ({ slides: [
  (() => { seed(201); const mailShirt = (x) => sh(wob([[x - 14, 268], [x + 14, 268], [x + 18, 320], [x + 4, 322], [x, 306], [x - 4, 322], [x - 18, 320]], { j: 0.6 }), 'mail'); return card(
    ground() + fig({ who: 'cook', apron: false, x: 90, armF: 150, s: 1.6 }) + fig({ who: 'guy', x: 310, dir: -1, armF: 150, s: 1.6 }) +
    ln('M60,262L340,262', C.ink, 4) + mailShirt(160) + mailShirt(240),
    { caption: 'ISTI PORTANT ARMAS AD NAVES', seed: 201 }); })(),
  (() => { seed(202); return card(
    ground() + fig({ who: 'cook', apron: false, tunic: 'red', x: 100, armF: 70, propF: { t: 'helmet', a: 0 }, armB: 60, propB: { t: 'sword', a: 0 } }) +
    fig({ who: 'turold', short: false, x: 210, armF: 140, propF: { t: 'spear', a: 0 }, armB: 70, propB: { t: 'helmet', a: 0 } }) +
    fig({ who: 'guy', tunic: 'green', x: 315, armF: 80, propF: { t: 'axe', a: 20 } }),
    { caption: 'ET HIC GALEAS ET GLADIOS', seed: 202 }); })(),
  (() => { seed(203); return card(
    ground() + cart(150, G, 1.4) +
    fig({ who: 'cook', apron: false, x: 280, armF: -60, armB: -60, rot: 10, anim: bob(1.5, 0.8, 1) }) +
    fig({ who: 'odo', x: 355, dir: -1, s: 1.4, armF: 120, armFAnim: wave(12, 1.2) }),
    { caption: 'ET HIC CARRUM VINO', seed: 203 }); })(),
] });

const s21 = () => { seed(121); return card(
  ground() + horse({ x: 270, y: G, s: 1.55, dir: -1, c: 'blue', far: 'ochre', saddle: 'ochre' }) +
  fig({ who: 'turold', x: 140, s: 1.6, armF: 85, anim: bob(2, 0.7) }) + ln(`M${140 + 46},${G - 100}L232,${G - 128}`, C.ink, 1.4),
  { caption: 'TUROLD', seed: 121, capY: 120, capSize: 34 }); };

const tracker = (route, cap, sd) => () => { seed(sd); return card(england(route), { caption: cap, seed: sd }); };
const s22 = tracker(['york', 'stamford'], 'STAMFORD BRIDGE', 122);

// ---------- Chapter IV: the crossing ----------
const s23 = (cap) => { seed(123); return card(
  sea(280, 180) +
  ship({ x: 70, y: 315, s: 0.45, crew: 2, sailC: 'ochre' }) + ship({ x: 320, y: 345, s: 0.62, crew: 2, sailC: 'red', horses: 1 }) +
  ship({ x: 190, y: 430, s: 1.1, crew: 3, horses: 2, lantern: true, boy: true, sailC: 'red' }),
  { caption: cap ?? 'HIC WILLELM DUX IN MAGNO NAVIGIO MARE TRANSIVIT', seed: 123, capSize: 14 }); };

const s24 = () => { seed(124); return card(
  `<g transform="translate(200,400)"><g>${sh(wob([[-60, 0], [-10, -120], [40, -170], [90, -150], [110, -90], [80, -80], [50, -110], [30, 0]], { j: 1.5 }), 'sage')}<circle cx="60" cy="-140" r="5" fill="${C.ink}"/>${ln('M70,-150q8,-8 4,-16M52,-150q6,-10 0,-16', C.ink, 2)}${ln(wob([[0, -100], [20, -140], [40, -160]], { closed: false, j: 1 }), C.green, 6)}${spin(0, 0, [-3, 3, -3], 1.6)}</g></g>` +
  sh(wob([[-20, 380], [420, 380], [420, 460], [-20, 460]], { j: 1 }), 'ochre') + ln('M-20,400L420,400', C.blue, 6) + ln('M-20,420L420,420', C.red, 5),
  { caption: '', seed: 124 }); };

const s25 = () => { seed(125); return card(
  ground(G, 'cream') + ship({ x: 300, y: 425, s: 0.95, crew: 1, sail: false, still: true }) +
  horse({ x: 160, y: G, s: 1.15, c: 'red', far: 'blue', gait: 'trot', rot: -8 }) +
  fig({ who: 'william', x: 55, s: 1.5, armF: 120, armFAnim: wave(10, 1.5) }),
  { caption: 'HIC EXEUNT CABALLI DE NAVIBUS', seed: 125 }); };

const s26 = (cap) => { seed(126); return card(
  ground() + [[90, 'ochre', 'red'], [200, 'blue', 'ochre'], [310, 'red', 'sage']].map(([x, c, far], i) => horse({ x, y: G - i * 2, s: 1.05, c, far, gait: 'trot', saddle: false, stallion: true })).join(''),
  { caption: cap ?? 'ET HIC CABALLI', seed: 126 }); };

const s27 = () => ({ frames: [
  (() => { seed(271); return card(
    ground() + fire(170, G, 1.3) + cauldron(300, G, 1.3) +
    fig({ who: 'cook', x: 100, armF: 85, propF: { t: 'skewer', a: 60 }, armFAnim: jab(6, 0.8), speaker: 'cook' }) +
    fig({ who: 'cook', tunic: 'red', hair: 'navy', x: 365, dir: -1, s: 1.5, armF: 100, propF: { t: 'spade', a: 150 }, armFAnim: spin(0, -84, [0, -20, 0], 1) }),
    { caption: 'HIC COQUITUR CARO', seed: 271 }); })(),
  (() => { seed(272); return card(
    ground() + fire(150, G, 1.1) +
    fig({ who: 'cook', x: 70, s: 1.6, armF: 130, propF: { t: 'bell', a: 0 }, armFAnim: spin(0, -84, [0, -16, 0, 10, 0], 0.3), speaker: 'cook' }) +
    fig({ who: 'odo', x: 300, dir: -1, armF: 150, armFAnim: wave(14, 0.5), anim: bob(2, 0.6, -3) }),
    { caption: 'HIC MINISTRAVERUNT MINISTRI', seed: 272 }); })(),
] });

const s28 = (cap) => { seed(128); return card(
  hall({ x: 200, y: G, w: 330, h: 200, towers: false, arches: 4, c: 'red', roof: 'blue' }) + ground() +
  fig({ who: 'william', x: 95, s: 1.5, armF: 70, propF: { t: 'cup', a: 0 } }) +
  fig({ who: 'odo', x: 200, s: 1.6, armF: 145, armB: 120, armFAnim: wave(6, 1.4), dir: -1 }) +
  fig({ who: 'guy', tunic: 'green', x: 290, dir: -1, s: 1.5, armF: 90, propF: { t: 'horn', a: -30 } }) +
  fig({ who: 'cook', apron: false, x: 345, dir: -1, s: 1.5, armF: 40 }) +
  table(200, G, 330, 'ochre', true) +
  `<g transform="translate(200,${G - 52})">${sh(wob([[-16, 0], [-4, -8], [12, -6], [20, -12], [20, 2], [12, -2], [-4, 6]], { j: 0.5 }), 'blue')}</g>` +
  `<g transform="translate(140,${G - 52})">${sh(oval(0, -4, 10, 5), 'ochre')}</g><g transform="translate(260,${G - 52})">${sh(oval(0, -4, 10, 5), 'red')}</g>`,
  { caption: cap ?? 'HIC EPISCOPUS CIBUM ET POTUM BENEDICIT', seed: 128, capSize: 15 }); };

const s29 = () => ({ frames: [
  (() => { seed(291); return card(
    ground() + motte(200, G, 1.25, false) +
    fig({ who: 'cook', apron: false, tunic: 'red', x: 60, s: 1.45, armF: 60, propF: { t: 'spade', a: 160 }, armFAnim: spin(0, -84, [0, 30, 0], 0.8) }) +
    fig({ who: 'guy', tunic: 'blue', x: 315, s: 1.45, armF: 100, propF: { t: 'spade', a: -60 }, armFAnim: spin(0, -84, [0, -30, 0], 0.5) }) +
    fig({ who: 'turold', tunic: 'green', short: false, x: 370, dir: -1, s: 1.45, armF: 100, propF: { t: 'spade', a: -60 }, armFAnim: spin(0, -84, [0, -30, 0], 0.5, 'begin="0.25s"') }),
    { caption: 'ISTE IUSSIT UT FODERETUR CASTELLUM', seed: 291 }); })(),
  (() => { seed(292); return card(
    ground() + motte(230, G, 1.35, true) +
    fig({ who: 'william', x: 70, s: 1.6, armF: 100, armFAnim: wave(8, 1.6) }),
    { caption: 'AT HESTENGACEASTRA', seed: 292 }); })(),
] });

const s30 = tracker(['york', 'london'], 'EBORACUM AD LUNDONIAM', 130);

const s31 = () => { seed(131); return card(
  hill(90, G, 220, 140, 'sage') + hill(320, G, 220, 120, 'green') + ground() +
  figure({ who: 'norman', x: 95, y: G - 132, s: 1.2, armF: 160, anim: bob(1, 1.4) }) +
  figure({ who: 'english', x: 320, y: G - 112, s: 1.2, dir: -1, armF: 160, anim: bob(1, 1.4, 0, 0.5) }),
  { caption: 'HIC SE VIDENT', seed: 131 }); };

// ---------- Chapter V: the battle ----------
const s32 = () => { seed(132); return card(
  ground() + horse({ x: 115, y: G, s: 1.35, c: 'ochre', far: 'red', rider: { who: 'william', armF: 130, propF: { t: 'sceptre', a: 20 }, armFAnim: jab(14, 1.1) } }) +
  horse({ x: 285, y: G - 4, s: 1.05, dir: -1, c: 'blue', far: 'ochre', rider: { who: 'norman', armF: 20, propF: { t: 'spear', a: 0 }, shield: 'red' } }) +
  horse({ x: 360, y: G, s: 1.05, dir: -1, c: 'red', far: 'sage', rider: { who: 'norman', helmet: 'ochre', armF: 20, propF: { t: 'spear', a: 0 }, shield: 'ochre' } }),
  { caption: 'HIC WILLELM DUX ALLOQUITUR SUIS MILITIBUS', seed: 132, capSize: 15 }); };

const s33 = (cap) => { seed(133); return card(
  hill(330, G, 280, 70, 'green') + ground() +
  [255, 300, 345, 390].map((x, i) => figure({ who: 'english', x, y: G - 50 - (i % 2) * 8, s: 1.3, dir: -1, shield: ['ochre', 'red', 'blue', 'cream'][i], motif: i % 2 ? 'dragon' : 'cross', armF: 130, propF: { t: 'axe', a: -20 }, armFAnim: wave(20, 0.7 + i * 0.1) })).join('') +
  horse({ x: 110, y: G, s: 1.25, c: 'blue', far: 'ochre', gait: 'gallop', rider: { who: 'norman', armF: 90, propF: { t: 'spear', a: 80 }, shield: 'red', motif: 'dragon' } }) +
  `<g opacity=".9">${[...Array(7)].map((_, i) => `<g transform="translate(${180 + i * 14},${150 + i * 12}) rotate(60)">${ln('M0,0L0,-26', C.ink, 1.4)}<animateTransform attributeName="transform" type="translate" values="0 0;40 26" dur="${0.8 + i * 0.1}s" repeatCount="indefinite" additive="sum"/></g>`).join('')}</g>`,
  { caption: cap ?? 'HIC FRANCI PUGNANT', seed: 133 }); };

const s34 = () => { seed(134); return card(
  ground() + figure({ who: 'english', x: 250, y: G - 10, s: 1.5, rot: 70, still: true, shield: 'ochre' }) +
  figure({ who: 'english', helmet: 'blue', x: 330, y: G, s: 1.5, rot: 35, still: true }) +
  horse({ x: 110, y: G, s: 1.3, c: 'red', far: 'blue', gait: 'gallop', rider: { who: 'norman', armF: 95, propF: { t: 'spear', a: 95 }, shield: 'blue' } }),
  { caption: 'HIC CECIDERUNT LEWINE ET GYRD FRATRES HAROLDI REGIS', seed: 134, capSize: 14 }); };

const s35 = (cap) => { seed(135); return card(
  ground() + horse({ x: 150, y: G, s: 1.4, c: 'sage', far: 'red', gait: 'trot', rider: { who: 'odo', robe: false, tunic: 'blue', armF: 120, propF: { t: 'club', a: -10 }, armFAnim: spin(0, -84, [0, -40, 0], 0.55) } }) +
  fig({ who: 'norman', x: 300, s: 1.3, dir: -1, armF: 30, anim: bob(1, 0.3) }) + fig({ who: 'norman', helmet: 'ochre', x: 355, s: 1.25, dir: -1, armF: 140, anim: bob(1, 0.35) }),
  { caption: cap ?? 'HIC ODO EPS BACULU TENENS CONFORTAT PUEROS', seed: 135, capSize: 15 }); };

const s36 = (cap) => { seed(136); return card(
  ground() + horse({ x: 145, y: G, s: 1.4, c: 'ochre', far: 'red', gait: 'trot', rider: { who: 'william', armF: 150, propF: { t: 'helmet', a: 0 }, armFAnim: wave(6, 0.5) } }) +
  horse({ x: 315, y: G, s: 1.2, dir: -1, c: 'blue', far: 'ochre', rider: { who: 'guy', speaker: 'eustace', helmet: 'blue', armF: 110, propF: { t: 'banner', c: 'ochre', cross: true, a: -10 }, armFAnim: jab(8, 0.6) } }),
  { caption: cap ?? 'HIC EST DUX WILELM', seed: 136 }); };

// The bottom border during the battle: while everyone looks up, down here it's the January sales.
const s37 = (cap) => { seed(137);
  const mail = sh(wob([[-16, -86], [16, -86], [20, -40], [6, -40], [0, -50], [-6, -40], [-20, -40]], { j: 0.6 }), 'mail');
  const swords = [0, 1, 2, 3].map((k) => `<g transform="translate(${-4 + k * 3},-60) rotate(${-70 + k * 8})">${ln('M0,0L0,-44', C.grey, 3)}${ln('M-5,-6L5,-6', C.ink, 2.4)}</g>`).join('');
  return card(
    ground() +
    [[300, 'ochre'], [330, 'red'], [360, 'blue']].map(([x, c]) => `<g transform="translate(${x},${G}) scale(.9)">${shield(c, 'dots')}</g>`).join('') +
    fig({ who: 'guy', tunic: 'green', x: 105, armF: 100, armB: 85 }) +
    `<g transform="translate(128,${G - 154}) scale(1.6) translate(0,86)"><g>${mail}${spin(0, -86, [-4, 4, -4], 2.2)}</g></g>` +
    fig({ who: 'cook', apron: false, tunic: 'red', x: 235, armF: 95, armB: 80, pose: 'walk', anim: bob(2, 0.5) }) +
    `<g transform="translate(262,${G - 92})"><g>${swords}${bob(2, 0.5)}</g></g>`,
    { caption: cap ?? 'INFRA: VENDITIO MAGNA', seed: 137 }); };

const s38 = () => { seed(138); return card(
  ground() + fig({ who: 'english', x: 120, s: 1.7, armF: 150, armB: 30, shield: 'ochre', motif: 'dragon', anim: bob(0.4, 4) }) +
  `<g transform="translate(137,${G - 176}) rotate(58)">${ln('M0,0L0,-52', C.ink, 2)}${ln('M-4,-44L0,-54L4,-44', C.ink, 1.6)}${ln('M-3,-6L3,-2M-3,-10L3,-6', C.red, 1.4)}</g>` +
  horse({ x: 285, y: G, s: 1.25, dir: -1, c: 'navy', far: 'grey', gait: 'walk', rider: { who: 'norman', armF: 150, propF: { t: 'sword', a: -30 } } }) +
  figure({ who: 'english', x: 245, y: G, s: 1.45, rot: 40, still: true, shield: 'red' }),
  { caption: 'HIC HAROLD REX INTERFECTUS EST', seed: 138 }); };

const s39 = () => { seed(139); return card(
  ground() + tree({ x: 330, y: G, h: 180 }) +
  fig({ who: 'william', x: 170, s: 1.85, armF: 150, propF: { t: 'banner', c: 'red', cross: true, a: 0 }, armB: 30 }),
  { caption: 'WILLELMUS VICTOR', seed: 139 }); };

// ---------- Chapter VI: the lost ending ----------
const s40 = () => { seed(140);
  const threads = [...Array(16)].map((_, i) => { const x = 236 + i * 10 + rnd() * 6; const c = [C.red, C.ochre, C.green, C.blue][i % 4]; const len = 60 + rnd() * 160; return `<g>${ln(wob([[x, 46], [x + 6, 46 + len * 0.4], [x - 4, 46 + len * 0.7], [x + 3, 46 + len]], { closed: false, j: 2 }), c, 2.2)}${spin(x, 46, [-2, 2, -2], 3 + rnd() * 2)}</g>`; }).join('');
  return card(
    `<g clip-path="url(#fray)">${ground()}${fig({ who: 'william', x: 100, armF: 130, armFAnim: wave(6, 2) })}${fig({ who: 'norman', x: 180, armF: 20 })}</g>` +
    `<clipPath id="fray"><path d="${wob([[0, 0], [230, 0], [240, 80], [222, 160], [244, 240], [226, 330], [238, 420], [228, 500], [0, 500]], { j: 4 })}"/></clipPath>` +
    `<rect x="232" y="46" width="200" height="408" fill="${C.linen2}" opacity=".5"/>` + threads,
    { caption: 'HIC WILLELM', seed: 140 }); };

const s41 = () => { seed(141); return card(
  hall({ x: 200, y: G, w: 280, h: 190, towers: true, c: 'ochre', roof: 'red' }) + ground() + throne(200, G, 1.8) +
  fig({ who: 'william', crown: true, pose: 'sit', x: 200, s: 1.8, armF: 60, propF: { t: 'sceptre', a: 10 }, armB: 50, propB: { t: 'orb' } }) +
  fig({ who: 'stigand', x: 320, dir: -1, s: 1.5, armF: 140 }),
  { caption: 'HIC WILLELM CORON', seed: 141, sketch: true }); };


// ---------- added scenes ----------
// Conan escapes Dol down a rope, while the Normans arrive at the front door.
const s08b = () => {
  const castle = (sd) => { seed(sd); return ground() + motte(295, G, 1.25) + ln(`M247,${G - 120}L247,${G - 4}`, C.ochre, 3); };
  const rider = (x) => horse({ x, y: G, s: 1.05, c: 'blue', far: 'ochre', gait: 'trot', rider: { who: 'norman', armF: 40, propF: { t: 'spear', a: 20 }, shield: 'red' } });
  return { frames: [
    (() => { const b = castle(181); return card(b + rider(60) +
      figure({ who: 'conan', x: 270, y: G - 86, s: 1.2, dir: -1, armF: 60, armFAnim: spin(0, -84, [0, -10, 0], 1.4) }),
      { caption: 'ET VENERUNT AD DOL ET CONAN FUGA VERTIT', seed: 181, capSize: 15 }); })(),
    (() => { const b = castle(182); return card(b + rider(110) +
      `<g transform="translate(247,${G - 130})"><g>${figure({ who: 'conan', x: 8, y: 120, s: 1.1, dir: -1, armF: 175, armB: 165, still: true, legs: 'ochre' })}<animateTransform attributeName="transform" type="translate" values="0 0;0 70;0 70" keyTimes="0;.8;1" dur="3s" repeatCount="indefinite" additive="sum"/>${spin(0, 0, [-6, 6, -6], 0.9)}</g></g>`,
      { caption: 'ET VENERUNT AD DOL ET CONAN FUGA VERTIT', seed: 182, capSize: 15 }); })(),
    (() => { const b = castle(183); return card(b + rider(150) +
      figure({ who: 'conan', x: 215, y: G, s: 1.3, armF: 60, armB: 40, armFAnim: spin(0, -84, [0, -25, 0], 0.5), anim: bob(1.5, 0.6) }),
      { caption: 'ET VENERUNT AD DOL ET CONAN FUGA VERTIT', seed: 183, capSize: 15 }); })(),
  ] };
};

// The funeral procession: the King on his bier, two tiny bell-ringers walking underneath.
const s14b = () => { seed(1414); return card(
  hall({ x: 352, y: G, w: 80, h: 170, towers: false, c: 'ochre', roof: 'red', arches: 1, cock: true }) + ground() +
  [95, 135, 215, 255].map((x, i) => fig({ who: 'cleric', tonsure: false, hair: ['ochre', 'navy', 'red', 'ochre'][i], tunic: ['red', 'green', 'blue', 'ochre'][i], legs: 'navy', robe: false, x, s: 1.35, armF: 165, armB: 150, still: true, anim: bob(1.2, 0.9, 0, i * 0.15) })).join('') +
  `<g>${sh(wob([[60, G - 150], [290, G - 150], [292, G - 140], [58, G - 140]], { j: 0.5, t: 0.3 }), 'ochre')}${sh(wob([[80, G - 152], [110, G - 172], [250, G - 170], [272, G - 152]], { j: 0.8 }), 'red')}${ln('M100,' + (G - 160) + 'L260,' + (G - 160), C.ochre, 2)}${bob(1.2, 0.9)}</g>` +
  [160, 190].map((x, i) => figure({ who: 'turold', x, y: G, s: 0.62, armF: 120, propF: { t: 'bell' }, armFAnim: spin(0, -84, [0, -18, 0, 12, 0], 0.4, `begin="${i * 0.2}s"`) })).join(''),
  { caption: 'HIC PORTATUR CORPUS EADWARDI REGIS AD ECCLESIAM', seed: 1414, capSize: 15 }); };

// The phantom fleet: while Harold hears about the comet, ghost ships drift through the border below.
const s17b = () => { seed(1717);
  const top = border(0, 46, 400, 77);
  let band = `<rect x="0" y="300" width="400" height="200" fill="url(#f-linen)"/>` + ln('M0,302L400,302M0,498L400,498', C.ink, 1.8);
  for (let x = -20; x < 420; x += 130) band += ln(`M${x},494L${x + 40},306`, C[(x / 130) % 2 ? 'red' : 'green'], 6);
  const ghosts = [70, 200, 330].map((x, i) => `<g opacity=".7"><g>${ship({ x, y: 470, s: 0.48, crew: 0, shields: false, sailC: 'grey', still: true })}<animateTransform attributeName="transform" type="translate" values="0 0;6 -4;0 0" dur="${3 + i * 0.6}s" repeatCount="indefinite"/></g><animate attributeName="opacity" values=".15;.75;.15" dur="${4 + i}s" repeatCount="indefinite"/></g>`).join('');
  const ghostStyle = `<style>.ghosts .st{fill:none!important;stroke:${C.navy};stroke-dasharray:3 3;stroke-width:1.4}.ghosts .sl{opacity:.6}</style>`;
  return card(
    ghostStyle + top +
    hall({ x: 300, y: 300, w: 130, h: 150, towers: true, c: 'red', roof: 'blue', arches: 2 }) + ln('M0,300L400,300', C.green, 4) +
    throne(300, 300, 1.25) + figure({ who: 'harold', crown: true, pose: 'sit', x: 300, y: 300, dir: -1, s: 1.25, armF: 40, propB: { t: 'sceptre', a: 0 }, armB: 60 }) +
    figure({ who: 'cleric', x: 200, y: 300, s: 1.2, armF: 125, armFAnim: spin(0, -84, [0, -12, 0], 0.9) }) +
    band + `<g class="ghosts">${ghosts}</g>`,
    { caption: 'HAROLD', seed: 1717, borders: false, capY: 78 }); };

// The ditch: horses and riders going head over heels (the Tapestry really does this).
const s33b = (cap) => { seed(3333);
  const flip = (x, y, rot, c, far, sp) => `<g transform="translate(${x},${y}) rotate(${rot})"><g>${horse({ x: 0, y: 110, s: 0.95, c, far, rider: { who: 'norman', armF: 160, armB: 150, shield: 'red' } })}${spin(0, 0, [rot * 0 - 10, 10, -10], sp)}</g></g>`;
  return card(
    hill(330, G, 260, 80, 'green') + ground() +
    sh(wob([[60, G - 2], [260, G - 2], [250, G + 26], [70, G + 26]], { j: 1 }), 'navy') +
    [300, 345, 385].map((x, i) => figure({ who: 'english', x, y: G - 58 - (i % 2) * 8, s: 1.15, dir: -1, shield: ['ochre', 'red', 'blue'][i], armF: 130, propF: { t: 'axe', a: -20 }, armFAnim: spin(0, -84, [0, -15, 0], 0.9 + i * 0.1) })).join('') +
    flip(110, G - 120, 160, 'ochre', 'red', 1.3) + flip(210, G - 150, 95, 'blue', 'ochre', 1.1),
    { caption: cap ?? 'HIC CECIDERUNT SIMUL ANGLI ET FRANCI IN PRELIO', seed: 3333, capSize: 15 }); };


// The farmer in the border, who is just getting on with it.
const farmScene = (sd, cap, extra = '', sheepN = 2) => { seed(sd); return card(
  extra + ground() + tree({ x: 365, y: G, h: 150, s: 0.9 }) +
  [...Array(sheepN)].map((_, i) => sheep(300 + i * 34, G - 2 - i * 3, 1.1, i ? 1 : -1)).join('') +
  harrow(170, G, 1.1) +
  horse({ x: 245, y: G, s: 1.0, c: 'ochre', far: 'red', saddle: false, gait: 'walk' }) +
  fig({ who: 'farmer', x: 105, s: 1.45, pose: 'walk', armF: 120, propF: { t: 'whip', a: 20 }, armFAnim: spin(0, -84, [0, -12, 0], 1.6), anim: bob(1.2, 0.9) }) +
  fig({ who: 'farmer', speaker: 'slinger', tunic: 'blue', legs: 'red', hair: 'navy', x: 40, s: 1.3, armF: 150, propF: { t: 'sling', a: 0 }, armFAnim: spin(0, -84, [0, -40, 0], 0.45) }) +
  birds(5, 230, 120, 140),
  { caption: cap, seed: sd }); };
const s20b = () => farmScene(2020, 'HIC RUSTICUS ARAT');
const s35b = () => farmScene(3535, 'HIC RUSTICUS ADHUC ARAT',
  `<g opacity=".55">${[60, 110, 160, 210, 260, 310].map((x, i) => horse({ x, y: 205 + (i % 2) * 6, s: 0.32, c: ['blue', 'red', 'ochre'][i % 3], gait: 'gallop', rider: { who: 'norman', armF: 100, propF: { t: 'spear', a: 80 } } })).join('')}${ln('M20,210L380,210', C.sage, 2)}</g>`, 1);

// Sponsored: The Norman. Before and after.
const s21b = () => {
  const headCard = (sd, who, label, extra) => { seed(sd); return card(
    figure({ who, helmet: null, x: 200, y: 640, s: 3.7, armF: 0, armB: 0, anim: bob(2, 2.4), ...extra }) +
    `<text x="200" y="128" text-anchor="middle" font-size="30" class="tcap" fill="${C.red}">${label}</text>`,
    { caption: 'HOMO NORMANNUS', seed: sd }); };
  return { frames: [
    headCard(2121, 'english', 'ANTE', { tunic: 'red', legs: 'red' }),
    headCard(2122, 'norman', 'POST', { tunic: 'red', legs: 'red', dir: -1 }),
  ] };
};

// Farm to fork: the Normans "source" lunch from the locals.
const s27b = () => { seed(2727); return card(
  ground() + tree({ x: 40, y: G, h: 140, s: 0.9 }) +
  fig({ who: 'cook', apron: false, tunic: 'blue', x: 120, s: 1.5, pose: 'walk', armF: 150, armB: 150, anim: bob(1.5, 0.7) }) +
  `<g><g>${sheep(104, G - 134, 1.15, 1, false)}</g>${bob(1.5, 0.7)}</g>` +
  fig({ who: 'guy', tunic: 'red', x: 215, s: 1.5, pose: 'walk', armF: -40, anim: bob(1.5, 0.7, 0, 0.3) }) +
  ln(`M${215 - 26},${G - 100}L170,${G - 18}`, C.ink, 1.4) +
  `<g transform="rotate(-12 160 ${G})">${sheep(160, G, 1.1, -1)}</g>` +
  fig({ who: 'farmer', x: 345, s: 1.45, dir: -1, armF: 150, armFAnim: spin(0, -84, [0, -20, 0], 0.35), anim: bob(1, 0.35) }),
  { caption: 'HIC MILITES FESTINAVERUNT HESTINGA UT CIBUM RAPERENTUR', seed: 2727, capSize: 13 }); };

// The only English archer. Versus thirty-five Norman ones.
const s33c = () => { seed(3434);
  const normans = [30, 70, 110].map((x, i) => figure({ who: 'norman', helmet: i % 2 ? 'ochre' : 'blue', x, y: G - (i % 2) * 6, s: 1.15, armF: 90, propF: { t: 'bow', a: 90 }, armB: -30, anim: bob(1, 1 + i * 0.2) })).join('');
  const volley = [...Array(9)].map((_, i) => `<g transform="translate(${130 + (i % 3) * 18},${200 + i * 9}) rotate(70)">${ln('M0,0L0,-24', C.ink, 1.3)}<animateTransform attributeName="transform" type="translate" values="0 0;150 -20" dur="${0.9 + (i % 4) * 0.15}s" repeatCount="indefinite" additive="sum"/></g>`).join('');
  return card(
    hill(340, G, 240, 60, 'green') + ground() + normans +
    [290, 330, 370].map((x, i) => figure({ who: 'english', x, y: G - 44 - (i % 2) * 6, s: 1.25, dir: -1, shield: ['ochre', 'red', 'blue'][i], armF: 120, propF: { t: 'axe', a: -20 } })).join('') +
    figure({ who: 'archer', x: 240, y: G - 18, s: 0.95, dir: -1, armF: 90, propF: { t: 'bow', a: 90 }, armB: -30, anim: bob(1.5, 0.5), speaker: 'archer' }) +
    volley,
    { caption: 'UNUS SAGITTARIUS ANGLICUS', seed: 3434 }); };

// Chapter title plates.
export function chapterCard(num, title, sub) {
  seed(900 + num);
  return card(
    `<text x="200" y="215" text-anchor="middle" font-size="22" class="tcap" fill="${C.red}">${num}</text>` +
    `<text x="200" y="262" text-anchor="middle" font-size="30" class="tcap" fill="${C.navy}">${title}</text>` +
    `<text x="200" y="300" text-anchor="middle" font-size="15" class="tcap" fill="${C.green}">${sub}</text>` +
    ln(wob([[90, 320], [200, 326], [310, 320]], { closed: false, j: 1 }), C.ochre, 3),
    { seed: 900 + num });
}

export const SCENES = {
  p01: s01, p02: s02, p03: s03, p04: s04, p05: s05, p06: s06, p07: s07, p08: s08, p08b: s08b, p09: s09, p10: s10, p11: s11, p12: s12,
  p13: s13, p14: s14, p14b: s14b, p15: s15, p16: s16, p17: s17, p17b: s17b, p18: s18, p19: s19, p20: s20, p20b: s20b, p21: s21, p21b: s21b, p22: s22,
  p23: s23, p24: s24, p25: s25, p26: s26, p27: s27, p27b: s27b, p28: s28, p29: s29, p30: s30, p31: s31,
  p32: s32, p33: s33, p33b: s33b, p33c: s33c, p34: s34, p35: s35, p35b: s35b, p36: s36, p37: s37, p38: s38, p39: s39, p40: s40, p41: s41,
};

// Get Stitched templates: [scene, sample caption].
export const TEMPLATES = [
  { id: 'feast', name: 'The Feast', scene: s28, sample: 'EATS ALL THE PRAWNS' },
  { id: 'comet', name: 'The Comet', scene: s16, sample: 'SEES A BAD SIGN' },
  { id: 'ship', name: 'The Ship', scene: s23, sample: 'SETS SAIL FOR IKEA' },
  { id: 'horses', name: 'The Horses', scene: s26, sample: 'ARRIVES LATE' },
  { id: 'club', name: "Odo's Club", scene: s35, sample: 'ENCOURAGES THE BOYS' },
  { id: 'throne', name: 'The Throne', scene: s15, sample: 'IS KING OF THE GROUP CHAT' },
  { id: 'quicksand', name: 'The Rescue', scene: s08, sample: 'CARRIES THE TEAM' },
  { id: 'helmet', name: 'The Helmet', scene: s36, sample: 'IS NOT DEAD, JUST TIRED' },
];

// ---------- avatars ----------
export function avatar(acc) {
  const wrap = (inner, vb = '-24 -126 48 48', bg = C.linen) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><rect x="-100" y="-200" width="300" height="300" fill="${bg}"/>${inner}</svg>`;
  seed(acc.length * 31);
  switch (acc) {
    case 'comet': return wrap(comet(8, -8, 0.5), '-24 -24 48 48', C.navy);
    case 'horse': return wrap(`<g transform="translate(-60,96)">${horse({ c: 'sage', saddle: false })}</g>`, '-24 -24 48 48');
    case 'border': return wrap(`<g transform="translate(0,4) scale(1.4)">${sh(wob([[-14, 2], [-4, -6], [8, -6], [14, -12], [16, -4], [10, 2], [12, 10], [6, 10], [4, 4], [-6, 4], [-8, 10], [-12, 10]], { j: 0.6 }), 'red')}</g>`, '-24 -24 48 48');
    case 'news': return wrap(`<rect x="-24" y="-24" width="48" height="48" fill="${C.red}"/><text x="0" y="-2" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}" font-family="Georgia,serif">1066</text><text x="0" y="12" text-anchor="middle" font-size="9" fill="${C.cream}" font-family="Georgia,serif" letter-spacing="1">NEWS</text>`, '-24 -24 48 48');
    case 'hawk': return wrap(`<g transform="scale(2.2) translate(0,6)">${figure({ who: 'harold', still: true }).slice(0, 0)}${sh(wob([[-6, 0], [-4, -10], [2, -16], [7, -13], [6, -6], [9, 4], [2, 2]], { j: 0.4 }), 'navy')}</g>`, '-24 -24 48 48');
    case 'nautical': return wrap(`<g transform="translate(0,10) scale(.16)">${ship({ crew: 0, shields: false, still: true })}</g>`, '-24 -24 48 48');
    case 'conan': return wrap(portrait('conan'));
    case 'farmer': return wrap(portrait('farmer'));
    case 'archer': return wrap(portrait('archer'));
    case 'barber': return wrap(portrait('norman', { helmet: null, tunic: 'red' }));
    case 'motte': return wrap(`<g transform="translate(0,18) scale(.26)">${motte(0, 0, 1)}</g>`, '-24 -24 48 48');
    default: return wrap(portrait(acc));
  }
}
