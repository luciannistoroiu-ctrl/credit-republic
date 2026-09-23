// Săptămâna 1 — vezi claude-project-import/knowledge/credit-republic-plan-postari-saptamana-1.md
// Denumire: cr_[unghi]_[zi]-[suprafață]-[nume]_[format]_v[n]
// Pânze în px CSS, randate la 2x: 4:5 = 540x675, 1:1 = 540x540, 9:16 = 540x960, 16:9 = 960x540.
// La 9:16, textul stă între y=110 și y=770 (zonele sigure TikTok/Reels/Stories).
const L = require('../lib.js');
const { wm, photo, house, drum, inA, popA, inOut, popOut, outA, APT, EASE } = L;

const F45 = { w: 540, h: 675 };
const F11 = { w: 540, h: 540 };
const F916 = { w: 540, h: 960 };
const F169 = { w: 960, h: 540 };

const pad = 44;
const foot = (on, right = '') => `
  <div class="abs" style="left:${pad}px;right:${pad}px;bottom:${pad - 6}px;display:flex;justify-content:space-between;align-items:center">
    ${wm(on)}${right}
  </div>`;
const foot916 = (on, right = '') => `
  <div class="abs" style="left:${pad}px;right:${pad}px;top:118px;display:flex;justify-content:space-between;align-items:center">
    ${wm(on, 'font-size:25px')}${right}
  </div>`;
const bg = (theme, inner) => `<div class="abs ${theme}" style="inset:0">${inner}</div>`;
const mid916 = (inner) => `<div class="abs" style="left:${pad}px;right:${pad}px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center">${inner}</div>`;
const counter = (i, n, on) => `<span class="eb ${on === 'dark' ? 'eb-d' : 'eb-l'}" style="font-size:12px">${i}/${n}</span>`;

const posts = [];

// ─────────────────────────── LUNI — 01 mecanismul ───────────────────────────

posts.push({
  id: 'cr_01_luni-story-sondaj_9x16_v1', ...F916, theme: 't-plum', themes: ['t-plum', 't-cream'],
  slides: [
    `${foot916('dark')}
     <div class="abs" style="left:${pad}px;right:${pad}px;top:230px">
       <span class="eb eb-d">sondaj</span>
       <div class="disp pills" style="font-size:46px;margin-top:22px"><span class="pl pl-cream">cât plătește clientul unui broker de credite?</span></div>
     </div>`,
    `${foot916('light')}
     <div class="abs" style="left:${pad}px;right:${pad}px;top:230px">
       <span class="eb eb-l">răspunsul de ieri</span>
       <div class="disp" style="font-size:120px;margin-top:26px;line-height:1"><span class="pl pl-mint">0 lei.</span></div>
       <div class="disp pills" style="font-size:38px;margin-top:26px"><span class="pl pl-plum">comisionul vine de la bancă.</span></div>
       <div class="body muted-l" style="font-size:19px;margin-top:30px;max-width:420px">Florența Nistoroiu, broker autorizat AVBS, negociază și duce dosarul până la semnare.</div>
     </div>`
  ]
});

posts.push({
  id: 'cr_01_luni-x-linia-master_1x1_v1', ...F11, theme: 't-plum',
  html: `
    <div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px"><span class="eb eb-d">obiceiul din piață</span></div>
    <div class="abs" style="left:${pad}px;right:${pad}px;top:118px">
      <div class="disp" style="font-size:44px">nimeni nu alege cel mai bun credit.</div>
      <div class="disp pills" style="font-size:44px;margin-top:10px"><span class="pl pl-coral">aleg primul care le iese în cale.</span></div>
      <div class="body muted-d" style="font-size:18px;margin-top:26px;max-width:430px">Florența Nistoroiu negociază dosarul până la semnare. 0 lei pentru client.</div>
    </div>
    ${foot('dark')}`
});

// ─────────────────────────── MARȚI — 07 birocrația ───────────────────────────

posts.push({
  id: 'cr_07_marti-feed-drumul_4x5_v1', ...F45, theme: 't-plum',
  html: `
    <div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px">
      <div class="disp pills" style="font-size:38px"><span class="pl pl-cream">un singur dosar,</span><br><span class="pl pl-cream">nu cinci drumuri.</span></div>
    </div>
    ${drum({ W: 540, H: 675, lx: 150, rx: 390, y0: 540, y1: 268, R: 38, loops: 5, flo: 92, lab: 22 })}
    ${foot('dark')}`
});

posts.push({
  id: 'cr_07_marti-x-checklist_1x1_v1', ...F11, theme: 't-cream',
  html: `
    <div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px">
      <span class="eb eb-l">birocrația</span>
      <div class="disp" style="font-size:31px;margin-top:16px">actele pentru un credit ipotecar, depuse o singură dată</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:22px">
        ${['act de identitate', 'adeverință de venit', 'extrase de cont', 'antecontract'].map((t) => `
          <div style="display:flex;align-items:center;gap:14px;background:var(--plum-08);border-radius:999px;padding:10px 16px">
            <span style="width:26px;height:26px;border-radius:50%;background:var(--mint);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px">✓</span>
            <span class="body" style="font-size:18px;font-weight:600">${t}</span>
          </div>`).join('')}
      </div>
    </div>
    ${foot('light', '<span class="body" style="font-size:15px;font-weight:700"><span class="pl pl-mint">0 lei pentru client</span></span>')}`
});

// ─────────────────────────── MIERCURI — 03 venitul variabil ───────────────────────────

