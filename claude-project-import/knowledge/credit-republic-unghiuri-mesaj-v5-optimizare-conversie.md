# credit republic — cele 7 unghiuri de mesaj, v5 (optimizare pentru conversie)

Rescriere a celor 7 unghiuri de brand (`social-creator/js/copy-engine.js`) și a celor 6→7
micro-persoane (`social-creator/js/micro-personas.js`), pornind de la audiență, modelul de
business, competitori și obiectivul de conversie. Prima iterație dintr-un loop de rafinare
(Ralph loop, max 5 iterații) — acest document e rezultatul iterației 1.

De ce „6 sau 7": codul are **7 unghiuri** dar avea doar **6 micro-persoane** — unghiul
06 (algoritm + om) nu avea o persoană dedicată. Am adăugat-o (`decizie_prea_mare`, vezi mai
jos), deci acum sunt 7 și 7.

---

## Metodologie: cum am măsurat, nu doar cum am „simțit"

Repo-ul are deja două unelte de scor obiectiv, folosite de `social-creator/test-suite.js`:

- **BrandValidator** — reguli stricte de compliance (fără superlative, fără cifră de bănci,
  fără culpabilizarea cititorului, „credit republic" cu minuscule etc.)
- **ScriptGrader** — 10 criterii D2C (hook, identificarea problemei, agitarea durerii,
  mecanism unic, social proof/autoritate, risk reversal, CTA unic), prag de „production ready"
  la ≥85/100.

Am rulat ambele pe toate cele 8 preset-uri (7 unghiuri, unghiul 01 are 2 preset-uri) **înainte**
și **după** rescriere:

| | scor mediu D2C | preset-uri „production ready" (≥85) | erori de brand compliance |
|---|---|---|---|
| înainte | 73.1 / 100 | 1 din 8 | 0 raportate (dar vezi bug-urile de mai jos) |
| după | **95.0 / 100** | **8 din 8** | **0 reale** |

„0 raportate" înainte e înșelător — validatorul însuși avea bug-uri care ascundeau violări
reale (detaliu mai jos). Testele automate au crescut de la 29 la **48, toate verzi**
(`node social-creator/test-suite.js`).

---

## Bug-uri de compliance reparate în unelte (nu doar în copy)

Astea nu erau vizibile până am scris copy nou și scorul nu s-a mișcat cum ar fi trebuit —
semn că validatorul mințea, nu că textul era curat.

1. **`\b` din regex nu recunoaște diacriticele românești ca literă.** JS tratează `\b` ca
   graniță doar față de `[A-Za-z0-9_]`. Orice regulă care se termina cu un cuvânt cu ă/â/î/ș/ț
   (ex. `cea mai mic[aă] dob[aâ]nd[aă]`) nu se declanșa NICIODATĂ, pentru că „ă" nu e literă
   pentru motorul de regex. Efect real: **`parteneri.html` avea live, nedetectat,
   „el primește cea mai mică dobândă din piață"** — exact tipul de superlativ pe care
   ghidul de brand îl interzice explicit. Corectat (regex + copia din pagină) și acoperit cu
   test de regresie.
2. **Verbul „compară" nu se potrivea cu „compara".** `ScriptGrader` căuta substring-ul literal
   „compara", dar românește se conjugă „compară" / „comparăm" / „comparate" — niciuna nu conține
   „compara" ca literă. Rezultat: aproape orice caption care folosea corect verbul la timpul
   prezent pierdea punctajul de „mecanism unic". Corectat la stem-ul „compar".
3. **„cel mai bine" / „cea mai bine" lipseau din lista de superlative** — aceeași afirmație ca
   „cel mai bun", doar la adverb. Prezent chiar în preset-ul 06 („combinația funcționează
   cel mai bine") — reparat și adăugat în regex.
4. **`micro-personas.js` nu era testat deloc** — nici de `test-suite.js`, nici de altcineva.
   Rezultat: un hook live cu „apartamentul **perfect**" (superlativ interzis) și un TEEP cu
   „**3 bănci** diferite" (cifră de bănci interzisă) au stat nedetectate. Am corectat ambele
   și am adăugat `micro-personas.js` + `script-engine.js` (generatorul de briefuri) în
   `test-suite.js`, ca să nu mai poată intra tăcut conținut necompliant pe viitor.

---

## Cele 7 unghiuri — audiență × business × competiție × obiectiv

Model de business, pe scurt (contextul pentru toate deciziile de mai jos): neobroker
ipotecar — un algoritm compară toate băncile, Florența Nistoroiu (broker autorizat AVBS,
Nistoroiu Financial Solutions SRL, intermediar de credit autorizat ANPC) negociază și duce
dosarul la semnare. **0 lei pentru client — comisionul vine de la bancă.** Obiectivul de
conversie e clicul pe „obține precalificarea" / CTA-ul echivalent din fiecare unghi.

### Tabel-rezumat: audiență · obiecție adresată · diferențiator · CTA

Detaliile și motivul fiecărei schimbări sunt în secțiunile de mai jos; tabelul e varianta
scanabilă a celor patru lucruri cerute pentru fiecare unghi.

| # unghi | audiență (persoană) | obiecția adresată | diferențiator vs competiție | CTA |
|---|---|---|---|---|
| 01 mecanismul | scepticul comisionului („unde e șmecheria?") | „cum poate fi gratuit — cine plătește de fapt?" | brokerii locali zic „gratuit" fără mecanism; fintech-urile pur-algoritm nu au un om care negociază | „verifică poziția ta" (self-serve, pt. un sceptic care vrea să verifice singur) |
| 02 refinanțarea amânată | cel care amână refinanțarea (ROBOR/IRCC) | „oricum m-ar suna banca dacă ar fi o ofertă mai bună" / „nu e efortul meu prioritar acum" | banca proprie n-are niciun motiv să te anunțe de o ofertă externă mai bună | „calculează refinanțarea" |
| 03 venitul variabil | PFA / dividende / IT | „am fost deja refuzat, nu mă calific" | băncile clasice au un singur algoritm rigid pentru venit non-standard; un refuz devine „verdict al pieței" | „vezi unde te califici" |
| 04 designul opac | victima reclamei cu dobândă mică | „am deja o ofertă cu dobândă mică, ce rost are să mai caut" | reclamele bancare arată procentul, nu costul total (asigurări, comisioane) | soft, în caption („verificarea durează 4 minute") — fără buton, registru observațional |
| 05 casa vs creditul | căutătorul de apartament la prima achiziție | „trebuie să semnez rapid, nu am timp să compar" | agenția imobiliară vinde casa, nu compară creditul; presiunea de timp e folosită de concurență, nu dezamorsată | soft, în caption — fără buton, registru observațional |
| 06 algoritm + om | 40+ / decizie prea mare pentru o aplicație (persoană nouă) | „nu am încredere doar într-un algoritm pentru o decizie de zeci de mii de euro" | fintech 100% automate nu au om responsabil; brokerii tradiționali sunt umani dar lenți/opaci | „discută cu Florența..." (uman, nu self-serve) |
| 07 birocrația | cuplul copleșit de dosare/drumuri | „sună a mult efort, dosare, drumuri la ghișeu" | procesul manual cere 4-5 drumuri la sucursale diferite, cu formulare re-completate de la zero | „precalifică-te, fără drumuri" (fricțiune zero — vezi de ce era greșit înainte, mai jos) |

### 01 · mecanismul — scepticul („unde e șmecheria?")
- **Competiție:** brokerii locali repetă „100% gratuit" ca slogan, fără mecanism — creează
  zgomot, nu încredere. Fintech-urile pur-algoritm nu au un om care negociază.
- **Ce am schimbat:** ambele preset-uri (afirmație + „cum funcționează") menționau
  algoritmul, dar niciunul nu numea explicit AVBS ca autoritate lângă mecanism. Am legat
  cele două direct: „un algoritm compară toate băncile, un broker autorizat AVBS duce
  dosarul la capăt" — răspunde exact la „cine plătește și de ce" fără să ceară cititorului
  să creadă pe cuvânt.
- **CTA:** „verifică poziția ta" (self-serve — potrivit unui scepic care vrea să verifice
  singur, nu să fie convins).

### 02 · refinanțarea amânată — cel care amână (ROBOR/IRCC)
- **Competiție — cel mai ascuțit unghi din cercetarea originală, neadus până acum în cod:** banca
  proprie nu are niciun motiv să te sune când apare o ofertă mai bună. Vechiul copy vorbea
  doar despre „costul amânării" fără să numească de ce oamenii amână (presupun că banca i-ar
  anunța).
