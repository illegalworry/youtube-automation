const {chromium}=require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const W=__dirname+'/';
(async()=>{const [mode,...rest]=process.argv.slice(2);
 const b=await chromium.launch({args:['--force-color-profile=srgb']});
 const pg=await b.newPage({viewport:{width:720,height:720},deviceScaleFactor:1.5});
 const errs=[];pg.on('pageerror',e=>errs.push(String(e)));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await pg.addInitScript('window.AUDIO='+fs.readFileSync(W+'audio.json','utf8'));
 await pg.goto('file://'+W+'scene.html');await pg.waitForTimeout(600);
 if(errs.length){console.log(errs);process.exit(1)}
 const cdp=await pg.context().newCDPSession(pg);
 const shot=async t=>{await pg.evaluate(`setTime(${t})`);const r=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:94,clip:{x:0,y:0,width:720,height:720,scale:1.5}});return Buffer.from(r.data,'base64')};
 if(mode==='preview'){for(const t of rest)fs.writeFileSync(W+`pv_${t}.jpg`,await shot(+t))}
 else{const fps=30,n=40*fps;
  const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',''+fps,'-c:v','mjpeg','-i','-','-i',W+'cut.wav','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-c:a','aac','-b:a','256k','-shortest','-movflags','+faststart',rest[0]],{stdio:['pipe','inherit','inherit']});
  const t0=Date.now();for(let i=0;i<n;i++){const buf=await shot(i/fps);if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%150==0)console.log(i,(Date.now()-t0)/1000)}
  ff.stdin.end();await new Promise(r=>ff.on('close',r))}
 if(errs.length)console.log('ERR',errs.slice(0,5));await b.close()})();
