// Generează reel-luni.html: Reel-ul de luni (unghi 01) ca document autonom pentru importul în Adobe Express.
// Fonturile (subset pe literele folosite) și fotografia sunt încorporate base64; fiecare .slide are 1080x1920.
// La text nou, regenerează subsetul de font (fonttools pyftsubset) ca să conțină literele noi.
const fs = require('fs');
const path = require('path');

// REMOTE=<commit>: resursele se referă prin jsDelivr (HTML mic, pentru trimis inline la importul Express)
const REMOTE = process.env.REMOTE;
const CDN = `https://cdn.jsdelivr.net/gh/luciannistoroiu-ctrl/credit-republic@${REMOTE}/social-creator/productie/express/`;
const src = (p, mime) => REMOTE ? CDN + p : `data:${mime};base64,` + fs.readFileSync(path.join(__dirname, p)).toString('base64');
const fontLatin = src('assets/cr-sans-latin.subset.woff2', 'font/woff2');
const fontExt = src('assets/cr-sans-ext.subset.woff2', 'font/woff2');
const flo = src('assets/florenta-360.jpg', 'image/jpeg');

const pill = (text, bg, fg, size) =>
  `<span class="pill" style="background:${bg};color:${fg};font-size:${size}px">${text}</span>`;
const lines = (arr, bg, fg, size) => arr.map((t) => pill(t, bg, fg, size)).join('<br>');

const wordmark = (color) =>
  `<div class="wm" style="color:${color}"><span class="m1"></span><span class="m2"></span>credit republic</div>`;

const slides = [
  {
    bg: '#FFF8F0',
    body: `${wordmark('#2B2640')}
      <div class="abs" style="left:88px;top:620px">${lines(['cine plătește', 'brokerul de credite?'], 'rgba(43,38,64,.08)', '#2B2640', 88)}</div>`
  },
  {
    bg: '#FFF8F0',
    body: `${wordmark('#2B2640')}
      <div class="abs disp" style="left:88px;top:700px;font-size:260px;color:#FF6B4A">banca.</div>`
  },
  {
    bg: '#2B2640',
    body: `${wordmark('#FFF8F0')}
      <div class="abs" style="left:88px;top:560px">${lines(['0 lei'], '#06D6A0', '#2B2640', 220)}</div>
      <div class="abs" style="left:88px;top:900px">${lines(['pentru client.'], '#FFF8F0', '#2B2640', 96)}</div>
      <div class="abs" style="left:88px;top:1070px">${lines(['comisionul vine', 'de la bancă.'], 'rgba(255,248,240,.14)', '#FFF8F0', 76)}</div>`
  },
  {
    bg: '#FFF8F0',
    body: `${wordmark('#2B2640')}
      <img class="abs" src="${flo}" style="left:88px;top:430px;width:340px;height:340px;border-radius:50%;border:10px solid #FF6B4A">
      <div class="abs" style="left:88px;top:840px">${lines(['Florența Nistoroiu', 'negociază.'], 'rgba(43,38,64,.08)', '#2B2640', 88)}</div>
      <div class="abs" style="left:88px;top:1130px">${lines(['algoritmul compară', 'toate băncile.'], '#06D6A0', '#2B2640', 72)}</div>`
  },
  {
    bg: '#2B2640',
    body: `<div class="abs" style="left:0;right:0;top:760px;text-align:center">
        <div class="wm big" style="color:#FFF8F0;position:static;display:inline-flex"><span class="m1"></span><span class="m2"></span>credit republic</div>
      </div>
      <div class="abs" style="left:0;right:0;top:940px;text-align:center">${pill('verifică poziția ta', '#2C86F6', '#FFFFFF', 52)}</div>
      <div class="abs body" style="left:0;right:0;top:1080px;text-align:center;font-size:40px;color:rgba(255,248,240,.72)">4 minute · 0 lei · creditrepublic.ro</div>`
  }
];

const html = `<!doctype html>
<html lang="ro"><head><meta charset="utf-8">
<title>credit republic — reel luni</title>
<meta name="hz:slide-selector" content=".slide">
<style>
@font-face{font-family:'CR Sans';font-weight:400 800;src:url(${fontLatin}) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'CR Sans';font-weight:400 800;src:url(${fontExt}) format('woff2');unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF}
*{margin:0;padding:0;box-sizing:border-box}
body{background:#888}
.slide{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:'CR Sans',sans-serif;margin-bottom:40px}
.abs{position:absolute}
.disp{font-weight:700;letter-spacing:-.03em;line-height:1.1}
.body{font-weight:600}
.pill{display:inline-block;font-weight:700;letter-spacing:-.025em;line-height:1.25;padding:.06em .42em;border-radius:999px;margin:.08em 0}
.wm{position:absolute;left:88px;top:236px;display:flex;align-items:center;gap:20px;font-weight:700;font-size:50px;letter-spacing:-.03em}
.wm .m1,.wm .m2{display:block;width:82px;height:26px;border-radius:13px}
.wm .m1{background:currentColor;opacity:.22;margin-right:-70px;transform:translateY(-16px)}
.wm .m2{background:#FF6B4A;transform:translateY(16px)}
.wm.big{font-size:92px;gap:30px}
</style></head><body>
${slides.map((s) => `<section class="slide" data-canvas-width="1080" data-canvas-height="1920" style="background:${s.bg}">${s.body}</section>`).join('\n')}
</body></html>`;

fs.writeFileSync(path.join(__dirname, 'reel-luni.html'), html);
console.log('reel-luni.html', html.length, 'bytes');
