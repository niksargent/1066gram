import { POSTS, ACCOUNTS, CHAPTERS, crownHolder } from './posts.js';
import { SCENES, TEMPLATES, chapterCard, avatar } from './scenes.js';
import * as audio from './audio.js';
import { rasterize, esc } from './util.js';
import { translate } from './latin.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const feed = $('#feed');
const byId = Object.fromEntries(POSTS.map((p) => [p.id, p]));

// ---------- helpers ----------
const CROWN = '<svg class="crown" viewBox="0 0 16 12" aria-label="verified"><path d="M1 11h14l-1-8-3.5 3L8 1 5.5 6 2 3z" fill="#d3a24a" stroke="#2b2f3c" stroke-width="1.1" stroke-linejoin="round"/></svg>';
const ICON = {
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.5 6.6 4.5c2.1 0 3.5 1.2 4.4 2.6.9-1.4 2.3-2.6 4.4-2.6 3.6 0 5.4 3.7 3.8 6.9C19 15.6 12 20 12 20z"/></svg>',
  comment: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/></svg>',
  save: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-5-6 5z"/></svg>',
  sound: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path class="on" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/><path class="off" d="m16 9 6 6m0-6-6 6"/></svg>',
  replay: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/></svg>',
};
const handleOf = (acc, post) => (acc === 'william' && post?.handle2 ? ACCOUNTS.william.handle2 : ACCOUNTS[acc]?.handle || acc);
const accLink = (acc, post) => `<button class="acc" data-acc="${acc}">${esc(handleOf(acc, post))}</button>${acc === crownHolder(post?.id || 'p01') && ['edward', 'harold', 'william'].includes(acc) ? CROWN : ''}`;
const fmtCaption = (s) => esc(s).replace(/&lt;small&gt;(.*?)&lt;\/small&gt;/g, '<small>$1</small>').replace(/\n/g, '<br>').replace(/@(\w+)/g, '<span class="mention">@$1</span>');
const longDate = (d) => d.replace(/\bJan\b/, 'January').replace(/\bSep\b/, 'September').replace(/\bOct\b/, 'October').replace(/\bDec\b/, 'December').toUpperCase();
const avatarHtml = (acc, size = 32) => `<span class="av" style="width:${size}px;height:${size}px">${avatar(acc)}</span>`;

function sceneOf(post) {
  const fn = SCENES[post.id];
  return fn ? fn() : '';
}