const mr = (myth, real) => `
  <div class="card" style="background:rgba(255,209,102,.28)">
    <span class="eb" style="background:var(--sun);color:var(--plum)">mit</span>
    <div class="body" style="font-size:27px;font-weight:600;margin-top:14px;line-height:1.35">${myth}</div>
  </div>
  <div class="card" style="background:rgba(6,214,160,.16);border:1.5px solid rgba(6,214,160,.45);margin-top:14px">
    <span class="eb" style="background:var(--mint);color:var(--plum)">realitate</span>
    <div class="body" style="font-size:27px;font-weight:600;margin-top:14px;line-height:1.35">${real}</div>
  </div>`;

posts.push({
  id: 'cr_03_miercuri-feed-carusel_4x5_v1', ...F45, theme: 't-cream', themes: ['t-plum', 't-cream', 't-cream', 't-plum'],
  slides: [
    `<div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px;display:flex;justify-content:space-between"><span class="eb eb-d">venitul variabil</span>${counter(1, 4, 'dark')}</div>
     <div class="abs" style="left:${pad}px;right:${pad}px;top:170px">
       <div class="disp pills" style="font-size:50px"><span class="pl pl-cream">pfa, dividende, bonusuri.</span></div>
       <div class="disp pills" style="font-size:50px;margin-top:12px"><span class="pl pl-sun">fiecare bancă le calculează altfel.</span></div>
       <div class="body" style="font-size:17px;font-weight:700;color:var(--sun);margin-top:34px">glisează →</div>
     </div>
     ${foot('dark')}`,
    `<div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px;display:flex;justify-content:space-between"><span class="eb eb-l">în practică</span>${counter(2, 4, 'light')}</div>
     <div class="abs" style="left:${pad}px;right:${pad}px;top:96px;bottom:96px;display:flex;flex-direction:column;justify-content:center">
       ${mr('venitul e același, oricare ar fi banca.', 'o bancă poate lua în calcul ultimul an fiscal, alta media pe doi ani.')}
     </div>
     ${foot('light')}`,
    `<div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px;display:flex;justify-content:space-between"><span class="eb eb-l">în practică</span>${counter(3, 4, 'light')}</div>
     <div class="abs" style="left:${pad}px;right:${pad}px;top:96px;bottom:96px;display:flex;flex-direction:column;justify-content:center">
       ${mr('suma aprobată depinde doar de cât câștigi.', 'același venit, altă sumă eligibilă, în funcție de bancă.')}
     </div>
     ${foot('light')}`,
    `<div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px;display:flex;justify-content:flex-end">${counter(4, 4, 'dark')}</div>
     <div class="abs" style="left:${pad}px;right:${pad}px;top:${pad + 8}px;display:flex;align-items:center;gap:18px">
       ${photo(112, 'border:4px solid var(--coral)')}
       <div><div class="disp" style="font-size:25px">Florența Nistoroiu</div><div class="body muted-d" style="font-size:16px">broker autorizat AVBS</div></div>
     </div>
     <div class="abs" style="left:${pad}px;right:${pad}px;top:210px">
       <div class="body pills" style="font-size:22px;font-weight:700"><span class="pl pl-sun">venit din pfa, dividende sau bonusuri?</span></div>
       <div class="disp pills" style="font-size:36px;margin-top:16px"><span class="pl pl-cream">Florența știe ce bancă îl acceptă și cât îți poate aproba.</span></div>
       <div class="disp" style="font-size:32px;margin-top:16px"><span class="pl pl-mint">0 lei pentru tine.</span></div>
       <div style="margin-top:26px"><span class="btn pl-blue">află ce sumă poți primi</span></div>
     </div>
     ${foot('dark')}`
  ]
});

posts.push({
  id: 'cr_03_miercuri-story-intrebare_9x16_v1', ...F916, theme: 't-sun',
  html: `
    ${foot916('light')}
    <div class="abs" style="left:${pad}px;right:${pad}px;top:220px">
      <div style="display:flex;align-items:center;gap:14px">
        ${photo(64, 'border:3px solid var(--plum)')}
        <span class="body" style="font-size:18px;font-weight:700">Florența răspunde.</span>
      </div>
      <div class="disp pills" style="font-size:58px;margin-top:26px"><span class="pl pl-plum">ce tip de venit ai?</span></div>
      <div class="body pills" style="font-size:24px;font-weight:600;margin-top:20px"><span class="pl pl-cream">pfa, dividende, bonusuri sau salariu plus altceva.</span></div>
    </div>`
});

// ─────────────────────────── JOI — 06 algoritm + om ───────────────────────────

