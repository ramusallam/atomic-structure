const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1280,height:720}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.APP_URL||'http://127.0.0.1:8932');
 const tick=async()=>page.evaluate(()=>{for(let i=0;i<100;i++)if(currentTick)currentTick(100);});
 const next=async()=>{await page.check('#notebookDone');assert.equal(await page.locator('#nextBtn').isEnabled(),true);await page.click('#nextBtn');};
 assert.equal(await page.locator('#nextBtn').isEnabled(),false);await page.keyboard.press('ArrowRight');assert.match(await page.locator('#stepNum').innerText(),/01/);
 await page.getByRole('button',{name:'Heat the flame'}).click();await tick();await page.getByRole('button',{name:'Li',exact:true}).click();await page.getByRole('button',{name:'Heat the flame'}).click();await tick();await next();
 for(const [symbol,count] of [['Na',11],['Ca',20]]){await page.getByRole('button',{name:symbol,exact:true}).click();for(let i=0;i<count;i++)await page.getByRole('button',{name:'Add next electron',exact:true}).click();}
 await next();await page.getByRole('button',{name:'Absorb (jump up)'}).click();await tick();await page.getByRole('button',{name:'Emit: small fall'}).click();await tick();
 for(let i=0;i<3;i++){await page.getByRole('button',{name:'Absorb (jump up)'}).click();await tick();}await page.getByRole('button',{name:'Emit: big fall'}).click();await tick();await next();
 for(const n of [3,4,5,6]){await page.getByRole('button',{name:'n = '+n+' → 2',exact:true}).click();await tick();}await next();
 for(const k of ['Li','Na','K','Ca','Cu','Sr'])await page.getByRole('button',{name:k,exact:true}).click();await next();
 await page.getByRole('button',{name:'Next atomic number',exact:true}).click();await page.getByRole('button',{name:'Next atomic number',exact:true}).click();await next();
 for(const k of ['C-12','C-13','C-14'])await page.getByRole('button',{name:k,exact:true}).click();await next();
 await page.locator('button[data-k="Na+"]').click();await page.locator('button[data-k="Cl-"]').click();await next();
 const counts=[17,18,18,11,12,10,12,12,10,8,8,10,20,20,18];const fields=page.locator('table input');for(let i=0;i<counts.length;i++)await fields.nth(i).fill(String(counts[i]));await page.check('#notebookDone');assert.equal(await page.locator('#nextBtn').isEnabled(),true);
 await fields.nth(0).fill('0');assert.equal(await page.locator('#nextBtn').isEnabled(),false);await fields.nth(0).fill('17');await page.reload();assert.equal(await page.locator('#nextBtn').isEnabled(),true);await page.click('#nextBtn');
 await page.getByRole('button',{name:'Calculate Aᵣ',exact:true}).click();await next();
 for(let i=0;i<6;i++)await page.getByRole('button',{name:'Reveal next step',exact:true}).click();await next();
 const values=['Sodium, 11 protons','Violet: shorter wavelength, more energy','2,8,1','Only specific energy differences are allowed','35','Same 6 protons; 8 rather than 6 neutrons','10','8,8,10','35.50','20%,80%'];
 for(let i=0;i<10;i++){
  const field=page.locator('#practiceAnswer');if(i===0){await page.getByRole('button',{name:'Show solution',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Next question',exact:true}).isEnabled(),false);await page.getByRole('button',{name:'Hide solution',exact:true}).click();}
  if([0,1,3,5].includes(i))await field.selectOption(values[i]);else await field.fill(values[i]);await page.getByRole('button',{name:'Check answer',exact:true}).click();await page.getByRole('button',{name:'Show solution',exact:true}).click();await page.getByRole('button',{name:'Hide solution',exact:true}).click();
  if(i===4){await page.reload();assert.match(await page.locator('.q-num').first().innerText(),/Question 5/);assert.equal(await page.locator('#practiceAnswer').inputValue(),'35');}
  if(i<9)await page.getByRole('button',{name:'Next question',exact:true}).click();
 }
 await page.check('#notebookDone');await page.getByRole('button',{name:'Finish practice',exact:true}).click();assert.match(await page.locator('#stepNum').innerText(),/13/);
 await page.click('#resetBtn');assert.match(await page.locator('#stepNum').innerText(),/01/);assert.equal(await page.locator('#nextBtn').isEnabled(),true);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'/private/tmp/atomic-structure-mobile.png',fullPage:true});await page.setViewportSize({width:1280,height:720});await page.screenshot({path:'/private/tmp/atomic-structure-desktop.png',fullPage:true});assert.deepEqual(errors,[]);await browser.close();console.log('PASS: all 13 steps, all assigned models/comparisons, 15 particle checks, 10 practice questions, reload, reveal-only gate, relocking, keyboard guard, and phone layout.');
})().catch(e=>{console.error(e);process.exit(1);});
