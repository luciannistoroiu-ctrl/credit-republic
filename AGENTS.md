# credit republic — context pentru agenți AI

Repo pentru site-ul și materialele de marketing ale **credit republic**, un neobroker
ipotecar din România: un algoritm compară ofertele de la toate băncile, iar **Florența
Nistoroiu** (broker autorizat AVBS, Nistoroiu Financial Solutions SRL, intermediar de
credit autorizat ANPC) negociază și duce dosarul până la semnare. **0 lei pentru client —
comisionul vine de la bancă.**

## Fișiere cheie

- `index.html`, `parteneri.html` — site-ul live (creditrepublic.ro)
- `social-creator/js/copy-engine.js` — cele **7 unghiuri de mesaj** (ANGLES + PRESETS) folosite
  în social media și pe site
- `social-creator/js/micro-personas.js` — 7 micro-persoane (TEEP) mapate pe cele 7 unghiuri
- `social-creator/js/brand-validator.js` — regulile stricte de brand, verificabile automat
- `social-creator/js/script-grader.js` — scor obiectiv D2C (10 criterii) pentru orice copy nou
- `social-creator/test-suite.js` — rulează `node social-creator/test-suite.js` **înainte să
  consideri gata orice schimbare de copy**. 56 teste; trebuie toate verzi.
- `claude-project-import/knowledge/credit-republic-unghiuri-mesaj-v5-optimizare-conversie.md`
  — istoricul complet al rescrierii celor 7 unghiuri (audiență × business × competiție × obiectiv)
- `claude-project-import/knowledge/credit-republic-analiza-strategica-unghiuri-2026.md`
  — analiză strategică cu surse externe despre piața 2026 (vezi „Descoperiri" mai jos)

## Regulile de brand (aplicate automat de `BrandValidator`, dar respectă-le și manual)

- „credit republic" — **exclusiv minuscule**, niciodată Title Case sau MAJUSCULE
- **Fără cifră de bănci** („12 bănci", „30 de bănci") — se spune întotdeauna „toate băncile"
- **Fără superlative** („cel mai bun", „cea mai mică dobândă", „cel mai bine") — singura
  excepție e linia master: „nimeni nu alege cel mai bun credit. aleg primul care le iese în cale."
- **Subiectul e sistemul, banca sau noi — niciodată cititorul ca autor al unei greșeli.**
  Interzis: „ai lăsat", „nu știi", „ai greșit", „ai pierdut"
- Sentence case peste tot, fără exclamări
- Albastru semnal `#2C86F6` apare cel mult o dată per ecran, doar pe rezultat confirmat
- Orice cadru cu rată/cost are nevoie de exemplul reprezentativ DAE (dacă se afișează o cifră)
- **Trei registre de ton**: exact (cifre, CTA, zero umor) / observațional (awareness, umor fin,
  fără buton) / uman (negociere, cald, prima persoană plural)

## Cele 7 unghiuri, pe scurt (detaliu complet + rationale în documentele de mai sus)

| # | unghi | audiență | prioritate curentă |
|---|---|---|---|
| 01 | mecanismul | scepticul comisionului | **1 — lead/H1**, dus acum de Florența+AVBS, nu de algoritm |
| 06 | algoritm + om | 40+ / decizie prea mare | **1 — lead**, conceptual unit cu 01 |
| 03 | venitul variabil | PFA/dividende/IT | **2** — mapează pe ~84% din piață (achiziție nouă) |
| 07 | birocrația | copleșit de dosare | **2** |
| 05 | casa vs creditul | cumpărător prima casă | **3** — extins cu obiecția TVA 21% (2026) |
| 04 | designul opac | victima reclamei | **4** — organic/awareness, fără buget |
| 02 | refinanțarea amânată | ROBOR/IRCC | **5** — canale proprii, nu achiziție rece (~16% din piață) |

**Strat constant peste toate 7**: Florența Nistoroiu, nominal, ca subiect al mesajului —
algoritmul e fapt de sprijin, nu erou (motiv: comoditizat în piață, vezi mai jos).

## Descoperiri strategice care contează pentru orice copy nou

1. Minim 7 competitori direcți (Ipotecare.ro, 123Credit.ro, Brokerul.ro, iFink.ro,
   VreauCredit.ro, Finzoom.ro, BrokerCredit.ro) fac exact aceeași promisiune de bază
   („algoritm compară toate băncile, gratuit") — nu mai e diferențiator.
2. **AVBS (francizorul) își promovează public același mecanism ca diferențiator propriu**
   („Soft AI Credit Ipotecar AVBS", 90%+ din franciză îl folosește deja) — **neconfirmat dacă
   algoritmul credit republic E acest soft de rețea sau tehnologie proprie**. Până se
   confirmă cu Florența/AVBS, nu prezenta algoritmul ca exclusiv/proprietar în copy nou.
3. Refinanțarea e ~16% din piață (confirmat național, Forbes.ro), dobânzi stabile — nu tratа
   unghiul 02 ca prioritate egală cu unghiurile de achiziție nouă.
4. TVA la locuințe noi a crescut la 21% (2025-2026) — obiecție reală „poate ar trebui să
   aștept", parțial adresată în unghiul 05.

## Cum validezi copy nou

```
node social-creator/test-suite.js
```

Orice text nou pentru social/site ar trebui, ideal, verificat prin `BrandValidator.validatePost()`
și scorat prin `ScriptGrader.evaluateScript()` înainte de publicare — vezi cele două fișiere
pentru API.
