// Video mode: lays out one post as a 1080x1920 TikTok frame and draws it at any moment
// on request, so tools/render-video.mjs can capture it frame by frame.
import { POSTS, ACCOUNTS, crownHolder } from './posts.js';
import { SCENES, avatar } from './scenes.js';
import { border, STYLE, defs, seed } from './art.js';
import { esc } from './util.js';

const byId = Object.fromEntries(POSTS.map((p) => [p.id, p]));
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const CROWN = '<svg class="crown" viewBox="0 0 16 12"><path d="M1 11h14l-1-8-3.5 3L8 1 5.5 6 2 3z" fill="#d3a24a" stroke="#2b2f3c" stroke-width="1.1" stroke-linejoin="round"/></svg>';
const av = (acc) => `<span class="av">${avatar(acc)}</span>`;
const handleOf = (acc, post) => (acc === 'william' && post?.handle2 ? ACCOUNTS.william.handle2 : ACCOUNTS[acc]?.handle || acc);

function band(cls, sd) {
  seed(sd);
  return `<svg class="band ${cls}" viewBox="0 0 415 46" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${STYLE}${defs()}${border(0, 46, 415, sd)}</svg>`;
}

// Same caption chunking as the feed.
function chunks(text, max = 64) {
  const parts = text.match(/[^.!?]+[.!?]*['"’]?\s*/g) || [text];
  const out = [];
  for (const p of parts.map((x) => x.trim()).filter(Boolean)) {
    const last = out[out.length - 1];
    if (last && (last + ' ' + p).length <= max) out[out.length - 1] = last + ' ' + p;
    else out.push(p);
  }
  return out;
}

let S = null; // current video state

window.setupVideo = async (cfg) => {
  const post = byId[cfg.id];
  const r = SCENES[post.id]();
  let ph;
  if (typeof r === 'string') ph = r;
  else if (r.frames) ph = r.frames.map((s, i) => `<div class="frame ${i ? '' : 'on'}">${s}</div>`).join('');
  else ph = `<div class="frame on">${r.slides[0]}</div>`;

  let over = '';
  if (post.news) over += `<div class="lower3"><div class="l3-tag">BREAKING</div><div class="l3-head">${esc(post.news.head)}</div><div class="l3-tick"><span>${esc(post.news.ticker.repeat(3))}</span></div></div>`;
  if (post.live) over += `<div class="live"><b>LIVE</b><span class="viewers">👁 <i>${post.id === 'p33' ? '1,066,000' : '412,000'}</i></span></div>`;
  if (post.score) over += `<div class="scorebug"><span>${post.score[0]}</span><b>${post.score[1]}</b><b>${post.score[2]}</b><span>${post.score[3]}</span></div>`;
  over += '<div class="subs"></div>';

  const crowned = post.acc === crownHolder(post.id) && ['edward', 'harold', 'william'].includes(post.acc);
  const v = $('#v');
  v.innerHTML = `
    ${band('top', 11)}
    <div class="hook">${cfg.hook}</div>
    <div class="head">${av(post.acc)}<div><b>@${esc(handleOf(post.acc, post))}</b>${crowned ? CROWN : ''}<small>${esc(post.loc || '')}${post.date ? ' · ' + esc(post.date) : ''}</small></div></div>
    <div class="vstage"><div class="media ${post.type}" data-id="${post.id}"><div class="ph">${ph}</div>${over}</div></div>
    <div class="cm-stack">${cfg.comments.map(([a, t]) => `<div class="bubble">${av(a)}<div><b>@${esc(handleOf(a, post))}</b><p>${esc(t)}</p></div></div>`).join('')}</div>
    <div class="mark">1066gram</div>
    ${band('bottom', 29)}
    <div class="end">
      <div class="cast">${['harold', 'william', 'odo', 'comet'].map(av).join('')}</div>
      <div class="logo">1066gram</div>
      <div class="tag">It’s 1066. Everyone’s posting.</div>
      <div class="what">The whole Bayeux Tapestry as a social feed.<br>51 posts · voices · 3D</div>
      <div class="bio">Link in bio</div>
    </div>`;

  const media = $('.media', v);
  S = { cfg, post, media, frames: $$('.frame', media), three: null, lines: cfg.lines.map((l) => ({ ...l, parts: chunks(l.text) })) };

  if (post.d3) {
    const { createImmersive } = await import('./immersive.js');
    S.three = createImmersive(media, post.d3, { width: 900, pixelRatio: 1, capture: true });
    media.appendChild(S.three.canvas);
    await S.three.ready;
    media.classList.add('three-on');
  }
  await document.fonts.ready;
  window.renderAt(0);
  return true;
};

const clamp = (x) => Math.max(0, Math.min(1, x));
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

window.renderAt = (t) => {
  const { cfg, media, frames, three } = S;
  const ms = t * 1000;

  // Shot cuts.
  let f = 0;
  for (const c of cfg.frames) if (t >= c.t) f = c.f;
  frames.forEach((el, i) => el.classList.toggle('on', i === f));

  // Who is talking, and the caption on screen.
  const line = S.lines.find((l) => t >= l.start && t < l.end);
  $$('[data-who].speaking', media).forEach((el) => el.classList.remove('speaking'));
  const subs = $('.subs', media);
  if (line) {
    $$(`[data-who="${line.who}"]`, media).forEach((el) => el.classList.add('speaking'));
    const total = line.parts.reduce((n, p) => n + p.length, 0);
    let acc = line.start, text = line.parts[0];
    for (const p of line.parts) { const d = (p.length / total) * (line.end - line.start); if (t >= acc) text = p; acc += d; }
    subs.textContent = text;
    subs.classList.add('on');
  } else subs.classList.remove('on');

  // Freeze every SMIL and CSS animation at exactly this moment.
  $$('svg', media).forEach((s) => { s.pauseAnimations?.(); s.setCurrentTime?.(t); });
  document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; });
  if (three) three.renderAt(t);

  // Hook pops in; comments slide in one by one; then the end card.
  const hook = $('.hook');
  const hp = easeOut(clamp(t / 0.35));
  hook.style.transform = `scale(${0.92 + 0.08 * hp})`;
  hook.style.opacity = hp;
  $$('.bubble').forEach((b, i) => {
    const k = easeOut(clamp((t - cfg.commentsAt - i * 1.1) / 0.35));
    b.style.opacity = k;
    b.style.transform = `translateY(${(1 - k) * 40}px) scale(${0.96 + 0.04 * k})`;
  });
  $('.end').style.opacity = clamp((t - cfg.endAt) / 0.4);
};
