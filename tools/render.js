// usage: node render.js spec.json scenes.json outdir prefix
const { chromium } = require('playwright'); const fs=require('fs'); const {spawn}=require('child_process');
const [specF, scenesF, outDir, prefix]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.route('http://wasl.test/', r=>r.fulfill({body:'<html><body></body></html>',contentType:'text/html'}));
await p.goto('http://wasl.test/');
await p.evaluate(([a,c])=>{localStorage.setItem('wasl_font_800',a);localStorage.setItem('wasl_font_300',c)},[fs.readFileSync(__dirname+'/f2/a800.b64','utf8'),fs.readFileSync(__dirname+'/f2/a300.b64','utf8')]);
await p.evaluate(fs.readFileSync(__dirname+'/gen2.js','utf8')); console.log(await p.evaluate(()=>window.__wasl.loadFonts()));
fs.mkdirSync(outDir,{recursive:true}); const out=[];
if (specF!=='-') { const spec=JSON.parse(fs.readFileSync(specF,'utf8'));
  const urls=await p.evaluate(spec=>{const w=window.__wasl;const N=spec.items.length+2;const cs=[w.cv(c=>w.cover(c,spec.cover,N),w.W,w.H)];
   spec.items.forEach((it,i)=>cs.push(w.cv(c=>w.item(c,i,it,N),w.W,w.H)));cs.push(w.cv(c=>w.cta(c,spec.cta,N),w.W,w.H));return cs.map(c=>c.toDataURL('image/jpeg',.95));},spec);
  urls.forEach((u,i)=>{const f=`${outDir}/${prefix}_c${i+1}.jpg`;fs.writeFileSync(f,Buffer.from(u.split(',')[1],'base64'));out.push(f);}); }
if (scenesF!=='-') { const scenes=JSON.parse(fs.readFileSync(scenesF,'utf8')); const total=scenes.reduce((s,x)=>s+x.dur,0); const fps=30, n=Math.round(total*fps);
  const vf=`${outDir}/${prefix}_reel.mp4`;
  const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',vf],{stdio:['pipe','ignore','ignore']});
  await p.evaluate(()=>{window.__fc=document.createElement('canvas')});
  for (let i=0;i<n;i++){ const u=await p.evaluate(([s,t])=>window.__wasl.frameAt(s,t).toDataURL('image/jpeg',.92),[scenes,i/fps]); ff.stdin.write(Buffer.from(u.split(',')[1],'base64')); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); out.push(vf);
  const cu=await p.evaluate(([s])=>window.__wasl.frameAt(s,1.8).toDataURL('image/jpeg',.92),[scenes]); const cf=`${outDir}/${prefix}_cover.jpg`; fs.writeFileSync(cf,Buffer.from(cu.split(',')[1],'base64')); out.push(cf); }
await b.close(); console.log(out.join('\n'));})();
