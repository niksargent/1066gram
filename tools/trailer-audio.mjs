// Generates the trailer's narration, sound effects and score into trailer/audio.
// Usage: node tools/trailer-audio.mjs [--force] [id ...]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'trailer/audio');
mkdirSync(OUT, { recursive: true });
const KEY = readFileSync('C:/Users/nik/OneDrive/Code/videos/minifig studio/.env', 'utf8').match(/^ELEVENLABS_API_KEY=(.*)$/m)[1].trim().replace(/^"|"$/g, '');

// The trailer voice: "David - Movie Trailer Narrator" from the ElevenLabs library (deepest of six auditioned).
export const NARRATOR = 'FF7KdobWPaiR0vkcALHF';

export const VO = [
  ['t1', '[deep, slow, epic movie trailer voice, ominous] In a world... before the internet...'],
  ['t2', '[deep, slow, grand movie trailer voice] ...one story was told... in seventy metres of wool.'],
  ['t3', '[deep movie trailer voice, quiet and intriguing] Now... it has been retold...'],
  ['t4', '[deep movie trailer voice, with a hint of a smile] ...as if everyone... had a phone.'],
  ['t5', '[deep, epic movie trailer voice, building] A tale of ambition. Betrayal. And one very confused hawk.'],
  ['t6', '[huge, booming movie trailer title read] Ten sixty-six gram.'],
  ['t7', '[deep movie trailer voice, wry and warm] It is ten sixty-six. Everyone is posting.'],
];

const SFX = [
  ['braam', 'massive cinematic movie trailer braam, deep distorted brass hit with sub bass boom and long reverb tail', 4],
  ['hit', 'huge cinematic trailer impact hit, low sub drop boom, punchy', 2.5],
  ['hit2', 'cinematic trailer metallic impact slam with deep boom', 2.5],
  ['whoosh', 'very fast cinematic whoosh swipe transition', 1],
  ['riser', 'cinematic tension riser building fast to a peak, reverse cymbal and strings', 4],
  ['scratch', 'vinyl record scratch, music stops abruptly', 1.2],
  ['pop', 'bright phone notification pop sound', 0.8],
  ['thread', 'close up sound of a needle and thread pulled slowly through coarse linen, quiet room', 4],
];

const MUSIC = [
  ['tr_intro', 'Instrumental cinematic movie trailer opening: dark low drone, distant wordless choir, slow ticking pulse, mounting tension, no drums yet.', 14000],
  ['tr_build', 'Instrumental epic movie trailer action build: thunderous taiko drums accelerating, driving staccato strings, brass stabs, rising intensity to a huge peak. Relentless, cinematic, no vocals.', 16000],
  ['tr_reveal', 'Instrumental cheeky epic movie trailer finale: full orchestra with a playful medieval lute and recorder melody, triumphant and witty, big drums, ending on a huge final chord. No vocals.', 26000],
];

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = new Set(args.filter((a) => !a.startsWith('--')));
const want = (id) => (!only.size || only.has(id)) && (force || !existsSync(join(OUT, `${id}.mp3`)));

async function post(url, body, file) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { method: 'POST', headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) { writeFileSync(file, Buffer.from(await r.arrayBuffer())); console.log('✓', file.split(/[\/]/).pop()); return; }
    if (r.status === 429 || r.status >= 500) { await new Promise((x) => setTimeout(x, 8000 * (i + 1))); continue; }
    throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  }
  throw new Error('gave up: ' + file);
}

for (const [id, text] of VO) if (want(id)) await post(`https://api.elevenlabs.io/v1/text-to-speech/${NARRATOR}?output_format=mp3_44100_192`, { text, model_id: 'eleven_v4' }, join(OUT, `${id}.mp3`));
for (const [id, text, d] of SFX) if (want(id)) await post('https://api.elevenlabs.io/v1/sound-generation', { text, duration_seconds: d, prompt_influence: 0.6 }, join(OUT, `${id}.mp3`));
for (const [id, prompt, ms] of MUSIC) if (want(id)) await post('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192', { prompt, music_length_ms: ms, force_instrumental: true }, join(OUT, `${id}.mp3`));
