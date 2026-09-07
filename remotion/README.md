# credit republic — remotion

Al doilea pipeline de producție video pentru seria „obiceiurile care îți
scumpesc creditul" (vezi planul de conținut publicat ca artifact). 3 din cele
4 piese ale săptămânii se produc prin `/animatie-video` (social-creator +
`js/motion-engine.js`, neschimbat); doar **ziua 3 — birocrația** trece prin
remotion, pentru că numărătoarea ei ("5 sucursale → 1 aplicare") are nevoie
de o valoare parametrizată, nu una hardcodată ca în
`startCounterAnimation()` din motion-engine.js.

## comenzi

```bash
cd remotion
npm install

npm start                        # remotion studio, preview live
npm run render:birocratie-9x16   # master 9:16 — Reels / TikTok / Shorts
npm run render:birocratie-1x1    # derivată 1:1 — IG / FB feed
npm run still:birocratie-9x16    # un singur cadru PNG, pt verificare rapidă
```

## structură

```
src/
  tokens.ts                        paleta + fonturile brandului (oglindă a
                                    social-creator/css/brand-templates.css)
  compositions/
    BirocratieComparison.tsx       scena ziua 3 — props parametrizate
                                    (fromCount, toCount, headline-uri, CTA)
  Root.tsx                         înregistrează cele 2 compoziții
                                    (9x16 master + 1x1 derivată)
  index.ts                         registerRoot()
```

## reguli de brand care se aplică și aici

- albastrul de semnal (`colors.signal`, `#2C86F6`) **nu** apare în această
  compoziție — e rezervat exclusiv piesei mecanismului (ziua 4, prin
  `/animatie-video`). dacă adaugi o compoziție remotion nouă cu un rezultat
  confirmat, verifică întâi dacă altă piesă din aceeași săptămână deja
  folosește albastrul.
- copy-ul vine din presetul `p_07_un_singur_dosar`
  (`social-creator/js/copy-engine.js`), pasat ca `defaultProps` — dacă textul
  sursă se schimbă acolo, actualizează-l și în `birocratieDefaultProps`.
- înainte de publicare, textul din props tot trebuie verificat cu
  `BrandValidator.validatePost()` / `ScriptGrader.evaluateScript()`, exact ca
  piesele din social-creator.

## export 60fps

randarea de mai sus e la 30fps (implicit remotion). dacă piesa trebuie să
stea lângă exporturile de 60fps de la `/animatie-video`, interpolează cadre
în etapa de montaj (nu în remotion) — nu are sens să dublăm complexitatea aici
pentru o singură piesă din 4.