- **Ce am schimbat:** titlul devine „banca ta nu te sună când apare o ofertă mai bună." —
  subiectul e banca, nu cititorul (regula anti-culpabilizare respectată), iar insight-ul e
  mai tare pentru că explică mecanismul lipsei de acțiune, nu doar costul ei. Cifrele
  concrete existente (7.90%→5.75%, 2.880 lei) rămân — erau deja punctul forte.
- **CTA:** „calculează refinanțarea" — acțiune, nu promisiune.

### 03 · venitul variabil — PFA / dividende / IT
- **Competiție:** băncile clasice tratează venitul non-standard cu un singur algoritm rigid;
  eșecul la o bancă se simte ca verdict al pieței.
- **Ce am schimbat:** titlul devine reformularea testată în cercetarea originală „o bancă
  ți-a spus nu. nu înseamnă că piața a spus nu." — mută respingerea de pe persoană pe
  metodologia unei singure bănci. Am adăugat explicit „0 lei" (risk reversal lipsea complet
  din caption-ul vechi).
- **CTA:** „vezi unde te califici" — reformulează din binar (accept/refuz) în căutare de
  potrivire, exact ce are nevoie cineva cu frica respingerii.

### 04 · designul opac — victima reclamei cu dobândă mică
- **Competiție:** reclamele bancare arată procentul, nu costul total (asigurări, comisioane
  de administrare).