// ---------- rendering ----------
function mediaHtml(post) {
  const t = post.type;
  let inner = '<div class="ph"></div>';
  let over = '';
  if (post.news) over += `<div class="lower3"><div class="l3-tag">BREAKING</div><div class="l3-head">${esc(post.news.head)}</div><div class="l3-tick"><span>${esc(post.news.ticker.repeat(3))}</span></div></div>`;
  if (post.live) over += `<div class="live"><b>LIVE</b><span class="viewers">👁 <i>${post.id === 'p33' ? '1,066,000' : '412,000'}</i></span></div>`;
  if (post.livechat) over += `<div class="livechat"></div>`;
  if (t === 'story') over += `<div class="story-bars"><i></i>${post.story2 ? '<i></i>' : ''}</div><div class="story-text">${esc(post.story)}</div>`;
  if (t === 'tracker') over += `<div class="trk"><div class="tr-title">${esc(post.tracker.title)}</div>${post.tracker.stats.map(([k, v]) => `<div class="tr-stat"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}<div class="tr-app">⚔ Stravum</div></div>`;
  if (t === 'immersive') over += `<div class="badge3d">3D</div>`;
  if (post.score) over += `<div class="scorebug"><span>${post.score[0]}</span><b>${post.score[1]}</b><b>${post.score[2]}</b><span>${post.score[3]}</span></div>`;
  if (post.seq?.some((st) => typeof st === 'string')) over += `<div class="subs" aria-live="polite"></div><button class="sound" aria-label="Toggle sound">${ICON.sound}</button><button class="replay" aria-label="Play again">${ICON.replay}</button>`;
  if (t === 'carousel') over += `<button class="cnav prev" aria-label="Previous slide">‹</button><button class="cnav next" aria-label="Next slide">›</button><div class="dots">${[0, 1, 2].map((i) => `<button class="dot ${i ? '' : 'on'}" data-i="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}</div>`;
  return `<div class="media ${t}${t === 'carousel' ? ' at-start' : ''}" data-id="${post.id}">${inner}${over}<div class="burst">${ICON.heart}</div></div>`;
}

function commentsHtml(post) {
  if (post.commentsOff) return '<p class="c-off">Comments on this post have been turned off.</p>';
  const cs = post.comments || [];
  let h = '';
  if (post.pinned) h += `<p class="pinned">📌 ${esc(post.pinned)}</p>`;
  if (post.pinnedBy) h += `<p class="cm"><span class="pin">📌</span> ${accLink(post.pinnedBy[0], post)} ${fmtCaption(post.pinnedBy[1])}</p>`;
  h += cs.map(([a, txt], i) => `<p class="cm ${i > 1 ? 'more' : ''}">${accLink(a, post)} ${fmtCaption(txt)}</p>`).join('');
  if (cs.length > 2) h += `<button class="viewall">View all ${cs.length} comments</button>`;
  if (post.limited) h += '<p class="c-off">Comments have been limited on this post.</p>';
  return h;
}

function postHtml(post) {
  if (post.type === 'straight') {
    return `<article class="post straight" id="${post.id}" data-id="${post.id}">${mediaHtml(post)}<div class="thread-line"></div></article>`;
  }
  if (post.type === 'stitched') return stitchedHtml(post);
  const acc = ACCOUNTS[post.acc];
  const liker = { p01: 'Stigand', p15: 'Stigand', p16: 'everyone', p26: 'horse_47' }[post.id] || ['Stigand', 'harolds.hawk', 'Turold', 'the.border'][parseInt(post.id.slice(1), 10) % 4];
  return `<article class="post" id="${post.id}" data-id="${post.id}">
    <header class="ph-head">
      <button class="av-btn" data-acc="${post.acc}">${avatarHtml(post.acc)}</button>
      <div class="who"><div>${accLink(post.acc, post)}${post.sponsored ? '' : ` <span class="dot">·</span> <span class="when">${esc(post.date)}</span>`}</div>
        <div class="loc">${post.sponsored ? 'Sponsored' : esc(post.loc)}</div></div>
      <button class="more-btn" aria-label="More">⋯</button>
    </header>
    ${mediaHtml(post)}
    <div class="actions">
      <button class="like" aria-label="Like">${ICON.heart}</button>
      <button class="cmt" aria-label="Comments">${ICON.comment}</button>
      <button class="shr" aria-label="Share">${ICON.share}</button>
      <span class="sp"></span>
      <button class="sav" aria-label="Save">${ICON.save}</button>
    </div>
    ${post.hideLikes ? '' : `<p class="likes">Liked by <b>${esc(liker)}</b> and <b class="n">${esc(post.likes)}</b> others</p>`}
    ${post.caption ? `<p class="cap">${accLink(post.acc, post)} ${fmtCaption(post.caption)}</p>` : ''}
    <div class="comments">${commentsHtml(post)}</div>
    ${post.date ? `<p class="date">${esc(longDate(post.date))}</p>` : ''}
    ${post.sponsored ? '<a class="cta">Learn more ›</a>' : ''}
  </article>`;
}

function chapterHtml(ch) {
  return `<section class="chapter" id="ch-${ch.n}" data-ch="${ch.n}">${chapterCard(ch.n, ch.title, ch.sub)}</section>`;
}

function stitchedHtml() {
  return `<article class="post stitched" id="p42" data-id="p42">
    <div class="st-intro"><h2>The ending was lost.</h2><p>We’ll use yours.</p></div>
    <div class="media stitched" data-id="p42"><div class="st-preview"></div><div class="subs"></div></div>
    <div class="st-ui">
      <div class="st-templates">${TEMPLATES.map((t, i) => `<button class="st-t ${i ? '' : 'on'}" data-t="${i}" aria-label="${esc(t.name)}"><span>${esc(t.name)}</span></button>`).join('')}</div>
      <label class="st-field"><span>HIC</span><input id="st-text" maxlength="34" autocomplete="off" spellcheck="false" placeholder="${esc(TEMPLATES[0].sample)}"></label>
      <div class="st-actions"><button class="st-share primary">Share your ending</button><button class="st-save">Save image</button></div>
    </div>
  </article>`;
}

function splashHtml() {
  return `<section class="splash" id="top">
    <div class="splash-card">
      <div class="logo">1066gram</div>
      <p class="tag">It’s 1066. Everyone’s posting.</p>
      <div class="cast-row">${['harold', 'william', 'odo', 'edward', 'comet', 'horse'].map((a) => avatarHtml(a, 46)).join('')}</div>
      <button class="enter primary">Enter with sound 🔊</button>
      <button class="enter-quiet">or scroll in silence</button>
      <p class="hint">Tip: hover or tap any Latin for a translation.</p>
    </div>
  </section>`;
}

function storiesHtml() {
  const cast = ['harold', 'william', 'odo', 'edward', 'comet', 'horse', 'turold', 'aelfgyva', 'cook', 'guy', 'border', 'news'];
  return cast.map((a) => `<button class="sto" data-acc="${a}">${avatarHtml(a, 56)}<span>${esc(ACCOUNTS[a].handle)}</span></button>`).join('');
}

function render() {
  let html = splashHtml();
  for (const post of POSTS) {
    const ch = CHAPTERS.find((c) => c.start === post.id);
    if (ch) html += chapterHtml(ch);
    html += postHtml(post);
  }
  html += `<footer class="credits"><p><b>1066gram</b></p><p>Made of linen, wool and nonsense. Inspired by the Bayeux Tapestry (c. 1070s). Loosely true where the truth is funnier.</p><p>Voices: Eleven v4 · Turold appears courtesy of himself.</p><button class="to-top">Back to 1064 ↑</button></footer>`;
  feed.innerHTML = html;
  $('#stories').innerHTML = storiesHtml();
  $('#thread').innerHTML = CHAPTERS.map((c) => `<button data-ch="${c.n}" title="${esc(c.title)}"><span>${c.n}</span></button>`).join('') + '<i class="fill"></i>';
}

// ---------- lazy media mounting ----------
const mounted = new Map(); // id -> { el, frames, three }

function mountMedia(media) {
  const id = media.dataset.id;
  if (mounted.has(id) || id === 'p42') return;
  const post = byId[id];
  const r = sceneOf(post);
  const ph = $('.ph', media);
  let frames = null;
  if (typeof r === 'string') {
    ph.innerHTML = r;
  } else if (r.frames) {
    ph.innerHTML = r.frames.map((s, i) => `<div class="frame ${i ? '' : 'on'}">${s}</div>`).join('');
    frames = $$('.frame', ph);
  } else if (r.slides) {
    ph.innerHTML = `<div class="slides">${r.slides.map((s) => `<div class="slide">${s}</div>`).join('')}</div>`;
    const sl = $('.slides', ph);
    const n = r.slides.length;
    sl.addEventListener('scroll', () => {
      const i = Math.round(sl.scrollLeft / sl.clientWidth);
      $$('.dots .dot', media).forEach((d, k) => d.classList.toggle('on', k === i));
      media.classList.toggle('at-start', i === 0);
      media.classList.toggle('at-end', i === n - 1);
    }, { passive: true });
    dragToSwipe(sl, media);
  }
  mounted.set(id, { frames, three: null });
  wireLatin(ph);
  $$('svg', ph).forEach((s) => s.pauseAnimations?.());
}

function unmountMedia(media) {
  const id = media.dataset.id;
  const m = mounted.get(id);
  if (!m) return;
  if (m.three) m.three.dispose();
  $('.ph', media).innerHTML = '';
  mounted.delete(id);
}

const nearObs = new IntersectionObserver((entries) => {
  for (const e of entries) e.isIntersecting ? mountMedia(e.target) : unmountMedia(e.target);
}, { rootMargin: '150% 0px' });

// ---------- carousels on desktop: arrows, dots, keys and click-and-drag ----------
function goSlide(media, i) {
  const sl = $('.slides', media);
  if (!sl) return;
  const n = sl.children.length;
  const to = Math.max(0, Math.min(n - 1, i));
  sl.scrollTo({ left: to * sl.clientWidth, behavior: 'smooth' });
}
const slideIndex = (media) => { const sl = $('.slides', media); return sl ? Math.round(sl.scrollLeft / sl.clientWidth) : 0; };
function dragToSwipe(sl, media) {
  let x0 = 0, left0 = 0, dragging = false;
  sl.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragging = true; x0 = e.clientX; left0 = sl.scrollLeft; media._dragged = false;
    sl.style.scrollSnapType = 'none';
    sl.setPointerCapture(e.pointerId);
  });
  sl.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 5) media._dragged = true;
    sl.scrollLeft = left0 - dx;
  });
  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - x0, w = sl.clientWidth;
    const from = Math.round(left0 / w);
    const to = Math.abs(dx) > w * 0.15 ? from + (dx < 0 ? 1 : -1) : from;
    sl.style.scrollSnapType = '';
    goSlide(media, to);
  };
  sl.addEventListener('pointerup', end);
  sl.addEventListener('pointercancel', end);
}

