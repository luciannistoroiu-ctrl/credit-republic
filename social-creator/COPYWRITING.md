# copywriting — credit republic social

Sursa de adevăr pentru cum se scrie textul de pe imagine/video și din
caption în `social-creator/`. Rezultat al unei bucle builder+critici
(brief/sistem/craft) comparate cu bara N26, pe cele 7 unghiuri de brand.
Aplicat, verificat și codificat în `js/brand-validator.js` (reguli
`NO_GENERIC_EYEBROW`, `SINGLE_HOOK_TITLE`, extensie la `NO_READER_BLAME`).

## Regulile

1. **Titlul e un singur hook** — o idee, sub 9 cuvinte cât se poate. Dacă
   ideea are 2 timpi („X. Y.”), desparte-i în `title` + `subtitle` (câmpuri
   separate), nu le înghesui într-un singur string legat prin punct.
   Excepție: linia master a brandului („nimeni nu alege cel mai bun
   credit. aleg primul care le iese în cale.”) — e deliberat 2 clauze,
   brand-canonică, nu se atinge.
2. **Fără etichetă-pastilă generică deasupra titlului** (`eyebrow`).
   „impact financiar”, „profil financiar”, „mit vs realitate” — categorii
   abstracte de 2 cuvinte care citesc ca generate automat. Implicit gol.
   Excepție: eyebrow-ul din slide-urile de carusel — acolo e etichetă
   funcțională de pas („pasul 01”, „rolul uman”), nu categorie de brand.
3. **Adresare directă sau persoana I** — nu vocea de brand la persoana a
   III-a care descrie serviciul din exterior („compară toate băncile”,
   nu „credit republic compară toate băncile”). Caption-urile închid cu
   „prin credit republic”, nu cu „credit republic + verb”.
4. **Fără cifră ilustrativă sau exemplu reprezentativ** — nici în title/
   subtitle/point/caption, nici într-un chip de rezultat (`calc_impact`).
   O cifră concretă e ok doar dacă descrie un comportament/proces („6 luni
   la vizionări”, „5 drumuri la 5 sucursale”), nu un rezultat financiar
   inventat („economie de 2.880 lei”, „dobândă 7.90%→5.75%”).
5. **Regula existentă a culpabilizării cititorului rămâne** — „ai lăsat”,
   „nu știi”, „ai greșit”, „nu ai verificat”, „nu ai comparat” interzise.
   Subiectul e mereu sistemul/banca, niciodată cititorul.
6. **Umorul rămâne doar în registrul observațional** (unghiurile cu
   `registerId: 'observational'`) — niciodată lângă o cifră, un simulator
   sau un CTA.

## De ce contează pentru randare, nu doar pentru text

Trei șabloane (`calc_impact`, `broker_ai`, `comparison` din
`js/templates.js`) aveau conținut hardcodat care ignora complet
`postData` — inclusiv cifre inventate afișate identic pe orice postare.
Fixate să fie parametrizate. Dacă adaugi un șablon nou: verifică mereu
că `title`/`subtitle`/`point1-3` chiar se randează, nu doar că există în
preset — `js/brand-validator.js` validează datele din preset, nu output-ul
randat, deci un câmp „mort” în șablon trece nedetectat.

## Verificare

`BrandValidator.validatePost(preset)` din `js/brand-validator.js` rulează
toate regulile de mai sus (plus cele preexistente: minuscule, fără număr
de bănci, fără superlative, albastru o dată). Rulează pe orice preset nou
înainte să-l adaugi în `js/copy-engine.js`.
