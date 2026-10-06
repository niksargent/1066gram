// Renders the cinema trailer: trailer/1066gram-trailer.mp4 (1920x1080, 24fps, H.264 + AAC).
// Usage: node tools/render-trailer.mjs [--still=SECONDS]   (--still renders one frame to trailer/still.jpg)
// Uses Edge (headless, via seaglass's playwright-core) and the ffmpeg bundled with imageio_ffmpeg.
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LINES } from './voice-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'app');
const TR = join(ROOT, 'trailer');
const FPS = 24;
const PORT = 8068;
const URL_TEXT = 'mr-nik.ai/1066gram';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const { chromium } = createRequire('C:/Users/nik/OneDrive/Code/videos/seaglass/package.json')('playwright-core');
const FFMPEG = execFileSync('python', ['-c', 'import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())']).toString().trim();

const say = Object.fromEntries(LINES.map(([id, , text]) => [id, text.replace(/\[[^\]]*\]\s*/g, '').replace(/\s+/g, ' ').trim()]));
const NARRATION = {
  t1: 'In a world… before the internet…', t2: '…one story was told… in seventy metres of wool.',
  t3: 'Now… it has been retold…', t4: '…as if everyone… had a phone.',
  t5: 'A tale of ambition. Betrayal. And one very confused hawk.', t6: '1066gram.', t7: 'It’s 1066. Everyone’s posting.',
};

const durs = {};
function dur(file) {
  if (durs[file] != null) return durs[file];
  let err = '';
  try { execFileSync(FFMPEG, ['-hide_banner', '-i', file], { stdio: ['ignore', 'ignore', 'pipe'] }); } catch (e) { err = e.stderr.toString(); }
  const m = err.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return (durs[file] = m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0);
}
const VO = (id) => join(APP, 'audio/vo', `${id}.mp3`);
const NV = (id) => join(TR, 'audio', `${id}.mp3`);
const APPSFX = (id) => join(APP, 'audio/sfx', `${id}.mp3`);
const D = (id) => dur(VO(id));
const N = (id) => dur(NV(id));

// Widescreen framing for each 3D set piece.
const VIEW = {
  comet: { dist: 1.12, ty: 0.4 },
  crossing: { dist: 0.85, ty: -0.25 },
  battle: { dist: 0.62, ty: -0.85 },
  tumble: { dist: 0.9, ty: 0.35 },
  feast: { dist: 0.72, ty: -0.6 },
};

// ---------- the edit ----------
let t = 0;
const shots = [], audio = [], hits = [], lines = [], fades = [];
let BOX = true;
const shot = (o, d) => { const s = { box: BOX, ...o, start: t, end: t + d }; if (s.type === '3d' && !s.view) s.view = VIEW[s.kind]; shots.push(s); t += d; return s; };
const narr = (id, at) => { audio.push({ file: NV(id), at, vol: 1.25 }); lines.push({ start: at, end: at + N(id), text: NARRATION[id] }); return at + N(id); };
const line = (id, at) => { audio.push({ file: VO(id), at, vol: 1.0 }); lines.push({ start: at, end: at + D(id), text: say[id] }); return at + D(id); };
const fx = (id, at, vol = 0.9, app = false) => audio.push({ file: app ? APPSFX(id) : NV(id), at, vol });
const boom = (at, kind = 'braam') => {
  fx(kind, at, kind === 'braam' ? 1.0 : 0.85);
  hits.push({ t: at, flash: kind === 'braam' ? 0.55 : 0.35, shake: kind === 'braam' ? 16 : 10 });
};
const card = (text, d, kind = 'braam') => { const s = shot({ type: 'card', text }, d); boom(s.start, kind); return s; };

// 1. Cold open: the camera drifts along the strip in the dark.
fades.push({ a: 0, b: 1.4, in: true });
fx('thread', 0.15, 0.9);
let s = shot({ type: 'strip', from: { id: 'p16', fx: -1.2, z: 1.08 }, to: { id: 'p11', fx: 0.3, z: 1.08 }, dim: [0.8, 0.45], linear: true }, 0.7 + N('t1') + 0.5);
narr('t1', s.start + 0.7);
s = shot({ type: '3d', kind: 'comet', t0: 0.6 }, N('t2') + 0.9);
narr('t2', s.start + 0.25);
hits.push({ t: s.start, flash: 0.15, shake: 0 });
shot({ type: 'black' }, 0.35);