// ---------- the active post (plays sound, animates) ----------
let active = null;

function setFrame(media, i) {
  const m = mounted.get(media.dataset.id);
  if (!m?.frames) return;
  m.frames.forEach((f, k) => f.classList.toggle('on', k === i));
}

function speaking(media, who, on) {
  $$('[data-who].speaking', media).forEach((el) => el.classList.remove('speaking'));
  if (on && who) $$(`[data-who="${who}"]`, media).forEach((el) => el.classList.add('speaking'));
}

let liveTimer = null;
function startLive(media, post) {
  stopLive();
  const v = $('.viewers i', media);
  const chat = $('.livechat', media);
  let n = parseInt((v?.textContent || '0').replace(/,/g, ''), 10);
  let k = 0;
  if (chat) chat.innerHTML = '';
  liveTimer = setInterval(() => {
    n += Math.round(Math.random() * 900 - 200);
    if (v) v.textContent = n.toLocaleString('en-GB');
    if (chat && post.livechat && Math.random() < 0.6) {
      const [a, t] = post.livechat[k++ % post.livechat.length];
      const p = document.createElement('p');
      p.innerHTML = `<b>${esc(handleOf(a, post))}</b> ${esc(t)}`;
      chat.appendChild(p);
      while (chat.children.length > 5) chat.firstChild.remove();
    }
  }, 900);
}
function stopLive() { clearInterval(liveTimer); liveTimer = null; }

