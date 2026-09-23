# video Veo în locul filmărilor cu Florența — săptămâna 1

Înlocuiește cele 6 video-uri care așteptau filmare sau fotografii (vezi
`social-creator/productie/saptamana-1/README.md`, „rămân de produs").

## reguli pentru toate clipurile Veo

- **Florența nu e generată.** Nici față, nici siluetă, nici mâini prezentate ca fiind ale ei.
  Ea apare doar prin fotografia reală (`social-creator/assets/florenta-nistoroiu.webp`), în cerc,
  peste video. Cadrele Veo arată obiecte, spații și mâini anonime.
- **Fără text generat.** Veo nu randează text lizibil (documente, ecrane, firme). Textul vine
  în pastile, peste video, prin `social-creator/productie/render.js`, și trece prin `BrandValidator`.
- **Fără bănci recognoscibile**, logo-uri, bani cash, zâmbete forțate spre cameră.
- **Registrul vizual:** lumină naturală caldă, tonuri cream și lemn deschis, accente mici plum și
  coral, mișcare de cameră lentă, realism documentar. Aceeași familie cu
  `photo_modern_interior.jpg`.
- **Fără voce generată.** Doar sunet ambiental de la Veo (sau fără sunet). Muzica se pune din
  aplicație. Nu se sintetizează vocea Florenței.
- **Etichetă AI:** la publicare, TikTok cere marcarea conținutului generat realist
  (`isAiGenerated: true` în Buffer), iar Meta îl etichetează automat.
- **Tehnic:** Veo generează clipuri de 8 s. Fiecare video de mai jos e montat din 2–3 clipuri,
  tăiate cu ffmpeg (calea 01 din `credit-republic-video-workflow.md`), cu pastilele suprapuse.

### bloc de stil (se lipește la finalul fiecărui prompt)

```
Style: documentary realism, shot on 35mm, shallow depth of field, warm natural window light,
cream walls and light oak wood, muted palette with small accents of deep plum (#2B2640) and
coral (#FF6B4A), slow deliberate camera movement, calm and premium mood. Vertical 9:16.
Audio: soft room ambience only, no speech, no music.
Negative: no text, no captions, no readable documents or screens, no logos, no bank branding,
no watermarks, no cash, no faces looking at camera, no forced smiles, no cartoon, no CGI look.
```

---

## 1. luni · Meta Reel — „cine plătește brokerul?" (unghi 01)

**Înlocuiește:** Florența la cameră, 20 s.
**Concept — „cheile":** momentul pentru care există un credit, cu costul brokerului ca întrebare.

| cadru | durată | prompt Veo |
|---|---|---|
| A | 0–6 s | `Close-up of two hands across a light oak table: one hand slides a set of new house keys on a simple ring toward the other hand, which gently takes them. Faces out of frame. Soft morning light from a window on the left. Slow push-in.` |
| B | 6–12 s | `Macro shot of a fountain pen signing the last page of a thick printed document on a wooden desk, the writing is blurred and unreadable. A coffee cup in soft focus in the background. Very slow lateral dolly.` |
| C | 12–17 s | `Point of view walking slowly into an empty, bright new apartment, the front door swings open onto a sunlit living room with cream walls and oak floor. Gentle handheld stabilised movement.` |
| — | 17–20 s | `cr_00_cadru-final-cta_9x16_v1.mp4` (existent) |

**Text în pastile:**

> cine plătește brokerul de credite?

> banca. 0 lei pentru client.

> Florența Nistoroiu negociază și duce dosarul până la semnare. algoritmul compară toate băncile.

Fotografia reală a Florenței intră în cerc pe cadrul C, odată cu a treia pastilă.

---

## 2. miercuri · TikTok — „același venit, trei calcule" (unghi 03)

**Înlocuiește:** Florența, 3 verificări PFA, 25 s.
**Concept — „același dosar, trei mese":** un teanc de acte identic ajunge pe trei birouri diferite.

| cadru | durată | prompt Veo |
|---|---|---|
| A | 0–7 s | `Overhead shot of a freelancer's kitchen table in the evening: a laptop, a small calculator, and a neat stack of printed invoices being squared by two hands. Warm lamp light. Slow top-down drift.` |
| B | 7–15 s | `The same neat stack of documents in a clear folder is placed down on three different desks in quick succession: a minimalist white desk, a dark wood desk, a glass desk. Match cut on the hand placing the folder, identical framing each time.` |
| C | 15–22 s | `Close-up of a hand closing the clear folder and sliding it into a single cream-coloured envelope on an oak desk, calm and decisive. Soft daylight. Slow push-in.` |

**Text în pastile:**

> pfa, dividende, bonusuri.

> același venit, trei calcule diferite.

> Florența știe ce bancă îl acceptă și cât îți poate aproba. 0 lei pentru tine.

Pe cadrul B, câte o etichetă mică „banca a / banca b / banca c" la fiecare masă (ca în animația
pentru X de miercuri).

