// The stitch art kit. Every function returns an SVG string.
// Figures face right; pass dir:-1 to mirror. Local origin is at the feet.

export const C = {
  linen: '#eadfc4', linen2: '#ddcfae',
  red: '#b4513a', ochre: '#d3a24a', cream: '#e6cf8f', sage: '#8c9a5a', green: '#3e6a58',
  blue: '#3c5180', navy: '#283149', grey: '#a6ad90', skin: '#efe2c6', white: '#f4ecd8',
  ink: '#2b2f3c',
};
const FILLS = ['red', 'ochre', 'cream', 'sage', 'green', 'blue', 'navy', 'grey', 'skin', 'white'];

// ---------- seeded randomness so every scene renders identically ----------
let _s = 1;
export function seed(n) { _s = n >>> 0 || 1; }
export function rnd() {
  _s |= 0; _s = (_s + 0x6d2b79f5) | 0;
  let t = Math.imul(_s ^ (_s >>> 15), 1 | _s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const jit = (j) => (rnd() - 0.5) * 2 * j;
const f1 = (n) => Math.round(n * 10) / 10;

// ---------- wobbly hand-stitched paths ----------
export function wob(pts, { j = 0.7, closed = true, t = 0.85 } = {}) {
  const p = pts.map(([x, y]) => [x + jit(j), y + jit(j)]);
  const n = p.length;
  if (n < 2) return '';
  const at = (i) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f1(p[0][0])},${f1(p[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * t, p1[1] + ((p2[1] - p0[1]) / 6) * t];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * t, p2[1] - ((p3[1] - p1[1]) / 6) * t];
    d += `C${f1(c1[0])},${f1(c1[1])} ${f1(c2[0])},${f1(c2[1])} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}
export function oval(cx, cy, rx, ry, n = 12, j = 0.5) {
  const pts = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return wob(pts, { j });
}
// A filled, stitched shape.
export const sh = (d, fill, extra = '') => `<path d="${d}" fill="url(#f-${fill})" class="st" ${extra}/>`;
// An outline-only stitched line.
export const ln = (d, color = C.ink, w = 1.8, extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" class="sl" ${extra}/>`;
const g = (inner, attrs = '') => `<g ${attrs}>${inner}</g>`;

// SMIL rotation about a local pivot (combines with any static transform).
export function spin(cx, cy, vals, dur = 2, extra = '') {
  const v = vals.map((a) => `${a} ${cx} ${cy}`).join(';');
  return `<animateTransform attributeName="transform" type="rotate" values="${v}" dur="${dur}s" repeatCount="indefinite" additive="sum" calcMode="spline" keySplines="${vals.slice(1).map(() => '.45 0 .55 1').join(';')}" ${extra}/>`;
}
export function bob(dy = 2, dur = 2.4, dx = 0, begin = 0) {
  return `<animateTransform attributeName="transform" type="translate" values="0 0;${dx} ${-dy};0 0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" additive="sum" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>`;
}

// ---------- shared defs: thread fills, linen, mail ----------
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))));
  return '#' + ch.map((v) => v.toString(16).padStart(2, '0')).join('');
}
export function defs() {
  const fills = FILLS.map((k) => {
    const c = C[k];
    return `<pattern id="f-${k}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
      <rect width="5" height="5" fill="${c}"/>
      <path d="M0.8 0V5" stroke="${shade(c, -0.22)}" stroke-width="1" opacity=".55"/>
      <path d="M3.2 0V5" stroke="${shade(c, 0.18)}" stroke-width=".8" opacity=".6"/>
    </pattern>`;
  }).join('');
  return `<defs>${fills}
    <pattern id="f-mail" width="5" height="5" patternUnits="userSpaceOnUse">
      <rect width="5" height="5" fill="${C.grey}"/>
      <circle cx="2.5" cy="2.5" r="1.5" fill="none" stroke="${C.navy}" stroke-width=".7" opacity=".7"/>
    </pattern>
    <pattern id="f-linen" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="${C.linen}"/>
      <path d="M0 1.5H6M0 4.5H6" stroke="${C.linen2}" stroke-width=".7" opacity=".7"/>
      <path d="M1.5 0V6M4.5 0V6" stroke="#fff" stroke-width=".5" opacity=".35"/>
    </pattern>
    <pattern id="f-sea" width="40" height="14" patternUnits="userSpaceOnUse">
      <rect width="40" height="14" fill="${C.blue}"/>
      <path d="M0 7Q10 1 20 7T40 7" fill="none" stroke="${C.green}" stroke-width="2.4"/>
      <path d="M0 12Q10 6 20 12T40 12" fill="none" stroke="${shade(C.blue, 0.3)}" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow"><stop offset="0" stop-color="#fff6d0" stop-opacity=".9"/><stop offset="1" stop-color="#fff6d0" stop-opacity="0"/></radialGradient>
  </defs>`;
}
export const STYLE = `<style>
  .st{stroke:${C.ink};stroke-width:1.7;stroke-dasharray:4.2 1.1;stroke-linecap:round;stroke-linejoin:round}
  .sl{stroke-dasharray:4.2 1.1;stroke-linecap:round;stroke-linejoin:round}
  .tcap{font-family:'IM Fell English SC',Georgia,serif;letter-spacing:2px}
  .has-en{cursor:help}
</style>`;

// ---------- characters ----------
// Look presets for the cast. Anything here can be overridden per use.
export const CAST = {
  harold: { tunic: 'red', legs: 'blue', hair: 'ochre', moustache: true },
  william: { tunic: 'green', legs: 'red', hair: 'navy', norman: true },
  odo: { tunic: 'blue', legs: 'ochre', hair: 'navy', norman: true, mitre: true, robe: true },
  edward: { tunic: 'blue', legs: 'red', hair: 'white', beard: 'white', crown: true, robe: true, cloak: 'red' },
  guy: { tunic: 'ochre', legs: 'green', hair: 'red', norman: true, moustache: true },
  turold: { tunic: 'ochre', legs: 'red', hair: 'red', short: true },
  aelfgyva: { tunic: 'green', legs: 'green', hood: 'ochre', robe: true },
  cleric: { tunic: 'ochre', legs: 'navy', hair: 'navy', tonsure: true, robe: true },
  cook: { tunic: 'sage', legs: 'red', hair: 'ochre', norman: true, apron: true },
  norman: { tunic: 'mail', legs: 'mail', hair: 'navy', norman: true, helmet: 'blue' },
  english: { tunic: 'mail', legs: 'mail', hair: 'ochre', moustache: true, helmet: 'ochre' },
  stigand: { tunic: 'cream', legs: 'navy', hair: 'grey', robe: true, mitre: true, tonsure: true },
  conan: { tunic: 'red', legs: 'ochre', hair: 'ochre', moustache: true },
  farmer: { tunic: 'sage', legs: 'ochre', hair: 'ochre', moustache: true, garters: false },
  archer: { tunic: 'ochre', legs: 'red', hair: 'ochre', moustache: true },
};

