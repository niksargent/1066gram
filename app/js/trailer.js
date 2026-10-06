// Cinema trailer: a 1920x1080 frame drawn at any moment on request, so
// tools/render-trailer.mjs can capture it frame by frame. The edit (shots, hits, lines)
// is computed by the renderer and handed in through setupTrailer().
import { SCENES, avatar } from './scenes.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (x) => Math.max(0, Math.min(1, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

let E = null; // the edit
const cells = {}; // scene id -> strip cell index
const threes = {}; // 3D kind -> instance

function sceneSvg(id, frame = 0) {
  const r = SCENES[id]();
  if (typeof r === 'string') return r;
  return (r.frames || r.slides)[Math.min(frame, (r.frames || r.slides).length - 1)];
}

window.setupTrailer = async (edit) => {
  E = edit;
  // The strip: every scene the edit visits, laid end to end like the real Tapestry.
  $('#strip').innerHTML = edit.strip.map(({ id, frame }, i) => { cells[`${id}:${frame || 0}`] = i; cells[id] ??= i; return `<div class="cell">${sceneSvg(id, frame)}</div>`; }).join('');

  // 3D set pieces, all built up front in widescreen.
  const kinds = [...new Set(edit.shots.filter((s) => s.type === '3d').map((s) => s.kind))];
  if (kinds.length) {
    const { createImmersive } = await import('./immersive.js');
    for (const k of kinds) {
      const inst = createImmersive($('#three'), k, { width: 1920, aspect: 16 / 9, pixelRatio: 1, capture: true, fov: 26 });
      inst.canvas.style.display = 'none';
      $('#three').appendChild(inst.canvas);
      await inst.ready;
      threes[k] = inst;
    }
  }

  // Phone reveal: the real site running inside a phone.
  if (edit.shots.some((s) => s.type === 'phone')) {
    $('#phone').innerHTML = `<div class="bgstrip"></div><div class="device"><div class="notch"></div><div class="screen"><iframe src="index.html"></iframe></div></div>` +
      edit.pings.map((p, i) => `<div class="ping" data-i="${i}" style="left:${p.x}px;top:${p.y}px"><span class="av">${avatar(p.acc)}</span><span>${p.html}</span></div>`).join('');
    const bg = $('#strip').cloneNode(true);
    bg.removeAttribute('id');
    bg.style.cssText = 'position:absolute;left:0;top:0;display:flex;transform-origin:0 0;transform:translate(-200px,40px) scale(2.0)';
    $('#phone .bgstrip').appendChild(bg);
    const frame = $('#phone iframe');
    await new Promise((r) => (frame.contentDocument?.readyState === 'complete' ? r() : frame.addEventListener('load', r, { once: true })));
    await new Promise((r) => setTimeout(r, 2500));
    try { frame.contentDocument.querySelector('.stories')?.remove(); } catch {}
  }

  $('#title').innerHTML = `<div class="bgstrip"></div><div class="logo">1066gram</div><div class="tag">It’s 1066. Everyone’s posting.</div><div class="url">${edit.url}</div>`;
  const tb = $('#strip').cloneNode(true);
  tb.removeAttribute('id');
  tb.style.cssText = 'position:absolute;left:0;top:0;display:flex;transform-origin:0 0;transform:translate(-900px,-60px) scale(2.4)';
  $('#title .bgstrip').appendChild(tb);

  await document.fonts.ready;
  window.renderAt(0);
  return true;
};

// Camera over the strip: centre on (fx, fy) of a scene, at zoom z (1 = card fills the height).
function stripCam(p) {
  const i = cells[p.key || p.id] ?? 0;
  const cx = (i + (p.fx ?? 0.5)) * 400, cy = (p.fy ?? 0.5) * 500;
  return { cx, cy, z: p.z ?? 1 };
}

