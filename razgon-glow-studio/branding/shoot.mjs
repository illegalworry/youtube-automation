// node branding/shoot.mjs → branding/banner.png, branding/avatar.png
import http from 'http'; import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright';
const ROOT = path.resolve('.'); const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); }).listen(0);
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const [k, w, h] of [['banner', 2560, 1440], ['avatar', 800, 800]]) {
  const pg = await b.newPage({ viewport: { width: w, height: h } }); pg.on('pageerror', e => console.log('ERR', e.message)); pg.on('console', m => console.log(m.text()));
  await pg.goto(`http://localhost:${srv.address().port}/branding/art.html?kind=${k}`); await pg.waitForFunction('window.DONE', null, { timeout: 30000 });
  await pg.locator('#c').screenshot({ path: `branding/${k}.png` }); console.log('wrote', k);
}
await b.close(); srv.close();