const screenIcon = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2B2640" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M7 12l3-3 2 2 4-4"/></svg>`;

posts.push({
  id: 'cr_06_joi-tiktok-carusel_9x16_v1', ...F916, theme: 't-cream', themes: ['t-plum', 't-cream', 't-cream', 't-plum'],
  slides: [
    `${foot916('dark', counter(1, 4, 'dark'))}
     <div class="abs" style="left:${pad}px;right:${pad}px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start">
       <div class="disp pills" style="font-size:52px"><span class="pl pl-cream">o decizie pe 30 de ani merită mai mult decât un rezultat pe ecran.</span></div>
     </div>`,
    `${foot916('light', counter(2, 4, 'light'))}
     <div class="abs" style="left:${pad}px;right:${pad}px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start">
       ${screenIcon}
       <div style="margin-top:18px"><span class="eb eb-l">algoritmul</span></div>
       <div class="disp pills" style="font-size:50px;margin-top:18px"><span class="pl pl-gl">compară toate băncile în 4 minute.</span></div>
     </div>`,
    `${foot916('light', counter(3, 4, 'light'))}
     <div class="abs" style="left:${pad}px;right:${pad}px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start">
       ${photo(120, 'border:4px solid var(--coral)')}
       <div style="margin-top:18px"><span class="eb eb-l">Florența</span></div>
       <div class="disp pills" style="font-size:44px;margin-top:18px"><span class="pl pl-gl">citește contractul, negociază și duce dosarul până la semnare.</span></div>
     </div>`,
    `${foot916('dark', counter(4, 4, 'dark'))}
     <div class="abs" style="left:${pad}px;right:${pad}px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start">
       <div class="disp pills" style="font-size:74px"><span class="pl pl-mint">0 lei pentru tine.</span></div>
       <div class="disp pills" style="font-size:38px;margin-top:26px"><span class="pl pl-cream">comisionul vine de la bancă.</span></div>
     </div>`
  ]
});

posts.push({
  id: 'cr_06_joi-x-broker-ai_1x1_v1', ...F11, theme: 't-cream',
  html: `
    <div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px">
      <div class="disp" style="font-size:36px">algoritmul compară.<br>Florența negociază.</div>
    </div>
    <div class="abs" style="left:${pad}px;right:${pad}px;top:168px;display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="card" style="background:var(--plum-08)">
        ${screenIcon.replace(/64/g, '42')}
        <div class="body" style="font-size:14px;font-weight:800;margin-top:10px">algoritmul</div>
        <div class="body" style="font-size:18px;font-weight:600;margin-top:6px">compară toate băncile în 4 minute.</div>
      </div>
      <div class="card" style="background:rgba(6,214,160,.16);border:1.5px solid rgba(6,214,160,.45)">
        ${photo(46, 'border:2px solid var(--coral)')}
        <div class="body" style="font-size:14px;font-weight:800;margin-top:8px">Florența Nistoroiu</div>
        <div class="body" style="font-size:18px;font-weight:600;margin-top:6px">negociază și duce dosarul până la semnare.</div>
      </div>
    </div>
    ${foot('light', '<span class="body" style="font-size:15px;font-weight:700"><span class="pl pl-mint">0 lei pentru client</span></span>')}`
});

// ─────────────────────────── VINERI — 05 casa vs creditul ───────────────────────────

posts.push({
  id: 'cr_05_vineri-feed-apartament_4x5_v1', ...F45, theme: 't-cream',
  html: `
    <div class="abs" style="inset:0;background:url('${APT}') 58% center/cover"></div>
    <div class="abs" style="left:0;right:0;bottom:0;height:160px;background:linear-gradient(to top,rgba(43,38,64,.55),transparent)"></div>
    <div class="abs" style="left:${pad}px;right:${pad}px;top:${pad + 10}px">
      <div class="disp pills" style="font-size:40px"><span class="pl pl-cream">6 luni pentru apartament.</span></div>
      <div class="disp pills" style="font-size:40px;margin-top:10px"><span class="pl pl-plum">20 de minute pentru credit.</span></div>
    </div>
    ${foot('dark')}`
});

// ─────────────────────────── SÂMBĂTĂ — 04 designul opac ───────────────────────────

posts.push({
  id: 'cr_04_sambata-story-quiz_9x16_v1', ...F916, theme: 't-cream',
  html: `
    ${foot916('light')}
    <div class="abs" style="left:${pad}px;right:${pad}px;top:230px">
      <span class="eb eb-l">quiz</span>
      <div class="disp pills" style="font-size:54px;margin-top:22px"><span class="pl pl-plum">ce intră în costul unui credit?</span></div>
    </div>`
});

const big = (n) => `<div class="disp" style="width:120px;height:120px;border-radius:50%;background:var(--sun);display:flex;align-items:center;justify-content:center;font-size:72px;line-height:1">${n}</div>`;
posts.push({
  id: 'cr_04_sambata-tiktok-carusel_9x16_v1', ...F916, theme: 't-cream', themes: ['t-plum', 't-cream', 't-cream', 't-cream', 't-plum'],
  slides: [
    `${foot916('dark', counter(1, 5, 'dark'))}
     <div class="abs" style="left:${pad}px;right:${pad}px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start">
       <div class="disp pills" style="font-size:52px"><span class="pl pl-cream">3 lucruri care nu apar în reclama cu dobândă mică.</span></div>
     </div>`,
    ...['comisionul lunar de administrare.', 'asigurările cerute de bancă.', 'cum se schimbă dobânda după perioada fixă.'].map((t, i) => `
     ${foot916('light', counter(i + 2, 5, 'light'))}
     <div class="abs" style="left:${pad}px;right:${pad}px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start">
       ${big(i + 1)}
       <div class="disp pills" style="font-size:48px;margin-top:26px"><span class="pl pl-gl">${t}</span></div>
     </div>`),
    `${foot916('dark', counter(5, 5, 'dark'))}
     <div class="abs" style="left:${pad}px;right:${pad}px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start">
       ${photo(120, 'border:4px solid var(--coral)')}
       <div class="disp pills" style="font-size:44px;margin-top:24px"><span class="pl pl-cream">Florența citește contractul înainte de semnare.</span></div>
       <div class="disp" style="font-size:44px;margin-top:16px"><span class="pl pl-mint">0 lei pentru tine.</span></div>
     </div>`
  ]
});

posts.push({
  id: 'cr_04_sambata-x-comparatie_1x1_v1', ...F11, theme: 't-cream',
  html: `
    <div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px">
      <div class="disp" style="font-size:30px">banca afișează cifra mică. contractul o conține pe cea reală.</div>
    </div>
    <div class="abs" style="left:${pad}px;right:${pad}px;top:162px;display:grid;grid-template-columns:.8fr 1.2fr;gap:14px;align-items:start">
      <div class="card" style="background:var(--plum-08)">
        <div class="body" style="font-size:13px;font-weight:800">reclama</div>
        <div class="body" style="font-size:17px;font-weight:600;margin-top:10px">dobânda</div>
      </div>
      <div class="card" style="background:var(--plum);color:var(--cream)">
        <div class="body" style="font-size:13px;font-weight:800;color:var(--mint)">contractul</div>
        ${['dobânda', 'comisionul lunar de administrare', 'asigurările cerute de bancă', 'dobânda după perioada fixă', 'costul total'].map((t) =>
          `<div class="body" style="font-size:17px;font-weight:600;margin-top:10px">${t}</div>`).join('')}
      </div>
    </div>
    ${foot('light')}`
});

// ─────────────────────────── DUMINICĂ — 02 refinanțarea ───────────────────────────

posts.push({
  id: 'cr_02_duminica-feed-calcul_4x5_v1', ...F45, theme: 't-plum',
  html: `
    <div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px"><span class="eb eb-d">refinanțarea · calcul estimativ</span></div>
    <div class="abs" style="left:${pad}px;right:${pad}px;top:100px">
      <div class="disp" style="font-size:40px">banca nu sună când apare o ofertă mai bună.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:28px">
        <div class="card" style="background:var(--cream-15)">
          <div class="body muted-d" style="font-size:14px;font-weight:700">dobânda de acum</div>
          <div class="disp" style="font-size:40px;margin-top:6px;opacity:.7">7,90%</div>
          <div class="body muted-d" style="font-size:16px;margin-top:4px">rată ~2.680 lei</div>
        </div>
        <div class="card" style="background:rgba(6,214,160,.14);border:1.5px solid rgba(6,214,160,.55)">
          <div class="body" style="font-size:14px;font-weight:700;color:var(--mint)">dobândă renegociată</div>
          <div class="disp" style="font-size:40px;margin-top:6px;color:var(--mint)">5,75%</div>
          <div class="body" style="font-size:16px;margin-top:4px">rată ~2.200 lei</div>
        </div>
      </div>
      <div class="body" style="margin-top:18px;font-size:20px;font-weight:700"><span class="pl pl-mint" style="padding:.4em .9em">diferență estimată: ~480 lei pe lună</span></div>
      <div class="body muted-d" style="font-size:13px;margin-top:18px">calcul estimativ orientativ: credit de 350.000 lei pe 25 de ani, rate lunare egale.</div>
    </div>
    ${foot('dark')}`
});

posts.push({
  id: 'cr_02_duminica-x-intrebare_1x1_v1', ...F11, theme: 't-sun',
  html: `
    <div class="abs" style="left:${pad}px;right:${pad}px;top:${pad}px"><span class="eb eb-l">întrebarea săptămânii</span></div>
    <div class="abs" style="left:${pad}px;right:${pad}px;top:120px">
      <div class="disp pills" style="font-size:40px"><span class="pl pl-plum">ce te-ar face să te uiți din nou la un credit luat acum câțiva ani?</span></div>
    </div>
    ${foot('light')}`
});

// ═══════════════════════════ ANIMAȚII (MP4, 30 fps, fără sunet) ═══════════════════════════
// Sunetul se adaugă nativ în aplicație (TikTok / Reels), ca să poată folosi audio de pe platformă.

const w = (text, s) => `<span style="display:inline-block;${inA(s, 0.35)}">${text}</span>`;
const area916 = (style, inner) => `<div class="abs" style="left:${pad}px;right:${pad}px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;${style}">${inner}</div>`;

posts.push({
  id: 'cr_01_luni-tiktok-text-cinetic_9x16_v1', ...F916, theme: 't-cream', dur: 15, cover: 7.2,
  html: `
    ${foot916('light')}
    ${area916(outA(3.0), `<div class="disp" style="font-size:66px">${w('cine', 0.2)} ${w('plătește', 0.45)} ${w('brokerul', 0.75)} ${w('de', 1.0)} ${w('credite?', 1.2)}</div>`)}
    ${area916(popOut(3.3, 5.2), `<div class="disp" style="font-size:140px;color:var(--coral)">banca.</div>`)}
    ${area916(outA(9.3), `
      <div class="disp" style="font-size:120px;line-height:1.2;${popA(5.5)}"><span class="pl pl-mint">0 lei</span></div>
      <div class="disp pills" style="font-size:52px;margin-top:14px;${inA(6.0)}"><span class="pl pl-gl">pentru client.</span></div>
      <div class="disp pills" style="font-size:40px;margin-top:22px;${inA(6.8)}"><span class="pl pl-plum">comisionul vine de la bancă.</span></div>`)}
    ${area916(outA(12.6), `
      <div style="${popA(9.6)}">${photo(170, 'border:5px solid var(--coral)')}</div>
      <div class="disp pills" style="font-size:44px;margin-top:26px;${inA(10.0)}"><span class="pl pl-gl">Florența Nistoroiu negociază.</span></div>
      <div class="disp pills" style="font-size:40px;margin-top:14px;${inA(10.9)}"><span class="pl pl-gl">algoritmul compară toate băncile.</span></div>`)}
    ${area916('align-items:center', `
      <div style="${popA(12.9)}">${wm('light', 'font-size:44px')}</div>
      <div class="body" style="font-size:22px;font-weight:700;margin-top:22px;${inA(13.4)}"><span class="pl pl-mint">0 lei pentru client</span></div>`)}`
});

posts.push({
  id: 'cr_07_marti-story-drumul_9x16_v1', ...F916, theme: 't-plum', dur: 6, cover: 5.5,
  html: `
    ${foot916('dark')}
    <div class="abs" style="left:${pad}px;right:${pad}px;top:172px;${inA(0.1)}">
      <div class="disp pills" style="font-size:32px"><span class="pl pl-cream">un singur dosar,</span><br><span class="pl pl-cream">nu cinci drumuri.</span></div>
    </div>
    ${drum({ W: 540, H: 960, lx: 150, rx: 390, y0: 620, y1: 372, R: 36, loops: 5, flo: 86, lab: 18, anim: { loop: [0.4, 3.0], line: [3.4, 0.8], end: 4.1 } })}
    <div class="abs" style="left:${pad}px;right:${pad}px;top:694px;${inA(4.6)}">
      <div class="body pills" style="font-size:21px;font-weight:700"><span class="pl pl-mint">un singur dosar, dus de Florența până la semnare.</span></div>
    </div>`
});

const stack = (s, step, hide) => `
  <div class="abs" style="left:${pad}px;right:${pad}px;top:250px;${outA(hide)}">
    ${['adeverință de venit.', 'extrase de cont.', 'act de identitate.', 'antecontract.'].map((t, i) =>
      `<div class="disp" style="font-size:40px;margin-top:12px;${inA(s + i * step, 0.3)}"><span class="pl pl-cream">${t}</span></div>`).join('')}
  </div>`;
const label = (t, s, e) => `<div class="abs" style="left:${pad}px;top:190px;${inOut(s, e, 0.3)}"><span class="eb eb-d" style="font-size:16px">${t}</span></div>`;

posts.push({
  id: 'cr_07_marti-tiktok-teanc-acte_9x16_v1', ...F916, theme: 't-plum', dur: 18, cover: 13.6,
  html: `
    ${foot916('dark')}
    ${label('la prima bancă', 0.1, 6.1)}
    ${stack(0.3, 1.0, 6.1)}
    ${label('la a doua bancă', 6.4, 8.3)}
    ${stack(6.5, 0.25, 8.3)}
    ${label('la a treia bancă', 8.6, 11.3)}
    ${stack(8.7, 0.2, 11.3)}
    <div class="abs" style="left:${pad}px;right:${pad}px;top:560px;${inOut(4.6, 11.3)}">
      <div class="disp pills" style="font-size:34px"><span class="pl pl-sun">aceleași acte, la fiecare bancă, de la zero.</span></div>
    </div>
    ${area916(`animation:none`, `
      <div style="${popA(11.9)}">${photo(120, 'border:4px solid var(--mint)')}</div>
      <div class="disp pills" style="font-size:54px;margin-top:22px;${popA(11.7)}"><span class="pl pl-mint">sau un singur dosar,</span></div>
      <div class="disp pills" style="font-size:38px;margin-top:14px;${inA(12.6)}"><span class="pl pl-cream">dus de Florența până la semnare.</span></div>
      <div class="disp pills" style="font-size:40px;margin-top:22px;${inA(14.4)}"><span class="pl pl-sun">0 lei pentru tine.</span></div>`)}`
});

const bars = [['banca a', 150, 'var(--plum)'], ['banca b', 250, 'var(--mint)'], ['banca c', 110, 'var(--plum)']];
posts.push({
  id: 'cr_03_miercuri-x-trei-calcule_16x9_v1', ...F169, theme: 't-cream', dur: 8, cover: 7.5,
  html: `
    <div class="abs" style="left:48px;top:56px;width:400px">
      <div style="${inA(0.1)}"><span class="eb eb-l">venitul variabil</span></div>
      <div class="disp" style="font-size:44px;margin-top:18px;${inA(0.3)}">același venit, altă sumă eligibilă.</div>
      <div class="body muted-l" style="font-size:19px;margin-top:20px;${inA(3.2)}">Florența știe ce bancă îți acceptă venitul și cât îți poate aproba.</div>
    </div>
    <div class="abs" style="left:48px;bottom:40px">${wm('light')}</div>
    <div class="abs" style="left:520px;width:390px;top:428px;height:2px;background:var(--plum);opacity:.25"></div>
    ${bars.map(([t, h, c], i) => `
      <div class="abs" style="left:${540 + i * 130}px;bottom:112px;width:96px;height:${h}px;border-radius:18px 18px 4px 4px;background:${c};transform-origin:bottom;animation:grow 1s ${EASE} ${1.0 + i * 0.4}s both"></div>
      <div class="abs body" style="left:${540 + i * 130}px;width:96px;text-align:center;top:440px;font-size:16px;font-weight:700;${inA(0.7)}">${t}</div>`).join('')}
    <div class="abs body" style="left:520px;width:390px;text-align:center;top:474px;font-size:15px;font-weight:700;${inA(0.5)}"><span class="pl pl-sun">același venit la intrare</span></div>
    <div class="abs body muted-l" style="right:48px;bottom:14px;font-size:12px">ilustrativ</div>`
});

posts.push({
  id: 'cr_05_vineri-story-precalificare_9x16_v1', ...F916, theme: 't-cream', dur: 6, cover: 4,
  html: `
    <div class="abs" style="inset:0;background:url('${APT}') 58% center/cover;animation:kb 6s linear both"></div>
    <div class="abs" style="left:${pad}px;top:112px;background:var(--cream);border-radius:999px;padding:8px 16px">${wm('light', 'font-size:22px')}</div>
    <div class="abs" style="left:${pad}px;right:${pad}px;top:230px">
      <div class="disp pills" style="font-size:40px;${inA(1.5)}"><span class="pl pl-cream">înainte de vizionări:</span></div>
      <div class="disp pills" style="font-size:40px;margin-top:10px;${inA(1.9)}"><span class="pl pl-plum">află suma eligibilă în 4 minute.</span></div>
    </div>`
});

posts.push({
  id: 'cr_05_vineri-x-drumul-tva_16x9_v1', ...F169, theme: 't-plum', dur: 8, cover: 7.5,
  html: `
    ${drum({ W: 960, H: 540, lx: 140, rx: 370, y0: 430, y1: 196, R: 32, loops: 4, flo: 80, lab: 18, anim: { loop: [0.3, 3.0], line: [3.3, 0.7], end: 3.9 } })}
    <div class="abs" style="left:510px;right:44px;top:120px">
      <div class="disp pills" style="font-size:42px;${inA(4.4)}"><span class="pl pl-cream">costul creditului se poate controla.</span></div>
      <div class="body" style="font-size:21px;font-weight:600;margin-top:24px;${inA(5.0)}">algoritmul compară toate băncile. Florența negociază.</div>
      <div class="body" style="font-size:21px;font-weight:700;margin-top:16px;${inA(5.6)}"><span class="pl pl-mint">0 lei pentru client.</span></div>
    </div>
    <div class="abs" style="right:44px;bottom:38px">${wm('dark')}</div>`
});

posts.push({
  id: 'cr_04_sambata-feed-reclama-contract_9x16_v1', ...F916, theme: 't-plum', dur: 12, cover: 6.4,
  css: `@keyframes toCorner { to { transform: translate(0, -190px) scale(.5); opacity: .5; } }`,
  html: `
    ${foot916('dark')}
    <div class="abs disp" style="left:${pad}px;right:${pad}px;top:360px;font-size:66px;transform-origin:left top;
      animation:fin .45s ${EASE} .2s both, toCorner .8s ${EASE} 2.4s forwards, fout .3s ease-in 7.6s forwards">dobânda din reclamă.</div>
    <div class="abs" style="left:${pad}px;right:${pad}px;top:300px;${outA(7.6)}">
      <div class="disp" style="font-size:40px;${inA(3.2)}"><span class="pl pl-sun">comisioane lunare.</span></div>
      <div class="disp" style="font-size:52px;margin-top:18px;${inA(4.4)}"><span class="pl pl-sun">asigurări.</span></div>
      <div class="disp" style="font-size:66px;margin-top:18px;${inA(5.6)}"><span class="pl pl-sun">marja.</span></div>
    </div>
    ${area916('', `<div class="disp pills" style="font-size:66px;${popA(8.0)}"><span class="pl pl-cream">costul din contract.</span></div>`)}`
});

posts.push({
  id: 'cr_02_duminica-story-rata_9x16_v1', ...F916, theme: 't-plum', dur: 6, cover: 5.5,
  js: `
    const el = document.getElementById('num');
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    window.onFrame = (t) => {
      const p = ease(Math.min(1, Math.max(0, (t - 1000) / 2000)));
      const v = Math.round((2680 - 480 * p) / 10) * 10;
      el.textContent = '~' + v.toLocaleString('de-DE');
      el.style.color = p >= 1 ? 'var(--mint)' : 'var(--cream)';
    };
    window.onFrame(0);`,
  html: `
    ${foot916('dark')}
    <div class="abs" style="left:${pad}px;right:${pad}px;top:200px">
      <div style="${inA(0.1)}"><span class="eb eb-d">refinanțarea · calcul estimativ</span></div>
      <div class="body muted-d" style="font-size:20px;font-weight:600;margin-top:28px;${inA(0.2)}">rata lunară</div>
      <div style="display:flex;align-items:baseline;gap:12px;margin-top:6px">
        <div id="num" class="disp" style="font-size:108px;line-height:1"></div>
        <div class="disp" style="font-size:40px">lei</div>
      </div>
      <div class="disp pills" style="font-size:30px;margin-top:24px;${inA(3.3)}"><span class="pl pl-mint">aceeași casă, altă rată.</span></div>
      <div class="body muted-d" style="font-size:14px;margin-top:22px;${inA(0.2)}">calcul estimativ orientativ: credit de 350.000 lei pe 25 de ani, dobândă 7,90% față de 5,75%.</div>
    </div>`
});

// Reel-ul de luni fără filmare: aceeași poveste ca scriptul Florenței, în text animat
const fade = (s, e) => `animation:fade .4s ease-out ${s}s both${e ? `, fout .3s ease-in ${e}s forwards` : ''}`;
const top916 = (on) => `<div class="abs" style="left:${pad}px;top:118px">${wm(on, 'font-size:25px')}</div>`;
posts.push({
  id: 'cr_01_luni-reel-mecanismul_9x16_v1', ...F916, theme: 't-cream', dur: 18, cover: 7.2,
  css: `@keyframes fade { from { opacity: 0; } to { opacity: 1; } }`,
  html: `
    <div class="abs t-plum" style="inset:0;${fade(5.4, 10.0)}"></div>
    <div class="abs t-plum" style="inset:0;${fade(14.4)}"></div>
    <div class="abs" style="inset:0;${outA(5.2)}">${top916('light')}</div>
    <div class="abs" style="inset:0;${fade(5.4, 10.0)}">${top916('dark')}</div>
    <div class="abs" style="inset:0;${fade(10.2, 14.2)}">${top916('light')}</div>
    ${area916(outA(3.2), `
      <div class="disp pills" style="font-size:52px;${inA(0.2)}"><span class="pl pl-gl">cine plătește</span></div>
      <div class="disp pills" style="font-size:52px;margin-top:8px;${inA(0.6)}"><span class="pl pl-gl">brokerul de credite?</span></div>`)}
    ${area916(popOut(3.6, 5.2), `<div class="disp" style="font-size:150px;color:var(--coral)">banca.</div>`)}
    ${area916(outA(10.0), `
      <div class="disp pills" style="font-size:124px;${popA(5.7)}"><span class="pl pl-mint">0 lei</span></div>
      <div class="disp pills" style="font-size:54px;margin-top:14px;${inA(6.2)}"><span class="pl pl-cream">pentru client.</span></div>
      <div class="disp pills" style="font-size:42px;margin-top:18px;${inA(6.9)}"><span class="pl pl-gd">comisionul vine de la bancă.</span></div>`)}
    ${area916(outA(14.2), `
      <div style="${popA(10.3)}">${photo(170, 'border:5px solid var(--coral)')}</div>
      <div class="disp pills" style="font-size:46px;margin-top:26px;${inA(10.8)}"><span class="pl pl-gl">Florența Nistoroiu negociază.</span></div>
      <div class="disp pills" style="font-size:42px;margin-top:14px;${inA(11.6)}"><span class="pl pl-mint">algoritmul compară toate băncile.</span></div>`)}
    ${area916('align-items:center', `
      <div style="${popA(14.8)}">${wm('dark', 'font-size:46px')}</div>
      <div style="margin-top:34px;${inA(15.3)}"><span class="btn pl-blue" style="font-size:24px;padding:16px 30px">verifică poziția ta</span></div>
      <div class="body muted-d" style="font-size:20px;font-weight:600;margin-top:20px;${inA(15.7)}">4 minute · 0 lei · creditrepublic.ro</div>`)}`
});

const disc = (n, s) => `<div class="disp" style="width:68px;height:68px;border-radius:50%;background:var(--sun);color:var(--plum);display:flex;align-items:center;justify-content:center;font-size:38px;line-height:1;flex-shrink:0;${popA(s)}">${n}</div>`;
const step = (n, t, s) => `<div style="display:flex;align-items:center;gap:16px;margin-top:18px">${disc(n, s)}<div class="disp pills" style="font-size:30px;${inA(s + 0.2)}"><span class="pl pl-gl">${t}</span></div></div>`;

// miercuri · TikTok (03): cele 3 verificări, fără filmare
posts.push({
  id: 'cr_03_miercuri-tiktok-trei-verificari_9x16_v1', ...F916, theme: 't-cream', dur: 20, cover: 11,
  html: `
    ${top916('light')}
    ${area916(outA(12.6), `
      <div class="disp pills" style="font-size:36px;${inA(0.2)}"><span class="pl pl-plum">3 lucruri pe care Florența le verifică la un venit din pfa</span></div>
      ${step(1, 'istoricul activității', 2.4)}
      ${step(2, 'cum apare venitul în declarația unică', 4.6)}
      ${step(3, 'ce bancă îl acceptă așa cum e', 6.8)}
      <div class="disp pills" style="font-size:28px;margin-top:26px;${inA(9.2)}"><span class="pl pl-sun">același venit poate însemna sume diferite de la o bancă la alta.</span></div>`)}
    ${area916('', `
      <div style="${popA(12.9)}">${photo(150, 'border:5px solid var(--coral)')}</div>
      <div class="disp pills" style="font-size:46px;margin-top:24px;${inA(13.4)}"><span class="pl pl-gl">Florența Nistoroiu, broker autorizat AVBS.</span></div>
      <div class="disp pills" style="font-size:46px;margin-top:14px;${inA(14.2)}"><span class="pl pl-mint">0 lei pentru tine.</span></div>
      <div class="disp pills" style="font-size:34px;margin-top:14px;${inA(14.8)}"><span class="pl pl-gl">comisionul vine de la bancă.</span></div>`)}`
});

// joi · Reel (06): algoritmul (rânduri de oferte fără nume) → omul (Florența)
const rows = [0, 1, 2, 3, 4, 5].map((i) => {
  const keep = i === 3;
  const w = [300, 360, 250, 330, 280, 340][i];
  return `<div style="display:flex;align-items:center;gap:12px;margin-top:14px;${keep ? '' : `animation:fin .35s ${EASE} ${0.3 + i * 0.12}s both, dim .4s ease ${2.6 + i * 0.15}s forwards`};${keep ? inA(0.3 + i * 0.12, 0.35) : ''}">
    <span style="width:34px;height:34px;border-radius:50%;background:${keep ? 'var(--mint)' : 'rgba(255,248,240,.2)'};flex-shrink:0"></span>
    <span style="height:34px;width:${w}px;border-radius:999px;background:${keep ? 'var(--mint)' : 'rgba(255,248,240,.2)'}"></span>
  </div>`;
}).join('');
const joiReel = {
  ...F916, theme: 't-plum',
  css: `@keyframes dim { to { opacity: .18; } } @keyframes fade { from { opacity: 0; } to { opacity: 1; } }`,
  html: `
    <div class="abs t-cream" style="inset:0;${fade(6.6)}"></div>
    <div class="abs" style="inset:0;${outA(6.4)}">${top916('dark')}</div>
    <div class="abs" style="inset:0;${fade(6.6)}">${top916('light')}</div>
    ${area916(outA(6.4), `
      <div>${rows}</div>
      <div class="disp pills" style="font-size:44px;margin-top:40px;${inA(3.4)}"><span class="pl pl-mint">4 minute: algoritmul compară toate băncile.</span></div>`)}
    ${area916(outA(13.2), `
      <div class="disp pills" style="font-size:48px;${inA(6.9)}"><span class="pl pl-gl">restul: negocierea, dosarul, semnarea.</span></div>
      <div style="margin-top:34px;${popA(8.6)}">${photo(170, 'border:5px solid var(--coral)')}</div>
      <div class="disp pills" style="font-size:56px;margin-top:22px;${inA(9.0)}"><span class="pl pl-plum">acolo e Florența.</span></div>`)}
    <div class="abs t-plum" style="inset:0;${fade(13.4)}"></div>
    ${area916('align-items:center', `
      <div style="${popA(13.8)}">${wm('dark', 'font-size:46px')}</div>
      <div style="margin-top:34px;${inA(14.3)}"><span class="btn pl-blue" style="font-size:24px;padding:16px 30px">verifică poziția ta</span></div>
      <div class="body muted-d" style="font-size:20px;font-weight:600;margin-top:20px;${inA(14.7)}">4 minute · 0 lei · creditrepublic.ro</div>`)}`
};
posts.push({ id: 'cr_06_joi-reel-algoritm-om_9x16_v1', ...joiReel, dur: 17, cover: 9.6 });
posts.push({ id: 'cr_06_joi-story-teaser_9x16_v1', ...joiReel, dur: 8, cover: 7.5 });

// vineri · TikTok (05): „vizionarea 14" — cadre diferite din aceeași fotografie de interior
const view = (pos, s, e, label) => `
  <div class="abs" style="inset:0;overflow:hidden;animation:fade .25s ease ${s}s both${e ? `, fout .25s ease ${e}s forwards` : ''}">
    <div class="abs" style="inset:0;background:url('${APT}') ${pos}/auto 175% no-repeat;animation:kb ${(e || 18) - s + 0.5}s linear ${s}s both"></div>
  </div>
  ${label ? `<div class="abs" style="left:${pad}px;top:230px;animation:pop .3s ${EASE} ${s + 0.15}s both${e ? `, fout .25s ease ${e}s forwards` : ''}"><span class="disp pl pl-sun" style="font-size:40px">${label}</span></div>` : ''}`;
posts.push({
  id: 'cr_05_vineri-tiktok-vizionarea-14_9x16_v1', ...F916, theme: 't-cream', dur: 18, cover: 7,
  css: `@keyframes fade { from { opacity: 0; } to { opacity: 1; } }`,
  html: `
    ${view('0% 45%', 0, 1.6, 'vizionarea 1.')}
    ${view('100% 35%', 1.6, 3.2, 'vizionarea 7.')}
    ${view('55% 100%', 3.2, 4.8, 'vizionarea 14.')}
    ${view('58% center', 4.8, 9.4, '')}
    <div class="abs" style="left:${pad}px;right:${pad}px;top:230px;animation:fin .45s ${EASE} 5.3s both, fout .3s ease 9.2s forwards">
      <div class="disp pills" style="font-size:50px"><span class="pl pl-cream">apartamentul potrivit.</span></div>
    </div>
    <div class="abs" style="left:${pad}px;top:112px;background:var(--cream);border-radius:999px;padding:8px 16px;${outA(9.2)}">${wm('light', 'font-size:22px')}</div>
    <div class="abs t-cream" style="inset:0;${fade(9.4)}"></div>
    <div class="abs" style="inset:0;${fade(9.4)}">${top916('light')}</div>
    ${area916('', `
      <div class="disp pills" style="font-size:46px;${inA(9.8)}"><span class="pl pl-gl">creditul: prima ofertă de la ghișeu, în 20 de minute.</span></div>
      <div class="disp pills" style="font-size:50px;margin-top:40px;${inA(12.4)}"><span class="pl pl-plum">prima casă merită și un credit comparat.</span></div>`)}`
});

// duminică · TikTok (02): refinanțarea, fără filmare
posts.push({
  id: 'cr_02_duminica-tiktok-refinantare_9x16_v1', ...F916, theme: 't-plum', dur: 18, cover: 10,
  html: `
    ${top916('dark')}
    <div class="abs" style="left:${pad}px;right:${pad}px;top:190px;${inA(0.2)}">
      <div class="disp pills" style="font-size:34px"><span class="pl pl-cream">am luat creditul acum câțiva ani. merită să mă uit din nou?</span></div>
    </div>
    ${area916('top:330px;' + outA(11.6), `
      <div class="disp pills" style="font-size:44px;${inA(2.2)}"><span class="pl pl-sun">răspunsul stă în cifre:</span></div>
      <div class="disp pills" style="font-size:36px;margin-top:22px;${inA(3.6)}"><span class="pl pl-gd">ce dobândă are creditul</span></div>
      <div class="disp pills" style="font-size:36px;margin-top:12px;${inA(5.0)}"><span class="pl pl-gd">cât a rămas de plată</span></div>
      <div class="disp pills" style="font-size:36px;margin-top:12px;${inA(6.4)}"><span class="pl pl-gd">ce prevede contractul la rambursare anticipată</span></div>`)}
    ${area916('top:330px', `
      <div style="${popA(11.9)}">${photo(150, 'border:5px solid var(--mint)')}</div>
      <div class="disp pills" style="font-size:48px;margin-top:24px;${inA(12.4)}"><span class="pl pl-cream">le verificăm împreună.</span></div>
      <div class="disp pills" style="font-size:48px;margin-top:14px;${inA(13.2)}"><span class="pl pl-mint">0 lei pentru tine.</span></div>`)}`
});

posts.push({
  id: 'cr_00_cadru-final-cta_9x16_v1', ...F916, theme: 't-plum', dur: 3, cover: 2.5,
  html: `
    ${area916('align-items:center', `
      <div style="${popA(0.1)}">${wm('dark', 'font-size:46px')}</div>
      <div style="margin-top:34px;${inA(0.6)}"><span class="btn pl-blue" style="font-size:24px;padding:16px 30px">verifică poziția ta</span></div>
      <div class="body muted-d" style="font-size:20px;font-weight:600;margin-top:20px;${inA(0.9)}">4 minute · 0 lei · creditrepublic.ro</div>`)}`
});

module.exports = posts;
