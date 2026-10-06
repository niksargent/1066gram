// The three 3D set pieces. Each starts as the flat tapestry card, then unfolds like a pop-up book:
// the linen page tips back into a floor and the cut-outs hinge up to stand on it.
import * as THREE from 'three';
import { C, seed, card, defs, STYLE, figure, horse, ship, hall, ground, sea, comet, hill, throne, reliquary, table, sh, wob, oval } from './art.js';
import { rasterize } from './util.js';

const G = 425;
const layerSvg = (inner) => `<svg viewBox="0 0 400 ${G}" xmlns="http://www.w3.org/2000/svg">${STYLE}${defs()}${inner}</svg>`;
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// Each kind: base page art, cut-outs (svg + depth into the scene), sky colour, extras.
const KINDS = {
  tumble: () => {
    seed(3333);
    const wall = [300, 345, 385].map((x, i) => figure({ who: 'english', x, y: G - 58 - (i % 2) * 8, s: 1.15, dir: -1, shield: ['ochre', 'red', 'blue'][i], armF: 130, propF: { t: 'axe', a: -20 }, still: true })).join('');
    // Each tumbling horse is centred in its own layer so it can spin about its middle.
    const tumbler = (c, far, sh) => layerSvg(horse({ x: 200, y: 300, s: 1.05, c, far, rider: { who: 'norman', armF: 160, armB: 150, shield: sh, still: true } }));
    return {
      base: card(hill(330, G, 260, 80, 'green') + ground() + sh(wob([[60, G - 2], [260, G - 2], [250, G + 26], [70, G + 26]], { j: 1 }), 'navy'), { caption: 'HIC CECIDERUNT SIMUL ANGLI ET FRANCI IN PRELIO', seed: 3333, capSize: 15 }),
      cuts: [
        { svg: layerSvg(hill(330, G, 260, 80, 'green') + wall), d: 2.6 },
        { svg: tumbler('ochre', 'red', 'red'), d: 1.4, flip: 1, x: -0.9 },
        { svg: tumbler('blue', 'ochre', 'ochre'), d: 0.7, flip: 1.3, x: 0.5 },
      ],
      sky: '#cdbb92',
    };
  },
  storm: () => {
    seed(104);
    return {
      base: card(sea(330, 130), { caption: 'HIC TEMPESTAS', seed: 104 }),
      cuts: [
        { svg: layerSvg(ship({ x: 200, y: 400, s: 1.05, crew: 3, sailC: 'ochre', still: true })), d: 0.9, bob: 3 },
      ],
      echoes: 0,
      sky: '#343b52',
      seaFloor: true,
      rain: true,
      lightning: true,
      // Low and close at sea level, with the ship framed above the news strip.
      cam: (p, t) => ({ pos: [Math.sin(t * 0.4) * 0.3 * p, -1.1 * p, 9.33 - p * 2.2], target: [0, -2.1 * p, -p * 1.6] }),
    };
  },
  oath: () => {
    seed(111);
    const S = 1.8;
    return {
      base: card(ground(), { caption: 'UBI HAROLD SACRAMENTUM FECIT WILLELMO DUCI', seed: 111, capSize: 15 }),
      cuts: [
        { svg: layerSvg(throne(52, G, 1.25) + figure({ who: 'william', pose: 'sit', x: 54, y: G, s: 1.25, armF: 100, propF: { t: 'sword', a: 20 }, still: true })), d: 2.2, x: -0.3 },
        { svg: layerSvg(figure({ who: 'odo', x: 345, y: G, dir: -1, s: 1.6, armF: 100, propB: { t: 'crozier' }, armB: 20, still: true })), d: 1.7, x: 0.2 },
        { svg: layerSvg(reliquary(150, G, 1.45, 'ochre') + reliquary(252, G, 1.45, 'red') + figure({ who: 'harold', x: 200, y: G, armF: 82, armB: -78, s: S, still: true })), d: 0.8 },
      ],
      sky: '#2b2233',
      // A slow, overdramatic push in on Harold.
      cam: (p, t) => ({ pos: [Math.sin(t * 0.3) * 0.25 * p, -1.0 * p, 9.33 - p * (3.2 + Math.min(t, 25) * 0.05)], target: [0, -1.45 * p, -p * 1.6] }),
    };
  },
  feast: () => {
    seed(128);
    const diners = figure({ who: 'william', x: 95, y: G, s: 1.5, armF: 70, propF: { t: 'cup', a: 0 }, still: true }) +
      figure({ who: 'odo', x: 200, y: G, s: 1.6, armF: 145, armB: 120, dir: -1, still: true }) +
      figure({ who: 'guy', tunic: 'green', x: 290, y: G, dir: -1, s: 1.5, armF: 90, propF: { t: 'horn', a: -30 }, still: true }) +
      figure({ who: 'cook', apron: false, x: 345, y: G, dir: -1, s: 1.5, armF: 40, still: true });
    const food = table(200, G, 330, 'ochre', true) +
      `<g transform="translate(200,${G - 52})">${sh(wob([[-16, 0], [-4, -8], [12, -6], [20, -12], [20, 2], [12, -2], [-4, 6]], { j: 0.5 }), 'blue')}</g>` +
      `<g transform="translate(140,${G - 52})">${sh(oval(0, -4, 10, 5), 'ochre')}</g><g transform="translate(260,${G - 52})">${sh(oval(0, -4, 10, 5), 'red')}</g>`;
    return {
      base: card(ground(), { caption: 'HIC EPISCOPUS CIBUM ET POTUM BENEDICIT', seed: 128, capSize: 15 }),
      cuts: [
        { svg: layerSvg(hall({ x: 200, y: G, w: 330, h: 200, towers: false, arches: 4, c: 'red', roof: 'blue' })), d: 2.4 },
        { svg: layerSvg(diners), d: 1.1 },
        { svg: layerSvg(food), d: 0.5 },
      ],
      sky: '#3d2a1f',
      candles: true,
    };
  },
  comet: () => {
    seed(116);
    const crowd = [50, 105, 160, 215].map((x, i) => figure({ who: i % 2 ? 'english' : 'harold', helmet: null, tunic: ['red', 'green', 'ochre', 'blue'][i], legs: ['blue', 'red', 'green', 'ochre'][i], hair: ['ochre', 'navy', 'red', 'ochre'][i], moustache: true, x, y: G, s: 1.45, armF: 150 + i * 4, still: true })).join('');
    return {
      base: card(ground(), { caption: 'ISTI MIRANT STELLA', seed: 116 }),
      cuts: [
        { svg: layerSvg(hall({ x: 345, y: G, w: 90, h: 130, towers: false, c: 'blue', roof: 'red', arches: 1 })), d: 2.4 },
        { svg: layerSvg(crowd), d: 0.4 },
      ],
      sky: '#1b2140',
      comet: `<svg viewBox="-170 -60 220 140" xmlns="http://www.w3.org/2000/svg">${STYLE}${defs()}${comet(0, 0, 1)}</svg>`,
    };
  },
  crossing: () => {
    seed(123);
    return {
      base: card(sea(280, 180), { caption: 'HIC WILLELM DUX IN MAGNO NAVIGIO MARE TRANSIVIT', seed: 123, capSize: 14 }),
      cuts: [
        { svg: layerSvg(ship({ x: 70, y: 315, s: 0.45, crew: 2, sailC: 'ochre', still: true })), d: 4.2, bob: 1 },
        { svg: layerSvg(ship({ x: 320, y: 345, s: 0.62, crew: 2, sailC: 'red', horses: 1, still: true })), d: 2.6, bob: 1 },
        { svg: layerSvg(ship({ x: 190, y: 420, s: 1.1, crew: 3, horses: 2, lantern: true, boy: true, sailC: 'red', still: true })), d: 0.5, bob: 1, lantern: [190, 420 - 196 * 1.1] },
      ],
      echoes: 6,
      sky: '#2b3555',
      seaFloor: true,
    };
  },
  battle: () => {
    seed(133);
    const wall = [255, 300, 345, 390].map((x, i) => figure({ who: 'english', x, y: G - 50 - (i % 2) * 8, s: 1.3, dir: -1, shield: ['ochre', 'red', 'blue', 'cream'][i], motif: i % 2 ? 'dragon' : 'cross', armF: 130, propF: { t: 'axe', a: -20 }, still: true })).join('');
    const rider = (c, far, sh) => layerSvg(horse({ x: 110, y: G, s: 1.25, c, far, rider: { who: 'norman', armF: 90, propF: { t: 'spear', a: 80 }, shield: sh, motif: 'dragon', still: true } }));
    return {
      base: card(hill(330, G, 280, 70, 'green') + ground(), { caption: 'HIC FRANCI PUGNANT', seed: 133 }),
      cuts: [
        { svg: layerSvg(wall), d: 3.2 },
        { svg: rider('ochre', 'red', 'blue'), d: 2.0, gallop: 1, x: -0.8 },
        { svg: rider('red', 'sage', 'ochre'), d: 1.3, gallop: 1, x: 0.6 },
        { svg: rider('blue', 'ochre', 'red'), d: 0.5, gallop: 1 },
      ],
      sky: '#cdbb92',
      arrows: true,
    };
  },
};