function head(o) {
  const hair = o.hair || 'ochre';
  let s = '';
  // neck
  s += sh(wob([[1, -92], [8, -92], [8, -86], [1, -86]], { j: 0.3 }), 'skin');
  // head with nose bump
  s += sh(wob([[-7, -104], [-4, -112], [4, -114], [11, -110], [14, -103], [17, -100], [14, -98], [13, -93], [6, -90], [-3, -92], [-8, -98]], { j: 0.4 }), 'skin');
  // eye
  s += `<circle cx="${f1(9 + jit(0.3))}" cy="-103" r="1.3" fill="${C.ink}"/>`;
  if (o.hood) {
    s += sh(wob([[-10, -100], [-6, -115], [5, -118], [13, -112], [12, -106], [5, -109], [-2, -104], [-2, -92], [-10, -86]], { j: 0.4 }), o.hood);
  } else if (o.norman) {
    // shaved back of head, hair only on top-front
    s += sh(wob([[-3, -110], [4, -115], [11, -112], [13, -106], [6, -108], [-1, -106]], { j: 0.3 }), hair);
    s += ln(wob([[-6, -104], [-7, -98]], { closed: false, j: 0.3 }), C.ink, 1, 'opacity=".5"');
  } else if (o.tonsure) {
    s += sh(wob([[-8, -100], [-6, -108], [-3, -110], [-2, -104], [-4, -96]], { j: 0.3 }), hair);
    s += sh(wob([[9, -112], [13, -108], [12, -105], [8, -108]], { j: 0.3 }), hair);
  } else {
    s += sh(wob([[-9, -96], [-7, -108], [0, -115], [9, -114], [13, -108], [6, -108], [0, -104], [-2, -96], [-5, -90]], { j: 0.4 }), hair);
  }
  if (o.moustache) s += sh(wob([[12, -96], [17, -96], [15, -91], [13, -93], [10, -91]], { j: 0.3 }), o.hair === 'white' ? 'white' : hair);
  if (o.beard) s += sh(wob([[6, -93], [14, -95], [14, -88], [10, -80], [7, -84], [3, -88]], { j: 0.4 }), o.beard);
  if (o.helmet) {
    s += sh(wob([[-10, -103], [-6, -114], [4, -124], [12, -114], [16, -103], [3, -106]], { j: 0.4 }), o.helmet);
    s += sh(wob([[13, -106], [16, -106], [15, -94], [13, -94]], { j: 0.2 }), o.helmet);
  }
  if (o.crown) {
    s += sh(wob([[-6, -110], [-6, -120], [-2, -116], [2, -123], [6, -116], [10, -122], [11, -110], [2, -108]], { j: 0.3, t: 0.3 }), 'ochre');
  }
  if (o.mitre) {
    s += sh(wob([[-7, -109], [-4, -124], [2, -119], [8, -126], [12, -110], [3, -107]], { j: 0.3, t: 0.4 }), o.mitreColor || 'cream');
    s += ln(`M2,-108 L2,-120`, C.red, 1.4);
  }
  return s;
}

// Arm: pivot at shoulder (0,-84), hangs down, `a` = degrees swung forward (90 = pointing ahead).
function arm(o, a, prop, front, anim) {
  const sleeve = o.tunic === 'mail' ? 'mail' : o.tunic;
  let s = sh(wob([[-4, -86], [4, -86], [4.5, -70], [3, -58], [-3, -58], [-4.5, -70]], { j: 0.3 }), sleeve);
  s += sh(oval(0, -56, 3.6, 3.6, 8, 0.2), 'skin');
  if (prop) s += `<g transform="translate(0,-56) rotate(${a + (prop.a || 0)})">${PROPS[prop.t](prop)}</g>`;
  return `<g transform="rotate(${-a} 0 -84)">${s}${anim || ''}</g>`;
}