- **Ce am schimbat:** mitul citat literal conținea „cea mai mică dobândă" — superlativul
  exact interzis de propriul ghid, ascuns de bug-ul de regex de mai sus (apărea și în
  caption, și în slide-ul carusel). Rescris fără superlativ, păstrând mitul credibil
  („primesc automat o reducere la dobândă"). Am adăugat mecanism + AVBS + o închidere
  moale, potrivită registrului observațional („dacă vrei să vezi costul real, verificarea
  durează 4 minute").

### 05 · casa vs creditul — căutătorul de apartament
- **Competiție:** agenția imobiliară vinde casa, nu compară creditul; presiunea de timp
  împinge spre prima ofertă.
- **Ce am schimbat:** unghi observațional, deja bun ca insight; i-am adăugat aceeași
  închidere moale (mecanism + AVBS + verificare 4 minute) — înainte nu avea niciun pod spre
  funnel, nici măcar informal.

### 06 · algoritm + om — decizia prea mare pentru o aplicație (persoană nouă)
- **Competiție:** fintech-urile 100% automate nu au un om responsabil pentru o decizie pe
  25-30 de ani; brokerii tradiționali sunt umani dar lenți și opaci.
- **Ce am schimbat:** „funcționează **cel mai bine**" (superlativ nedetectat) → „de ce
  alegem această combinație". Am adăugat o propoziție de agitare a durerii cu subiect pe
  sistem, nu pe cititor („un dosar poate pierde timp în comitetele de risc", nu „tu pierzi
  timp"). **CTA schimbat din „începe precalificarea" în „discută cu Florența"** — celelalte
  unghiuri „exact" au CTA-uri self-serve; acesta e singurul unghi „uman" prin design, așa
  că CTA-ul trebuie să ofere un om, nu un formular.
- **Persoană nouă (`decizie_prea_mare`):** 40+ sau oricine a folosit deja un simulator dar
  vrea o confirmare umană înainte de o decizie mare. Am evitat deliberat cifra „75% se
  descurcă singuri" din cercetarea originală — o conversație anterioară (`08-sapte-unghiuri...`)
  a semnalat explicit că e nesursată; am păstrat regula „nicio cifră neverificată".

### 07 · birocrația — cuplul copleșit de dosare
- **Deja cel mai bun scor (100/100)** — l-am lăsat aproape neatins.
- **Un singur fix, dar cred că e cel mai important din tot exercițiul:** CTA-ul era
  „**aplică acum**". Persoana asta are exact frica de-a „aplica"/depune dosare — CTA-ul
  propriu retrigger-a obiecția pe care tot restul mesajului o dezamorsa. Schimbat în
  „precalifică-te, fără drumuri" — zero fricțiune, în limbaj care oglindește punctul de
  durere numit chiar în unghi.

---

## Onestitate despre „conversie de peste 10%"

Rata de conversie reală depinde de trafic, targetare, ofertă, viteza paginii, creativul
video/foto și canal — nu doar de textul unghiului. Ce am optimizat aici sunt factorii pe
care copy-ul chiar îi controlează:

- **potrivire mesaj-audiență** (fiecare unghi vorbește direct despre insight-ul TEEP al
  persoanei lui, nu generic)
- **claritate mecanism + risc-zero** (0 lei, cine plătește, cine e Florența/AVBS) — prezent
  acum în toate cele 8 preset-uri, nu doar în jumătate
- **CTA fără fricțiune și fără contradicție cu obiecția persoanei** (fix-ul de la unghiul 07)
- **compliance real, nu doar aparent** — un claim nesubstanțiat („cea mai mică dobândă") pe
  pagina de parteneri e exact genul de risc legal/încredere care poate anula orice câștig de
  conversie dacă un vizitator sceptic sau un concurent îl remarcă.

95/100 pe scorul intern D2C + 0 erori de compliance e un prag solid pentru „gata de
publicat". Dacă >10% conversie se atinge sau nu depinde acum de testare A/B live pe trafic
real — recomand testarea unghiurilor 02 și 07 (CTA-urile schimbate) primele, pentru că
schimbarea de CTA e ipoteza cu cel mai clar mecanism cauzal din tot setul.

## Ce rămâne deschis pentru următoarele iterații

- Scorul de „agitare a durerii" rămâne la 90/100 pe cele 4 preset-uri din registrul
  observațional (01×2, 04, 05) — decizie deliberată: agitarea explicită a durerii ar rupe
  regula „fără presiune de vânzare" a registrului observațional. De verificat dacă un
  cititor uman e de acord cu acest compromis sau dacă tot merită o formulare mai fină.
- Cifra reală de bănci din parteneriatul AVBS tot nu e confirmată (semnalat încă din
  `08-sapte-unghiuri-de-comunicare...`) — nu blochează nimic acum pentru că regula curentă e
  „toate băncile" peste tot, dar merită închis odată pentru totdeauna.
- `elementor-embed.html` pare un export vechi cu encoding stricat (mojibake pe diacritice) —
  neatins în această iterație, nu face parte din cele 7 unghiuri; merită verificat separat
  dacă fișierul e încă folosit undeva.

---

## Iterația 2 — ce s-a adăugat

Copy-ul din iterația 1 a rezistat la o a doua citire critică (nimic de rescris) — recitirea
în sine e verificarea, nu semn că nu s-a lucrat. Ce era totuși de terminat:

- Tabelul de mai sus (audiență · obiecție adresată · diferențiator · CTA) — cerința inițială
  numea explicit aceste patru lucruri „per unghi"; iterația 1 le avea pe toate prin text, dar
  nu într-o formă scanabilă, per-unghi.
- Consistență buton ↔ caption la unghiul 06: butonul zice „discută cu florența", dar caption-ul
  se închidea cu „află de la Florența..." — mesaj corect, dar altă formulare decât butonul.
  Unificat pe „discută cu Florența, fără cost și fără obligație — află ce se schimbă..." (are
  ambele verbe: cel din buton, pentru consistență, și „află", pentru ca ScriptGrader să
  recunoască CTA-ul din caption). Rescor: tot 100/100, neschimbat — era deja despre formulare,
  nu despre punctaj.
