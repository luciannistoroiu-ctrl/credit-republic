# analiză reclame competiție — ipotecare.ro

4 reclame story (9:16) de la ipotecare.ro, unul dintre cei 7 competitori direcți din `AGENTS.md`.
Imaginile sunt în `competitie/ipotecare-ro/`.

Scopul: ce tipare merită preluate, ce trebuie evitat și cum le adaptăm pe cele 7 unghiuri
credit republic.

---

## 1. reclamele, pe rând

### 01 — comparația de dobândă (`01-comparatie-dobanda.png`)

- **Titlu:** „când accesezi un credit ipotecar nu te opri la prima ofertă"
- **Structură:** două coloane — „oferta obținută de tine" (5,10%, 3000 lei) vs „oferta obținută
  de ipotecare.ro" (4,55%, 2810 lei). Pastilă jos: „-2.280 lei ANUAL".
- **Ce funcționează:** cifrele se citesc în 2 secunde; diferența anuală (190 lei × 12) face
  concretă o diferență de 0,55 pp care altfel pare mică. Formatul „înainte / după" e cel mai
  convingător dintre cele 4.
- **Probleme:**
  - titlul e aproape linia noastră master („nimeni nu alege cel mai bun credit. aleg primul care
    le iese în cale") — **același insight, deja folosit de ei**. Linia noastră rămâne mai bună
    (observațională, fără imperativ), dar nu mai e singură în piață.
  - „oferta obținută de tine" pune cititorul ca autor al ofertei slabe — la noi e interzis.
  - fără sumă, perioadă sau exemplu reprezentativ: cifrele nu pot fi verificate de cititor.
  - ALL CAPS în titlu și pastilă.
- **Scor ScriptGrader pe copy:** 50/100 (lipsesc: agitarea durerii, mecanismul, dovada socială, CTA).

### 02 — procentul pe casă (`02-procent-casa.png`)

- **Structură:** „cu ipotecare.ro" — casă verde 80% vs „fără" — casă roșie 20%, cu text lung
  dedesubt.
- **Ce funcționează:** copy-ul din coloana „fără" („din bancă în bancă, zeci de formulare, timp
  prețios") descrie exact durerea din unghiul 07 — birocrația.
- **Probleme:**
  - 80% / 20% nu înseamnă nimic — 80% din ce? Cifră decorativă, fără sursă. Slăbește încrederea
    exact la publicul sceptic.
  - verde/roșu = clișeu de semafor; mult text mic, greu de citit într-un story.
  - „trebuie să mergi singur… să pierzi timp" — cititorul e subiectul pierderii.
- **Scor ScriptGrader:** 55/100.

### 03 — drumul, varianta foto (`03-drum-foto.png`)

- **Titlu:** „vrei să îți cumperi prima ta casă?" (scris „sa", fără diacritică)
- **Structură:** drum portocaliu drept spre o casă luminoasă vs drumuri gri încâlcite spre o
  casă gri. „alege scurtătura."
- **Ce funcționează:** **cea mai puternică metaforă din set.** Se înțelege fără text, oprește
  scroll-ul, transmite „simplu vs complicat" instant. Culoarea brandului e drumul însuși.
- **Probleme:** promisiunea e doar „scurtătură" — nu spune cine, cum sau cât costă. Tipografie
  ALL CAPS. Randare 3D generică.
- **Scor ScriptGrader:** 30/100 (textul singur nu vinde; toată greutatea e pe imagine).

### 04 — drumul, varianta linie (`04-drum-linie.png`)

- **Titlu:** „vrei casă nouă?"
- **Structură:** aceeași idee ca 03, redusă la minimum: o linie punctată directă vs o linie
  punctată care face bucle, ambele spre o iconiță de casă.
- **Ce funcționează:** cost de producție aproape zero, foarte lizibil, se pretează la animație
  (linia se desenează). E formatul cel mai ușor de replicat în `social-creator`
  (`MotionEngine`).
- **Probleme:** aceleași ca la 03; plus mult spațiu gol neexploatat.

---

## 2. tipare comune