// opts.width / opts.pixelRatio / opts.capture let the video renderer drive it frame by frame.
export function createImmersive(container, kind, opts = {}) {
  const spec = KINDS[kind]();
  const aspect = opts.aspect || 0.8;
  const W = opts.width || container.clientWidth || 400, H = Math.round(W / aspect);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: opts.capture ? 'high-performance' : 'low-power', preserveDrawingBuffer: !!opts.capture });
  renderer.setPixelRatio(opts.pixelRatio || Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.className = 'three';

  const scene = new THREE.Scene();
  const linen = new THREE.Color(C.linen), sky = new THREE.Color(spec.sky);
  scene.background = linen.clone();
  scene.fog = new THREE.Fog(linen.clone(), 10, 26);
  const fov = opts.fov || 30;
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
  const D = 2.5 / Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const disposables = [];

  const tex = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; disposables.push(t); return t; };
  const mat = (map, extra = {}) => { const m = new THREE.MeshBasicMaterial({ map, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide, ...extra }); disposables.push(m); return m; };
  const plane = (w, h) => { const g = new THREE.PlaneGeometry(w, h); disposables.push(g); return g; };

  // Page hinge at the bottom edge of the card.
  const hinge = new THREE.Group();
  hinge.position.set(0, -2.5, 0);
  scene.add(hinge);
  const cuts = [];
  let seaMesh = null, cometMesh = null, starPts = null, lantern = null, page = null;
  const arrows = [];
  const echoes = [];
  let rainPts = null, candles = [];

  const ready = (async () => {
    const pageC = await rasterize(spec.base, 800, 1000);
    page = new THREE.Mesh(plane(4, 5), mat(tex(pageC), { alphaTest: 0, transparent: !!spec.seaFloor }));
    page.position.y = 2.5;
    hinge.add(page);

    const cutCanvases = await Promise.all(spec.cuts.map((c) => rasterize(c.svg, 800, 850, { font: false })));
    spec.cuts.forEach((c, i) => {
      const h = new THREE.Group();
      const m = new THREE.Mesh(plane(4, 4.25), mat(tex(cutCanvases[i])));
      m.position.y = 2.125;
      h.add(m);
      h.userData = { ...c, base: 0.75, z: 0.004 * (i + 1), mesh: m, phase: i * 1.7 };
      hinge.add(h);
      cuts.push(h);
      if (c.lantern) {
        const gc = document.createElement('canvas');
        gc.width = gc.height = 128;
        const gx = gc.getContext('2d');
        const grad = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(255,244,200,1)'); grad.addColorStop(0.35, 'rgba(255,220,140,.45)'); grad.addColorStop(1, 'rgba(255,220,140,0)');
        gx.fillStyle = grad; gx.fillRect(0, 0, 128, 128);
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(gc), color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
        glow.scale.set(1.3, 1.3, 1);
        glow.position.set(c.lantern[0] / 100 - 2, (G - c.lantern[1]) / 100, 0.02);
        h.add(glow);
        lantern = glow;
        disposables.push(glow.material);
      }
    });

    // Extra distant ships on the crossing.
    if (spec.echoes) {
      const src = cutCanvases[0];
      for (let k = 0; k < spec.echoes; k++) {
        const m = new THREE.Mesh(plane(4, 4.25), mat(tex(src), { opacity: 0, transparent: true }));
        m.position.set(-6 + k * 2.4 + Math.random(), -2.5 + 2.125 * 0.8, -7 - Math.random() * 6);
        m.scale.setScalar(0.8);
        m.userData.phase = Math.random() * 6;
        scene.add(m);
        echoes.push(m);
      }
    }

    if (spec.seaFloor) {
      const g = new THREE.PlaneGeometry(40, 40, 80, 80);
      disposables.push(g);
      const sc = document.createElement('canvas');
      sc.width = 256; sc.height = 256;
      const x = sc.getContext('2d');
      x.fillStyle = C.blue; x.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 16) {
        x.strokeStyle = y % 32 ? C.green : '#5a6fa0'; x.lineWidth = y % 32 ? 5 : 2;
        x.beginPath();
        for (let px = 0; px <= 256; px += 8) x.lineTo(px, y + 8 + Math.sin(px / 20) * 4);
        x.stroke();
      }
      const t = tex(sc);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(10, 10);
      seaMesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0 }));
      disposables.push(seaMesh.material);
      seaMesh.rotation.x = -Math.PI / 2;
      seaMesh.position.set(0, -2.48, -8);
      scene.add(seaMesh);
    }

    if (spec.comet) {
      const cc = await rasterize(spec.comet, 880, 560, { font: false });
      cometMesh = new THREE.Mesh(plane(5.5, 3.5), mat(tex(cc), { opacity: 0, transparent: true, alphaTest: 0.05, depthWrite: false }));
      cometMesh.position.set(1.4, aspect > 1 ? 1.75 : 3.1, -9);
      if (aspect > 1) cometMesh.scale.setScalar(1.25);
      scene.add(cometMesh);
      const n = 380, pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 40; pos[i * 3 + 1] = Math.random() * 14 - 1; pos[i * 3 + 2] = -10 - Math.random() * 10; }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      disposables.push(g);
      starPts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xf0dfae, size: 0.09, transparent: true, opacity: 0 }));
      disposables.push(starPts.material);
      scene.add(starPts);
    }

    if (spec.rain) {
      const n = 700, pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 16; pos[i * 3 + 1] = Math.random() * 10 - 2.5; pos[i * 3 + 2] = -Math.random() * 10 + 2; }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      disposables.push(g);
      rainPts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xb8c4dd, size: 0.05, transparent: true, opacity: 0 }));
      disposables.push(rainPts.material);
      scene.add(rainPts);
    }
    if (spec.candles) {
      const gc = document.createElement('canvas');
      gc.width = gc.height = 64;
      const gx = gc.getContext('2d');
      const grad = gx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,230,160,1)'); grad.addColorStop(0.4, 'rgba(255,190,90,.35)'); grad.addColorStop(1, 'rgba(255,190,90,0)');
      gx.fillStyle = grad; gx.fillRect(0, 0, 64, 64);
      const t = tex(gc);
      for (let i = 0; i < 9; i++) {
        const m = new THREE.SpriteMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
        disposables.push(m);
        const sp = new THREE.Sprite(m);
        sp.position.set(-1.8 + i * 0.45, -0.6 + Math.random() * 1.8, -1.2 - Math.random() * 2);
        sp.scale.setScalar(0.5 + Math.random() * 0.4);
        sp.userData.phase = Math.random() * 6;
        scene.add(sp);
        candles.push(sp);
      }
    }

    if (spec.arrows) {
      for (let i = 0; i < 14; i++) {
        const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.45, -0.12, 0)]);
        disposables.push(g);
        const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x2b2f3c, transparent: true, opacity: 0 }));
        disposables.push(l.material);
        l.userData = { phase: Math.random(), speed: 0.5 + Math.random() * 0.5, z: -1 - Math.random() * 3, y: Math.random() * 1.5 };
        scene.add(l);
        arrows.push(l);
      }
    }
  })();

  let raf = 0, t0 = 0, running = false;
  const target = new THREE.Vector3();

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    draw((now - t0) / 1000);
  }

  function draw(t) {
    const p = ease(Math.min(1, Math.max(0, (t - 0.8) / 2.4)));

    hinge.rotation.x = -p * Math.PI / 2;
    for (const h of cuts) {
      const u = h.userData;
      h.position.set((u.x || 0) * p, u.base + u.d * p, u.z);
      h.rotation.x = p * Math.PI / 2;
      if (u.bob) { const k = u.bob; u.mesh.position.y = 2.125 + Math.sin(t * 1.6 * (k > 1 ? 1.4 : 1) + u.phase) * 0.06 * k * p; u.mesh.rotation.z = Math.sin(t * 1.1 * (k > 1 ? 1.5 : 1) + u.phase) * 0.04 * k * p; }
      if (u.flip) {
        // Head over heels: spin about the horse's middle while hopping in an arc over the ditch.
        const k = (t * 0.45 * u.flip + u.phase * 0.1) % 1;
        u.mesh.position.y = 2.125 + Math.sin(k * Math.PI) * 1.2 * p;
        u.mesh.rotation.z = -k * Math.PI * 2 * p;
        u.mesh.position.x = (k - 0.5) * 1.6 * p;
      }
      if (u.gallop) {
        u.mesh.position.y = 2.125 + Math.abs(Math.sin(t * 6 + u.phase)) * 0.12 * p;
        u.mesh.position.x = ((t * 0.5 + u.phase * 0.3) % 2.4 - 1.2) * p;
      }
    }
    for (const e of echoes) { e.material.opacity = p; e.position.y = -2.5 + 1.7 + Math.sin(t * 1.3 + e.userData.phase) * 0.06; }
    if (lantern) lantern.material.opacity = (0.55 + Math.sin(t * 5) * 0.15) * p;
    if (seaMesh) {
      seaMesh.material.opacity = p;
      if (page) page.material.opacity = 1 - p;
      const pos = seaMesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, Math.sin(x * 0.8 + t * 1.4) * 0.08 + Math.cos(y * 0.6 + t) * 0.06); }
      pos.needsUpdate = true;
      seaMesh.material.map.offset.x = t * 0.02;
    }
    if (cometMesh) { cometMesh.material.opacity = p; cometMesh.position.x = 1.4 - t * 0.03; }
    if (starPts) starPts.material.opacity = p * (0.75 + Math.sin(t * 2) * 0.1);
    for (const a of arrows) {
      const k = (t * a.userData.speed + a.userData.phase) % 1;
      a.position.set(2.5 - k * 6, -0.2 + a.userData.y + Math.sin(k * Math.PI) * 1.2, a.userData.z);
      a.material.opacity = p * (k < 0.9 ? 1 : 0);
    }

    if (rainPts) {
      rainPts.material.opacity = 0.8 * p;
      const pos = rainPts.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) { let y = pos.getY(i) - 0.18; if (y < -2.5) y += 10; pos.setY(i, y); pos.setX(i, pos.getX(i) - 0.03 < -8 ? 8 : pos.getX(i) - 0.03); }
      pos.needsUpdate = true;
    }
    for (const c of candles) c.material.opacity = p * (0.7 + Math.sin(t * 9 + c.userData.phase) * 0.15 + Math.sin(t * 23 + c.userData.phase) * 0.08);

    scene.background.copy(linen).lerp(sky, p);
    if (spec.lightning && p > 0.9) { const f = (t % 7.3) < 0.12 || ((t % 7.3) > 0.25 && (t % 7.3) < 0.33); if (f) scene.background.lerp(new THREE.Color('#dfe6ff'), 0.7); }
    scene.fog.color.copy(scene.background);

    // Camera: from dead-on (matching the flat card) up into the diorama, then a slow drift.
    if (spec.cam) {
      const c = spec.cam(p, t);
      camera.position.set(...c.pos);
      target.set(...c.target);
    } else {
      const drift = Math.sin(t * 0.22) * (spec.candles ? 1.2 : 0.8) * p;
      camera.position.set(drift, p * 1.6, D - p * 0.8);
      target.set(drift * 0.3, -p * 0.2, -p * 3);
    }
    // Optional reframing (used by the widescreen trailer): pull in towards the target and shift it.
    if (api.view) {
      const v = api.view;
      target.y += (v.ty ?? 0) * p;
      camera.position.lerp(target, (1 - (v.dist ?? 1)) * p);
      camera.position.y += (v.cy ?? 0) * p;
    }
    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  const api = {
    view: null,
    canvas,
    ready,
    start() { if (running) return; running = true; t0 = performance.now(); raf = requestAnimationFrame(frame); },
    stop() { running = false; cancelAnimationFrame(raf); },
    renderAt(t) { draw(t); },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      renderer.forceContextLoss?.();
      canvas.remove();
    },
  };
  return api;
}