let noiseSeed = 1;
function grain(t) {
  const c = $('#grain'), x = c.getContext('2d');
  const img = x.createImageData(c.width, c.height);
  let s = (Math.floor(t * 30) * 2654435761) >>> 0 || 1;
  for (let i = 0; i < img.data.length; i += 4) {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    const v = (s >>> 0) % 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  x.putImageData(img, 0, 0);
}

window.renderAt = (t) => {
  const shot = E.shots.find((s) => t >= s.start && t < s.end) || E.shots[E.shots.length - 1];
  const k = clamp((t - shot.start) / (shot.end - shot.start));
  const local = t - shot.start;
  const show = { stripwrap: 0, three: 0, card: 0, phone: 0, title: 0 };

  // Freeze all stitched animations at this moment.
  $$('svg').forEach((s) => { s.pauseAnimations?.(); s.setCurrentTime?.(t); });

  if (shot.type === 'strip') {
    show.stripwrap = 1;
    const a = stripCam(shot.from), b = stripCam(shot.to || shot.from);
    const kk = shot.linear ? k : ease(k);
    const cx = lerp(a.cx, b.cx, kk), cy = lerp(a.cy, b.cy, kk), z = lerp(a.z, b.z, kk);
    const s = (1080 / 500) * z;
    $('#strip').style.transform = `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`;
    $('#stripwrap .dim').style.opacity = shot.dim ? lerp(shot.dim[0], shot.dim[1], k) : 0;
  } else if (shot.type === '3d') {
    show.three = 1;
    for (const [kind, inst] of Object.entries(threes)) inst.canvas.style.display = kind === shot.kind ? 'block' : 'none';
    threes[shot.kind].view = shot.view || null;
    threes[shot.kind].renderAt((shot.t0 ?? 6) + local * (shot.speed ?? 1));
  } else if (shot.type === 'card') {
    show.card = 1;
    const txt = $('#card .txt');
    if (txt.textContent !== shot.text) { txt.textContent = shot.text; txt.classList.toggle('small', shot.text.length > 14); }
    const g = easeOut(clamp(local / 0.25));
    txt.style.transform = `scale(${1.1 - 0.06 * g - 0.03 * k})`;
    txt.style.opacity = g * (1 - clamp((local - (shot.end - shot.start - 0.12)) / 0.12));
    txt.style.filter = `blur(${(1 - g) * 8}px)`;
  } else if (shot.type === 'phone') {
    show.phone = 1;
    const dev = $('#phone .device');
    const g = easeOut(clamp(local / 0.7));
    dev.style.transform = `translateY(${(1 - g) * 500}px) rotate(${(1 - g) * -8 + Math.sin(local * 1.2) * 0.8}deg) scale(${0.92 + 0.08 * g})`;
    try {
      const doc = $('#phone iframe').contentDocument;
      const y = (id) => doc.getElementById(id)?.offsetTop ?? 0;
      const [from, to] = shot.scroll;
      const sk = ease(clamp((local - 0.8) / (shot.end - shot.start - 1.2)));
      $('#phone iframe').contentWindow.scrollTo(0, lerp(y(from), y(to), sk) - 60);
    } catch {}
    $$('#phone .ping').forEach((el) => {
      const p = E.pings[+el.dataset.i];
      const pk = easeOut(clamp((t - p.t) / 0.3));
      el.style.opacity = pk;
      el.style.transform = `translateY(${(1 - pk) * 30}px) scale(${0.85 + 0.15 * pk})`;
    });
  } else if (shot.type === 'title') {
    show.title = 1;
    const g = easeOut(clamp(local / 0.6));
    $('#title .logo').style.transform = `scale(${1.25 - 0.25 * g + 0.02 * local})`;
    $('#title .logo').style.opacity = g;
    $('#title .tag').style.opacity = easeOut(clamp((local - shot.tagAt) / 0.5));
    $('#title .url').style.opacity = easeOut(clamp((local - shot.urlAt) / 0.5));
  }
  for (const [id, v] of Object.entries(show)) $('#' + id).style.opacity = v;

  // Letterbox: closed for the "film", opening when the phone arrives.
  const box = shot.box === 'open' ? 1 - easeOut(clamp(local / 0.8)) : shot.box === false ? 0 : 1;
  $$('.bar').forEach((b) => (b.style.height = `${138 * box}px`));

  // Hits: white flash and a jolt of camera shake.
  let fl = 0, sx = 0, sy = 0;
  for (const h of E.hits) {
    if (t < h.t) continue;
    const d = t - h.t;
    fl += (h.flash ?? 0) * Math.exp(-d * 10);
    const a = (h.shake ?? 0) * Math.exp(-d * 9);
    sx += a * Math.sin(d * 63); sy += a * Math.cos(d * 51);
  }
  $('#flash').style.opacity = Math.min(0.9, fl);
  $('#shake').style.transform = `translate(${sx}px, ${sy}px)`;
  $('#fade').style.opacity = E.fades.reduce((m, f) => Math.max(m, t >= f.a && t <= f.b ? (f.in ? 1 - (t - f.a) / (f.b - f.a) : (t - f.a) / (f.b - f.a)) : 0), 0);

  // Dialogue subtitles (the trailer has to work on mute).
  const line = E.lines.find((l) => t >= l.start && t < l.end);
  const subs = $('#subs');
  subs.textContent = line ? line.text : '';
  subs.style.opacity = line ? 1 : 0;
  subs.style.bottom = box > 0.5 ? '34px' : '70px';

  grain(t);
};
