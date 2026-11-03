// HTML templates for Wasl monochrome system. Exports functions returning full HTML strings.
const FONTS = `
@font-face{font-family:Lalezar;src:url(fonts/Lalezar-Regular.ttf)}
@font-face{font-family:Ruqaa;src:url(fonts/ArefRuqaa-Bold.ttf)}
@font-face{font-family:Amiri;src:url(fonts/Amiri-Bold.ttf)}
@font-face{font-family:Alex;src:url(fonts/Alexandria.ttf);font-weight:100 900}
@font-face{font-family:Reem;src:url(fonts/ReemKufi.ttf);font-weight:400 700}
@font-face{font-family:Messiri;src:url(fonts/ElMessiri.ttf);font-weight:400 700}`;
const BASE = `${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
:root{--k:#050505;--w:#F4F4F1;--g1:#BDBDBA;--g2:#7A7A78;--g3:#2A2A2A}
html,body{background:var(--k)}
.page{position:relative;overflow:hidden;direction:rtl;font-family:Alex,sans-serif;color:var(--w);background:var(--k)}
.grain{position:absolute;inset:0;opacity:.06;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");mix-blend-mode:screen;pointer-events:none}
.top{position:absolute;top:70px;right:90px;left:90px;display:flex;justify-content:space-between;align-items:center;font-family:Alex;font-weight:300;font-size:22px;letter-spacing:.32em;color:var(--g1);direction:ltr}
.top .mark{font-family:Lalezar;font-size:40px;letter-spacing:0;color:var(--w);direction:rtl}
.rule{position:absolute;left:90px;right:90px;height:1px;background:rgba(244,244,241,.18)}
.foot{position:absolute;bottom:64px;right:90px;left:90px;display:flex;justify-content:space-between;align-items:center;direction:ltr;font-family:Alex;font-weight:300;font-size:22px;letter-spacing:.2em;color:var(--g2)}
.dots{display:flex;gap:8px}.dots i{display:block;width:34px;height:3px;background:rgba(244,244,241,.18)}.dots i.on{background:var(--w)}
.obj{position:absolute;pointer-events:none}
.disp{font-family:Lalezar;line-height:1.02}
.ruq{font-family:Ruqaa;color:var(--g1)}
.amiri{font-family:Amiri}
.light{font-family:Alex;font-weight:300}
.out{color:transparent;-webkit-text-stroke:2px var(--w)}
.white .page,.page.white{background:var(--w);color:var(--k)}
.page.white .top,.page.white .foot{color:#555}.page.white .top .mark{color:var(--k)}
.page.white .rule{background:rgba(5,5,5,.18)}.page.white .dots i{background:rgba(5,5,5,.15)}.page.white .dots i.on{background:var(--k)}
.page.white .ruq{color:#444}.page.white .out{-webkit-text-stroke:2px var(--k)}
`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const dots = (n, N) => `<div class="dots">${Array.from({ length: N }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</div>`;
const chrome = (n, N, label) => `<div class="grain"></div><div class="top"><span>${label || 'WASL · STUDIO'}</span><span class="mark" style="display:flex;align-items:center;gap:14px">وَصْل${MARK(54)}</span></div><div class="rule" style="top:130px"></div>
<div class="foot"><span>@WASLK_SA</span>${dots(n, N)}<span>${String(n).padStart(2, '0')}/${String(N).padStart(2, '0')}</span></div>`;
function page(w, h, inner, cls = '', extraCss = '') { return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}${extraCss}</style></head><body><div class="page ${cls}" style="width:${w}px;height:${h}px">${inner}</div></body></html>`; }

// obj placeholders: <canvas data-shape="sphere" data-size="760" ...> drawn by Engrave after load
const obj = (shape, size, css, ink, extra = '') => `<canvas class="obj" data-shape="${shape}" data-size="${size}" data-ink="${ink || '#F4F4F1'}" ${extra} style="${css};width:${size}px;height:${size}px"></canvas>`;

function cover(d, N) {
  return page(1080, 1350, `${chrome(1, N)}
  ${obj(d.shape || 'sphere', 820, 'left:-140px;top:120px')}
  <div style="position:absolute;right:90px;top:210px;font-family:Alex;font-weight:300;font-size:26px;letter-spacing:.06em;color:var(--g1)">${esc(d.kicker)}</div>
  <div style="position:absolute;right:90px;left:90px;bottom:230px">
    <div class="disp" style="font-size:${d.size1 || 200}px">${esc(d.line1)}</div>
    <div class="ruq" style="font-size:${d.sizeA || 150}px;line-height:1.05;margin-top:-6px;color:var(--w)">${esc(d.accent)}</div>
    <div class="disp out" style="font-size:${d.size2 || 150}px;margin-top:4px">${esc(d.line2 || '')}</div>
    <div class="light" style="font-size:34px;line-height:1.6;color:var(--g1);margin-top:30px;max-width:780px">${esc(d.sub)}</div>
  </div>
  <div style="position:absolute;left:90px;bottom:150px;direction:ltr;font-family:Alex;font-weight:300;font-size:24px;letter-spacing:.3em;color:var(--w)">← SWIPE</div>`);
}
function item(d, i, N) {
  const white = i % 2 === 1, ink = white ? '#050505' : '#F4F4F1', num = String(i + 1).padStart(2, '0');
  const shapes = ['torus', 'cube', 'pawn', 'rings', 'stack', 'capsule', 'sphere'];
  return page(1080, 1350, `${chrome(i + 2, N)}
  ${obj(d.shape || shapes[i % shapes.length], 520, 'left:-60px;top:150px;opacity:.95', ink)}
  <div style="position:absolute;right:90px;top:190px;font-family:Alex;font-weight:800;font-size:250px;line-height:1" class="out">${num}</div>
  <div style="position:absolute;right:90px;left:90px;top:500px">
    <div class="ruq" style="font-size:54px;line-height:1.2">${esc(d.label || 'الخطوة')}</div>
    <div style="font-family:Reem;font-weight:700;font-size:${d.titleSize || 92}px;line-height:1.15;margin-top:6px">${esc(d.title)}</div>
    <div class="light" style="font-size:36px;line-height:1.6;margin-top:22px;color:${white ? '#555' : 'var(--g1)'};max-width:860px">${esc(d.desc)}</div>
  </div>
  <div style="position:absolute;right:90px;left:90px;bottom:150px;background:${white ? 'var(--k)' : 'var(--w)'};color:${white ? 'var(--w)' : 'var(--k)'};padding:40px 46px">
    <div style="font-family:Lalezar;font-size:40px;letter-spacing:.02em">${esc(d.fixLabel || 'الحل')} ←</div>
    <div style="font-family:Alex;font-weight:500;font-size:38px;line-height:1.55;margin-top:8px">${esc(d.fix)}</div>
  </div>`, white ? 'white' : '');
}
function cta(d, N) {
  return page(1080, 1350, `${chrome(N, N)}
  ${obj(d.shape || 'rings', 760, 'left:160px;top:150px;opacity:.9')}
  <div style="position:absolute;right:90px;left:90px;bottom:200px;text-align:center">
    <div class="disp" style="font-size:150px">${esc(d.line1)}</div>
    <div class="ruq" style="font-size:130px;line-height:1.1;color:var(--w)">${esc(d.accent)}</div>
    <div class="light" style="font-size:32px;color:var(--g1);margin:26px 0 40px;letter-spacing:.02em">${(d.bullets || []).map(esc).join('  ·  ')}</div>
    <div style="display:inline-block;background:var(--w);color:var(--k);font-family:Lalezar;font-size:46px;padding:26px 70px">${esc(d.button)}</div>
  </div>`);
}
function story(d) {
  return page(1080, 1920, `<div class="grain"></div><div class="top" style="top:120px"><span>NEW POST</span><span class="mark">وَصْل</span></div><div class="rule" style="top:190px"></div>
  ${obj(d.shape || 'sphere', 1000, 'left:40px;top:260px')}
  <div style="position:absolute;right:90px;left:90px;bottom:430px">
    <div style="font-family:Alex;font-weight:300;font-size:30px;letter-spacing:.06em;color:var(--g1)">${esc(d.kicker)}</div>
    <div class="disp" style="font-size:190px;margin-top:10px">${esc(d.line1)}</div>
    <div class="ruq" style="font-size:150px;line-height:1.05;color:var(--w)">${esc(d.accent)}</div>
    <div class="light" style="font-size:38px;line-height:1.6;color:var(--g1);margin-top:24px">${esc(d.sub)}</div>
  </div>
  <div style="position:absolute;left:90px;right:90px;bottom:250px;border:2px solid var(--w);padding:28px;text-align:center;font-family:Lalezar;font-size:44px">${esc(d.button || 'شوف المنشور الجديد ↓')}</div>
  <div style="position:absolute;left:0;right:0;bottom:150px;text-align:center;direction:ltr;font-family:Alex;font-weight:300;font-size:24px;letter-spacing:.3em;color:var(--g2)">@WASLK_SA</div>`);
}
const MARK = (sz, col = '#F4F4F1') => `<svg width="${sz}" height="${sz}" viewBox="0 0 1080 1080" style="display:block"><circle cx="425" cy="540" r="185" fill="${col}"/><circle cx="655" cy="540" r="162" fill="none" stroke="${col}" stroke-width="46"/></svg>`;
function logo() { return page(1080, 1080, `<div style="position:absolute;inset:0">${MARK(1080)}</div>`); }
module.exports = { cover, item, cta, story, logo, page, obj, esc, BASE, MARK };