async function activate(media) {
  if (active === media) return;
  deactivate();
  active = media;
  const id = media.dataset.id;
  const post = byId[id];
  mountMedia(media);
  media.classList.add('active');
  media.classList.remove('ended');
  $$('svg', media).forEach((s) => s.unpauseAnimations?.());
  if (post.music) audio.cue(post.music, id);
  audio.ambience(post.amb || null);
  updateDatePill(post);

  if (post.type === 'immersive') mountThree(media, post);
  if (post.live) startLive(media, post);
  if (post.type === 'story' && post.story2) {
    const st = $('.story-text', media);
    media._storyT = setTimeout(() => { st.textContent = post.story2; media.classList.add('story-2'); }, 2600);
  }
  if (id === 'p42') { audio.runSequence(['r17_1'], { onLine: (l, w, t, d) => subs(media, l ? t : '', d) }); return; }
  if (post.seq) playSeq(media, post);
}

function playSeq(media, post) {
  media.classList.remove('ended');
  setFrame(media, 0);
  audio.runSequence(post.seq, {
    onLine: (lineId, who, text, dur) => { subs(media, lineId ? text : '', dur); speaking(media, who, !!lineId); },
    onFrame: (i) => setFrame(media, i),
    onEnd: () => { if ($('.replay', media)) media.classList.add('ended'); speaking(media, null, false); },
  });
}

