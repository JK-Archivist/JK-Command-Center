#!/usr/bin/env node
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);

async function dragAndSnap(page, fromSel, toSel, framesDir, base){
  await fs.mkdir(framesDir, { recursive: true });
  const from = await page.$(fromSel);
  const to = await page.$(toSel);
  if (!from || !to) throw new Error('Selectors not found');
  const fromBox = await from.boundingBox();
  const toBox = await to.boundingBox();
  if (!fromBox || !toBox) throw new Error('Bounding boxes not found');
  const start = { x: fromBox.x + fromBox.width/2, y: fromBox.y + fromBox.height/2 };
  const end = { x: toBox.x + toBox.width/2, y: toBox.y + 20 };

  await page.mouse.move(start.x, start.y);
  await page.screenshot({ path: `${framesDir}/${base}_00.png` });
  await page.mouse.down();
  const steps = 8;
  for (let i=1; i<=steps; i++){
    const x = start.x + (end.x-start.x)*(i/steps);
    const y = start.y + (end.y-start.y)*(i/steps);
    await page.mouse.move(x,y);
    await new Promise(r=>setTimeout(r,60));
    await page.screenshot({ path: `${framesDir}/${base}_${String(i).padStart(2,'0')}.png` });
  }
  await page.mouse.up();
}

async function makeGif(framesDir, base, out){
  return new Promise((resolve, reject)=>{
    ffmpeg()
      .input(`${framesDir}/${base}_%02d.png`)
      .inputOptions(['-framerate 12'])
      .outputOptions(['-vf', 'split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse'])
      .save(out)
      .on('end', resolve)
      .on('error', reject);
  });
}

async function main(){
  const baseUrl = 'http://localhost:3000';
  await fs.mkdir('public/screenshots', { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Tasks DnD: move first card from todo to doing
  await page.goto(baseUrl + '/tasks', { waitUntil: 'networkidle0' });
  await dragAndSnap(page, '[data-col="todo"] [data-task-id]', '[data-col="doing"]', 'tmp_frames', 'tasks');
  await makeGif('tmp_frames', 'tasks', 'public/screenshots/tasks-dnd.gif');

  // Content DnD: move first card from idea to script
  await page.goto(baseUrl + '/content', { waitUntil: 'networkidle0' });
  await dragAndSnap(page, '[data-stage="idea"] [data-content-id]', '[data-stage="script"]', 'tmp_frames', 'content');
  await makeGif('tmp_frames', 'content', 'public/screenshots/content-dnd.gif');

  await browser.close();
}

main().catch((e)=>{ console.error(e); process.exit(1); });
