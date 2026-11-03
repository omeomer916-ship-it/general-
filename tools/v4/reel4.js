// Kinetic-typography reel renderer with synthesized sound design.
const fs = require('fs'); const path = require('path'); const { execFileSync, spawn } = require('child_process');
const T = require('./templates');
const DUR = { hook: 2.8, point: 3.1, cta: 3.4 };

function sceneHtml(sc, i, start) {
  const d = sc.dur, s = start.toFixed(3), e = T.esc;
  const words = (txt, cls, base, step) => e(txt).split(' ').map((w, k) => `<span class="w ${cls}" style="animation-delay:${(start + base + k * step).toFixed(3)}s">${w}</span>`).join(' ');
  let inner = '';
  if (sc.type === 'hook') {
    inner = `<div class="flash" style="animation-delay:${s}s"></div>
    <div class="shake" style="animation-delay:${(start + 0.15).toFixed(3)}s;position:absolute;right:100px;left:100px;top:760px">
      <div class="disp" style="font-size:${sc.size || 170}px;line-height:1.05">${words(sc.line1, 'slam', 0.05, 0.13)}</div>
      <div class="ruq rise" style="font-size:${(sc.size || 170) * 0.85}px;color:var(--w);line-height:1.15;animation-delay:${(start + 0.55).toFixed(3)}s">${e(sc.accent)}</div>
    </div>`;
  } else if (sc.type === 'point') {
    inner = `<div class="out numIn" style="position:absolute;right:100px;top:520px;font-family:Alex;font-weight:800;font-size:260px;line-height:1;animation-delay:${s}s">${String(sc.n).padStart(2, '0')}</div>
    <div style="position:absolute;right:100px;left:100px;top:840px">
      <div class="ruq fade" style="font-size:60px;animation-delay:${(start + 0.15).toFixed(3)}s">${e(sc.label || '')}</div>
      <div class="wipe" style="font-family:Reem;font-weight:700;font-size:${sc.size || 104}px;line-height:1.18;margin-top:10px;animation-delay:${(start + 0.25).toFixed(3)}s">${e(sc.title)}</div>
      <div class="bar" style="animation-delay:${(start + 0.55).toFixed(3)}s"></div>
      <div class="light fade" style="font-size:46px;line-height:1.55;color:var(--g1);margin-top:26px;animation-delay:${(start + 0.8).toFixed(3)}s">${e(sc.sub || '')}</div>
    </div>`;
  } else {
    inner = `<div class="pop" style="position:absolute;left:390px;top:470px;animation-delay:${s}s">${T.MARK(300)}</div>
    <div style="position:absolute;right:80px;left:80px;top:860px;text-align:center">
      <div class="disp pop" style="font-size:150px;animation-delay:${(start + 0.3).toFixed(3)}s">${e(sc.line1)}</div>
      <div class="ruq pop" style="font-size:130px;color:var(--w);line-height:1.15;animation-delay:${(start + 0.55).toFixed(3)}s">${e(sc.accent)}</div>
      <div class="pop" style="display:inline-block;margin-top:50px;background:var(--w);color:var(--k);font-family:Lalezar;font-size:56px;padding:28px 70px;animation-delay:${(start + 0.85).toFixed(3)}s">${e(sc.button || 'تابعنا لمحتوى يكبّر مشروعك')}</div>
    </div>`;
  }
  return `<div class="sc" style="animation-duration:${d}s;animation-delay:${s}s">${inner}</div>`;
}
const CSS = `
.sc{position:absolute;inset:0;opacity:0;animation-name:show;animation-timing-function:step-end}
@keyframes show{0%{opacity:1}100%{opacity:1}}
.w{display:inline-block;animation:slam .45s cubic-bezier(.2,1.4,.4,1) both}
@keyframes slam{0%{opacity:0;transform:scale(1.9);filter:blur(14px)}60%{opacity:1;filter:blur(0)}100%{opacity:1;transform:scale(1)}}
.rise{animation:rise .6s cubic-bezier(.2,.9,.2,1) both}@keyframes rise{0%{opacity:0;transform:translateY(80px);clip-path:inset(0 0 100% 0)}100%{opacity:1;transform:none;clip-path:inset(0 0 0 0)}}
.flash{position:absolute;inset:0;background:#fff;animation:flash .35s ease-out both;z-index:5}@keyframes flash{0%{opacity:.9}100%{opacity:0}}
.shake{animation:shake .35s linear both}@keyframes shake{0%,100%{transform:none}20%{transform:translate(-14px,8px)}40%{transform:translate(12px,-10px)}60%{transform:translate(-8px,6px)}80%{transform:translate(6px,-4px)}}
.numIn{animation:numIn .6s cubic-bezier(.2,.9,.2,1) both}@keyframes numIn{0%{opacity:0;transform:translateX(-260px)}100%{opacity:1;transform:none}}
.fade{animation:fade .5s ease both}@keyframes fade{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:none}}
.wipe{animation:wipe .7s cubic-bezier(.6,0,.2,1) both}@keyframes wipe{0%{clip-path:inset(0 0 0 100%)}100%{clip-path:inset(0 0 0 0)}}
.bar{height:6px;background:var(--w);margin-top:22px;transform-origin:right;animation:bar .6s cubic-bezier(.6,0,.2,1) both;width:240px}@keyframes bar{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
.pop{animation:pop .5s cubic-bezier(.2,1.5,.4,1) both}@keyframes pop{0%{opacity:0;transform:scale(.7)}100%{opacity:1;transform:none}}
.draw path,.draw line{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1s cubic-bezier(.6,0,.2,1) forwards;animation-delay:inherit}
.draw{animation:none}@keyframes draw{to{stroke-dashoffset:0}}
.wipeT{position:absolute;inset:0;background:var(--w);z-index:6;animation:wt .32s cubic-bezier(.7,0,.3,1) both;transform-origin:left}
@keyframes wt{0%{transform:translateX(100%)}50%{transform:translateX(0)}100%{transform:translateX(-100%)}}
#prog{position:absolute;left:100px;right:100px;bottom:150px;height:5px;background:rgba(244,244,241,.15)}#prog i{position:absolute;right:0;top:0;bottom:0;background:var(--w);animation:prog linear both}@keyframes prog{0%{width:0}100%{width:100%}}
#bgobj{position:absolute;left:-120px;top:120px;width:1320px;height:1320px;opacity:.28}
`;
function buildHtml(scenes, total) {
  let t = 0, parts = [], wipes = [];
  for (const [i, sc] of scenes.entries()) { parts.push(sceneHtml(sc, i, t)); if (i > 0) wipes.push(`<div class="wipeT" style="animation-delay:${(t - 0.16).toFixed(3)}s"></div>`); t += sc.dur; }
  const inner = `<div class="grain"></div><canvas id="bgobj" width="900" height="900"></canvas>
  <div class="top" style="top:120px"><span>WASL · STUDIO</span><span class="mark">وَصْل</span></div><div class="rule" style="top:190px"></div>
  ${parts.join('\n')}${wipes.join('')}
  <div id="prog"><i style="animation-duration:${total}s"></i></div>
  <div style="position:absolute;left:0;right:0;bottom:90px;text-align:center;direction:ltr;font-family:Alex;font-weight:300;font-size:24px;letter-spacing:.3em;color:var(--g2)">@WASLK_SA</div>`;
  return T.page(1080, 1920, inner, '', CSS);
}
function sfx(dir) {
  const f = n => path.join(dir, n); const run = a => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a]);
  if (!fs.existsSync(f('whoosh.wav'))) run(['-f', 'lavfi', '-i', 'anoisesrc=d=0.7:c=pink:a=0.9', '-af', 'bandpass=f=900:w=1400,afade=t=in:d=0.42:curve=exp,afade=t=out:st=0.42:d=0.28,volume=1.6', f('whoosh.wav')]);
  if (!fs.existsSync(f('impact.wav'))) run(['-f', 'lavfi', '-i', "aevalsrc='0.95*sin(2*PI*(42+90*exp(-t*18))*t)*exp(-t*3.2)+0.35*(random(0)*2-1)*exp(-t*40)':d=1.6", '-af', 'lowpass=f=900', f('impact.wav')]);
  if (!fs.existsSync(f('tick.wav'))) run(['-f', 'lavfi', '-i', "aevalsrc='0.5*sin(2*PI*1800*t)*exp(-t*90)':d=0.08", f('tick.wav')]);
  if (!fs.existsSync(f('riser.wav'))) run(['-f', 'lavfi', '-i', "aevalsrc='0.35*sin(2*PI*(150*t+250*t*t))*(t/1.4)+0.25*(random(0)*2-1)*(t/1.4)*(t/1.4)':d=1.4", '-af', 'highpass=f=200', f('riser.wav')]);
}
function bed(dir, total, file) {
  // original "slowed + reverb" style bed: Am-F-C-G pads (2s each), soft sub, slow kick, long reverb
  const T = total.toFixed(2), ch = 2.0;
  const chord = (f1, f2, f3, k) => `(between(mod(t,${ch * 4}),${k * ch},${(k + 1) * ch})*(sin(2*PI*${f1}*t)+0.8*sin(2*PI*${f2}*t)+0.7*sin(2*PI*${f3}*t)+0.25*sin(2*PI*${f1 * 2}*t)))`;
  const pad = [chord(220, 261.63, 329.63, 0), chord(174.61, 220, 261.63, 1), chord(130.81, 164.81, 196, 2), chord(196, 246.94, 293.66, 3)].join('+');
  const sub = `0.35*sin(2*PI*(55*between(mod(t,8),0,2)+43.65*between(mod(t,8),2,4)+65.41*between(mod(t,8),4,6)+49*between(mod(t,8),6,8))*t)`;
  const bt = 0.857; // 70bpm slowed
  const kick = `0.55*sin(2*PI*(45+70*exp(-mod(t,${bt})*22))*mod(t,${bt}))*exp(-mod(t,${bt})*6)`;
  const expr = `0.10*(${pad})*(0.75+0.25*sin(2*PI*0.125*t))+${sub}+${kick}`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', `aevalsrc='${expr}':d=${T}:s=44100`, '-af',
    `lowpass=f=2400,aecho=0.8:0.85:120|260|420:0.45|0.32|0.22,aecho=0.7:0.7:900:0.25,volume=1.5,afade=t=in:d=0.6,afade=t=out:st=${(total - 1.2).toFixed(2)}:d=1.2`, file]);
}
async function renderReel(ctx, reel, outDir, prefix, DIR, ENG) {
  const scenes = reel.scenes.map(s => Object.assign({ dur: DUR[s.type] || 3 }, s)); const total = scenes.reduce((a, s) => a + s.dur, 0);
  const html = buildHtml(scenes, total);
  const cx = await ctx.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 }); const p = await cx.newPage();
  await p.route('http://wasl.local/**', r => { const u = new URL(r.request().url()); if (u.pathname === '/') return r.fulfill({ body: html, contentType: 'text/html' }); return r.fulfill({ path: path.join(DIR, decodeURIComponent(u.pathname)) }); });
  await p.goto('http://wasl.local/'); await p.evaluate(() => { window.__anims = document.getAnimations(); window.__anims.forEach(a => { a.pause(); a.currentTime = 0; }); });
  await p.evaluate(ENG); await p.evaluate(() => document.fonts.ready);
  const shape = reel.shape || 'sphere';
  await p.evaluate(shape => { window.__frames = []; for (let k = 0; k < 24; k++) window.__frames.push(Engrave.render(900, 900, { shape, spacing: 7, ay: k / 24 * Math.PI * 2, ax: -0.4 })); }, shape);
  const fps = 30, n = Math.round(total * fps), vtmp = path.join(outDir, prefix + '_v.mp4');
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', vtmp], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let i = 0; i < n; i++) {
    const t = i / fps;
    await p.evaluate(t => { window.__anims.forEach(a => { a.currentTime = t * 1000; }); const c = document.getElementById('bgobj'), x = c.getContext('2d'); x.clearRect(0, 0, 900, 900); x.drawImage(window.__frames[Math.floor(t * 8) % 24], 0, 0); }, t);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  const cover = path.join(outDir, `${prefix}_cover.jpg`);
  await p.evaluate(t => window.__anims.forEach(a => { a.currentTime = t * 1000; }), 1.6); await p.screenshot({ path: cover, type: 'jpeg', quality: 92 }); await cx.close();
  // audio
  const sdir = path.join(DIR, 'sfx'); fs.mkdirSync(sdir, { recursive: true }); sfx(sdir);
  const bedF = path.join(outDir, prefix + '_bed.wav'); bed(sdir, total, bedF);
  const ev = []; let t = 0; for (const [i, s] of scenes.entries()) { if (i === 0) ev.push(['impact', 0.12]); else ev.push(['whoosh', Math.max(0, t - 0.35)]); if (s.type === 'cta') { ev.push(['riser', Math.max(0, t - 1.4)]); ev.push(['impact', t + 0.3]); } if (s.type === 'point') ev.push(['tick', t + 0.25]); t += s.dur; }
  const args = ['-v', 'error', '-y', '-i', vtmp, '-i', bedF]; ev.forEach(([n]) => args.push('-i', path.join(sdir, n + '.wav')));
  const fc = ev.map(([n, at], k) => `[${k + 2}:a]adelay=${Math.round(at * 1000)}|${Math.round(at * 1000)},volume=${n === 'impact' ? 1.1 : n === 'tick' ? 0.5 : 0.8}[e${k}]`).join(';') + `;[1:a]${ev.map((_, k) => `[e${k}]`).join('')}amix=inputs=${ev.length + 1}:normalize=0,alimiter=limit=0.9[a]`;
  const vf = path.join(outDir, `${prefix}_reel.mp4`);
  execFileSync('ffmpeg', [...args, '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', vf]);
  fs.unlinkSync(vtmp); fs.unlinkSync(bedF); return [vf, cover];
}
module.exports = { renderReel };