// Captions: long lines are split into short chunks timed across the clip by length.
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
function subs(media, text, dur = 0) {
  const s = $('.subs', media);
  if (!s) return;
  clearTimeout(media._subT);
  if (!text) { s.classList.remove('on'); return; }
  const cs = dur ? chunks(text) : [text];
  const total = cs.reduce((n, c) => n + c.length, 0);
  let i = 0;
  const next = () => {
    s.textContent = cs[i];
    s.classList.add('on');
    const ms = (cs[i].length / total) * dur * 1000;
    if (++i < cs.length) media._subT = setTimeout(next, ms);
  };
  next();
}

function deactivate() {
  if (!active) return;
  const media = active;
  active = null;
  media.classList.remove('active', 'story-2');
  clearTimeout(media._storyT);
  const post = byId[media.dataset.id];
  if (post?.type === 'story' && post.story2) $('.story-text', media).textContent = post.story;
  audio.stopSequence();
  audio.stopCue(media.dataset.id);
  stopLive();
  subs(media, '');
  speaking(media, null, false);
  $$('svg', media).forEach((s) => s.pauseAnimations?.());
  const m = mounted.get(media.dataset.id);
  if (m?.three) { m.three.stop(); media.classList.remove('three-on'); }
}

async function mountThree(media, post) {
  const m = mounted.get(post.id);
  if (!m) return;
  try {
    if (!m.three) {
      const { createImmersive } = await import('./immersive.js');
      m.three = createImmersive(media, post.d3);
      media.appendChild(m.three.canvas);
      await m.three.ready;
    }
    if (active !== media) return;
    media.classList.add('three-on');
    m.three.start();
  } catch (e) {
    console.warn('3D unavailable, staying flat', e);
  }
}

const activeObs = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && e.intersectionRatio >= 0.6) activate(e.target);
    else if (e.target === active && e.intersectionRatio < 0.35) deactivate();
  }
}, { threshold: [0, 0.35, 0.6, 0.9] });

// ---------- Latin translations ----------
function wireLatin(root) {
  $$('text.tcap', root).forEach((t) => {
    const tr = translate(t.textContent);
    if (!tr) return;
    t.classList.add('has-en');
    t.dataset.en = tr.en;
    if (tr.real) t.dataset.real = '1';
  });
}
let tipFor = null;
function showTip(text) {
  const tip = $('#tip');
  tipFor = text;
  tip.innerHTML = `<span class="tip-en">${esc(text.dataset.en)}</span><span class="tip-src">${text.dataset.real ? '✦ Real Tapestry inscription' : 'Our own dog-Latin'}</span>`;
  tip.classList.add('on');
  const r = text.getBoundingClientRect();
  const w = tip.offsetWidth, h = tip.offsetHeight;
  const x = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2));
  const y = r.bottom + 8 + h > innerHeight ? r.top - h - 8 : r.bottom + 8;
  tip.style.transform = `translate(${x}px, ${y}px)`;
}
function hideTip() { $('#tip').classList.remove('on'); tipFor = null; }
document.addEventListener('pointerover', (e) => { if (e.pointerType === 'mouse') { const t = e.target.closest?.('text.has-en'); if (t) showTip(t); } });
document.addEventListener('pointerout', (e) => { if (e.pointerType === 'mouse' && e.target.closest?.('text.has-en')) hideTip(); });
addEventListener('scroll', () => tipFor && hideTip(), { passive: true });
document.addEventListener('click', (e) => { if (tipFor && !e.target.closest?.('text.has-en')) hideTip(); });

