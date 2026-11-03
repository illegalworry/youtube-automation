import http from 'http'; import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright';
const ROOT = path.resolve('.'); const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); }).listen(0);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
fs.mkdirSync('branding/variants', { recursive: true });
for (const bg of process.argv.slice(2)) { const pg = await b.newPage({ viewport: { width: 800, height: 800 } }); await pg.goto(`http://localhost:${srv.address().port}/branding/art.html?kind=avatar&bg=${bg}`); await pg.waitForFunction('window.DONE'); await pg.locator('#c').screenshot({ path: `branding/variants/${bg}.png` }); }
await b.close(); srv.close();
