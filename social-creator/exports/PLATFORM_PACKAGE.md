# Pachet de postări — X / Instagram / Facebook / TikTok

Trei piese, fiecare adaptată pentru cele 4 platforme. Copy-ul e preluat direct
din presetul sursă din `js/copy-engine.js` (nimic inventat aici) — doar
lungimea și formatul de fișier variază pe platformă, per convențiile fiecăreia.

---

## 1. Postare statică — `p_01_master_statement` (unghiul 01, mecanismul)

Fișiere randate (același conținut, 3 rapoarte de aspect native suportate deja
de `format-*` din `brand-templates.css`):

- `exports/static_master_ig_fb.png` — 1080×1350 (4:5) — Instagram + Facebook feed
- `exports/static_master_x.png` — 1080×565 (1.91:1) — X (timeline)
- `exports/static_master_tiktok.png` — 1080×1920 (9:16) — TikTok (photo mode)

**Instagram / Facebook** (caption completă):
> nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.
>
> Când cumperi un apartament, petreci luni întregi căutând compartimentarea potrivită, etajul, orientarea spre soare și cartierul.
>
> Dar când vine vorba de credit, prima sucursală care iese în cale sau banca unde vine salariul câștigă des, fără comparație.
>
> credit republic compară toate băncile în câteva minute. Serviciul este 0 lei pentru tine — comisionul vine de la bancă.
>
> #creditrepublic #creditipotecar #educatiefinanciara #neobroker #crediteromania #refinantare

**X** (scurtat, sub limita de citire rapidă a feed-ului):
> nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.
>
> inerția e cel mai scump comision pe care îl plătești când cumperi o casă.
>
> credit republic compară toate băncile în câteva minute — 0 lei pentru tine.

**TikTok** (caption scurtă + hashtag-uri, textul principal e deja pe imagine):
> nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.
>
> #creditrepublic #creditipotecar #educatiefinanciara #fyp

---

## 2. Postare HyperFrames (video) — unghiul 02, refinanțarea amânată

Fișier: `videos/refinantare-hyperframes/renders/video.mp4` — 1080×1920 (9:16),
6.0s, kinetic typography. Un singur export video acoperă toate 4 platformele
(9:16 vertical e nativ pe Reels/Stories IG & FB, TikTok, și video pe X).

**Instagram / Facebook** (Reels):
> cât costă să amâni refinanțarea unui credit ipotecar?
>
> Dacă ai semnat într-o perioadă cu dobânzi ridicate, o piață care între timp a scăzut înseamnă bani lăsați băncii din simplă obișnuință.
>
> Amânarea cu 6 luni nu costă 0 lei — costă exact cât rămâne neverificat.
>
> compară dobânda ta cu piața de azi, prin credit republic.
>
> #refinantare #creditipotecar #creditrepublic

**X** (scurtat):
> fiecare lună de amânare a refinanțării are un preț real.
>
> verifică dacă dobânda ta mai reflectă piața de azi, prin credit republic.

**TikTok**:
> amânarea refinanțării nu costă 0 lei — costă exact cât rămâne neverificat.
>
> #refinantare #creditipotecar #creditrepublic #fyp

---

## 3. Postare Higgsfield (video) — unghiul 07, birocrația

Concept vizual generat: 5 teancuri de hârtii răzlețe pe un birou care alunecă
și se unesc într-un singur dosar (obiect, fără oameni) — metaforă vizuală
pentru "un singur dosar online vs 5 drumuri la 5 sucursale". **Fișierul nu e
încă în repo** — Higgsfield livrează pe un CDN (`cloudfront.net`) blocat de
politica de rețea a acestui sandbox; captions-urile de mai jos sunt gata de
folosit imediat ce fișierul video ajunge local (job id `a601c383-2337-4890-a50f-b8696584963e`,
9:16, 5s).

**Instagram / Facebook** (Reels):
> cât timp pierzi dacă mergi pe cont propriu la bănci vs o singură aplicare online prin credit republic:
>
> Pe cont propriu:
> - 4-5 drumuri la sucursale diferite
> - formulare re-completate de la zero
> - săptămâni de așteptare pentru răspunsuri parțiale
>
> Prin credit republic:
> - o singură aplicare online de 4 minute
> - toate băncile comparate simultan
> - broker autorizat AVBS care se ocupă de acte
> - 0 lei comision
>
> #birocratie #creditipotecar #economisestetimp #neobroker #creditrepublic

**X** (scurtat):
> un singur dosar online vs 5 drumuri la 5 sucursale.
>
> o singură aplicare, toate băncile comparate, 0 lei comision — prin credit republic.

**TikTok**:
> 5 drumuri la bănci vs 1 aplicare online. alegi tu.
>
> #birocratie #creditipotecar #neobroker #creditrepublic #fyp

---

## De reținut

- Regulile de brand rămân intacte: fără cifre ilustrative inventate, CTA
  consistent ("verifică poziția ta" unde e cazul), "credit republic" minuscul,
  humor doar în registrul observational (nu e cazul aici).
- Postarea statică și cea HyperFrames sunt gata de publicat direct din
  fișierele de mai sus.
- Postarea Higgsfield așteaptă fișierul video (blocaj de rețea, vezi mai sus).