// Prop library. Origin = grip point, "up" is -y.
export const PROPS = {
  spear: (p) => ln(`M0,${p.len ? p.len * 0.3 : 26}L0,${-(p.len || 90)}`, C.ink, 2) + sh(wob([[0, -(p.len || 90) - 12], [4, -(p.len || 90) + 1], [-4, -(p.len || 90) + 1]], { j: 0.3, t: 0.2 }), 'grey') + (p.pennon ? sh(wob([[0, -(p.len || 90) + 4], [22, -(p.len || 90) + 8], [10, -(p.len || 90) + 12], [20, -(p.len || 90) + 16], [0, -(p.len || 90) + 18]], { j: 0.4, t: 0.3 }), p.pennon) : ''),
  sword: () => sh(wob([[-1.6, -2], [1.6, -2], [1.2, -40], [0, -44], [-1.2, -40]], { j: 0.2, t: 0.2 }), 'grey') + ln('M-6,-3L6,-3', C.ink, 2.4) + `<circle cx="0" cy="5" r="2.4" fill="${C.ochre}" stroke="${C.ink}" stroke-width="1"/>`,
  club: () => sh(wob([[-1.5, 8], [1.5, 8], [3, -20], [6, -28], [4, -36], [-2, -38], [-5, -30], [-3, -20]], { j: 0.5 }), 'ochre') + `<circle cx="3" cy="-30" r="1.4" fill="${C.ink}"/><circle cx="-2" cy="-24" r="1.2" fill="${C.ink}"/>`,
  axe: () => ln('M0,22L0,-60', C.ink, 2.2) + sh(wob([[0, -60], [14, -66], [17, -52], [13, -46], [0, -50]], { j: 0.3, t: 0.4 }), 'grey'),
  sceptre: () => ln('M0,10L0,-44', C.ink, 2) + sh(wob([[0, -54], [5, -46], [0, -42], [-5, -46]], { j: 0.2, t: 0.3 }), 'ochre'),
  orb: () => sh(oval(0, -6, 5, 5, 10, 0.2), 'ochre') + ln('M0,-11L0,-17M-3,-14L3,-14', C.ink, 1.5),
  crozier: () => ln('M0,20L0,-62', C.ink, 2) + ln(wob([[0, -62], [2, -70], [9, -71], [10, -64], [5, -62]], { closed: false, j: 0.2 }), C.ochre, 2.6),
  hawk: () => `<g transform="translate(-2,-4)">${sh(wob([[-6, 0], [-4, -10], [2, -16], [7, -13], [6, -6], [9, 4], [2, 2]], { j: 0.4 }), 'navy')}<circle cx="4" cy="-13" r="1" fill="${C.cream}"/>${sh(wob([[8, -13], [11, -12], [8, -10]], { j: 0.1, t: 0.2 }), 'ochre')}</g>`,
  keys: () => ln('M0,0L60,-6', C.ink, 2) + sh(oval(60, 3, 3, 3, 8, 0.2), 'ochre') + ln('M60,6L60,16M60,12L64,12M60,15L63,15', C.ochre, 1.8),
  spade: () => ln('M0,12L0,-30', C.ink, 2) + sh(wob([[-6, -30], [6, -30], [5, -44], [-5, -44]], { j: 0.3, t: 0.3 }), 'grey'),
  skewer: () => ln('M0,6L0,-46', C.ink, 1.6) + [-14, -24, -34].map((y) => sh(oval(0, y, 5, 4, 8, 0.6), 'red')).join(''),
  bell: () => sh(wob([[-6, 0], [6, 0], [4, -10], [0, -13], [-4, -10]], { j: 0.2, t: 0.4 }), 'ochre') + `<circle cx="0" cy="2" r="1.6" fill="${C.ink}"/>`,
  horn: () => sh(wob([[0, 0], [16, -10], [22, -8], [22, -16], [14, -16], [-2, -4]], { j: 0.3 }), 'cream'),
  cup: () => sh(wob([[-5, -16], [5, -16], [3, -8], [1, -8], [1, 0], [4, 1], [-4, 1], [-1, 0], [-1, -8], [-3, -8]], { j: 0.2, t: 0.3 }), 'ochre'),
  banner: (p) => ln('M0,22L0,-80', C.ink, 2) + sh(wob([[0, -80], [26, -77], [20, -70], [30, -66], [18, -62], [0, -60]], { j: 0.4, t: 0.3 }), p.c || 'red') + (p.cross ? ln('M8,-76L8,-64M3,-70L14,-70', C.cream, 1.6) : ''),
  torch: () => ln('M0,8L0,-28', C.ink, 2.2) + sh(wob([[0, -28], [6, -36], [3, -40], [5, -48], [-1, -40], [-5, -36]], { j: 0.6 }), 'ochre'),
  shovel: () => PROPS.spade(),
  helmet: () => `<g transform="translate(0,-4)">${sh(wob([[-10, 0], [-6, -11], [3, -20], [11, -10], [15, 0], [3, -3]], { j: 0.4 }), 'blue')}</g>`,
  scroll: () => sh(wob([[-2, -2], [16, -6], [18, 4], [0, 8]], { j: 0.3, t: 0.3 }), 'white') + ln('M3,1L14,-1M4,4L13,2', C.ink, 0.8),
  arrow: () => ln('M0,0L0,-30', C.ink, 1.4) + ln('M-3,-26L0,-32L3,-26', C.ink, 1.4),
  bow: () => ln('M0,-28Q18,0 0,28', C.red, 3) + ln('M0,-28L-8,0L0,28', C.ink, 0.9) + ln('M-8,0L30,0', C.ink, 1.3) + ln('M26,-3L31,0L26,3', C.ink, 1.3),
  sling: () => ln('M0,0Q10,-12 4,-24', C.ink, 1.1) + `<circle cx="4" cy="-25" r="2.6" fill="${C.grey}" stroke="${C.ink}" stroke-width=".8"/>`,
  whip: () => ln('M0,8L0,-30', C.ink, 1.8) + ln('M0,-30Q14,-40 26,-28', C.ink, 1),
  none: () => '',
};

export function sheep(x, y, s = 1, dir = 1, bobbing = true) {
  const body = sh(wob([[-18, -14], [-12, -24], [-2, -27], [10, -25], [18, -18], [17, -8], [6, -5], [-8, -5], [-17, -8]], { j: 1.2 }), 'white');
  const head = sh(wob([[16, -22], [24, -26], [30, -20], [26, -14], [18, -15]], { j: 0.4 }), 'navy');
  const legs = ln('M-10,-6L-11,0M-4,-6L-3,0M6,-6L5,0M12,-6L13,0', C.navy, 2.2);
  return `<g transform="translate(${x},${y}) scale(${dir * s},${s})"><g>${legs}${body}${head}<circle cx="25" cy="-21" r="1" fill="${C.white}"/>${bobbing ? bob(1, 0.9) : ''}</g></g>`;
}
export function birds(n, x, y, spread = 120) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const bx = x + rnd() * spread, by = y + rnd() * 50, d = (1.4 + rnd()).toFixed(2);
    s += `<g transform="translate(${bx | 0},${by | 0})"><g>${ln('M-6,0Q-3,-4 0,0Q3,-4 6,0', C.navy, 1.6)}<animateTransform attributeName="transform" type="translate" values="0 0;${(40 + rnd() * 40) | 0} -${(20 + rnd() * 20) | 0};0 0" dur="${d * 3}s" repeatCount="indefinite"/></g></g>`;
  }
  return s;
}
export function harrow(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">${sh(wob([[-30, -14], [30, -14], [30, -6], [-30, -6]], { j: 0.4, t: 0.3 }), 'ochre')}${[-24, -12, 0, 12, 24].map((tx) => ln(`M${tx},-6L${tx - 2},2`, C.ink, 2)).join('')}${ln('M30,-12L70,-40', C.ink, 1.6)}</g>`;
}

