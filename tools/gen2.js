window.__wasl = (function () {
  const B = 'WaslB, "Segoe UI", Tahoma, sans-serif', L = 'WaslL, "Segoe UI", Tahoma, sans-serif';
  const C = { bg: '#0A0A0B', gold: '#CFAE6B', gold2: '#F1D9A0', gold3: '#9C7B3E', white: '#F4EFE7', muted: '#8C877E', hair: 'rgba(207,174,107,0.35)' };
  const W = 1080, H = 1350, P = 110, R = W - P;
  const ease = x => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
  async function loadFonts() {
    const out = [];
    for (const [k, fam] of [['wasl_font_800', 'WaslB'], ['wasl_font_300', 'WaslL']]) {
      const b64 = localStorage.getItem(k); if (!b64) { out.push(fam + ':missing'); continue; }
      const bin = Uint8Array.from(atob(b64), ch => ch.charCodeAt(0));
      const f = new FontFace(fam, bin.buffer); await f.load(); document.fonts.add(f); out.push(fam + ':ok');
    }
    return out.join(' ');
  }
  function goldFill(c, x1, y1, x2, y2) { const g = c.createLinearGradient(x1, y1, x2, y2); g.addColorStop(0, C.gold3); g.addColorStop(0.45, C.gold2); g.addColorStop(1, C.gold); return g; }
  function f(c, s, fam) { c.font = `${s}px ${fam}`; }
  function t(c, s, x, y, size, fill, fam, align, dir, ls) { f(c, size, fam || B); c.direction = dir || 'rtl'; c.textAlign = align || 'right'; c.fillStyle = fill; c.letterSpacing = ls || '0px'; c.fillText(s, x, y); c.letterSpacing = '0px'; }
  function wrap(c, s, maxW, size, fam) { f(c, size, fam); const o = []; let cur = ''; for (const w of s.split(' ')) { const x = cur ? cur + ' ' + w : w; if (c.measureText(x).width > maxW && cur) { o.push(cur); cur = w; } else cur = x; } if (cur) o.push(cur); return o; }
  function grain(c, w, h, a) { const n = document.createElement('canvas'); n.width = 256; n.height = 256; const x = n.getContext('2d'); const d = x.createImageData(256, 256);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255 * a; } x.putImageData(d, 0, 0); c.fillStyle = c.createPattern(n, 'repeat'); c.fillRect(0, 0, w, h); }
  function bg(c, w, h) {
    c.fillStyle = C.bg; c.fillRect(0, 0, w, h);
    let g = c.createRadialGradient(w * 0.9, -h * 0.05, 0, w * 0.9, -h * 0.05, w * 1.1); g.addColorStop(0, 'rgba(207,174,107,0.16)'); g.addColorStop(1, 'rgba(207,174,107,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    g = c.createLinearGradient(0, h * 0.6, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    grain(c, w, h, 0.035);
    // hairline frame with corner ticks
    c.strokeStyle = 'rgba(207,174,107,0.18)'; c.lineWidth = 1.5; c.strokeRect(44, 44, w - 88, h - 88);
    c.strokeStyle = C.gold; c.lineWidth = 3; const k = 34;
    for (const [x, y, sx, sy] of [[44, 44, 1, 1], [w - 44, 44, -1, 1], [44, h - 44, 1, -1], [w - 44, h - 44, -1, -1]]) { c.beginPath(); c.moveTo(x, y + sy * k); c.lineTo(x, y); c.lineTo(x + sx * k, y); c.stroke(); }
  }
  function header(c, n, N) {
    t(c, 'وَصْل', R, 160, 36, C.white, B);
    t(c, 'W A S L  ·  M A R K E T I N G', P, 156, 18, C.gold, L, 'left', 'ltr');
    c.fillStyle = C.hair; c.fillRect(P, 196, R - P, 1.5);
    // footer
    const gap = 8, sw = 46; for (let i = 0; i < N; i++) { c.fillStyle = i < n ? C.gold : 'rgba(244,239,231,0.14)'; c.fillRect(R - (i + 1) * sw - i * gap, H - 132, sw, 3); }
    t(c, '@waslk_sa', P, H - 112, 24, C.muted, L, 'left', 'ltr');
    t(c, `${String(n).padStart(2, '0')} / ${String(N).padStart(2, '0')}`, P, H - 150, 20, C.muted, L, 'left', 'ltr');
  }
  function kicker(c, s, y) { t(c, s, R, y, 30, C.gold, L); c.fillStyle = C.gold; c.fillRect(R - 56, y + 24, 56, 3); }
  // cover: {kicker, lines:[{text,gold}], sub}
  function cover(c, d, N) { bg(c, W, H); header(c, 1, N); kicker(c, d.kicker, 330);
    let y = 520; f(c, 140, B); const sz = Math.min(140, ...d.lines.map(ln => 140 * (R - P) / c.measureText(ln.text).width)); for (const ln of d.lines) { const fill = ln.gold ? goldFill(c, P, y - sz, R, y) : C.white; t(c, ln.text, R, y, sz, fill, B); y += sz * 1.16; }
    y -= 40; for (const l of wrap(c, d.sub, R - P - 140, 40, L)) { t(c, l, R, y, 40, C.muted, L); y += 62; }
    t(c, 'اسحب', R, H - 200, 28, C.white, B); f(c, 28, B); const sw = c.measureText('اسحب').width; c.fillStyle = C.gold; c.fillRect(R - sw - 90, H - 211, 60, 2.5);
    c.beginPath(); c.moveTo(R - sw - 90, H - 210); c.lineTo(R - sw - 78, H - 220); c.moveTo(R - sw - 90, H - 210); c.lineTo(R - sw - 78, H - 200); c.strokeStyle = C.gold; c.lineWidth = 2.5; c.stroke(); }
  // item: {label, title, desc, fixLabel, fix}
  function item(c, i, d, N) { bg(c, W, H); header(c, i + 2, N);
    const num = String(i + 1).padStart(2, '0'); f(c, 300, B); c.direction = 'ltr'; c.textAlign = 'left'; c.lineWidth = 2; c.strokeStyle = 'rgba(207,174,107,0.55)'; c.strokeText(num, P - 6, 520);
    kicker(c, d.label, 330); let y = 640;
    for (const l of wrap(c, d.title, R - P, 84, B)) { t(c, l, R, y, 84, C.white, B); y += 104; } y += 4;
    for (const l of wrap(c, d.desc, R - P - 60, 38, L)) { t(c, l, R, y, 38, C.muted, L); y += 60; }
    const Ls = wrap(c, d.fix, R - P - 100, 42, L), bh = 110 + Ls.length * 64, by = Math.max(y + 40, H - 210 - bh);
    c.fillStyle = 'rgba(207,174,107,0.07)'; c.fillRect(P, by, R - P, bh); c.strokeStyle = C.hair; c.lineWidth = 1.5; c.strokeRect(P, by, R - P, bh);
    c.fillStyle = C.gold; c.fillRect(R - 4, by, 4, bh);
    t(c, d.fixLabel || 'الحل', R - 44, by + 60, 30, goldFill(c, P, by, R, by + 60), B);
    let ly = by + 120; for (const l of Ls) { t(c, l, R - 44, ly, 42, C.white, L); ly += 64; } }
  // cta: {kicker, l1, l2, bullets[], button, side}
  function cta(c, d, N) { bg(c, W, H); header(c, N, N); kicker(c, d.kicker, 330); let y = 520;
    f(c, 120, B); const sz = Math.min(120, ...[d.l1, d.l2].map(x => 120 * (R - P) / c.measureText(x).width)); t(c, d.l1, R, y, sz, C.white, B); y += sz * 1.2; t(c, d.l2, R, y, sz, goldFill(c, P, y - sz, R, y), B); y += 100;
    for (const s of d.bullets) { c.save(); c.translate(R - 8, y - 14); c.rotate(Math.PI / 4); c.fillStyle = C.gold; c.fillRect(-6, -6, 12, 12); c.restore(); t(c, s, R - 34, y, 38, C.white, L); y += 66; }
    y += 50; f(c, 38, B); const bw = c.measureText(d.button).width + 120; c.fillStyle = goldFill(c, R - bw, y, R, y + 104); c.fillRect(R - bw, y, bw, 104);
    t(c, d.button, R - 60, y + 66, 38, C.bg, B); t(c, d.side, R - bw - 36, y + 64, 30, C.muted, L); }
  function cv(fn, w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); return c; }
  function toFile(c, name) { return new Promise(r => c.toBlob(b => r(new File([b], name, { type: 'image/jpeg' })), 'image/jpeg', 0.95)); }
  async function carousel(spec) { const N = spec.items.length + 2; const cs = [cv(c => cover(c, spec.cover, N), W, H)];
    spec.items.forEach((it, i) => cs.push(cv(c => item(c, i, it, N), W, H))); cs.push(cv(c => cta(c, spec.cta, N), W, H));
    return Promise.all(cs.map((c, i) => toFile(c, `wasl_${i + 1}.jpg`))); }
  // ---------- REEL ----------
  // scenes: [{dur, kind:'hook'|'point'|'cta', label?, big, small?}]
  const RW = 1080, RH = 1920, RP = 110, RR = RW - RP;
  let RG = null;
  function rbg(c, tt) { if (!RG) { RG = cv(x => { bg(x, RW, RH); }, RW, RH); } c.drawImage(RG, 0, 0);
    const gx = RW * (0.75 + 0.2 * Math.sin(tt * 0.5)), gy = RH * (0.2 + 0.08 * Math.cos(tt * 0.4)); const g = c.createRadialGradient(gx, gy, 0, gx, gy, 900);
    g.addColorStop(0, 'rgba(207,174,107,0.10)'); g.addColorStop(1, 'rgba(207,174,107,0)'); c.fillStyle = g; c.fillRect(0, 0, RW, RH);
    t(c, 'وَصْل', RR, 230, 40, C.white, B); t(c, '@waslk_sa', RP, 226, 26, C.muted, L, 'left', 'ltr'); c.fillStyle = C.hair; c.fillRect(RP, 268, RR - RP, 1.5); }
  function words(c, s, size, fam, maxW) { return wrap(c, s, maxW, size, fam).map(line => line.split(' ')); }
  function drawWords(c, lines, x, y, size, fam, lt, start, perWord, fill, align) { let k = 0; const lh = size * 1.22;
    for (const ln of lines) { f(c, size, fam); c.direction = 'rtl'; const full = ln.join(' '); const lw = c.measureText(full).width; let cx = align === 'center' ? x + lw / 2 : x;
      for (const w of ln) { const a = ease((lt - start - k * perWord) / 0.28); if (a > 0) { c.globalAlpha = a; c.textAlign = 'right'; c.fillStyle = typeof fill === 'function' ? fill(y) : fill; const dy = (1 - a) * 36; c.fillText(w, cx, y + dy); }
        cx -= c.measureText(w + ' ').width; k++; } y += lh; }
    c.globalAlpha = 1; return y; }
  function scene(c, sc, lt) {
    const out = sc.dur - lt < 0.25 ? ease((sc.dur - lt) / 0.25) : 1; c.save(); c.globalAlpha = out;
    const z = 1 + 0.04 * (lt / sc.dur); c.translate(RW / 2, RH / 2); c.scale(z, z); c.translate(-RW / 2, -RH / 2);
    const gf = y => goldFill(c, RP, y - 130, RR, y);
    if (sc.kind === 'hook') {
      const big = words(c, sc.big, 128, B, RR - RP); let y = 820 - (big.length - 1) * 70;
      y = drawWords(c, big, RR, y, 128, B, lt, 0.05, 0.12, C.white);
      if (sc.small) { const sm = words(c, sc.small, 128, B, RR - RP); drawWords(c, sm, RR, y + 10, 128, B, lt, 0.05 + big.flat().length * 0.12, 0.12, gf); }
    } else if (sc.kind === 'point') {
      const la = ease(lt / 0.3); c.globalAlpha = out * la; t(c, sc.label, RR, 700, 40, C.gold, L); c.fillStyle = C.gold; c.fillRect(RR - 70 * la, 726, 70 * la, 3); c.globalAlpha = out;
      const big = words(c, sc.big, 96, B, RR - RP); let y = drawWords(c, big, RR, 860, 96, B, lt, 0.15, 0.09, C.white);
      if (sc.small) { const a = ease((lt - 0.15 - big.flat().length * 0.09) / 0.4); c.globalAlpha = out * Math.max(a, 0); for (const l of wrap(c, sc.small, RR - RP - 40, 46, L)) { t(c, l, RR, y + 30, 46, C.muted, L); y += 70; } }
    } else {
      const a = ease(lt / 0.4); c.globalAlpha = out * a;
      t(c, sc.big, RW / 2, 820, 116, C.white, B, 'center'); t(c, sc.small || '', RW / 2, 965, 116, gf(965), B, 'center');
      f(c, 44, B); const btn = sc.button || 'راسلنا: استشارة مجانية'; const bw = c.measureText(btn).width + 120; const by = 1080 + (1 - a) * 40;
      c.fillStyle = goldFill(c, RW / 2 - bw / 2, by, RW / 2 + bw / 2, by + 112); c.fillRect(RW / 2 - bw / 2, by, bw, 112); t(c, btn, RW / 2, by + 72, 44, C.bg, B, 'center');
    }
    c.restore(); }
  async function reel(scenes) {
    const cvs = document.createElement('canvas'); cvs.width = RW; cvs.height = RH; const c = cvs.getContext('2d'); const total = scenes.reduce((s, x) => s + x.dur, 0);
    const mime = ['video/mp4;codecs=avc1.640028', 'video/mp4;codecs=avc1.42E01E', 'video/mp4'].find(m => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(cvs.captureStream(30), { mimeType: mime, videoBitsPerSecond: 10e6 }); const ch = []; rec.ondataavailable = e => e.data.size && ch.push(e.data); const done = new Promise(r => rec.onstop = r);
    const fr = tt => { rbg(c, tt); let acc = 0; for (const sc of scenes) { if (tt < acc + sc.dur) { scene(c, sc, tt - acc); break; } acc += sc.dur; }
      c.fillStyle = 'rgba(244,239,231,0.12)'; c.fillRect(RP, RH - 200, RR - RP, 4); c.fillStyle = C.gold; const w = (RR - RP) * Math.min(tt / total, 1); c.fillRect(RR - w, RH - 200, w, 4); };
    fr(0); rec.start(250); const t0 = performance.now();
    await new Promise(res => { const iv = setInterval(() => { const tt = (performance.now() - t0) / 1000; if (tt >= total) { clearInterval(iv); res(); return; } fr(tt); }, 1000 / 30); });
    rec.stop(); await done; return new File([new Blob(ch, { type: 'video/mp4' })], 'wasl_reel.mp4', { type: 'video/mp4' }); }
  function frameAt(scenes, tt) { const c0 = cv(() => { }, RW, RH); const c = c0.getContext('2d'); rbg(c, tt); let acc = 0; for (const sc of scenes) { if (tt < acc + sc.dur) { scene(c, sc, tt - acc); break; } acc += sc.dur; } return c0; }
  function setFiles(input, files) { const dt = new DataTransfer(); files.forEach(x => dt.items.add(x)); input.files = dt.files; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); }
  async function upload(files) { const inp = document.querySelector('[role=dialog] input[type=file]') || document.querySelector('input[type=file]'); if (!inp) return 'NO_FILE_INPUT'; setFiles(inp, files); return 'OK'; }
  return { loadFonts, carousel, reel, upload, frameAt, cv, cover, item, cta, W, H };
})(); 'wasl ready';
