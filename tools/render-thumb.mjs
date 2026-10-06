// Renders the YouTube thumbnails (1280x720): trailer/thumbnail.png, or with `comet` trailer/thumbnail-comet.png.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ALT = process.argv[2] === 'comet';
const { chromium } = createRequire('C:/Users/nik/OneDrive/Code/videos/seaglass/package.json')('playwright-core');
const server = spawn('python', [join(ROOT, 'tools/serve.py'), '8069'], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:8069/${ALT ? 'thumb-comet' : 'thumb'}.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ready);
  await page.evaluate(() => window.__ready);
  const out = `trailer/thumbnail${ALT ? '-comet' : ''}.png`;
  await page.screenshot({ path: join(ROOT, out) });
  console.log('→', out);
} finally { await browser.close(); server.kill(); }