// ---------- more scenery ----------
export function dog(x, y, s = 1, c = 'red', dir = 1, run = true) {
  const l = (lx, d) => `<g>${ln(`M${lx},-10L${lx + d},0`, C[c], 3)}${run ? spin(lx, -10, [20, -20, 20], 0.45) : ''}</g>`;
  const body = sh(wob([[-16, -14], [-4, -18], [10, -16], [16, -24], [22, -22], [24, -16], [16, -12], [10, -8], [-12, -8], [-20, -16], [-26, -22], [-22, -12]], { j: 0.5 }), c);
  return `<g transform="translate(${x},${y}) scale(${dir * s},${s})"><g>${l(-12, -4)}${l(8, 4)}${body}<circle cx="19" cy="-20" r="1" fill="${C.ink}"/>${l(-8, 4)}${l(12, -4)}${run ? bob(2, 0.45) : ''}</g></g>`;
}
export function table(x, y, w = 160, c = 'ochre', curved = false) {
  const top = curved
    ? wob([[-w / 2, -50], [-w / 4, -42], [w / 4, -42], [w / 2, -50], [w / 2, -40], [w / 4, -32], [-w / 4, -32], [-w / 2, -40]], { j: 0.5 })
    : wob([[-w / 2, -50], [w / 2, -50], [w / 2, -42], [-w / 2, -42]], { j: 0.4, t: 0.3 });
  return `<g transform="translate(${x},${y})">${sh(top, 'white')}${ln(`M${-w / 2 + 12},-40L${-w / 2 + 14},0M${w / 2 - 12},-40L${w / 2 - 14},0`, C[c], 4)}</g>`;
}
export function bed(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">${sh(wob([[-60, -30], [60, -30], [64, -18], [-64, -18]], { j: 0.4, t: 0.3 }), 'blue')}${ln('M-56,-18L-58,0M56,-18L58,0', C.ochre, 4)}${sh(wob([[-70, -50], [-60, -50], [-58, -18], [-68, -18]], { j: 0.3, t: 0.3 }), 'ochre')}${sh(wob([[60, -42], [70, -42], [68, -18], [58, -18]], { j: 0.3, t: 0.3 }), 'ochre')}</g>`;
}
export function blanket(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">${sh(wob([[-50, -30], [-20, -44], [40, -42], [54, -32], [50, -26], [-50, -26]], { j: 0.6 }), 'red')}</g>`;
}
export function reliquary(x, y, s = 1, c = 'ochre') {
  return `<g transform="translate(${x},${y}) scale(${s})">${ln('M-12,-40L-14,0M12,-40L14,0', C.ink, 3)}${sh(wob([[-18, -40], [18, -40], [18, -64], [0, -78], [-18, -64]], { j: 0.4, t: 0.3 }), c)}${[[-8, -56], [8, -56], [0, -66]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="2.4" fill="${C.red}"/>`).join('')}${ln('M0,-78L0,-86M-4,-82L4,-82', C.ink, 1.6)}</g>`;
}
export function cart(x, y, s = 1, load = 'barrels') {
  let l = '';
  if (load === 'barrels') l = [-26, 0, 26].map((bx) => sh(wob([[bx - 11, -46], [bx + 11, -46], [bx + 13, -64], [bx + 11, -82], [bx - 11, -82], [bx - 13, -64]], { j: 0.4 }), 'ochre') + ln(`M${bx - 12},-58L${bx + 12},-58M${bx - 12},-70L${bx + 12},-70`, C.red, 2)).join('');
  return `<g transform="translate(${x},${y}) scale(${s})">${l}${sh(wob([[-46, -46], [46, -46], [42, -32], [-42, -32]], { j: 0.4, t: 0.3 }), 'red')}${ln('M46,-40L80,-50', C.ink, 3)}<g transform="translate(-24,-16)">${sh(oval(0, 0, 15, 15, 12, 0.5), 'ochre')}${ln('M-13,0L13,0M0,-13L0,13', C.ink, 1.6)}${spin(0, 0, [0, 360], 2.5).replace('calcMode="spline"', 'calcMode="linear"').replace(/keySplines="[^"]*"/, '')}</g><g transform="translate(24,-16)">${sh(oval(0, 0, 15, 15, 12, 0.5), 'ochre')}${ln('M-13,0L13,0M0,-13L0,13', C.ink, 1.6)}</g></g>`;
}
export function cauldron(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">${ln('M-26,0L-20,-60L20,-60L26,0', C.ink, 3)}${ln('M0,-60L0,-46', C.ink, 2)}${sh(wob([[-18, -46], [18, -46], [16, -28], [0, -22], [-16, -28]], { j: 0.4 }), 'navy')}<g opacity=".7">${ln('M-6,-50Q-12,-62 -4,-72T-6,-92', C.grey, 2)}${bob(4, 2)}</g></g>`;
}
export function hill(x, y, w = 200, h = 80, c = 'sage') {
  return sh(wob([[x - w / 2, y], [x - w / 4, y - h * 0.7], [x, y - h], [x + w / 4, y - h * 0.7], [x + w / 2, y]], { j: 1, t: 0.7 }), c);
}
export function motte(x, y, s = 1, keep = true) {
  let k = '';
  if (keep) k = sh(wob([[-30, -70], [30, -70], [30, -126], [-30, -126]], { j: 0.5, t: 0.2 }), 'ochre') + [-20, -6, 8, 22].map((px) => ln(`M${px},-72L${px},-124`, C.red, 1.4, 'opacity=".6"')).join('') + sh(wob([[-36, -126], [36, -126], [0, -150]], { j: 0.4, t: 0.2 }), 'red');
  return `<g transform="translate(${x},${y}) scale(${s})">${k}${sh(wob([[-90, 0], [-50, -40], [-30, -70], [30, -70], [50, -40], [90, 0]], { j: 1, t: 0.6 }), 'sage')}${ln('M-60,-30L60,-30M-40,-52L40,-52', C.green, 2.4)}</g>`;
}
export function doorway(x, y, s = 1, c = 'blue') {
  return `<g transform="translate(${x},${y}) scale(${s})">${sh(wob([[-56, 0], [-56, -150], [0, -190], [56, -150], [56, 0], [44, 0], [44, -144], [0, -176], [-44, -144], [-44, 0]], { j: 0.6, t: 0.3 }), c)}${sh(wob([[-62, -150], [0, -196], [62, -150], [62, -160], [0, -206], [-62, -160]], { j: 0.5, t: 0.3 }), 'red')}</g>`;
}
export function handOfGod(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">${sh(wob([[-40, -10], [-20, -24], [20, -24], [40, -10], [30, 0], [-30, 0]], { j: 0.8 }), 'blue')}${sh(wob([[-5, -2], [5, -2], [6, 18], [10, 30], [4, 34], [-2, 28], [-6, 20]], { j: 0.4 }), 'skin')}${ln('M-3,22L-3,34M0,24L1,36', C.ink, 1.2)}${bob(3, 3)}</g>`;
}
export function stars(n = 18, y0 = 60, y1 = 300) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = 20 + rnd() * 360, y = y0 + rnd() * (y1 - y0);
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1 + rnd() * 1.5)}" fill="${C.cream}"><animate attributeName="opacity" values="1;.3;1" dur="${f1(1.5 + rnd() * 2)}s" repeatCount="indefinite"/></circle>`;
  }
  return s;
}
// Stitched England for the run-tracker posts. Returns [svg, places].
export const PLACES = { york: [236, 205], stamford: [246, 200], london: [284, 342], hastings: [286, 374], pevensey: [276, 378], bosham: [236, 376] };
export function england(route = []) {
  let s = sh(wob([[176, 64], [214, 58], [222, 96], [205, 100], [186, 122], [168, 110], [150, 84]], { j: 1, t: 0.7 }), 'grey');
  s += sh(wob([[205, 100], [225, 130], [240, 165], [256, 194], [248, 214], [266, 234], [300, 268], [318, 290], [310, 318], [296, 334], [306, 350], [298, 372], [270, 382], [235, 384], [200, 392], [165, 402], [126, 422], [140, 400], [170, 380], [185, 362], [165, 344], [140, 332], [150, 306], [166, 282], [150, 262], [170, 248], [190, 244], [186, 214], [180, 182], [176, 150], [186, 122]], { j: 1.2, t: 0.6 }), 'sage');
  s += `<text x="236" y="222" font-size="11" class="tcap" fill="${C.navy}" text-anchor="middle">EBORACUM</text><text x="284" y="330" font-size="11" class="tcap" fill="${C.navy}" text-anchor="end">LUNDONIA</text>`;
  if (route.length) {
    const pts = route.map((k) => PLACES[k]);
    s += ln(wob(pts, { closed: false, j: 1.5 }), C.red, 4, 'stroke-dasharray="7 4" class="route"');
  }
  for (const k of new Set(route)) { const [x, y] = PLACES[k]; s += `<circle cx="${x}" cy="${y}" r="5" fill="${C.ochre}" stroke="${C.ink}" stroke-width="1.6"/>`; }
  return s;
}

