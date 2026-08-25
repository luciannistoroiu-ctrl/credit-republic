# pachet de import — credit republic

pentru pornirea sistemului de design în Claude Design (claude.ai/design).

---

## ordinea de încărcare

**1. sistemul de design** — la onboarding, sau din setările organizației:

| fișier | ce extrage |
|---|---|
| `brand/credit-republic-ghid-v4.3.pptx` | paletă, tipografie, tipare de layout, motivul pastilei |
| `marca/*.png` | marca, în cele patru variante + favicon |
| `referinta/cr_homepage_v4.html` | componente și structura paginii |

încarcă întâi PPTX-ul. e sursa cea mai bogată — paletă, roluri tipografice și motivul vizual, toate într-un singur fișier.

**2. instrucțiunile de proiect** — lipește conținutul din `brand/cr_brief_claude_design.md`
la prima sesiune. **fără el, sistemul extras va fi corect vizual și greșit ca reguli.**
importul citește culori și litere; nu citește „albastrul apare o singură dată, în momentul
rezultatului confirmat" sau „inamicul e inerția, nu băncile".

**3. HTML-ul** — nu e format de import oficial (lista e: codebase, captură web, DOCX, PPTX, XLSX).
două ocoluri care merg:
- pui `referinta/cr_homepage_v4.html` într-un repo GitHub și indici repo-ul — vede codul, nu doar pixelii
- folosești captura web pe site-ul live, după ce e publicat

---

## conținut

```
brand/
  credit-republic-ghid-v4.3.pptx     15 slide-uri, validat
  cr_brief_claude_design.md          reguli, unghiuri, blocante
marca/
  cr_semn_light.svg / .png           fundal deschis
  cr_semn_dark.svg / .png            fundal închis
  cr_semn_mono.svg / .png            o singură culoare
  cr_semn_mono_alb.svg / .png        o singură culoare, pe închis
  cr_favicon.svg / .png              geometrie îngroșată pentru 16px
referinta/
  cr_homepage_v4.html                mostra completă, autonomă
```

SVG pentru producție, PNG pentru import — unele fluxuri de extracție nu citesc SVG.

---

## de verificat după import

rulează un prompt de test — „fă o pagină de destinație pentru refinanțare" — și verifică:

- „credit republic" apare cu minuscule
- nicio cifră de bănci; se spune „toate băncile"
- niciun superlativ, nicio mențiune de DAE
- albastrul `#2C86F6` apare cel mult o dată, pe un rezultat confirmat
- titlurile în Omnes, corpul în Helvetica Neue
- textul de accent stă în pastile, nu liber pe fundal

dacă pică vreunul, nu e o problemă de sistem — e brief-ul care n-a fost lipit ca instrucțiuni.

---

## fonturi

Omnes cere un web project din contul tău Adobe Fonts. verifică licența pentru web font,
nu doar desktop. în `cr_homepage_v4.html`, `<head>` conține `use.typekit.net/KIT_ID.css`
— înlocuiește `KIT_ID`.