// 2. Hero cards.
card('ONE MAN.', 1.0);
shot({ type: 'strip', from: { id: 'p33c', fx: 0.6, fy: 0.68, z: 2.3 }, to: { id: 'p33c', fx: 0.61, fy: 0.68, z: 2.7 } }, 1.3);
card('AGAINST THIRTY-FIVE.', 1.1, 'hit');
s = shot({ type: 'strip', from: { id: 'p33c', fx: 0.22, fy: 0.7, z: 2.0 }, to: { id: 'p33c', fx: 0.6, fy: 0.68, z: 2.3 } }, D('r24_4') + 1.1);
fx('arrows', s.start + 0.05, 0.8, true);
line('r24_4', s.start + 0.55);

card('ONE PROMISE.', 1.0);
shot({ type: '3d', kind: 'oath', t0: 6 }, 1.5);
card('TWO BOXES.', 1.0, 'hit');
s = shot({ type: '3d', kind: 'oath', t0: 13 }, D('r03_2') + 1.0);
line('r03_2', s.start + 0.35);

card('ONE BISHOP.', 1.0);
card('NO SWORDS.', 0.9, 'hit');
s = shot({ type: 'strip', from: { id: 'p35', fx: 0.4, fy: 0.6, z: 1.8 }, to: { id: 'p35', fx: 0.4, fy: 0.58, z: 2.1 } }, D('r13_3') + 1.1);
fx('thwack', s.start + 0.25, 1.0, true);
line('r13_3', s.start + 0.5);

card('ONE KING.', 1.0);
card('ONE LAST WORD.', 1.0, 'hit');
s = shot({ type: 'strip', from: { id: 'p14', fx: 0.5, fy: 0.62, z: 1.7 }, to: { id: 'p14', fx: 0.52, fy: 0.62, z: 2.05 } }, D('r04_2') + D('r04_3') + 1.0);
let e = line('r04_2', s.start + 0.3);
line('r04_3', e + 0.25);

// 3. Montage: the score kicks in and the cuts get faster.
const montageAt = t;
fx('riser', montageAt - 1.8, 0.8);
const montage = [
  ['3d', 'storm', 8, 0.9], ['3d', 'crossing', 10, 0.95], ['strip', 'p33', 0, 0.75], ['3d', 'battle', 9, 0.95],
  ['3d', 'tumble', 7, 1.0], ['strip', 'p36', 0, 0.7], ['3d', 'feast', 9, 0.8], ['3d', 'battle', 13, 0.65], ['3d', 'comet', 12, 0.6],
];
montage.forEach(([type, k, t0, d], i) => {
  const sh = type === '3d' ? shot({ type: '3d', kind: k, t0 }, d) : shot({ type: 'strip', from: { id: k, fx: 0.35, fy: 0.58, z: 1.6 }, to: { id: k, fx: 0.6, fy: 0.58, z: 1.75 } }, d);
  if (i % 2) fx('whoosh', sh.start - 0.08, 0.7); else boom(sh.start, 'hit');
});
const scratchAt = t;

// 4. Record scratch. Silence. The farmer.
fx('scratch', scratchAt, 1.0);
s = shot({ type: 'strip', from: { id: 'p35b', fx: 0.35, fy: 0.65, z: 1.5 }, to: { id: 'p35b', fx: 0.36, fy: 0.65, z: 1.55 } }, D('r25_2') + 1.6);
fx('farm', s.start, 0.35, true);
line('r25_2', s.start + 0.75);
shot({ type: 'black' }, 0.45);