// Kite shield, worn at the chest (drawn in front of the body).
export function shield(c = 'ochre', motif = 'cross') {
  let s = sh(wob([[0, -86], [14, -84], [16, -68], [8, -44], [0, -36], [-8, -44], [-16, -68], [-14, -84]], { j: 0.4, t: 0.5 }), c);
  if (motif === 'cross') s += ln('M0,-82L0,-42M-12,-70L12,-70', C.ink, 1.4);
  if (motif === 'dots') s += [[-6, -72], [6, -72], [0, -58], [0, -78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${C.ink}"/>`).join('');
  if (motif === 'dragon') s += ln(wob([[-8, -60], [-2, -74], [6, -66], [2, -56], [8, -48]], { closed: false, j: 0.5 }), C.red, 2.2);
  s += `<circle cx="0" cy="-68" r="2.6" fill="${C.ochre}" stroke="${C.ink}" stroke-width=".9"/>`;
  return s;
}

/**
 * A puppet figure.
 * opts: who (cast preset), x, y, dir, s (scale), pose ('stand'|'walk'|'sit'|'ride'|'kneel'),
 * armF / armB (degrees forward), propF / propB ({t:'spear',...}), shield, anim (string of extra
 * SMIL to apply to whole figure), armFAnim / armBAnim (SMIL for the arms), cls, id, who-attr for speaking.
 */
export function figure(opts) {
  const o = { ...(CAST[opts.who] || {}), ...opts };
  const pose = o.pose || 'stand';
  const tunic = o.tunic, legs = o.legs || 'blue';
  const robeHem = o.robe ? -6 : -42;
  let body = '';

  // legs
  if (pose === 'sit') {
    body += sh(wob([[-6, -50], [16, -52], [20, -46], [20, -4], [26, -2], [26, 2], [14, 2], [14, -40], [-6, -42]], { j: 0.4, t: 0.4 }), legs);
  } else if (pose === 'ride') {
    body += sh(wob([[-4, -48], [6, -48], [14, -30], [10, -10], [17, -7], [16, -3], [5, -5], [6, -28], [-4, -40]], { j: 0.4, t: 0.4 }), legs);
  } else if (pose === 'kneel') {
    body += sh(wob([[-6, -30], [6, -30], [16, -10], [14, 0], [-22, 0], [-22, -6], [4, -8], [-6, -18]], { j: 0.4, t: 0.4 }), legs);
  } else {
    const stride = pose === 'walk' ? 10 : 5;
    const shoe = (x) => sh(wob([[x - 3, -6], [x + 3, -6], [x + 10, -2], [x + 9, 1], [x - 3, 1]], { j: 0.3, t: 0.3 }), o.shoes || 'navy');
    if (!o.robe) {
      body += sh(wob([[-6, -46], [-1, -46], [-stride + 2, -6], [-stride - 3, -6]], { j: 0.3, t: 0.3 }), legs) + shoe(-stride);
      body += sh(wob([[1, -46], [6, -46], [stride + 3, -6], [stride - 2, -6]], { j: 0.3, t: 0.3 }), legs) + shoe(stride);
      if (o.garters !== false && legs !== 'mail') body += ln(`M${-stride + 1},-30L${-stride + 3},-22M${-stride},-22L${-stride + 2},-14M${stride - 1},-30L${stride + 1},-22M${stride},-22L${stride + 2},-14`, C.ink, 0.9, 'opacity=".6"');
    } else {
      body += shoe(-4) + shoe(6);
    }
  }

  // back arm
  const armB = arm(o, o.armB ?? 8, o.propB, false, o.armBAnim);

  // cloak behind
  let cloak = '';
  if (o.cloak) cloak = sh(wob([[-8, -88], [6, -88], [2, -60], [-6, -30], [-20, -34], [-16, -60]], { j: 0.5 }), o.cloak);

  // tunic / robe / mail
  const tf = tunic === 'mail' ? 'mail' : tunic;
  let tun;
  if (pose === 'ride' || pose === 'sit') {
    tun = sh(wob([[-10, -88], [10, -88], [10, -62], [14, -46], [-12, -44], [-10, -62]], { j: 0.4, t: 0.5 }), tf);
  } else if (tunic === 'mail') {
    tun = sh(wob([[-10, -88], [10, -88], [10, -62], [14, -40], [6, -40], [1, -48], [-4, -40], [-13, -40], [-10, -62]], { j: 0.4, t: 0.5 }), 'mail');
  } else {
    tun = sh(wob([[-10, -88], [10, -88], [10, -62], [19 + (o.robe ? 2 : 0), robeHem], [-18 - (o.robe ? 2 : 0), robeHem], [-10, -62]], { j: 0.5, t: 0.5 }), tf);
    if (!o.robe) tun += ln(`M-17,${robeHem + 3}L18,${robeHem + 3}`, C.ink, 1, 'opacity=".5"');
  }
  tun += ln('M-10,-63L10,-63', o.belt ? C[o.belt] : C.ink, 1.6, 'opacity=".75"');
  if (o.apron) tun += sh(wob([[2, -66], [14, -64], [17, -40], [4, -40]], { j: 0.4 }), 'white');

  const sh_ = o.shield ? shield(o.shield, o.motif) : '';
  const armF = arm(o, o.armF ?? 14, o.propF, true, o.armFAnim);
  const hd = `<g class="head">${head(o)}${o.headAnim || ''}</g>`;

  const up = (s) => (pose === 'kneel' ? `<g transform="translate(0,18)">${s}</g>` : s);
  const inner = up(cloak + armB) + body + up(tun + hd + sh_ + armF);
  const s = (o.s || 1) * (o.short ? 0.82 : 1);
  const tr = `translate(${o.x || 0},${o.y || 0}) scale(${(o.dir || 1) * s},${s})`;
  const who = o.speaker ? `data-who="${o.speaker}"` : (opts.who && CAST[opts.who] ? `data-who="${opts.who}"` : '');
  const idle = o.anim ?? (o.still ? '' : bob(0.7, 2.4 + rnd() * 1.2, 0, -rnd() * 2));
  const rot = o.rot ? ` rotate(${o.rot} 0 -50)` : '';
  return `<g transform="${tr}${rot}" class="fig ${o.cls || ''}" ${who}><g>${inner}${idle}</g></g>`;
}

// Head-and-shoulders portrait for avatars (viewBox -24 -126 48 48).
export function portrait(who, extra = {}) {
  seed(who.length * 97 + 7);
  const o = { ...(CAST[who] || {}), ...extra };
  return head(o) + sh(wob([[-14, -88], [16, -88], [20, -70], [-18, -70]], { j: 0.4 }), o.tunic === 'mail' ? 'mail' : o.tunic || 'red');
}

// ---------- horses ----------
export function horse(opts) {
  const o = { c: 'ochre', far: null, gait: 'walk', ...opts };
  const c = o.c, far = o.far || (c === 'ochre' ? 'red' : 'ochre');
  const leg = (x, top, dx, col, ph) => {
    const l = sh(wob([[x - 3, top], [x + 3, top], [x + 2 + dx, -6], [x + 5 + dx, -1], [x - 3 + dx, -1], [x - 3 + dx, -6]], { j: 0.3, t: 0.4 }), col);
    if (o.gait === 'gallop') return `<g>${l}${spin(x, top, [ph, -ph, ph], 0.5)}</g>`;
    if (o.gait === 'trot') return `<g>${l}${spin(x, top, [ph * 0.5, -ph * 0.5, ph * 0.5], 0.8)}</g>`;
    return l;
  };
  const g1 = o.gait === 'gallop';
  let s = '';
  s += leg(-28, -46, g1 ? -10 : -4, far, 18) + leg(26, -46, g1 ? 10 : 4, far, -18);
  // tail
  s += sh(wob([[-38, -64], [-48, -60], [-54, -40], [-50, -28], [-46, -44], [-40, -54]], { j: 0.6 }), far);
  // body
  s += sh(wob([[-40, -66], [-26, -74], [10, -74], [32, -72], [40, -62], [36, -48], [10, -44], [-26, -44], [-40, -52]], { j: 0.6 }), c);
  // neck + head
  s += sh(wob([[26, -72], [38, -96], [48, -110], [56, -108], [66, -88], [70, -80], [64, -76], [54, -88], [46, -80], [40, -64]], { j: 0.5, t: 0.6 }), c);
  s += sh(wob([[46, -110], [48, -118], [52, -110]], { j: 0.2, t: 0.2 }), c);
  s += `<circle cx="56" cy="-100" r="1.4" fill="${C.ink}"/>`;
  // mane
  s += ln(wob([[30, -78], [36, -94], [44, -106]], { closed: false, j: 0.4 }), C[far], 3.2);
  // bridle + reins
  s += ln(`M50,-102L62,-84M44,-92L62,-90`, C.ink, 1.1, 'opacity=".8"');
  // The Tapestry's stallions are, famously, drawn in full. Small and stylised, as stitched.
  if (o.stallion) s += sh(wob([[-6, -46], [5, -46], [7, -36], [3, -30], [-2, -34]], { j: 0.25, t: 0.4 }), far);
  s += leg(-20, -46, g1 ? 12 : 4, c, -20) + leg(30, -46, g1 ? -8 : -3, c, 20);
  // saddle cloth
  if (o.saddle !== false) s += sh(wob([[-12, -76], [8, -76], [10, -60], [-14, -58]], { j: 0.4 }), o.saddle || 'red');
  // rider, seated at the saddle
  let rider = '';
  if (o.rider) rider = figure({ pose: 'ride', ...o.rider, x: -2, y: -26, s: 1 });
  const rock = o.gait === 'gallop' ? bob(3, 0.5) : o.gait === 'trot' ? bob(2, 0.8) : bob(0.8, 3);
  const s_ = o.s || 1;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${(o.dir || 1) * s_},${s_})" class="horse"><g>${s}${rider}${rock}</g></g>`;
}

// ---------- ships ----------
export function ship(opts) {
  const o = { w: 1, sail: true, shields: true, crew: 3, horses: 0, ...opts };
  let s = '';
  // mast + sail
  if (o.sail) {
    s += ln('M0,-40L0,-190', C.ink, 3);
    s += sh(wob([[-50, -175], [50, -175], [58, -110], [0, -100], [-58, -110]], { j: 0.8, t: 0.5 }), o.sailC || 'red');
    s += ln('M-20,-172L-24,-106M0,-174L0,-101M20,-172L24,-106', C[o.sailC === 'ochre' ? 'red' : 'ochre'], 3.2, 'opacity=".9"');
    if (o.lantern) s += `<circle cx="0" cy="-196" r="16" fill="url(#glow)"/>` + sh(wob([[-4, -200], [4, -200], [5, -190], [-5, -190]], { j: 0.2 }), 'ochre');
  }
  // crew heads
  for (let i = 0; i < o.crew; i++) {
    const x = -60 + (i * 120) / Math.max(1, o.crew - 1 || 1);
    s += `<g transform="translate(${x},${46 - 2})">${head({ ...CAST.norman, helmet: i % 2 ? 'ochre' : 'blue' })}</g>`;
  }
  // horse heads peeking
  for (let i = 0; i < o.horses; i++) {
    const x = -50 + i * 40;
    s += `<g transform="translate(${x},-44)">${sh(wob([[0, 0], [6, -22], [14, -26], [22, -14], [16, -10], [10, -16], [8, 0]], { j: 0.5 }), ['ochre', 'blue', 'red', 'sage'][i % 4])}<circle cx="13" cy="-20" r="1.2" fill="${C.ink}"/></g>`;
  }
  // hull
  const hull = wob([[-118, -96], [-104, -70], [-96, -50], [-70, -18], [0, -10], [70, -18], [96, -50], [106, -70], [124, -100], [130, -96], [116, -60], [90, -44], [0, -42], [-90, -44], [-112, -62], [-124, -92]], { j: 0.6, t: 0.5 });
  s += sh(hull, o.hullC || 'ochre');
  s += ln(wob([[-100, -56], [-60, -30], [0, -24], [60, -30], [100, -56]], { closed: false, j: 0.5 }), C.blue, 4);
  s += ln(wob([[-90, -48], [-50, -36], [0, -32], [50, -36], [90, -48]], { closed: false, j: 0.5 }), C.red, 3);
  // dragon prow
  s += sh(wob([[120, -98], [132, -112], [142, -108], [136, -100], [128, -96]], { j: 0.4 }), 'red') + `<circle cx="134" cy="-106" r="1.2" fill="${C.ink}"/>`;
  s += sh(wob([[-120, -94], [-128, -110], [-136, -112], [-130, -100]], { j: 0.4 }), 'red');
  if (o.boy) s += figure({ who: 'turold', tunic: 'ochre', x: -112, y: -60, s: 0.5, dir: 1, armF: 100, propF: { t: 'horn', a: -90 } });
  // shields along the gunwale
  if (o.shields) for (let x = -80; x <= 80; x += 22) s += `<g transform="translate(${x},-20) scale(.42)">${shield(['ochre', 'red', 'blue', 'cream'][(x / 22 + 4) % 4 | 0], 'dots')}</g>`;
  const rock = o.still ? '' : spin(0, -40, [-2, 2, -2], 4 + rnd()) + bob(2, 3.2);
  const s_ = o.s || 1;
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${(o.dir || 1) * s_},${s_})" class="ship"><g>${s}${rock}</g></g>`;
}

