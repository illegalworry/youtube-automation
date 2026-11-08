import { chromium } from 'playwright'; import http from 'http'; import fs from 'fs'; import path from 'path';
const [,, page, out, w='2400', h='2000'] = process.argv; const root = path.resolve('web');
const srv = http.createServer((q, s) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p)) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': p.endsWith('.js') ? 'text/javascript' : 'text/html' }); fs.createReadStream(p).pipe(s); }).listen(0);
await new Promise(r => srv.on('listening', r));
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: +w, height: +h } });
pg.on('pageerror', e => console.log('ERR', e.message)); pg.on('console', m => console.log('PAGE', m.text()));
await pg.goto(`http://localhost:${srv.address().port}/${page}`); await pg.waitForFunction(() => window.ready || window.err, null, { timeout: 60000 });
console.log(await pg.evaluate(() => window.err || 'ok'));
await pg.screenshot({ path: out, type: 'jpeg', quality: 85 }); await b.close(); srv.close();
