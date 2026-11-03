// node render4.js spec.json outdir prefix [--no-reel]
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { execFileSync, spawn } = require('child_process');
const T = require('./templates'); const R = require('./reel4');
const [specF, outDir, prefix] = process.argv.slice(2); const noReel = process.argv.includes('--no-reel');
const DIR = __dirname; const spec = JSON.parse(fs.readFileSync(specF, 'utf8')); fs.mkdirSync(outDir, { recursive: true });
const ENG = fs.readFileSync(path.join(DIR, 'engrave.js'), 'utf8');
async function shot(b, html, w, h, file, scale = 2) {
  const cx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale }); const p = await cx.newPage();
  await p.route('http://wasl.local/**', r => { const u = new URL(r.request().url()); const f = path.join(DIR, decodeURIComponent(u.pathname)); if (u.pathname === '/') return r.fulfill({ body: html, contentType: 'text/html' }); return r.fulfill({ path: f }); });
  await p.goto('http://wasl.local/'); await p.evaluate(ENG); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => { document.querySelectorAll('canvas.obj').forEach(c => { const s = +c.dataset.size, k = 2; const e = Engrave.render(s * k, s * k, { shape: c.dataset.shape, ink: c.dataset.ink, spacing: 6 * k, ax: -0.45 + Math.random() * 0.3, ay: 0.4 + Math.random() * 0.6 }); c.width = s * k; c.height = s * k; c.getContext('2d').drawImage(e, 0, 0); }); });
  const tmp = file + '.png'; await p.screenshot({ path: tmp }); await cx.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', tmp, '-vf', `scale=${w}:${h}:flags=lanczos`, '-q:v', '2', file]); fs.unlinkSync(tmp); return file;
}
(async () => {
  const b = await chromium.launch(); const ctx = b; const out = [];
  const N = spec.items.length + 2;
  out.push(await shot(ctx, T.cover(spec.cover, N), 1080, 1350, `${outDir}/${prefix}_c1.jpg`));
  for (let i = 0; i < spec.items.length; i++) out.push(await shot(ctx, T.item(spec.items[i], i, N), 1080, 1350, `${outDir}/${prefix}_c${i + 2}.jpg`));
  out.push(await shot(ctx, T.cta(spec.cta, N), 1080, 1350, `${outDir}/${prefix}_c${N}.jpg`));
  if (spec.story) out.push(await shot(ctx, T.story(spec.story), 1080, 1920, `${outDir}/${prefix}_story.jpg`, 1.5));
  if (spec.logo) out.push(await shot(ctx, T.logo(), 1080, 1080, `${outDir}/logo.jpg`, 1));
  if (spec.reel && !noReel) out.push(...await R.renderReel(ctx, spec.reel, outDir, prefix, DIR, ENG));
  await b.close(); console.log(out.join('\n'));
})();
