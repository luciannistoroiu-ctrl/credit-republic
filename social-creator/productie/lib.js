const FLO = '../assets/florenta-nistoroiu-cerc.jpg';
const APT = '../assets/photo_modern_interior.jpg';

const MARK = {
  dark: '<svg viewBox="0 0 106 58"><rect width="82" height="26" rx="13" fill="#FFF8F0" fill-opacity=".22"/><rect x="24" y="32" width="82" height="26" rx="13" fill="#FF6B4A"/></svg>',
  light: '<svg viewBox="0 0 106 58"><rect width="82" height="26" rx="13" fill="#2B2640" fill-opacity=".22"/><rect x="24" y="32" width="82" height="26" rx="13" fill="#FF6B4A"/></svg>'
};

// "ı" fără punct: pastila coral ține locul punctului, ca în marca din templates.js
function wm(on = 'dark', style = '') {
  const color = on === 'dark' ? 'var(--cream)' : 'var(--plum)';
  return `<div class="wm" style="color:${color};${style}">${MARK[on]}<span>cred<span class="ip">ı</span>t republ<span class="ip">ı</span>c</span></div>`;
}

const EASE = 'cubic-bezier(.2,.7,.2,1)';
const inA = (s, d = 0.45) => `animation:fin ${d}s ${EASE} ${s}s both`;
const popA = (s, d = 0.4) => `animation:pop ${d}s ${EASE} ${s}s both`;
const inOut = (s, e, d = 0.45) => `animation:fin ${d}s ${EASE} ${s}s both, fout .3s ease-in ${e}s forwards`;
const popOut = (s, e, d = 0.4) => `animation:pop ${d}s ${EASE} ${s}s both, fout .3s ease-in ${e}s forwards`;
const outA = (e) => `animation:fout .3s ease-in ${e}s forwards`;

const photo = (size, style = '') => `<div class="photo" style="width:${size}px;height:${size}px;background-image:url('${FLO}');${style}"></div>`;

const house = (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M3 11 12 4l9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg>`;

// traseul cu bucle: centrul urcă liniar, iar un punct se rotește în jurul lui (cicloidă alungită)
function loopPath(cx, y0, height, R, loops) {
  const T = Math.PI * 2 * loops, a = height / T, steps = loops * 90;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * T;
    const x = cx + R * Math.sin(t);
    const y = y0 - a * t + R * (Math.cos(t) - 1) * 0.55;
    d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d;
}

// „drumul": bucle prin toate băncile vs linie dreaptă până la Florența
// o = { W, H, lx, rx, y0, y1, R, loops, flo, lab, anim: {loop:[s,d], line:[s,d], end:s} }
function drum(o) {
  const loops = loopPath(o.lx, o.y0, o.y0 - o.y1, o.R, o.loops);
  const line = `M${o.rx} ${o.y0} L${o.rx} ${o.y1}`;
  const la = o.anim ? `style="animation:draw ${o.anim.loop[1]}s linear ${o.anim.loop[0]}s both"` : '';
  const ln = o.anim ? `style="animation:draw ${o.anim.line[1]}s ${EASE} ${o.anim.line[0]}s both"` : '';
  const endA = o.anim ? popA(o.anim.end) : '';
  const labA = o.anim ? inA(0.3) : '';
  const f = o.flo;
  return `
  <svg class="abs" style="left:0;top:0" width="${o.W}" height="${o.H}" viewBox="0 0 ${o.W} ${o.H}">
    <defs>
      <mask id="mL" maskUnits="userSpaceOnUse"><path d="${loops}" pathLength="1" stroke="#fff" stroke-width="14" fill="none" stroke-dasharray="1" stroke-dashoffset="0" ${la}/></mask>
    </defs>
    <path d="${loops}" mask="url(#mL)" stroke="rgba(255,248,240,.6)" stroke-width="3.2" fill="none" stroke-dasharray="7 8" stroke-linecap="round"/>
    <path d="${line}" pathLength="1" stroke="#06D6A0" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="0" ${ln}/>
    <circle cx="${o.lx}" cy="${o.y0}" r="7" fill="#FFF8F0" fill-opacity=".6"/>
    <circle cx="${o.rx}" cy="${o.y0}" r="8" fill="#06D6A0"/>
  </svg>
  <div class="abs" style="left:${o.lx - 22}px;top:${o.y1 - 58}px;${endA}">${house(44, 'rgba(255,248,240,.55)')}</div>
  <div class="abs" style="left:${o.rx - f / 2}px;top:${o.y1 - f - 6}px;${endA}">
    ${photo(f, 'border:4px solid #06D6A0')}
    <div class="abs" style="right:-10px;bottom:-6px;width:40px;height:40px;border-radius:50%;background:#06D6A0;display:flex;align-items:center;justify-content:center">${house(24, '#2B2640')}</div>
  </div>
  <div class="abs body" style="left:${o.lx}px;top:${o.y0 + o.lab}px;transform:translateX(-50%);white-space:nowrap;font-size:15px;font-weight:700"><div style="${labA}"><span class="pl pl-gd">toate băncile, pe rând</span></div></div>
  <div class="abs body" style="left:${o.rx}px;top:${o.y0 + o.lab}px;transform:translateX(-50%);white-space:nowrap;font-size:15px;font-weight:700"><div style="${labA}"><span class="pl pl-mint">un singur dosar</span></div></div>`;
}

module.exports = { FLO, APT, wm, inA, popA, inOut, popOut, outA, photo, house, drum, EASE };