// ---------- header date + timeline ----------
function updateDatePill(post) {
  if (post?.date) $('#datepill').textContent = post.date.replace(/ · .*/, '');
}
function updateThread() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const f = Math.max(0, Math.min(1, scrollY / max));
  $('#thread .fill').style.transform = matchMedia('(max-width: 540px)').matches ? `scaleX(${f})` : `scaleY(${f})`;
  const chs = $$('.chapter');
  let cur = null;
  for (const c of chs) if (c.getBoundingClientRect().top < innerHeight * 0.5) cur = c.dataset.ch;
  $$('#thread button').forEach((b) => b.classList.toggle('on', b.dataset.ch === cur));
}

// ---------- sheets ----------
function openSheet(html, cls = '') {
  const sh = $('#sheet');
  sh.className = `sheet open ${cls}`;
  $('.sheet-body', sh).innerHTML = html;
  $('#scrim').classList.add('open');
  return sh;
}
function closeSheet() { $('#sheet').classList.remove('open'); $('#scrim').classList.remove('open'); }

function openProfile(acc) {
  const a = ACCOUNTS[acc];
  if (!a) return;
  const posts = POSTS.filter((p) => p.acc === acc);
  openSheet(`<div class="profile">
    <div class="pr-top">${avatarHtml(acc, 84)}<div class="pr-stats"><div><b>${posts.length}</b><span>posts</span></div><div><b>${esc(a.followers)}</b><span>followers</span></div><div><b>${acc === 'odo' ? 1 : acc === 'comet' ? 0 : 3}</b><span>following</span></div></div></div>
    <p class="pr-name">${esc(a.name)} ${['edward', 'harold', 'william'].includes(acc) ? CROWN : ''}</p>
    <p class="pr-handle">@${esc(a.handle)}${acc === 'william' ? ` → @${esc(a.handle2)}` : ''}</p>
    <p class="pr-bio">${esc(a.bio)}</p>
    <div class="pr-grid">${posts.map((p) => `<button data-goto="${p.id}">${thumb(p)}</button>`).join('') || '<p class="c-off">No posts. Lurker.</p>'}</div>
  </div>`, 'profile-sheet');
}
function thumb(p) {
  if (p.type === 'straight' || p.type === 'stitched') return '';
  const r = sceneOf(p);
  const s = typeof r === 'string' ? r : (r.frames || r.slides)[0];
  return s;
}

async function shareImage(svg, caption, handle) {
  const c = await rasterize(svg, 1080, 1350);
  const out = document.createElement('canvas');
  out.width = 1080; out.height = 1500;
  const x = out.getContext('2d');
  x.fillStyle = '#1c1b18'; x.fillRect(0, 0, 1080, 1500);
  x.drawImage(c, 0, 0);
  x.fillStyle = '#eadfc4';
  x.font = '64px "Uncial Antiqua", Georgia, serif';
  x.fillText('1066gram', 48, 1448);
  x.font = '34px Inter, system-ui, sans-serif';
  x.textAlign = 'right';
  x.fillStyle = '#d3a24a';
  x.fillText(handle ? '@' + handle : '', 1032, 1440);
  return new Promise((r) => out.toBlob(r, 'image/png'));
}

function postUrl(id) { return `${location.origin}${location.pathname}#${id}`; }