| observație | implicație pentru noi |
|---|---|
| toate 4 folosesc „cu X / fără X", ecran împărțit vertical | formatul e validat în piață; îl folosim, dar diferențiem conținutul coloanei „cu" |
| eroul e **platforma** (logo-ul), niciodată un om | **golul nostru:** Florența, nominal, în coloana „cu". niciun competitor nu pune un broker cu nume și față |
| promisiunea = „compari mai ușor" | confirmă descoperirea 1 din `AGENTS.md`: comparația e comoditizată; noi vindem negocierea + dosarul dus până la semnare |
| nicio mențiune de cost pentru client | „0 lei — comisionul vine de la bancă" e un diferențiator vizibil, de pus pe fiecare variantă |
| cititorul e subiectul greșelii („obținută de tine", „să pierzi") | noi punem sistemul sau banca drept subiect |
| ALL CAPS, portocaliu + negru, fundal cu pattern de iconițe | ne diferențiem vizual prin sentence case, pastile, albastru semnal o singură dată |
| cifre fără context (80%, 5,10% fără sumă/perioadă) | orice cifră afișată de noi trebuie să fie reală și verificabilă |

---

## 3. ce preluăm, adaptat pe unghiuri

Toate textele de mai jos au trecut prin `BrandValidator.validateText()` (0 probleme) și
`ScriptGrader.evaluateScript()` (**100/100**, production ready). Pentru comparație, textele
competiției au obținut 30–55.

### P1 — format „comparație de ofertă" (din reclama 01) → **unghiul 01, mecanismul**

Coloane: „oferta de la ghișeu" / „oferta negociată de Florența". Albastrul semnal doar pe
diferența confirmată.

> oferta de la ghișeu vs oferta negociată de Florența. aceeași bancă, același profil, altă rată,
> iar diferența costă bani în fiecare lună. Florența Nistoroiu negociază, algoritmul compară
> toate băncile. 0 lei pentru tine, comisionul vine de la bancă. verifică ce rată se poate negocia.

**Condiție:** se folosește doar cu un caz real (cu acordul clientului) — nu cifre ilustrative.

### P2 — format „drumul" (din 03/04) → **unghiul 07, birocrația**

Coloana „fără": linia cu bucle, etichetată „toate băncile, pe rând". Coloana „cu": linie
dreaptă, cu Florența la capăt.

> drumul prin toate băncile durează luni de zile: formulare, aceleași acte de fiecare dată.
> drumul cu credit republic: algoritmul compară toate băncile, iar Florența duce un singur dosar
> până la semnare. 0 lei pentru tine. lasă-ne actele, facem noi drumurile.

### P3 — format „drumul" → **unghiul 05, casa vs creditul (prima casă)**

> prima casă nu vine cu hartă, iar fiecare ocol costă timp. cu credit republic, algoritmul
> compară toate băncile și Florența duce dosarul până la semnare. 0 lei pentru tine. află ce
> credit se potrivește profilului tău.

### P4 — format „comparație" → **unghiul 04, designul opac**

Coloane: „dobânda din reclamă" / „costul din contract". Registru observațional pe organic,
exact pe paid.

> dobânda din reclamă vs costul din contract. banca afișează cifra mică, contractul o conține pe
> cea reală, iar diferența costă bani. algoritmul compară costul total, Florența citește
> contractul înainte de semnare. 0 lei pentru tine. verifică oferta primită.

---

## 4. ce nu preluăm

- **procente decorative** tip 80% / 20% — la publicul sceptic (unghiul 01) distrug credibilitatea.
- **„alege scurtătura"** ca atare — sugerează că sărim pași; la o decizie de 30 de ani, publicul
  40+ (unghiul 06) vrea siguranță, nu viteză. Metafora drumului da, cuvântul „scurtătură" nu.
- **randări 3D generice** — reclama 04 (linie simplă) arată că ideea nu are nevoie de ele.
- **pattern de iconițe pe fundal** — e deja semnătura lor vizuală.

---

## 5. de urmărit

- ipotecare.ro a ocupat insight-ul „prima ofertă". linia noastră master rămâne, dar în
  creative noi merită pus accentul pe ce nu pot copia: **Florența + negocierea + dosarul dus
  până la semnare**.
- dacă reclamele „drumul" rulează mult timp (se vede în Meta Ad Library), e semn că performează —
  argument să testăm P2/P3 primele.
