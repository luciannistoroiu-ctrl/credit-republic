# credit republic — analiza conținutului de pe creditrepublic.ro, tabel before & after

Cerință: „analizează conținutul de pe creditrepublic.ro și dă-mi un tabel cu recomandări,
before & after." Scris pe parcursul a 3 iterații (Ralph loop, max 3 iterații) — istoricul
per iterație e la finalul documentului.

## Metodologie și o limitare de verificat

Accesul direct la `creditrepublic.ro` e blocat de proxy-ul de rețea al acestui mediu
(`EGRESS_BLOCKED` la fetch) — aceeași limitare de sandbox semnalată și în ciclul anterior
(`credit-republic-unghiuri-mesaj-v5-optimizare-conversie.md`, iterația 4: „singurele erori de
rețea sunt Google Fonts + cdnjs blocate de proxy-ul sandboxului"). Analiza de mai jos se
bazează pe codul din acest repo — stabilit deja, independent, în iterația 6 a ciclului
anterior (`index.html` = sursa site-ului live, confirmat prin potrivirea hook-ului unghiului
02 între cercetare și pagină) — încrucișat cu regulile de brand și strategia deja documentate
în `claude-project-import/knowledge/`. **De verificat cu o persoană care are acces la site-ul
live:** că `index.html`, `parteneri.html`, `verifica-dobanda-preview.html` și
`pozitia-ta-embed.html` din repo sunt chiar versiunile publicate acum (nu doar la ultimul
deploy cunoscut).

Fișiere citite integral: `index.html` (1459 linii), `parteneri.html` (749),
`verifica-dobanda-preview.html` (917), `pozitia-ta-embed.html` (138), plus
`admin-leads.html` pentru mesajele trimise efectiv către leaduri. Am pornit de la
`credit-republic-analiza-strategica-unghiuri-2026.md` (verdictul strategic pe cele 7 unghiuri)
și `credit-republic-unghiuri-mesaj-v5-optimizare-conversie.md` (regulile de brand voice /
compliance deja stabilite), ca să nu redescopăr ce era deja verificat — și am căutat direct
punctele unde codul curent nu (mai) respectă acele reguli sau acel verdict.

**Descoperire de fond, înainte de tabel:** ultimul commit din repo (`06c620a`) tocmai a
repoziționat H1-ul de pe homepage de pe mecanism („toate băncile comparate") pe brokerul
nominal („Florența Nistoroiu compară piața pentru tine") — exact recomandarea #1 din
`credit-republic-analiza-strategica-unghiuri-2026.md` („H1-ul... 100% pe mecanism, 0% pe om
sau nume... primul loc de atacat"). Jumătate din tabelul de mai jos e, practic, consecința
directă a acestei schimbări: titlul paginii, meta description, OG/Twitter tags și tagline-ul
din footer încă vorbesc varianta veche, pre-repoziționare. Nu e o listă de 8 probleme
disparate — e un singur fir: o decizie bună, aplicată pe jumătate.

---

## Tabelul: before & after

| # | Zonă (fișier:linie) | Categorie | Before (acum) | After (recomandare) |
|---|---|---|---|---|
| 1 | `index.html` `<title>`, meta description, OG/Twitter, footer:1109 | copywriting + SEO on-page | „toate băncile comparate" — mecanism, fără nume | „Florența Nistoroiu, broker de credite" — om, nume, răspundere |
| 2 | `verifica-dobanda-preview.html` (tot fișierul) | copywriting / brand voice | Title Case: „Dobânda ta există." | minuscule: „dobânda ta există." (identic cu index.html) |
| 3 | `verifica-dobanda-preview.html:673` | trust / compliance | „...costul total **(DAE)**..." | „...costul total al fiecărei oferte..." (fără acronim) |
| 4 | `verifica-dobanda-preview.html:743-756`, `pozitia-ta-embed.html:102` | trust / compliance | cifre (4,95% / 6,42%) fără dată sau fără sursă deloc | aceleași cifre + „actualizat [dată]" + condiții, ca pe index.html |
| 5 | `parteneri.html:394` vs `index.html:1017` | structură / accesibilitate | alt="Camelia Florența Nistoroiu — Parteneriat Oficial & Consultanță Dedicată" | alt="Camelia Florența Nistoroiu — broker credite" (identic cu index.html) |
| 6 | `index.html:61-91` (JSON-LD `FAQPage`) | SEO on-page | 3 din 5 întrebări vizibile sunt în schema | toate cele 5 întrebări din `<details>` incluse în `@graph` |
| 7 | `index.html` — nicio secțiune | structură / copywriting (gol de conținut) | obiecția „s-a scumpit, poate aștept" (TVA 21%) — nimic | secțiune/FAQ nouă, registru observațional, care numește obiecția |
| 8 | `index.html:710` vs `:727`, `:1097` | CTA | „scrie pe WhatsApp" (meniu mobil) ≠ „întreabă pe WhatsApp" (hero, final) | „întreabă pe WhatsApp" peste tot (varianta majoritară, 2 din 3) |

Detaliile, citatul complet și motivul fiecărei rânduri sunt mai jos, în aceeași ordine —
aproximativ de la cel mai ieftin/vizibil fix la cel care cere o decizie de conținut nouă.

---

### 1 · titlu/meta/OG/footer nu urmează H1-ul repoziționat pe brokerul nominal
**Prioritate: cea mai mare — vizibilă în orice rezultat Google sau share social, cost de
implementare minim (text, nu cod).**

- **Before** (`index.html:6-22`, `:1109`):
  - `<title>`: „credit republic — broker de credite \| precalificare online. o singură
    aplicare, toate băncile comparate."
  - `<meta name="description">`: „o singură aplicare online. toate băncile comparate în 4
    minute, fără interogare la biroul de credit. 0 lei pentru tine — comisionul vine de la
    bancă. broker autorizat AVBS."
  - `og:title`: „credit republic — broker de credite \| toate băncile comparate în 4 minute"
  - footer (linia 1109): „un sistem compară toate băncile. un broker autorizat AVBS
    negociază."
- **De ce e o problemă reală, nu doar stil:** `credit-republic-analiza-strategica-unghiuri-2026.md`
  a stabilit deja că „un algoritm compară toate băncile" nu mai diferențiază pe nimeni — cel
  puțin 7 competitori spun identic, iar AVBS (rețeaua-mamă) își promovează public **același**
  soft AI ca argument propriu. H1-ul a fost rescris ca reacție directă la asta. Dar titlul de
  Google, textul de share pe Facebook/WhatsApp/LinkedIn (OG) și cardul de Twitter sunt exact
  ce vede lumea **înainte** să ajungă la H1 — și toate încă vând mecanismul generic, nu pe
  Florența. Cineva care dă share la pagina asta pe WhatsApp trimite mai departe exact
  propoziția pe care analiza strategică a numit-o „limbaj standard al categoriei".
  - bonus tehnic: `<title>`-ul actual are ~104 caractere — aproape dublu față de pragul uzual
    de trunchiere din SERP-ul Google (~55-60 caractere); „toate băncile comparate" oricum nu
    se mai vede complet în rezultatul de căutare.
- **After (propus, de confirmat formularea exactă cu Florența înainte de publicare — regulă
  deja stabilită în repo pentru orice schimbă H1-ul/mesajul de intrare)**:
  - `<title>`: „credit republic — Florența Nistoroiu, broker de credite" (~57 caractere)
  - `<meta name="description">`: „Florența Nistoroiu, broker autorizat AVBS, compară toate
    băncile pentru tine. o aplicare online, rezultat în 4 minute, 0 lei pentru tine."
  - `og:title`/`twitter:title`: „credit republic — Florența Nistoroiu compară piața pentru
    tine" (oglindă directă a noului H1, ca share-ul să spună exact ce spune pagina)
  - footer: „Florența Nistoroiu compară toate băncile pentru tine. broker autorizat AVBS,
    0 lei pentru tine."

### 2 · `verifica-dobanda-preview.html` rupe convenția „totul cu minuscule"
- **Before** (exemple, fișier întreg): H1 „Dobânda ta există.<br>Un punct de referință, nu."
  (:578); „Verdict orientativ" (:655); „Peste media pieței" (:662); „Economisește la rata
  lunară" (:722); „Obține Precalificare Gratuit" (:764); „Media pieței (BNR)" (:745).
- **De ce:** `index.html` are, cuvânt cu cuvânt, aceeași secțiune „poziția ta" — dar scrisă
  integral cu minuscule (h2:897 „dobânda ta există.<br>un punct de referință, nu."). Regula
  „credit republic cu minuscule, niciodată caps" a fost deja verificată explicit în tot
  repo-ul, de două ori (iterațiile 7 și 8 din ciclul anterior) — dar acele treceri au verificat
  numele mărcii, nu titlurile/butoanele întregi. Fișierul ăsta pare o versiune scrisă separat
  (poate exportată dintr-un tool de design), care n-a mai trecut prin regula de ton stabilită
  pentru restul site-ului.
- **After:** rescrie tot fișierul cu minuscule, folosind direct formulările deja existente pe
  `index.html` unde se suprapun (h1 → „dobânda ta există.<br>un punct de referință, nu.";
  „Verifică dacă te încadrezi →" din `pozitia-ta-embed.html:108` → „verifică dacă te
  încadrezi →"). Nu e nevoie de rescriere de mesaj, doar de casing — risc minim.

### 3 · „DAE" numit explicit, exact termenul interzis de propriul ghid de brand
- **Before** (`verifica-dobanda-preview.html:673`): „Dobânda nominală nu include comisioanele
  și asigurările. La precalificare comparăm costul total (DAE) — nu rata lunară."
- **De ce:** lista de interdicții din `credit-republic-sistem-de-prompt-v4.md` („forbidden")
  și checklist-ul din `00-CITESTE.md` („niciun superlativ, nicio mențiune de DAE") sunt
  explicite. `index.html:947` transmite **exact același mesaj**, dar fără acronim: „dobânda
  nu conține comisioanele. de asta, la precalificare, comparăm costul total al fiecărei
  oferte — nu rata lunară." Fișierul preview reintroduce cuvântul pe care restul brandului îl
  evită cu bună știință — probabil pentru că un „DAE" afișat fără exemplul reprezentativ
  complet (sumă, durată, cost total) e exact riscul pe care regula încearcă să-l evite.
- **After:** înlocuiește cu formularea de pe `index.html:947`, cuvânt cu cuvânt — mesajul
  rămâne identic, doar termenul reglementat dispare.

### 4 · cifrele AVBS/BNR au sursă și dată pe index.html, dar nu și pe preview/embed
- **Before:**
  - `index.html` (config JS, :1250-1274) afișează vizibil „oferta optimă disponibilă prin
    rețeaua AVBS · credit ipotecar standard, LTV max. 75%, dobândă fixă 3 ani · actualizat 21
    august 2026" și „BNR — dobânda medie... · iulie 2026" — sursă, condiții **și** dată, toate
    randate pe pagină.
  - `verifica-dobanda-preview.html:743-756` are un bloc „sources", dar fără dată: „conform
    rapoartelor BNR recente" (fără să spună care/când).
  - `pozitia-ta-embed.html:102` afișează „dobândă de la 4,95% fixă AVBS" fără nicio sursă,
    condiție sau dată — doar cifra goală.
  - Aceeași cifră (4,95%) ajunge și în mesajul WhatsApp real trimis leadurilor din
    `admin-leads.html:312`: „Avem oferte optime începând de la 4.95% prin AVBS."
- **De ce:** dacă `verifica-dobanda-preview.html` sau `pozitia-ta-embed.html` sunt
  distribuite/încorporate separat de homepage (numele lor — „preview", „embed" — sugerează
  exact asta), un vizitator vede o dobândă concretă fără niciun indiciu despre cât de recentă
  e. Pe `index.html`, aceeași cifră e explicit datată — deci standardul corect există deja în
  repo, doar nu e copiat peste tot unde cifra apare. Riscul crește pentru că cifra ajunge și
  într-un mesaj trimis direct unui lead real, nu doar afișată pe o pagină.
- **After:** propagă exact structura din `index.html` (sursă + condiții + „actualizat
  [dată]") pe toate cele 3 locuri unde 4,95%/6,42% apar, și adaugă un pas de proces (checklist
  sau reminder) care actualizează data peste tot când AVBS schimbă cifra — nu doar pe
  homepage.

### 5 · alt text inconsecvent pe aceeași fotografie
- **Before** (`parteneri.html:394`): `alt="Camelia Florența Nistoroiu — Parteneriat Oficial &
  Consultanță Dedicată"` — majuscule, descrie eticheta de marketing suprapusă peste imagine
  (badge-ul „Parteneriat Oficial..."), nu ce se vede în fotografie.
- **De ce:** e aceeași poză (`Florenta Broker v2.webp`) ca pe `index.html:1017`, unde alt-ul e
  „Camelia Florența Nistoroiu — broker credite" — minuscule, descriptiv, exact convenția
  stabilită deja în iterația 7 a ciclului anterior pentru restul site-ului. Alt text-ul nu e
  loc pentru copy de marketing — e pentru cititoare de ecran și pentru Google Images; varianta
  de pe `parteneri.html` pierde ambele.
- **After:** `alt="Camelia Florența Nistoroiu — broker credite"`, identic cu `index.html`.

### 6 · schema FAQPage nu acoperă toate întrebările vizibile
- **Before** (`index.html:61-91`): JSON-LD `FAQPage` are 3 intrări („0 lei comision",
  „scorul de credit", „ce e un broker de credite"). Pagina vizibilă (`:1066-1085`) are 5
  `<details>` — lipsesc din schema „sunt obligat să merg mai departe?" și „ce date trebuie să
  introduc?".
- **De ce:** structured data incompletă înseamnă că Google poate arăta un rich snippet FAQ
  parțial (3 din 5 întrebări posibile), deși conținutul răspunde deja, vizibil, la toate cele
  5 — pierdere de vizibilitate SERP fără niciun cost de conținut nou, doar de marcare.
- **After:** adaugă cele două `Question`/`Answer` lipsă în `@graph`, cu textul deja existent
  în pagină, cuvânt cu cuvânt (ca schema să rămână sincronă cu ce vede vizitatorul).

### 7 · gol de conținut: obiecția „s-a scumpit, poate aștept" (TVA 21%) nu are nicio secțiune
- **Before:** nimic, pe nicio pagină din repo. Confirmat prin căutare directă („TVA", „21%",
  „amân", „aștept") — singurul rezultat e „fără așteptat pe hold" (:963), fără legătură.
- **De ce:** `credit-republic-analiza-strategica-unghiuri-2026.md` a semnalat deja asta ca „cel
  mai clar gol de conținut" găsit în analiza de piață 2026 — TVA la case noi a urcat la 21%,
  volumul tranzacțiilor a scăzut ~9% (București ~12%), iar presa vorbește explicit despre
  amânare. Niciunul din cele 7 unghiuri de mesaj și nicio secțiune din site nu răspunde la
  „poate ar trebui să mai aștept". E singurul rând din acest tabel care nu e o corecție de
  conținut existent, ci un gol confirmat de două surse independente (cercetarea de piață +
  scanarea de conținut din această analiză).
- **After (schiță, de validat cu Florența — e decizie de conținut nouă, nu un fix mecanic):**
  o bandă observațională, în același registru ca secțiunea „obs" existentă (`index.html:865`,
  fără buton, ton constatativ): eyebrow „piața 2026" · linie „s-a scumpit, deci mai aștepți?"
  · text „TVA la case noi a urcat la 21%, tranzacțiile au scăzut. dar rata pe care o negociezi
  nu depinde de TVA — depinde de câte bănci compari. amânarea nu ieftinește creditul, doar
  întârzie comparația." Register „soft", ca unghiurile 04/05 din
  `credit-republic-unghiuri-mesaj-v5-optimizare-conversie.md` — observațional, nu de vânzare
  directă, pentru că nu există încă un mecanism clar de risc-zero de atașat (spre deosebire de
  unghiurile cu buton).

### 8 · CTA-ul secundar de WhatsApp are două formulări diferite
- **Before:** „scrie pe WhatsApp" (`index.html:710`, meniul mobil) vs. „întreabă pe WhatsApp"
  (`:727` hero, `:1097` CTA final).
- **De ce:** micro-inconsecvență, dar exact genul verificat sistematic în iterația 2 a
  ciclului anterior (consistență buton↔caption la unghiul 06) — un vizitator care deschide
  meniul mobil după ce a văzut hero-ul vede două verbe diferite pentru aceeași acțiune.
  „întreabă" e formularea majoritară (2 din 3 apariții) și sună mai puțin ca o obligație de-a
  redacta un mesaj anume.
- **After:** unifică pe „întreabă pe WhatsApp" în meniul mobil (`index.html:710`).

---

## Ce e deja bine — nu schimbăm, doar semnalăm ca reper

Câteva lucruri verificate direct în cod, care fac exact ce ar trebui — utile ca reper pentru
orice rescriere de mai sus, ca să nu se piardă din greșeală:

- **Transparența „0 lei" e peste tot, consecventă** — hero, figs, footer, FAQ, widget-uri.
  Niciun loc nu ascunde sau nuanțează asta.
- **Niciun superlativ nou, nicio cifră de bănci inventată** pe conținutul principal —
  marquee-ul de pe `index.html:810` numește bănci reale (Banca Transilvania, ING, BCR...) în
  loc de o cifră, exact soluția recomandată în ciclul anterior pentru problema „câte bănci".
- **FAQ-ul răspunde la obiecțiile reale de încredere**, nu la întrebări decorative: impactul
  pe scorul de credit, dacă ești „obligat" să mergi mai departe, ce date se cer. Astea sunt
  exact obiecțiile pe care un vizitator sceptic le-ar avea.
- **Tabelul de comparație** (`#compara`, :984-1011) e concret și verificabil (timp, DTI,
  status dosar), nu doar adjective auto-laudative.
- **Recenziile** numesc situații specifice (venit variabil, refinanțare, nevoi personale) cu
  nume și context, nu testimoniale generice interschimbabile.
- **Structured data există** (`FinancialService` + `FAQPage`) — doar incompletă (rândul 6),
  nu absentă.
- **Footer-ul are toate linkurile de conformitate** — confidențialitate, cookies, termeni,
  ANPC-SAL — vizibile, nu ascunse într-un submeniu.

---

## Prioritizare

- **Fix-uri mecanice, risc minim, fără decizie de conținut nouă** (rândurile 2, 3, 5, 6, 8):
  casing, un cuvânt interzis, un alt text, două intrări de schema, un verb de buton. Pot fi
  aplicate direct, fără aprobare de brand — sunt aliniere la reguli deja stabilite, nu reguli
  noi.
- **Fix cu impact mare, cost mic, dar care merită un ochi uman înainte de publicare**
  (rândul 1): titlul/meta/OG sunt cea mai vizibilă suprafață a brandului (fiecare rezultat
  Google, fiecare share) — propagă direct decizia deja luată la H1, dar formularea exactă
  merită confirmarea Florenței, ca orice altă schimbare de mesaj de intrare.
- **Verificare operațională, nu de copy** (rândul 4): nu e text de rescris, e un proces de
  ținut sincron (sursă + dată peste tot unde apare cifra AVBS/BNR).
- **Decizie de conținut nouă, nu un fix** (rândul 7): singurul rând care cere un unghi nou,
  nu o corecție. Schița de mai sus e un punct de plecare, nu text gata de publicat.

---

## Fișiere analizate

`index.html` · `parteneri.html` · `verifica-dobanda-preview.html` · `pozitia-ta-embed.html` ·
`admin-leads.html` (doar mesajele customer-facing) · `elementor-embed.html` (verificat rapid,
confirmat neschimbat față de semnalarea din ciclul anterior — encoding stricat, draft separat,
neatins).

Cunoștințe folosite ca bază: `credit-republic-analiza-strategica-unghiuri-2026.md`,
`credit-republic-unghiuri-mesaj-v5-optimizare-conversie.md`, `00-CITESTE.md`,
`credit-republic-sistem-de-prompt-v4.md`.

---

## Istoricul iterațiilor

### Iterația 1 — cercetare + primul draft complet al tabelului
Citire completă a `index.html`, `parteneri.html`, `verifica-dobanda-preview.html`,
`pozitia-ta-embed.html`; încercare de acces direct la `creditrepublic.ro` (blocat de proxy,
documentat mai sus); construirea celor 8 rânduri before/after pe baza diferențelor concrete
găsite în cod, încrucișate cu regulile deja documentate în `claude-project-import/knowledge/`.
