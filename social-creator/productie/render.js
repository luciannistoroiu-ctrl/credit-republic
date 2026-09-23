// node social-creator/productie/render.js <folder-săptămână> [filtru-id]
// Randează stills (PNG) și animații (MP4, cadru cu cadru) la 2x. Validează textul fiecărui cadru.
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const { spawn, execSync } = require('child_process');
const { once } = require('events');

const PW = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const FPS = 30;

const ROOT = __dirname;
const WEEK = path.join(ROOT, process.argv[2] || 'saptamana-1');
const FILTER = process.argv[3] || '';
const OUT = path.join(WEEK, 'out');
const TMP = path.join(ROOT, '.render.html');

const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(ROOT, '../js/brand-validator.js'), 'utf8').replace(/^const (\w+) =/m, 'var $1 ='),
  ctx
);
const BV = ctx.BrandValidator;

const posts = require(path.join(WEEK, 'posts.js'));

function doc(p, inner, theme) {
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="base.css">
<style>${p.css || ''}</style></head><body>
<div class="cv ${theme}" style="width:${p.w}px;height:${p.h}px">${inner}</div>
<script>${p.js || ''}</script></body></html>`;
}

async function check(page, label) {
  const { text, blue } = await page.evaluate(() => {
    const blue = [...document.querySelectorAll('.cv *')].filter(
      (el) => getComputedStyle(el).backgroundColor === 'rgb(44, 134, 246)'
    ).length;
    return { text: document.body.innerText.replace(/ı/g, 'i'), blue };
  });
  const issues = BV.validateText(text, label).map((i) => `${i.rule.id}: "${i.match}"`);
  if (blue > 1) issues.push(`albastru semnal de ${blue} ori`);
  return issues;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await PW.chromium.launch();
  const report = [];

  for (const p of posts) {
    if (FILTER && !p.id.includes(FILTER)) continue;
    const page = await browser.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: 2 });
    const slides = p.slides || [p.html];

    for (let i = 0; i < slides.length; i++) {
      const suffix = slides.length > 1 ? `_${String(i + 1).padStart(2, '0')}` : '';
      fs.writeFileSync(TMP, doc(p, slides[i], (p.themes && p.themes[i]) || p.theme));
      await page.goto('file://' + TMP);
      await page.evaluate(() => document.fonts.ready);

      const issues = await check(page, p.id + suffix);
      report.push({ id: p.id + suffix, issues });

      if (!p.dur) {
        await page.screenshot({ path: path.join(OUT, `${p.id}${suffix}.png`) });
        console.log('png', p.id + suffix, issues.length ? issues : 'ok');
        continue;
      }

      await page.evaluate(() => {
        window.__set = (ms) => {
          document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; });
          if (window.onFrame) window.onFrame(ms);
        };
      });
      const file = path.join(OUT, `${p.id}.mp4`);
      const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS),
        '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-profile:v', 'high',
        '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', '-an', file], { stdio: ['pipe', 'inherit', 'inherit'] });
      const frames = Math.round(p.dur * FPS);
      for (let f = 0; f < frames; f++) {
        await page.evaluate((ms) => window.__set(ms), (f * 1000) / FPS);
        const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
        if (!ff.stdin.write(buf)) await once(ff.stdin, 'drain');
      }
      ff.stdin.end();
      await once(ff, 'close');

      // copertă pentru TikTok/Reels la momentul ales
      await page.evaluate((ms) => window.__set(ms), (p.cover ?? p.dur - 0.5) * 1000);
      await page.screenshot({ path: path.join(OUT, `${p.id}_coperta.png`) });
      console.log('mp4', p.id, `${p.dur}s`, issues.length ? issues : 'ok');
    }
    await page.close();
  }

  await browser.close();
  fs.rmSync(TMP, { force: true });
  const bad = report.filter((r) => r.issues.length);
  console.log(`\n${report.length} cadre randate, ${bad.length} cu probleme`);
  if (bad.length) { console.log(JSON.stringify(bad, null, 2)); process.exit(1); }
})();