function openShare(post) {
  const url = postUrl(post.id);
  openSheet(`<div class="share">
    <p class="sh-title">Share</p>
    <div class="sh-row">
      <button class="sh-native">↗<span>Share…</span></button>
      <button class="sh-copy">🔗<span>Copy link</span></button>
      <button class="sh-img">🖼<span>Save image</span></button>
    </div>
    <p class="sh-url">${esc(url)}</p>
  </div>`, 'share-sheet');
  const sheet = $('#sheet');
  const text = `${handleOf(post.acc, post)} on 1066gram: ${(post.caption || '').split('\n')[0]}`;
  $('.sh-native', sheet).onclick = async () => {
    try { await navigator.share({ title: '1066gram', text, url }); closeSheet(); } catch {}
  };
  if (!navigator.share) $('.sh-native', sheet).hidden = true;
  $('.sh-copy', sheet).onclick = async () => { try { await navigator.clipboard.writeText(url); toast('Link copied'); } catch { toast(url); } closeSheet(); };
  $('.sh-img', sheet).onclick = async () => {
    toast('Stitching…');
    const r = sceneOf(post);
    const svg = typeof r === 'string' ? r : (r.frames || r.slides)[0];
    const blob = await shareImage(svg, post.caption, handleOf(post.acc, post));
    download(blob, `1066gram-${post.id}.png`);
  };
}

// Shows the stitched image in a sheet: press-and-hold / right-click saves it anywhere,
// and the download button works wherever the host allows downloads.
function download(blob, name) {
  const url = URL.createObjectURL(blob);
  openSheet(`<div class="imgsheet"><img src="${url}" alt="Your 1066gram image"><p>Press and hold (or right-click) the image to save it.</p><a class="primary" href="${url}" download="${esc(name)}">Download</a></div>`, 'image-sheet');
}

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 1800);
}

// ---------- Get Stitched ----------
const BLOCK = /\b(fuck|shit|cunt|bitch|bastard|wank|twat|dick|cock|piss|nigg|fag|slut|whore|rape|nazi|hitler|porn|sex|tits|arse|asshole)\w*/i;
let stT = 0;
function stitchedCaption() {
  const raw = ($('#st-text')?.value || '').toUpperCase().replace(/[^A-Z0-9 ,.!?'&-]/g, '').trim();
  if (BLOCK.test(raw)) return 'HIC SOMEONE TRIED TO BE RUDE';
  return 'HIC ' + (raw || TEMPLATES[stT].sample);
}
function renderStitched() {
  const r = TEMPLATES[stT].scene(stitchedCaption());
  const svg = typeof r === 'string' ? r : '';
  const el = $('.st-preview');
  if (el) { el.innerHTML = svg; wireLatin(el); }
}
function initStitched() {
  const art = $('#p42');
  $$('.st-t', art).forEach((b) => {
    const t = TEMPLATES[+b.dataset.t];
    const r = t.scene('');
    b.insertAdjacentHTML('afterbegin', `<span class="tt">${r}</span>`);
    b.onclick = () => { stT = +b.dataset.t; $$('.st-t', art).forEach((x) => x.classList.toggle('on', x === b)); $('#st-text').placeholder = t.sample; renderStitched(); };
  });
  $('#st-text').addEventListener('input', renderStitched);
  renderStitched();
  const make = () => shareImage(TEMPLATES[stT].scene(stitchedCaption()), '', '');
  $('.st-save', art).onclick = async () => { toast('Stitching…'); download(await make(), '1066gram-my-ending.png'); };
  $('.st-share', art).onclick = async () => {
    const blob = await make();
    const file = new File([blob], '1066gram-my-ending.png', { type: 'image/png' });
    try {
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: '1066gram', text: `${stitchedCaption()} — my ending for the Bayeux Tapestry`, url: postUrl('p42') });
      else download(blob, '1066gram-my-ending.png');
    } catch { download(blob, '1066gram-my-ending.png'); }
  };
}

