// Audio engine. Everything runs through Web Audio so volume works on every phone.
// Before the viewer taps (or while muted) sequences still run on timers, so subtitles
// and talking animations play silently, like a muted reel.
import { LINES } from './lines.js';

const ctx = new (window.AudioContext || window.webkitAudioContext)();
const master = ctx.createGain();
master.connect(ctx.destination);
const bus = (v) => { const g = ctx.createGain(); g.gain.value = v; g.connect(master); return g; };
const voiceBus = bus(1), sfxBus = bus(0.55), musicBus = bus(1), ambBus = bus(0.32);

const MUSIC_LEVEL = 0.38, MUSIC_DUCKED = 0.12;
const buffers = new Map();

export function load(url) {
  if (!buffers.has(url)) {
    buffers.set(url, fetch(url).then((r) => r.arrayBuffer()).then((b) => new Promise((res, rej) => ctx.decodeAudioData(b, res, rej))).catch(() => null));
  }
  return buffers.get(url);
}
export const voiceUrl = (id) => `audio/vo/${id}.mp3`;
export const sfxUrl = (id) => `audio/sfx/${id}.mp3`;
const musicUrl = (id) => `audio/music/${id}.mp3`;

let muted = true;
export const isMuted = () => muted;
export const audible = () => !muted && ctx.state === 'running';

// Must be called from a user gesture.
export async function unlock() {
  try { await ctx.resume(); } catch {}
  setMuted(false);
}
export function setMuted(m) {
  muted = m;
  master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.05);
  if (!m && ctx.state !== 'running') ctx.resume().catch(() => {});
  document.documentElement.classList.toggle('muted', m);
  listeners.forEach((f) => f(m));
}
const listeners = new Set();
export const onMute = (f) => listeners.add(f);

// Plays a buffer; resolves when it would have finished (even if the context is suspended).
function play(buf, dest, { loop = false, gain = 1 } = {}) {
  const g = ctx.createGain();
  g.gain.value = gain;
  g.connect(dest);
  let src = null;
  if (ctx.state === 'running') {
    src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = loop;
    src.connect(g);
    src.start();
  }
  let timer;
  const done = loop ? new Promise(() => {}) : new Promise((r) => { timer = setTimeout(r, buf.duration * 1000); });
  return {
    g, done, duration: buf.duration,
    stop(fade = 0.15) {
      clearTimeout(timer);
      g.gain.setTargetAtTime(0, ctx.currentTime, fade / 3);
      if (src) setTimeout(() => { try { src.stop(); } catch {} }, fade * 1000 + 50);
    },
  };
}

// ---------- music: one-shot cues, never looped ----------
// A cue belongs to an owner (a post or chapter id). Starting a cue fades out the previous one;
// leaving a post fades out only its own cue, so chapter stings can ring on into the next post.
let cueNow = null; // { id, owner, h }
export async function cue(id, owner) {
  if (cueNow && cueNow.id === id && cueNow.owner === owner) return;
  stopCue();
  if (!id || ctx.state !== 'running') { if (id) pendingCue = { id, owner }; return; }
  const mine = { id, owner, h: null };
  cueNow = mine;
  const buf = await load(musicUrl(id));
  if (!buf || cueNow !== mine) return;
  mine.h = play(buf, musicBus, { gain: 0 });
  mine.h.g.gain.setTargetAtTime(1, ctx.currentTime, 0.25);
  mine.h.done.then(() => { if (cueNow === mine) cueNow = null; });
}
export function stopCue(owner) {
  if (!cueNow || (owner && cueNow.owner !== owner)) return;
  cueNow.h?.stop(1.5);
  cueNow = null;
  pendingCue = null;
}
let pendingCue = null;
function duck(on) { musicBus.gain.setTargetAtTime(on ? MUSIC_DUCKED : MUSIC_LEVEL, ctx.currentTime, 0.15); }
musicBus.gain.value = MUSIC_LEVEL;

// When sound comes on, start whatever was waiting for it (stopping anything already playing first).
onMute((m) => {
  if (m || ctx.state !== 'running') return;
  if (pendingCue) { const c = pendingCue; pendingCue = null; cue(c.id, c.owner); }
  if (ambNow.id && !ambNow.h) { const id = ambNow.id; ambNow = { id: null, h: null }; ambience(id); }
});

// ---------- ambience: a quiet bed under a post, fading out after a while ----------
let ambNow = { id: null, h: null };
export async function ambience(id) {
  if (id === ambNow.id) return;
  if (ambNow.h) ambNow.h.stop(0.8);
  const mine = { id, h: null };
  ambNow = mine;
  if (!id) return;
  const buf = await load(sfxUrl(id));
  if (!buf || ambNow !== mine || ctx.state !== 'running') return;
  const h = play(buf, ambBus, { loop: true, gain: 0 });
  h.g.gain.setTargetAtTime(1, ctx.currentTime, 0.4);
  h.g.gain.setTargetAtTime(0, ctx.currentTime + 22, 2);
  mine.h = h;
}

export function sfx(id, gain = 1) {
  load(sfxUrl(id)).then((b) => { if (b && audible()) play(b, sfxBus, { gain }); });
}

// ---------- sequences ----------
let current = null;

export function stopSequence() {
  if (current) { current.cancelled = true; current.handles.forEach((h) => h.stop()); current.cleanup(); current = null; }
  duck(false);
}

/**
 * Runs a post's sequence.
 * hooks: onLine(lineId|null, who, text), onFrame(i), onEnd()
 */
export async function runSequence(seq, hooks = {}) {
  stopSequence();
  const run = { cancelled: false, handles: new Set(), timers: new Set(), cleanup() { this.timers.forEach(clearTimeout); hooks.onLine?.(null); } };
  current = run;
  // Warm the cache for the whole sequence.
  seq.forEach((st) => { if (typeof st === 'string') load(voiceUrl(st)); else if (st.s) load(sfxUrl(st.s)); });

  for (let i = 0; i < seq.length; i++) {
    if (run.cancelled) return;
    const st = seq[i];
    if (typeof st === 'string') {
      const buf = await load(voiceUrl(st));
      if (run.cancelled) return;
      if (!buf) continue;
      const line = LINES[st] || {};
      hooks.onLine?.(st, line.who, line.text, buf.duration);
      duck(true);
      const h = play(buf, voiceBus);
      run.handles.add(h);
      // Frame cuts timed against this clip: {f, at} steps that follow it.
      while (seq[i + 1] && seq[i + 1].f !== undefined && seq[i + 1].at !== undefined) {
        const { f, at } = seq[++i];
        const t = setTimeout(() => !run.cancelled && hooks.onFrame?.(f), at * buf.duration * 1000);
        run.timers.add(t);
      }
      await h.done;
      run.handles.delete(h);
      duck(false);
      hooks.onLine?.(null);
    } else if (st.w) {
      await new Promise((r) => { const t = setTimeout(r, st.w); run.timers.add(t); });
    } else if (st.s) {
      sfx(st.s, st.v ?? 1);
    } else if (st.f !== undefined) {
      hooks.onFrame?.(st.f);
    }
  }
  if (!run.cancelled) { current = null; hooks.onEnd?.(); }
}
