// Frame-by-frame renderer: serves the folder, opens scene in headless Chromium, screenshots every frame, muxes with ffmpeg.
import http from 'http'; import fs from 'fs'; import path from 'path'; import { spawnSync } from 'child_process';
import { createRequire } from 'module'; const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const root = path.dirname(new URL(import.meta.url).pathname);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const SCALE = +arg('scale', 1), FPS = 24, DUR = +arg('dur', 22.96), W = Math.round(1920 * SCALE), H = Math.round(1080 * SCALE);
const FROM = Math.round(+arg('from', 0) * FPS), TO = Math.min(Math.round(+arg('to', DUR) * FPS), Math.round(DUR * FPS));
const AT = arg('at', null), WORKERS = +arg('workers', 3), OUT = arg('out', 'build/frames');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/index.html')); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(d); } }); }).listen(0);
await new Promise(r => srv.on('listening', r)); const port = srv.address().port;
fs.mkdirSync(path.join(root, OUT), { recursive: true });
const frames = AT ? AT.split(',').map(s => Math.round(+s * FPS)) : Array.from({ length: Math.max(0, TO - FROM) }, (_, i) => FROM + i);
async function worker(id, list) {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'] });
  const pg = await b.newPage({ viewport: { width: W, height: H } });
  pg.on('console', m => { if (/error|fail/i.test(m.text())) console.log('[page]', m.text()); }); pg.on('pageerror', e => console.log('[pageerror]', e.message));
  await pg.goto(`http://localhost:${port}/index.html?w=${W}&h=${H}`); await pg.waitForFunction('window.ready === true', null, { timeout: 120000 });
  let n = 0, t0 = Date.now();
  for (const f of list) {
    await pg.evaluate(t => window.drawFrame(t), f / FPS);
    await pg.screenshot({ path: path.join(root, OUT, `f${String(f).padStart(5, '0')}.png`) });
    if (++n % 24 === 0) console.log(`worker ${id}: ${n}/${list.length} (${((Date.now() - t0) / n / 1000).toFixed(2)} s/frame)`);
  }
  await b.close();
}
const lists = Array.from({ length: WORKERS }, (_, i) => frames.filter((_, k) => k % WORKERS === i));
await Promise.all(lists.map((l, i) => l.length ? worker(i, l) : null)); srv.close();
console.log('frames done', frames.length);