// ---------- scenery ----------
export function tree(opts) {
  const o = { h: 150, c: 'green', c2: 'sage', ...opts };
  const h = o.h;
  let s = '';
  s += ln(wob([[0, 0], [-6, -h * 0.3], [6, -h * 0.55], [-4, -h * 0.8], [0, -h]], { closed: false, j: 1 }), C[o.c2 === 'sage' ? 'ochre' : 'red'], 5);
  s += ln(wob([[0, 0], [6, -h * 0.3], [-6, -h * 0.55], [4, -h * 0.8], [0, -h]], { closed: false, j: 1 }), C.red, 4);
  const leaf = (x, y, r, a, c) => `<g transform="translate(${x},${y}) rotate(${a})">${sh(wob([[0, 0], [r * 0.5, -r * 0.6], [r * 0.2, -r * 1.2], [0, -r * 1.5], [-r * 0.2, -r * 1.2], [-r * 0.5, -r * 0.6]], { j: 0.6 }), c)}</g>`;
  s += leaf(0, -h, 22, 0, o.c) + leaf(-4, -h * 0.75, 20, -55, o.c2) + leaf(4, -h * 0.72, 20, 55, o.c2) + leaf(-6, -h * 0.5, 18, -70, o.c) + leaf(6, -h * 0.48, 18, 70, o.c);
  const sway = o.still ? '' : spin(0, 0, [-1.5, 1.5, -1.5], 5 + rnd() * 2);
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.s || 1})" class="tree"><g>${s}${sway}</g></g>`;
}

