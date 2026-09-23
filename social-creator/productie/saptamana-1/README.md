# producție — săptămâna 1

Materialele pentru `claude-project-import/knowledge/credit-republic-plan-postari-saptamana-1.md`.
Toate fișierele sunt în `out/`, la rezoluție de publicare (2x): 1080×1350, 1080×1080, 1080×1920, 1920×1080.

**Gata: 14 din 14 imagini, 8 din 14 video** + un cadru final reutilizabil.
Video-urile rămase au nevoie de filmare cu Florența (4) sau de fotografii noi (1), vezi jos.

## gata de publicat

| zi | suprafață | tip | fișier |
|---|---|---|---|
| luni | Meta story | imagine | `cr_01_luni-story-sondaj_9x16_v1_01.png` (sondaj) + `_02.png` (răspunsul, a doua zi) |
| luni | TikTok | video 15 s | `cr_01_luni-tiktok-text-cinetic_9x16_v1.mp4` |
| luni | X | imagine | `cr_01_luni-x-linia-master_1x1_v1.png` |
| marți | Meta feed | imagine | `cr_07_marti-feed-drumul_4x5_v1.png` |
| marți | Meta story | video 6 s | `cr_07_marti-story-drumul_9x16_v1.mp4` |
| marți | TikTok | video 18 s | `cr_07_marti-tiktok-teanc-acte_9x16_v1.mp4` |
| marți | X | imagine | `cr_07_marti-x-checklist_1x1_v1.png` |
| miercuri | Meta feed | carusel 4 | `cr_03_miercuri-feed-carusel_4x5_v1_01..04.png` |
| miercuri | Meta story | imagine | `cr_03_miercuri-story-intrebare_9x16_v1.png` |
| miercuri | X | video 8 s | `cr_03_miercuri-x-trei-calcule_16x9_v1.mp4` |
| joi | TikTok | carusel 4 | `cr_06_joi-tiktok-carusel_9x16_v1_01..04.png` |
| joi | X | imagine | `cr_06_joi-x-broker-ai_1x1_v1.png` |
| vineri | Meta feed | imagine | `cr_05_vineri-feed-apartament_4x5_v1.png` |
| vineri | Meta story | video 6 s | `cr_05_vineri-story-precalificare_9x16_v1.mp4` |
| vineri | X | video 8 s | `cr_05_vineri-x-drumul-tva_16x9_v1.mp4` |
| sâmbătă | Meta feed | video 12 s | `cr_04_sambata-feed-reclama-contract_9x16_v1.mp4` |
| sâmbătă | Meta story | imagine | `cr_04_sambata-story-quiz_9x16_v1.png` |
| sâmbătă | TikTok | carusel 5 | `cr_04_sambata-tiktok-carusel_9x16_v1_01..05.png` |
| sâmbătă | X | imagine | `cr_04_sambata-x-comparatie_1x1_v1.png` |
| duminică | Meta feed | imagine | `cr_02_duminica-feed-calcul_4x5_v1.png` |
| duminică | Meta story | video 6 s | `cr_02_duminica-story-rata_9x16_v1.mp4` |
| duminică | X | imagine | `cr_02_duminica-x-intrebare_1x1_v1.png` |
| — | Reels Florența | video 3 s | `cr_00_cadru-final-cta_9x16_v1.mp4` — se lipește la finalul Reel-urilor de luni și joi |

Fiecare video are și o copertă: `*_coperta.png` (se alege ca thumbnail în TikTok/Reels).

### la publicare

- **Story-urile cu sondaj, casetă de întrebare și quiz** au spațiu liber în jumătatea de jos:
  sticker-ul se adaugă nativ în Instagram (opțiunile sunt în plan).
- **Story-urile cu link** (marți, vineri, duminică): link sticker cu UTM, în zona de jos.
- **Video-urile sunt fără sunet**, intenționat. Muzica se adaugă nativ în TikTok/Instagram, din
  biblioteca platformei (licențiată pentru postare organică).
- Caption-urile sunt în plan, la ziua și suprafața respectivă.

## rămân de produs

| zi | suprafață | ce lipsește |
|---|---|---|
| luni | Meta feed — Reel | filmare Florența (script în plan) + `cr_00_cadru-final-cta` la final |
| miercuri | TikTok | filmare Florența: 3 verificări PFA |
| joi | Meta feed — Reel | filmare Florența la telefon, jumătatea de jos a ecranului |
| joi | Meta story | primele 8 s din Reel-ul de joi |
| vineri | TikTok — vizionarea 14 | 4–5 fotografii de apartamente diferite (există doar una în `assets/`) |
| duminică | TikTok | filmare Florența: refinanțare |

Toate cele 4 filmări încap într-o singură sesiune de ~1 oră.

## de verificat înainte de publicare

- **Fotografia Florenței**: `social-creator/assets/florenta-nistoroiu.webp` (originalul) și
  `florenta-nistoroiu-cerc.jpg` (decupajul pătrat folosit în cercuri).
- **Fontul**: titlurile trebuie să fie în Omnes, dar Omnes cere Adobe Fonts și nu e disponibil
  aici. Randarea folosește Plus Jakarta Sans, fontul de rezervă deja declarat în
  `brand-templates.css`. Cu Omnes instalat local, o re-randare îl folosește automat (e primul în
  lista de fonturi).
- Punctele din secțiunea 7 a planului: exemplul PFA (miercuri), TVA 21% (vineri).

## re-randare

```
pip install imageio-ffmpeg     # ffmpeg static cu libx264, dacă nu există ffmpeg în sistem
FFMPEG=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())") \
  node social-creator/productie/render.js saptamana-1 [filtru]
```

`[filtru]` e opțional, o parte din nume (ex. `vineri`). Scriptul folosește Playwright (instalat
global), randează fiecare cadru și **validează automat tot textul vizibil** prin
`BrandValidator`, plus regula albastrului semnal (cel mult un element per cadru). Dacă un cadru
încalcă o regulă, scriptul iese cu eroare.

Conținutul e în `posts.js`, iar stilurile în `../base.css` și `../lib.js`.
