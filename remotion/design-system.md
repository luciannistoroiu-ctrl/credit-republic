# credit republic — design system (remotion)

Distilat din sursele reale ale repo-ului, nu inventat — dacă un fișier sursă
se schimbă, actualizează și acest fișier. Surse: `social-creator/css/brand-templates.css`,
`social-creator/css/motion.css`, `social-creator/js/copy-engine.js`, `AGENTS.md`,
`remotion/src/compositions/BirocratieComparison.tsx` (primul precedent construit).

Acest fișier e checklist-ul criticului de sistem din `/design-loop` — verificabil
prin privire la cadre randate, nu prin citirea codului.

## paletă (locked)

| token | hex | rol |
|---|---|---|
| cream | `#FFF8F0` | fundal deschis, negativ spațiu |
| plum | `#2B2640` | fundal închis, cerneală principală pe cream |
| coral | `#FF6B4A` | accentul brandului — pastile, cuvântul de accent |
| sunshine | `#FFD166` | accent secundar, rar |
| mint | `#06D6A0` | accent secundar, rar |
| signal (`#2C86F6`) | — | **rezervat**: apare cel mult o dată pe cadru, exclusiv pe rezultatul confirmat |

## tipografie

- display: Omnes → fallback `Plus Jakarta Sans` (fonturi Adobe nu sunt disponibile aici fără kit web)
- body: Helvetica Neue → fallback `Plus Jakarta Sans` / Arial
- **doar sentence case** — niciodată Title Case sau MAJUSCULE, nici pe titluri, nici pe wordmark
- **fără semne de exclamare**
- cifrele aliniate cu `font-variant-numeric: tabular-nums` oriunde apar coloane de cifre

## regulile de brand (din `AGENTS.md`, verificabile pe cadru)

- „credit republic" — exclusiv minuscule
- nicio cifră de bănci („12 bănci") — se spune „toate băncile"
- fără superlative — singura excepție e linia master: „nimeni nu alege cel mai bun credit. aleg primul care le iese în cale."
- subiectul e sistemul/banca/noi — niciodată cititorul ca autor al unei greșeli („ai lăsat", „nu știi", „ai greșit")
- orice cifră de rată/cost afișată cere legenda exemplului reprezentativ DAE, vizibil în cadru
- text de accent stă în pastile (`border-radius: 999px`), niciodată liber pe fundal

## motion (din `motion.css` + `motion-engine.js`)

- mișcare continuă, lentă, într-o singură direcție — niciodată bounce, overshoot sau spin
- **maximum o mișcare principală pe cadru** — dacă două elemente se mișcă simultan, unul trebuie să fie strict subordonat (parte a aceleiași tranziții), nu independent
- easing implicit: ease-out cubic — `1 - (1-progress)^3`, identic cu `startCounterAnimation()`
- albastrul de semnal nu se animează (nu pulsează, nu se mișcă) — apare static, o singură dată, pe rezultatul confirmat

## convenții de cod (din `BirocratieComparison.tsx`)

- copy-ul intră ca props (`defaultProps`), niciodată retastat direct în JSX — sursa e presetul corespunzător din `copy-engine.js`
- beat-urile sunt `<Sequence>`-uri separate, cu limitele exprimate în cadre (`fps * secunde`), nu în milisecunde hardcodate
- token-urile de culoare/font vin din `src/tokens.ts`, niciodată hex-uri inline noi
- fiecare compoziție are o variantă 9:16 (master) și cel puțin o derivată (1:1 sau 4:5) — nu crop post-randare, compoziții separate

## identity anchor — semnul-coadă

Două bare-pastilă offset diagonal — o bară translucidă (35% opacitate) în spatele
unei bare coral solide (geometria reală din `cr_semn_light.svg`/`cr_semn_dark.svg`).
Nu se contopește niciodată într-o singură bară, nu se rotește peste ~6°.