// 5. The turn: the letterbox opens and the phone arrives.
s = shot({ type: 'card', text: 'NOW…' }, N('t3') + 0.5);
narr('t3', s.start + 0.2);
hits.push({ t: s.start, flash: 0.1, shake: 0 });
const phoneAt = t;
s = shot({ type: 'phone', box: 'open', scroll: ['p11', 'p16'] }, N('t4') + 4.4);
narr('t4', s.start + 0.35);
BOX = false;
const pings = [
  { acc: 'william', html: '<b>@WilliamTheBastard</b> liked your oath', x: 150, y: 200 },
  { acc: 'comet', html: '<b>@HalleysComet</b>: told you ☄️', x: 1310, y: 290 },
  { acc: 'harold', html: '<b>Harold</b> has left the chat', x: 190, y: 620 },
  { acc: 'news', html: '🔴 <b>Hastings</b> is LIVE', x: 1330, y: 690 },
  { acc: 'odo', html: '<b>@BishopOdo</b>: Blessed 🙏', x: 260, y: 880 },
];
pings.forEach((p, i) => { p.t = s.start + 1.3 + i * 0.62; fx('pop', p.t, 0.6); });
hits.push({ t: s.start, flash: 0.25, shake: 6 });

// 6. "A tale of…"
s = shot({ type: 'strip', box: false, key: 'p18', from: { id: 'p18', fx: 0.5, fy: 0.62, z: 1.45 }, to: { id: 'p18', fx: 0.5, fy: 0.6, z: 1.6 } }, 2.1);
narr('t5', s.start + 0.15);
shot({ type: '3d', box: false, kind: 'oath', t0: 22 }, 1.7);
shot({ type: 'strip', box: false, from: { id: 'p02', fx: 0.48, fy: 0.5, z: 2.4 }, to: { id: 'p02', fx: 0.52, fy: 0.47, z: 2.9 } }, Math.max(2.4, N('t5') + 0.6 - 3.8));

// 7. Epic. Heartbreaking. Embroidered.
card('EPIC.', 0.8);
shot({ type: '3d', box: false, kind: 'battle', t0: 10 }, 1.15);
const heartAt = t;
card('HEARTBREAKING.', 1.0, 'hit');
shot({ type: 'strip', box: false, from: { id: 'p38', fx: 0.42, fy: 0.55, z: 1.7 }, to: { id: 'p38', fx: 0.42, fy: 0.52, z: 2.0 }, linear: true }, 2.1);
const embAt = t;
card('EMBROIDERED.', 0.9, 'hit2');
s = shot({ type: 'strip', box: false, from: { id: 'p21', fx: 0.42, fy: 0.55, z: 1.65 }, to: { id: 'p21', fx: 0.44, fy: 0.55, z: 1.85 } }, D('r18_3') + 0.6);
line('r18_3', s.start + 0.2);

// 8. Title.
const titleAt = t;
const tagLocal = 0.4 + N('t6') + 0.35;
s = shot({ type: 'title', box: false, tagAt: tagLocal, urlAt: tagLocal + 1.2 }, tagLocal + N('t7') + 1.9);
boom(s.start + 0.3, 'braam');
narr('t6', s.start + 0.4);
narr('t7', s.start + tagLocal);
fades.push({ a: t - 0.6, b: t });
shot({ type: 'black', box: false }, 0.9);

// 9. Post-credits sting.
BOX = true;
s = shot({ type: 'strip', key: 'p08b:2', from: { key: 'p08b:2', fx: 0.48, fy: 0.6, z: 1.3 }, to: { key: 'p08b:2', fx: 0.5, fy: 0.6, z: 1.4 } }, D('r20_3') + 1.3);
fades.push({ a: s.start, b: s.start + 0.4, in: true });
line('r20_3', s.start + 0.4);
fades.push({ a: t - 0.5, b: t });
const TOTAL = t;

// Score: dark intro (looped) until the montage, the build until the scratch,
// then the finale from the phone reveal, dropping out for "Heartbreaking".
audio.push({ file: NV('tr_intro'), at: 0, vol: 0.55, loop: true, until: montageAt, fadeOut: 1.2 });
audio.push({ file: NV('tr_build'), at: montageAt - 0.2, vol: 0.85, until: scratchAt, fadeOut: 0.05 });
audio.push({ file: NV('tr_reveal'), at: phoneAt, vol: 0.6, until: heartAt + 0.15, fadeOut: 0.5 });
audio.push({ file: NV('tr_reveal'), at: embAt, seek: embAt - phoneAt, vol: 0.6, until: titleAt + (TOTAL - titleAt) - 2.5, fadeOut: 2.0 });

