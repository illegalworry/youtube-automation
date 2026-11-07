// render.mjs — deterministic frame renderer for lyric-card videos (headless Chromium -> ffmpeg).
//   node render.mjs --project projects/ija                       square video -> out/<title>_square.mp4
//   node render.mjs --project projects/ija --fmt vertical         9:16 version
//   node render.mjs --project projects/ija --stills 1,5.5,12      PNG stills -> build/stills
//   options: --workers N  --from S --to S  --fps N
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const args = {}; { const a = process.argv.slice(2); for (let i = 0; i < a.length; i++) if (a[i].startsWith('--')) { const k = a[i].slice(2); args[k] = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true; } }
if (!args.project) { console.error('usage: node render.mjs --project projects/<name> [--fmt square|vertical] [--stills t1,t2]'); process.exit(1); }
const PROJECT = path.resolve(args.project);
const CFG = JSON.parse(fs.readFileSync(path.join(PROJECT, 'config.json'), 'utf8'));
const BUILD = path.join(PROJECT, 'build'), OUT = path.join(PROJECT, 'out');
fs.mkdirSync(BUILD, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
if (!fs.existsSync(path.join(BUILD, 'audio.json'))) spawnSync('python3', [path.join(ROOT, 'tools/analyze.py'), PROJECT, String(CFG.fps || 60)], { stdio: 'inherit' });
const FMT = args.fmt || 'square';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const p = url.startsWith('/project/') ? path.join(PROJECT, url.slice(9)) : path.join(ROOT, url);
  if (!(p.startsWith(ROOT) || p.startsWith(PROJECT)) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
}).listen(0);
const PORT = server.address().port;

async function open(browser) {
  const [w, h] = CFG.formats[FMT];
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  page.on('console', m => { if (m.type() === 'error') console.log('[page]', m.text()); });
  await page.goto(`http://localhost:${PORT}/engine/index.html?fmt=${FMT}`);
  await page.waitForFunction('window.READY === true || !!window.BOOT_ERROR', null, { timeout: 60000 });
  const err = await page.evaluate('window.BOOT_ERROR'); if (err) throw new Error(err);
  return page;
}
const frame = (page, t, type = 'jpeg') => page.evaluate(t => window.renderAt(t), t).then(() => page.screenshot({ type, ...(type === 'jpeg' ? { quality: 95 } : {}) }));

if (args.stills) {
  const b = await chromium.launch(); const page = await open(b);
  const dir = path.join(BUILD, 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const t of String(args.stills).split(',').map(Number)) { fs.writeFileSync(path.join(dir, `${FMT}_${t.toFixed(2)}.png`), await frame(page, t, 'png')); }
  console.log('stills ->', dir); await b.close(); server.close(); process.exit(0);
}

const fps = +(args.fps || CFG.fps || 60);
const dur = JSON.parse(fs.readFileSync(path.join(BUILD, 'audio.json'))).duration;
const f0 = Math.round((+args.from || 0) * fps), f1 = Math.round((args.to ? +args.to : dur) * fps);
const W = +(args.workers || Math.max(1, os.cpus().length));
const parts = path.join(BUILD, `parts_${FMT}`); fs.rmSync(parts, { recursive: true, force: true }); fs.mkdirSync(parts, { recursive: true });
const chunk = Math.ceil((f1 - f0) / W); let done = 0; const t0 = Date.now();
await Promise.all(Array.from({ length: W }, async (_, w) => {
  const a = f0 + w * chunk, b = Math.min(f1, a + chunk); if (a >= b) return;
  const br = await chromium.launch(); const page = await open(br);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', path.join(parts, `p${String(w).padStart(2, '0')}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) {
    const buf = await frame(page, f / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (++done % 120 === 0) console.log(`${done}/${f1 - f0} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await br.close();
}));
server.close();
const list = path.join(parts, 'list.txt');
fs.writeFileSync(list, fs.readdirSync(parts).filter(f => f.endsWith('.mp4')).sort().map(f => `file '${path.join(parts, f)}'`).join('\n'));
const silent = path.join(BUILD, `silent_${FMT}.mp4`);
spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent], { stdio: 'inherit' });
const out = path.join(OUT, `${(args.name || CFG.title).replace(/[\\/:*?"<>|\s]+/g, '_')}_${FMT}.mp4`);
const ss = (+args.from || 0);
spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', silent, '-ss', String(ss), '-i', path.join(PROJECT, CFG.audio), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)}s ->`, out);
