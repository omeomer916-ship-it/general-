// Engraving-style 3D renderer: ray-marched SDF objects drawn with hatching lines (white ink on black).
window.Engrave = (function () {
  const V = (x, y, z) => [x, y, z], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], len = a => Math.hypot(a[0], a[1], a[2]), nrm = a => mul(a, 1 / (len(a) || 1));
  function rot(p, ax, ay) { let [x, y, z] = p; let c = Math.cos(ax), s = Math.sin(ax); [y, z] = [c * y - s * z, s * y + c * z]; c = Math.cos(ay); s = Math.sin(ay); [x, z] = [c * x + s * z, -s * x + c * z]; return [x, y, z]; }
  const sd = {
    sphere: (p, r) => len(p) - r,
    torus: (p, R, r) => Math.hypot(Math.hypot(p[0], p[2]) - R, p[1]) - r,
    box: (p, b, r) => { const q = [Math.abs(p[0]) - b[0], Math.abs(p[1]) - b[1], Math.abs(p[2]) - b[2]]; return len([Math.max(q[0], 0), Math.max(q[1], 0), Math.max(q[2], 0)]) + Math.min(Math.max(q[0], q[1], q[2]), 0) - r; },
    cyl: (p, h, r) => { const d = [Math.hypot(p[0], p[2]) - r, Math.abs(p[1]) - h]; return Math.min(Math.max(d[0], d[1]), 0) + Math.hypot(Math.max(d[0], 0), Math.max(d[1], 0)); },
    cone: (p, h, r) => { const q = Math.hypot(p[0], p[2]); const k = r / h; const y = p[1]; return Math.max((q - (h - y) * k / 2) * Math.cos(Math.atan(k / 2)), -y - h / 2 + h / 2 - h, y - h / 2) },
  };
  const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
  const SCENES = {
    sphere: p => sd.sphere(p, 1.15),
    torus: p => sd.torus(p, 1.0, 0.42),
    cube: p => sd.box(p, [0.8, 0.8, 0.8], 0.12),
    pawn: p => smin(smin(sd.sphere(add(p, [0, -0.85, 0]), 0.45), sd.cyl(add(p, [0, -0.05, 0]), 0.55, 0.26), 0.3), sd.cyl(add(p, [0, 0.75, 0]), 0.16, 0.8), 0.25),
    rings: p => Math.min(sd.torus(p, 1.0, 0.18), sd.torus(rot(p, Math.PI / 2, 0), 1.0, 0.18), sd.torus(rot(p, 0, Math.PI / 2), 0.7, 0.14)),
    stack: p => smin(smin(sd.box(add(p, [0, 0.75, 0]), [0.9, 0.22, 0.9], 0.05), sd.box(add(p, [0, 0.15, 0]), [0.65, 0.22, 0.65], 0.05), 0.05), sd.sphere(add(p, [0, -0.65, 0]), 0.5), 0.2),
    capsule: p => smin(sd.cyl(p, 0.7, 0.55), sd.sphere(add(p, [0.0, -1.0, 0]), 0.35), 0.4),
  };
  function render(w, h, opts) {
    const o = Object.assign({ shape: 'sphere', ax: -0.45, ay: 0.6, spacing: 7, angle: -0.5, light: [-0.6, 0.8, 0.7], scale: 1, ink: '#F5F5F2', cross: true, bg: null }, opts || {});
    const f = SCENES[o.shape] || SCENES.sphere, Ld = nrm(o.light);
    const res = 2, gw = Math.ceil(w / res), gh = Math.ceil(h / res), L = new Float32Array(gw * gh).fill(-1), Z = new Float32Array(gw * gh);
    const map = p => f(rot(mul(p, 1 / o.scale), o.ax, o.ay)) * o.scale;
    const cam = [0, 0, 4.2];
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
      const u = (i * res - w / 2) / (Math.min(w, h) / 2), v = -(j * res - h / 2) / (Math.min(w, h) / 2);
      const rd = nrm([u * 0.62, v * 0.62, -1]); let t = 0, hit = false;
      for (let k = 0; k < 80; k++) { const p = add(cam, mul(rd, t)); const d = map(p); if (d < 0.002) { hit = true; break; } t += d; if (t > 9) break; }
      if (!hit) continue; const p = add(cam, mul(rd, t)), e = 0.002;
      const n = nrm([map(add(p, [e, 0, 0])) - map(sub(p, [e, 0, 0])), map(add(p, [0, e, 0])) - map(sub(p, [0, e, 0])), map(add(p, [0, 0, e])) - map(sub(p, [0, 0, e]))]);
      let dif = Math.max(dot(n, Ld), 0); let sh = 1, tt = 0.03; for (let k = 0; k < 24; k++) { const hh = map(add(p, mul(Ld, tt))); sh = Math.min(sh, 8 * hh / tt); tt += Math.max(hh, 0.02); if (sh < 0.01 || tt > 4) break; }
      const rim = Math.pow(1 - Math.max(dot(n, mul(rd, -1)), 0), 3);
      L[j * gw + i] = Math.pow(Math.min(1, 0.02 + 0.95 * dif * Math.max(sh, 0) + 0.3 * rim), 1.35); Z[j * gw + i] = t;
    }
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
    if (o.bg) { x.fillStyle = o.bg; x.fillRect(0, 0, w, h); }
    x.strokeStyle = o.ink; x.lineCap = 'round';
    const lum = (px, py) => { const i = Math.floor(px / res), j = Math.floor(py / res); if (i < 0 || j < 0 || i >= gw || j >= gh) return -1; return L[j * gw + i]; };
    const dep = (px, py) => { const i = Math.floor(px / res), j = Math.floor(py / res); if (i < 0 || j < 0 || i >= gw || j >= gh) return 4.2; return Z[j * gw + i] || 4.2; };
    const K = Math.min(w, h) * 0.32;
    function hatch(angle, sp, thr, wmax) {
      const ca = Math.cos(angle), sa = Math.sin(angle), D = Math.hypot(w, h);
      for (let s = -D; s < D; s += sp) {
        let prev = null; x.beginPath();
        for (let q = -D; q < D; q += 2) {
          let px = w / 2 + ca * q - sa * s, py = h / 2 + sa * q + ca * s; const dz = (4.2 - dep(px, py)) * K * 0.2; px -= sa * dz; py += ca * dz; if (px < 0 || py < 0 || px >= w || py >= h) { prev = null; continue; }
          const l = lum(px, py); if (l < 0) { prev = null; continue; }
          // white ink: brighter surface => thicker line
          const ww = Math.max(0, (l - thr) / (1 - thr)) * wmax; if (ww < 0.25) { prev = null; continue; }
          if (prev) { x.lineWidth = ww; x.beginPath(); x.moveTo(prev[0], prev[1]); x.lineTo(px, py); x.stroke(); }
          prev = [px, py];
        }
      }
    }
    hatch(o.angle, o.spacing, 0.0, o.spacing * 0.78);
    if (o.cross) hatch(o.angle + 1.1, o.spacing * 1.3, 0.55, o.spacing * 0.55);
    // contour accent
    x.lineWidth = 1.2; x.globalAlpha = 0.35;
    for (let j = 1; j < gh - 1; j++) for (let i = 1; i < gw - 1; i++) { const a = L[j * gw + i] >= 0, b = L[j * gw + i + 1] >= 0, d = L[(j + 1) * gw + i] >= 0; if (a !== b || a !== d) { x.fillStyle = o.ink; x.fillRect(i * res, j * res, 1.6, 1.6); } }
    x.globalAlpha = 1; return c;
  }
  return { render, shapes: Object.keys(SCENES) };
})();