// ---------- events ----------
function bind() {
  feed.addEventListener('click', (e) => {
    const lat = e.target.closest?.('text.has-en');
    if (lat) { showTip(lat); return; }
    const t = e.target.closest('button, .media');
    if (!t) return;
    const art = e.target.closest('.post');
    const post = art && byId[art.dataset.id];
    if (t.matches('.enter')) { audio.unlock().then(() => audio.cue('title', 'splash')); $('.chapter')?.scrollIntoView({ behavior: 'smooth' }); return; }
    if (t.matches('.enter-quiet')) { $('.chapter')?.scrollIntoView({ behavior: 'smooth' }); return; }
    if (t.matches('.to-top')) { scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (t.matches('.acc, .av-btn')) { openProfile(t.dataset.acc); return; }
    if (t.matches('.viewall')) { t.closest('.comments').classList.add('all'); t.remove(); return; }
    if (t.matches('.cmt')) { const c = $('.comments', art); c.classList.add('all'); $('.viewall', c)?.remove(); return; }
    if (t.matches('.cnav')) { const m = t.closest('.media'); goSlide(m, slideIndex(m) + (t.matches('.next') ? 1 : -1)); return; }
    if (t.matches('.dot')) { goSlide(t.closest('.media'), +t.dataset.i); return; }
    if (t.matches('.like')) { like(art, !t.classList.contains('on')); return; }
    if (t.matches('.shr')) { openShare(post); return; }
    if (t.matches('.sav')) { t.classList.toggle('on'); toast(t.classList.contains('on') ? 'Saved to your chest' : 'Removed'); return; }
    if (t.matches('.more-btn')) { openShare(post); return; }
    if (t.matches('.sound')) { e.stopPropagation(); if (audio.isMuted()) audio.unlock(); else audio.setMuted(true); return; }
    if (t.matches('.replay')) { e.stopPropagation(); audio.unlock(); playSeq(t.closest('.media'), post); return; }
    if (t.matches('.media')) {
      if (t._dragged) { t._dragged = false; return; }
      const now = Date.now();
      if (now - (t._tap || 0) < 320) { like(art, true); burst(t); }
      else if (audio.isMuted() && post?.seq) { audio.unlock(); }
      t._tap = now;
    }
  });

  $('#stories').addEventListener('click', (e) => { const b = e.target.closest(".sto"); if (b) openProfile(b.dataset.acc); });
  $('#thread').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) $(`#ch-${b.dataset.ch}`)?.scrollIntoView({ behavior: 'smooth' }); });
  $('#scrim').addEventListener('click', closeSheet);
  $('#sheet').addEventListener('click', (e) => {
    const g = e.target.closest('[data-goto]');
    if (g) { closeSheet(); document.getElementById(g.dataset.goto)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    if (e.target.closest('.sheet-close')) closeSheet();
  });
  $('#mute').addEventListener('click', () => (audio.isMuted() ? audio.unlock() : audio.setMuted(true)));
  $('.brand').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  addEventListener('scroll', () => requestAnimationFrame(updateThread), { passive: true });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && active?.classList.contains('carousel') && !e.target.closest('input')) {
      e.preventDefault();
      goSlide(active, slideIndex(active) + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });

  // Unlock audio on the first real tap anywhere, not just the enter button.
  const firstTouch = (e) => {
    if (e.target.closest?.('#mute, .sound, .enter-quiet')) return;
    removeEventListener('click', firstTouch, true);
    removeEventListener('touchend', firstTouch, true);
    if (audio.isMuted()) audio.unlock();
  };
  addEventListener('click', firstTouch, true);
  addEventListener('touchend', firstTouch, true);
}

function like(art, on) {
  const b = $('.like', art);
  if (!b) return;
  b.classList.toggle('on', on);
  if (on) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); audio.sfx('ding', 0.5); }
}
function burst(media) {
  const b = $('.burst', media);
  b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
}

// ---------- boot ----------
render();
bind();
initStitched();
$$('.media').forEach((m) => { nearObs.observe(m); activeObs.observe(m); });
// Each chapter plate gets its own short sting as it arrives.
const chapterObs = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) audio.cue(`sting${CHAPTERS.findIndex((c) => c.n === e.target.dataset.ch) + 1}`, 'chapter');
}, { threshold: 0.6 });
$$('.chapter').forEach((c) => chapterObs.observe(c));
audio.setMuted(true);
if (location.hash && document.getElementById(location.hash.slice(1))) {
  requestAnimationFrame(() => document.getElementById(location.hash.slice(1)).scrollIntoView({ block: 'start' }));
}
updateThread();