const strip = [
  { id: 'p16' }, { id: 'p02' }, { id: 'p11' }, { id: 'p33c' }, { id: 'p35' }, { id: 'p14' }, { id: 'p33' }, { id: 'p36' },
  { id: 'p35b' }, { id: 'p18' }, { id: 'p38' }, { id: 'p21' }, { id: 'p08b', frame: 2 }, { id: 'p23' }, { id: 'p28' },
];

// ---------- audio mix ----------
function mix(out) {
  const args = ['-y', '-hide_banner', '-loglevel', 'error'];
  audio.forEach((a) => { if (a.loop) args.push('-stream_loop', '-1'); if (a.seek) args.push('-ss', a.seek.toFixed(2)); args.push('-i', a.file); });
  const parts = audio.map((a, i) => {
    const ms = Math.round(a.at * 1000);
    let f = `[${i}:a]aresample=44100,aformat=channel_layouts=stereo`;
    if (a.until) { const len = a.until - a.at; f += `,atrim=0:${len.toFixed(2)},afade=t=out:st=${Math.max(0, len - (a.fadeOut ?? 0.3)).toFixed(2)}:d=${(a.fadeOut ?? 0.3).toFixed(2)}`; }
    return `${f},volume=${a.vol},adelay=${ms}|${ms}[a${i}]`;
  });
  const m = `${audio.map((_, i) => `[a${i}]`).join('')}amix=inputs=${audio.length}:normalize=0:duration=longest,atrim=0:${TOTAL.toFixed(2)},loudnorm=I=-14:TP=-1.0:LRA=14,aresample=48000[out]`;
  args.push('-filter_complex', [...parts, m].join(';'), '-map', '[out]', '-c:a', 'aac', '-b:a', '256k', out);
  execFileSync(FFMPEG, args, { stdio: 'inherit' });
}

// ---------- render ----------
mkdirSync(TR, { recursive: true });
const still = process.argv.find((a) => a.startsWith('--still='));
console.log(`Trailer: ${TOTAL.toFixed(1)}s, ${shots.length} shots, ${Math.ceil(TOTAL * FPS)} frames`);
if (process.argv.includes('--list')) { shots.forEach((x) => console.log(x.start.toFixed(2).padStart(6), x.type.padEnd(6), x.kind || x.text || x.from?.id || x.from?.key || '')); process.exit(0); }

const server = spawn('python', [join(ROOT, 'tools/serve.py'), String(PORT)], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));
const browser = await chromium.launch({ executablePath: EDGE, headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (err) => console.log('  page error:', err.message));
  await page.goto(`http://localhost:${PORT}/trailer.html`, { waitUntil: 'networkidle' });
  await page.evaluate((edit) => window.setupTrailer(edit), { shots, hits, lines, fades, pings, strip, url: URL_TEXT });

  if (still) {
    for (const [i, at] of still.split('=')[1].split(',').map(Number).entries()) {
      await page.evaluate((x) => window.renderAt(x), at);
      await page.waitForTimeout(200);
      await page.evaluate((x) => window.renderAt(x), at);
      await page.screenshot({ path: join(TR, `still-${String(i).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 85 });
    }
    console.log('stills written to', TR);
  } else {
    const silent = join(TR, 'video.tmp.mp4');
    const ff = spawn(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-vf', 'scale=in_range=full:out_range=tv,format=yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-r', String(FPS), silent], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.ceil(TOTAL * FPS);
    const t0 = Date.now();
    for (let f = 0; f < n; f++) {
      await page.evaluate((x) => window.renderAt(x), f / FPS);
      const jpg = await page.screenshot({ type: 'jpeg', quality: 93 });
      if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
      if (f % 120 === 0) console.log(`  frame ${f}/${n}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
    const snd = join(TR, 'audio.tmp.m4a');
    mix(snd);
    execFileSync(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-i', snd, '-c:v', 'copy', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', join(TR, '1066gram-trailer.mp4')]);
    rmSync(silent); rmSync(snd);
    console.log('done →', join(TR, '1066gram-trailer.mp4'));
  }
} finally {
  await browser.close();
  server.kill();
}