---

## 3. joi · Meta Reel — „ecranul și masa" (unghi 06)

**Înlocuiește:** ecran împărțit cu Florența la telefon, 15 s.
**Concept:** de la lumina rece a ecranului (algoritmul) la lumina caldă a mesei de lucru (omul).

| cadru | durată | prompt Veo |
|---|---|---|
| A | 0–6 s | `Close-up of a laptop screen in a dim room, cool blue light reflecting on the keyboard, abstract rows of soft shapes scrolling and sorting on the screen, nothing readable. Slow push-in toward the screen.` |
| B | 6–12 s | `Transition to a warm sunlit desk: a printed contract is opened, a pen underlines a line, a smartphone on the desk lights up with an incoming call. Hands only, no face. Slow lateral dolly.` |
| — | 12–15 s | `cr_00_cadru-final-cta_9x16_v1.mp4` |

**Text în pastile:**

> 4 minute: algoritmul compară toate băncile.

> restul: negocierea, dosarul, semnarea.

> acolo e Florența.

„Acolo e Florența" apare cu fotografia ei reală în cerc, peste cadrul B. Mâinile din cadru rămân
anonime și nu sunt prezentate ca fiind ale ei.

**Story-ul de joi (teaser, 8 s):** primele 8 s din acest Reel, fără generare nouă.

---

## 4. vineri · TikTok — „vizionarea 14" (unghi 05)

**Înlocuiește:** fotografiile de apartamente care lipseau, 20 s. Formatul cel mai potrivit pentru Veo.
**Concept:** registru observațional, umor fin, fără buton în cadru.

| cadru | durată | prompt Veo |
|---|---|---|
| A | 0–8 s | `A fast sequence of front doors opening onto different empty apartments for viewing: a small studio, a bright two-room flat, an attic with sloped ceiling, a flat with a balcony. Each door opens in the same framing, one second each, point of view from the doorway. Natural daylight.` |
| B | 8–14 s | `Slow, satisfied push-in on the perfect empty living room: large window, warm afternoon light, oak floor, cream walls. Dust particles in the light. Calm.` |
| C | 14–20 s | `Contrast shot: a hand quickly signs a single sheet of paper on a plain counter, the whole action takes two seconds, then the pen is put down. Neutral fluorescent light, slightly cooler tone. Static camera.` |

**Text în pastile:**

> vizionarea 1. vizionarea 7. vizionarea 14.

> apartamentul potrivit.

> creditul: prima ofertă de la ghișeu, în 20 de minute.

> prima casă merită și un credit comparat.

---

## 5. duminică · TikTok — „sertarul" (unghi 02)

**Înlocuiește:** Florența despre refinanțare, 20 s.
**Concept:** creditul uitat într-un sertar, redescoperit într-o duminică dimineață.

| cadru | durată | prompt Veo |
|---|---|---|
| A | 0–7 s | `A hand slowly opens a wooden drawer in a home office and takes out an old folder of documents, slightly worn at the edges. Sunday morning light. Slow push-in.` |
| B | 7–14 s | `Time-lapse on a kitchen table: a closed folder and a coffee cup, sunlight moves slowly across the table from morning to afternoon, suggesting years passing. Static camera.` |
| C | 14–20 s | `The folder is opened on the table, a calculator is placed next to it, a hand rests on the documents, calm and attentive. Warm light. Slow lateral dolly.` |

**Text în pastile:**

> creditul luat acum câțiva ani.

> banca nu sună când apare o ofertă mai bună.

> ce dobândă are, cât a rămas de plată, ce prevede contractul la rambursare anticipată.

> le verificăm împreună, 0 lei pentru tine.

Fotografia reală a Florenței intră în cerc pe ultima pastilă.

---

## ordinea recomandată de generare

1. **vineri „vizionarea 14"** — cel mai mare câștig (Veo face ce fotografiile nu puteau).
2. **joi „ecranul și masa"** — acoperă și Reel-ul, și story-ul.
3. **luni „cheile"**, **duminică „sertarul"**, **miercuri „trei mese"**.

Cadrele cu mâini sunt cele mai predispuse la artefacte (degete, pixuri). Se generează 2–3 variante
și se alege cea curată; dacă nu iese, cadrul se înlocuiește cu varianta de obiecte
(ex. doar folderul, fără mână).
