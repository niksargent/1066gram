// Renders the YouTube thumbnail: trailer/thumbnail.png (1280x720).
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire('C:/Users/nik/OneDrive/Code/videos/seaglass/package.json')('playwright-core');
const server = spawn('python', [join(ROOT, 'tools/serve.py'), '8069'], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8069/thumb.html', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ready);
  await page.evaluate(() => window.__ready);
  await page.screenshot({ path: join(ROOT, 'trailer/thumbnail.png') });
  console.log('→ trailer/thumbnail.png');
} finally { await browser.close(); server.kill(); }
