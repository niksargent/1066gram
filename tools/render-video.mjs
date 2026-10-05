// Renders the TikTok videos (1080x1920, 30fps, H.264 + AAC) into videos/.
// Usage: node tools/render-video.mjs [id ...]      e.g. node tools/render-video.mjs p11
// Uses tools already on this machine: Edge (headless, via seaglass's playwright-core) and
// the ffmpeg bundled with Python's imageio_ffmpeg. Nothing is installed.
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PICKS, LINK } from './video-picks.mjs';
import { LINES } from './voice-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'app');
const OUT = join(ROOT, 'videos');
const FPS = 30;
const PORT = 8067;
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const { chromium } = createRequire('C:/Users/nik/OneDrive/Code/videos/seaglass/package.json')('playwright-core');
const FFMPEG = execFileSync('python', ['-c', 'import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())']).toString().trim();

const { POSTS, CHAPTERS } = await import('../app/js/posts.js');
const byId = Object.fromEntries(POSTS.map((p) => [p.id, p]));
const subtitle = Object.fromEntries(LINES.map(([id, who, text]) => [id, { who, text: text.replace(/\[[^\]]*\]\s*/g, '').replace(/\s+/g, ' ').trim() }]));

// ---------- timing ----------
const durCache = {};
function duration(file) {
  if (durCache[file] != null) return durCache[file];
  let err = '';
  try { execFileSync(FFMPEG, ['-hide_banner', '-i', file], { stdio: ['ignore', 'ignore', 'pipe'] }); } catch (e) { err = e.stderr.toString(); }
  const m = err.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return (durCache[file] = m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0);
}
const vo = (id) => join(APP, 'audio/vo', `${id}.mp3`);
const sfx = (id) => join(APP, 'audio/sfx', `${id}.mp3`);
const music = (id) => join(APP, 'audio/music', `${id}.mp3`);

function chapterOf(id) {
  let n = 0;
  for (const p of POSTS) { const c = CHAPTERS.findIndex((ch) => ch.start === p.id); if (c >= 0) n = c + 1; if (p.id === id) return n; }
  return 1;
}

// Mirrors the feed's sequence player, but on a fixed clock.
function timeline(post) {
  const LEAD = 0.9;
  let t = LEAD;
  const lines = [], frames = [], audio = [];
  const seq = post.seq || [];
  for (let i = 0; i < seq.length; i++) {
    const st = seq[i];
    if (typeof st === 'string') {
      const d = duration(vo(st));
      lines.push({ start: t, end: t + d, who: subtitle[st].who, text: subtitle[st].text });
      audio.push({ file: vo(st), at: t, vol: 1 });
      while (seq[i + 1] && seq[i + 1].f !== undefined && seq[i + 1].at !== undefined) { const { f, at } = seq[++i]; frames.push({ t: t + at * d, f }); }
      t += d;
    } else if (st.w) t += st.w / 1000;
    else if (st.s) audio.push({ file: sfx(st.s), at: t, vol: 0.6 * (st.v ?? 1) });
    else if (st.f !== undefined) frames.push({ t, f: st.f });
  }
  const seqEnd = Math.max(t, post.d3 ? 6 : 4);
  const commentsAt = seqEnd + 0.7;
  const endAt = commentsAt + 3 * 1.1 + 1.6;
  const total = endAt + 3.2;
  // Music: the post's own cue, or its chapter's sting; the title theme under the end card.
  audio.push({ file: music(post.music || `sting${chapterOf(post.id)}`), at: 0, vol: post.music ? 0.32 : 0.3 });
  audio.push({ file: music('title'), at: endAt - 0.2, vol: 0.5 });
  if (post.amb) audio.push({ file: sfx(post.amb), at: 0, vol: 0.22, loop: true, until: seqEnd + 0.5 });
  return { lines, frames, audio, seqEnd, commentsAt, endAt, total };
}

