// Generates every voice line and sound effect into app/audio.
// Usage: node tools/generate-audio.mjs [--force] [id ...]
// The API key is read from the minifig studio .env at run time and never stored in this project.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VOICES, LINES, SFX } from './voice-lines.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_PATH = process.env.ELEVENLABS_ENV || 'C:/Users/nik/OneDrive/Code/videos/minifig studio/.env';
const KEY = readFileSync(ENV_PATH, 'utf8').match(/^ELEVENLABS_API_KEY=(.*)$/m)?.[1].trim().replace(/^"|"$/g, '');
if (!KEY) throw new Error('ELEVENLABS_API_KEY not found');

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = new Set(args.filter((a) => !a.startsWith('--')));
const VO_DIR = join(ROOT, 'app/audio/vo');
const SFX_DIR = join(ROOT, 'app/audio/sfx');
mkdirSync(VO_DIR, { recursive: true });
mkdirSync(SFX_DIR, { recursive: true });

let chars = 0;

async function post(url, body, out) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      chars += Number(res.headers.get('character-cost') || res.headers.get('x-character-count') || 0);
      writeFileSync(out, Buffer.from(await res.arrayBuffer()));
      return;
    }
    const msg = await res.text();
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      continue;
    }
    throw new Error(`${res.status} ${msg.slice(0, 200)}`);
  }
  throw new Error('gave up after retries');
}

const jobs = [
  ...LINES.map(([id, who, text, model_id = 'eleven_v4']) => ({
    id,
    out: join(VO_DIR, `${id}.mp3`),
    run: (out) =>
      post(`https://api.elevenlabs.io/v1/text-to-speech/${VOICES[who]}?output_format=mp3_44100_128`, { text, model_id }, out),
  })),
  ...SFX.map(([id, text, duration_seconds]) => ({
    id,
    out: join(SFX_DIR, `${id}.mp3`),
    run: (out) => post('https://api.elevenlabs.io/v1/sound-generation', { text, duration_seconds, prompt_influence: 0.5 }, out),
  })),
].filter((j) => (only.size ? only.has(j.id) : true) && (force || !existsSync(j.out)));

console.log(`${jobs.length} clips to generate`);
let done = 0;
const failed = [];
async function worker() {
  while (jobs.length) {
    const job = jobs.shift();
    try {
      await job.run(job.out);
      console.log(`✓ ${job.id} (${++done})`);
    } catch (e) {
      failed.push(job.id);
      console.log(`✗ ${job.id}: ${e.message}`);
    }
  }
}
await Promise.all([worker(), worker(), worker()]);
console.log(`Done. ${done} generated, ${failed.length} failed${failed.length ? ': ' + failed.join(', ') : ''}. Reported character cost: ${chars || 'n/a'}`);