// Arcaded hall with a tiled roof and optional towers/dome.
export function hall(opts) {
  const o = { w: 160, h: 120, c: 'ochre', roof: 'red', arches: 3, towers: true, dome: false, ...opts };
  const { w, h } = o;
  let s = '';
  s += sh(wob([[-w / 2, 0], [w / 2, 0], [w / 2, -h], [-w / 2, -h]], { j: 0.6, t: 0.2 }), o.c);
  const aw = w / o.arches;
  for (let i = 0; i < o.arches; i++) {
    const x0 = -w / 2 + i * aw + 6, x1 = x0 + aw - 12;
    s += sh(wob([[x0, 0], [x0, -h * 0.55], [(x0 + x1) / 2, -h * 0.75], [x1, -h * 0.55], [x1, 0]], { j: 0.4, t: 0.4 }), o.inner || 'linen');
  }
  // roof
  s += sh(wob([[-w / 2 - 10, -h], [w / 2 + 10, -h], [w / 2 - 6, -h - 34], [-w / 2 + 6, -h - 34]], { j: 0.6, t: 0.2 }), o.roof);
  for (let y = -h - 8; y > -h - 34; y -= 8) s += ln(`M${-w / 2 + 2},${y}L${w / 2 - 2},${y}`, C.ink, 0.9, 'opacity=".45"');
  if (o.towers) for (const tx of [-w / 2 - 6, w / 2 + 6]) {
    s += sh(wob([[tx - 12, 0], [tx + 12, 0], [tx + 12, -h - 40], [tx - 12, -h - 40]], { j: 0.5, t: 0.2 }), o.towerC || 'blue');
    s += sh(wob([[tx - 16, -h - 40], [tx + 16, -h - 40], [tx, -h - 64]], { j: 0.4, t: 0.2 }), o.roof);
  }
  if (o.dome) s += sh(wob([[-26, -h - 34], [26, -h - 34], [20, -h - 54], [0, -h - 64], [-20, -h - 54]], { j: 0.5 }), 'blue') + ln(`M0,${-h - 64}L0,${-h - 78}`, C.ink, 2);
  if (o.cock) s += `<g transform="translate(18,${-h - 80})">${sh(wob([[0, 0], [8, -6], [14, -4], [10, 2], [2, 4]], { j: 0.3 }), 'ochre')}</g>` + ln(`M24,${-h - 34}L24,${-h - 78}`, C.ink, 1.6);
  return `<g transform="translate(${o.x || 0},${o.y || 0}) scale(${o.s || 1})" class="hall">${s}</g>`;
}

export function throne(x, y, s = 1, c = 'ochre') {
  return `<g transform="translate(${x},${y}) scale(${s})">${sh(wob([[-18, 0], [-14, -48], [26, -48], [28, 0], [22, 0], [20, -40], [-8, -40], [-12, 0]], { j: 0.4, t: 0.3 }), c)}${sh(wob([[-22, -48], [30, -48], [30, -54], [-22, -54]], { j: 0.3, t: 0.3 }), 'red')}<circle cx="-18" cy="-60" r="5" fill="url(#f-ochre)" class="st"/><circle cx="26" cy="-60" r="5" fill="url(#f-ochre)" class="st"/></g>`;
}