// ---------- audio mix ----------
function mixAudio(tl, outFile) {
  const args = ['-y', '-hide_banner', '-loglevel', 'error'];
  tl.audio.forEach((a) => { if (a.loop) args.push('-stream_loop', '-1'); args.push('-i', a.file); });
  const parts = tl.audio.map((a, i) => {
    const ms = Math.round(a.at * 1000);
    const trim = a.loop ? `atrim=0:${(a.until - a.at).toFixed(2)},afade=t=out:st=${(a.until - a.at - 1.5).toFixed(2)}:d=1.5,` : '';
    return `[${i}:a]${trim}aresample=44100,volume=${a.vol},adelay=${ms}|${ms}[a${i}]`;
  });
  const mix = `${tl.audio.map((_, i) => `[a${i}]`).join('')}amix=inputs=${tl.audio.length}:normalize=0:duration=longest,atrim=0:${tl.total.toFixed(2)},afade=t=out:st=${(tl.total - 1.2).toFixed(2)}:d=1.2,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100,aformat=channel_layouts=stereo[out]`;
  args.push('-filter_complex', [...parts, mix].join(';'), '-map', '[out]', '-c:a', 'aac', '-b:a', '192k', outFile);
  execFileSync(FFMPEG, args, { stdio: 'inherit' });
}

// ---------- main ----------
mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
const picks = PICKS.filter((p) => !only.length || only.includes(p.id));

const server = spawn('python', [join(ROOT, 'tools/serve.py'), String(PORT)], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));
const browser = await chromium.launch({ executablePath: EDGE, headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });

try {
  for (const [n, pick] of picks.entries()) {
    const post = byId[pick.id];
    const tl = timeline(post);
    const all = post.pinnedBy ? [post.pinnedBy, ...post.comments] : post.comments;
    const comments = pick.comments.map((i) => all[i]).filter(Boolean);
    const num = String(PICKS.indexOf(pick) + 1).padStart(2, '0');
    const base = join(OUT, `1066gram-${num}-${pick.slug}`);
    const nFrames = Math.ceil(tl.total * FPS);
    console.log(`\n[${n + 1}/${picks.length}] ${pick.id} ${pick.slug}: ${tl.total.toFixed(1)}s, ${nFrames} frames`);

    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => console.log('  page error:', e.message));
    await page.goto(`http://localhost:${PORT}/render.html`, { waitUntil: 'networkidle' });
    await page.evaluate((cfg) => window.setupVideo(cfg), { id: pick.id, hook: pick.hook, comments, lines: tl.lines, frames: tl.frames, commentsAt: tl.commentsAt, endAt: tl.endAt });

    const silent = `${base}.video.mp4`;
    const ff = spawn(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-vf', 'scale=in_range=full:out_range=tv,format=yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-profile:v', 'high', '-r', String(FPS), silent], { stdio: ['pipe', 'inherit', 'inherit'] });
    const started = Date.now();
    for (let f = 0; f < nFrames; f++) {
      await page.evaluate((t) => window.renderAt(t), f / FPS);
      const jpg = await page.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
      if (f % 150 === 0) process.stdout.write(`  frame ${f}/${nFrames}\r`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
    await page.close();

    const wav = `${base}.audio.m4a`;
    mixAudio(tl, wav);
    execFileSync(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-i', wav, '-c:v', 'copy', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', `${base}.mp4`]);
    execFileSync('cmd', ['/c', 'del', '/q', silent.replace(/\//g, '\\'), wav.replace(/\//g, '\\')]);
    console.log(`  done in ${((Date.now() - started) / 1000).toFixed(0)}s → ${base}.mp4`);
  }
} finally {
  await browser.close();
  server.kill();
}

// Captions to paste into TikTok / X / LinkedIn.
const md = ['# 1066gram — video captions', '', `Post in this order. Put **${LINK}** in your TikTok bio; on X and LinkedIn paste it as the last line.`, ''];
PICKS.forEach((p, i) => {
  md.push(`## ${String(i + 1).padStart(2, '0')} · ${p.slug.replace(/-/g, ' ')}`, '', `**On screen:** ${p.hook.replace(/<\/?em>/g, '')}`, '',
    '**Caption:**', '', '```', `${p.caption}`, '', `Full feed: link in bio`, '', p.tags, '```', '',
    '**X / LinkedIn:**', '', '```', `${p.caption}`, '', `The whole Bayeux Tapestry as a social feed: ${LINK}`, '```', '');
});
writeFileSync(join(OUT, 'captions.md'), md.join('\n'));
console.log(`\nCaptions → ${join(OUT, 'captions.md')}`);
