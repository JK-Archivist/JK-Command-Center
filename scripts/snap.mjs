#!/usr/bin/env node
import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const targets = [
  { path: '/tasks', out: 'public/screenshots/tasks.png' },
  { path: '/content', out: 'public/screenshots/content.png' },
  { path: '/calendar', out: 'public/screenshots/calendar.png' },
];

async function main(){
  await fs.mkdir('public/screenshots', { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  for (const t of targets){
    const url = `http://localhost:3000${t.path}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.setViewport({ width: 1280, height: 900 });
    await page.screenshot({ path: t.out, fullPage: true });
    console.log('Saved', t.out);
  }
  await browser.close();
}

main().catch((e)=>{ console.error(e); process.exit(1); });