export function ground(y = 420, c = 'sage') {
  return sh(wob([[0, y], [80, y - 4], [160, y + 2], [240, y - 3], [320, y + 3], [400, y - 2], [400, y + 12], [0, y + 12]], { j: 0.8, t: 0.6 }), c);
}

// The wave pattern lives in user space, so the band itself slides (inside a clip) to make it roll.
let seaN = 0;
export function sea(y, h = 40, x0 = -20, x1 = 420) {
  const id = `seaclip${++seaN}`;
  const top = ln(wob([[x0, y], [x0 + 60, y - 4], [x0 + 140, y + 3], [x0 + 220, y - 3], [x0 + 300, y + 3], [x1, y]], { closed: false, j: 1 }), C.green, 3);
  return `<g class="sea"><clipPath id="${id}"><rect x="${x0}" y="${y - 6}" width="${x1 - x0}" height="${h + 6}"/></clipPath>` +
    `<g clip-path="url(#${id})"><g><rect x="${x0 - 40}" y="${y}" width="${x1 - x0 + 80}" height="${h}" fill="url(#f-sea)"/><animateTransform attributeName="transform" type="translate" values="0 0;-40 0" dur="3.2s" repeatCount="indefinite"/></g>` +
    `<g>${top}<animateTransform attributeName="transform" type="translate" values="0 0;-6 1.5;0 0" dur="2.6s" repeatCount="indefinite"/></g></g></g>`;
}

export function fire(x, y, s = 1) {
  const flame = (c, sc, d) => `<g>${sh(wob([[-14, 0], [-10, -18], [-4, -12], [0, -34], [5, -14], [10, -22], [14, 0]], { j: 1 }), c)}<animateTransform attributeName="transform" type="scale" values="1 1;${sc} ${2 - sc};1 1" dur="${d}s" repeatCount="indefinite"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${flame('red', 1.1, 0.5)}<g transform="scale(.6)">${flame('ochre', 0.9, 0.4)}</g>${ln('M-18,2L18,-2M-16,-2L16,2', C.ink, 3)}</g>`;
}

export function comet(x, y, s = 1) {
  let tail = '';
  for (let i = 0; i < 6; i++) tail += ln(wob([[0, 0], [-40, 8 + i * 4], [-90, 14 + i * 9], [-150, 18 + i * 14]], { closed: false, j: 2 }), [C.ochre, C.red, C.cream, C.sage][i % 4], 2.4);
  const star = sh(wob([[0, -14], [5, -5], [14, -4], [7, 3], [9, 13], [0, 7], [-9, 13], [-7, 3], [-14, -4], [-5, -5]], { j: 0.4, t: 0.3 }), 'ochre');
  return `<g transform="translate(${x},${y}) scale(${s})" class="comet"><circle r="40" fill="url(#glow)"><animate attributeName="r" values="34;44;34" dur="2.5s" repeatCount="indefinite"/></circle>${tail}${star}</g>`;
}

// Tapestry borders: banded strips with diagonal bars and little beasts.
const BEASTS = [
  (x, y) => sh(wob([[x - 12, y + 6], [x - 6, y - 4], [x + 4, y - 6], [x + 10, y - 12], [x + 14, y - 8], [x + 10, y], [x + 12, y + 8], [x + 6, y + 4], [x - 4, y + 6], [x - 10, y + 10]], { j: 0.6 }), 'sage'),
  (x, y) => sh(wob([[x - 14, y + 2], [x - 4, y - 6], [x + 8, y - 6], [x + 14, y - 12], [x + 16, y - 4], [x + 10, y + 2], [x + 12, y + 10], [x + 6, y + 10], [x + 4, y + 4], [x - 6, y + 4], [x - 8, y + 10], [x - 12, y + 10]], { j: 0.6 }), 'red') + ln(wob([[x - 14, y + 2], [x - 20, y - 6], [x - 16, y - 12]], { closed: false, j: 0.6 }), C.red, 2),
  (x, y) => sh(wob([[x - 8, y + 10], [x - 10, y - 2], [x - 2, y - 10], [x + 4, y - 8], [x + 10, y - 12], [x + 6, y - 2], [x + 8, y + 10]], { j: 0.5 }), 'blue'),
  (x, y) => sh(wob([[x - 12, y + 4], [x, y - 8], [x + 12, y + 4], [x + 4, y + 2], [x, y + 10], [x - 4, y + 2]], { j: 0.5 }), 'ochre'),
];
export function border(y, h = 46, w = 400, offset = 0) {
  let s = `<rect x="0" y="${y}" width="${w}" height="${h}" fill="url(#f-linen)"/>`;
  s += ln(`M0,${y + 2}L${w},${y + 2}M0,${y + h - 2}L${w},${y + h - 2}`, C.ink, 1.6);
  const step = 64;
  for (let i = -1, x = -offset % step; x < w + step; x += step, i++) {
    s += ln(`M${x},${y + h - 3}L${x + 26},${y + 3}`, C[i % 2 ? 'red' : 'green'], 4.5);
    const k = ((i + Math.floor(offset / step)) % BEASTS.length + BEASTS.length) % BEASTS.length;
    s += BEASTS[k](x + 44, y + h / 2);
  }
  return `<g class="border">${s}</g>`;
}

// Latin caption in the Tapestry manner: words alternate wool colours.
export function latin(text, y = 80, size = 17, w = 400) {
  const words = text.split(' ');
  const cols = [C.navy, C.green, C.red];
  const tspans = words.map((wd, i) => `<tspan fill="${cols[i % 3]}">${wd}</tspan>`).join(' ');
  return `<text x="${w / 2}" y="${y}" text-anchor="middle" font-size="${size}" class="tcap" ${text.length > 28 ? `textLength="${w - 30}" lengthAdjust="spacingAndGlyphs"` : ''}>${tspans}</text>`;
}

// A full square-ish card: 400 x 500 with borders, linen ground and a caption.
export function card(inner, { caption = '', seed: sd = 1, bg = '', capY = 80, borders = true, w = 400, h = 500, over = '', sketch = false, capSize = 17 } = {}) {
  seed(sd);
  const b = borders ? border(0, 46, w, sd * 13) + border(h - 46, 46, w, sd * 7 + 30) : '';
  const sk = sketch ? `<style>.sketch .st{fill:none;stroke:${C.navy};stroke-width:1.1;stroke-dasharray:2.5 2.5;opacity:.75}</style>` : '';
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" class="scene">${STYLE}${sk}${defs()}
    <rect width="${w}" height="${h}" fill="url(#f-linen)"/>${bg}
    <g class="stage${sketch ? ' sketch' : ''}">${inner}</g>
    ${caption ? latin(caption, capY, capSize, w) : ''}${b}${over}</svg>`;
}
