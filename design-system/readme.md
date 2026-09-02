# credit republic — design system

`credit republic` is a Romanian neobroker for mortgage credit — not a bank. A hybrid model: an AI system compares the market, and Florența Nistoroiu, an AVBS-network licensed broker, negotiates and signs.

The adversary is **inertia** — the habit of accepting the first offer without comparing. **Banks are never the villain.** They do exactly what they're designed to do.

Master line: *nimeni nu alege cel mai bun credit. aleg primul care le iese în cale.*

Values: simplifying · enabling · witty · trustworthy.

---

## Source of truth

This system was rebuilt from the package uploaded 2026-08-27, which replaces all earlier material:

| uploaded file | lives here as |
|---|---|
| `tokens.css` | `tokens/tokens.css` — verbatim, the single source of truth for values |
| `components.html` | `patterns.css` (component CSS, verbatim) + `guidelines/reference/components.html` |
| `exemplu-landing.html` | `page.css` (page-layer CSS, verbatim) + `guidelines/reference/exemplu-landing.html` |
| `design-system.md` | `guidelines/design-system.md` — verbatim, the canonical rules |
| `import-in-claude-design.md` | `guidelines/import-in-claude-design.md` — verbatim |

The brand's own `00`–`04` Project Knowledge files remain the ultimate authority. Where anything here contradicts them, they win.

Still-valid material from earlier rounds, kept because the new package doesn't cover it: `guidelines/copy-si-video.md` (three registers, seven content angles, video production rules), `guidelines/video-workflow-technical.md` (ffmpeg / Playwright execution recipes), `guidelines/prompt-system-v4.md` (Nano Banana Pro image-prompt schemas), `guidelines/00-ghid-pas-cu-pas.md` (zero-to-published walkthrough), `social.css` + `tools/randeaza.py` (the social-plate canvas layer and its renderer).

---

## The blue rule

`--cr-semnal` `#2C86F6` is the only color in the system with a fixed meaning.

**It appears once per screen.** Only on a confirmed positive result that **belongs to the visitor**, or on the active primary button. Never decorative — never on a background, a border, an icon, a chart, a neutral state, or a generic result.

If a screen has both a confirmed figure and a primary button, **only one is blue** — the figure wins, and the button becomes `.cr-btn--secundar`. In practice this means **action buttons default to plum** (`.cr-btn--plum`): hierarchically primary without consuming the signal. The finished landing page uses blue exactly once, in "poziția ta".

`guidelines/reference/components.html` shows blue three times because it's a component sheet, not a screen.

The rest of the palette: cream and plum are backgrounds and text; coral, sunshine and mint are for pills and color blocks. **One color family per section** — three colors in a frame is clutter, not color-blocking.

---

## Typography

Helvetica Neue, with Arial as the metric substitute where it doesn't exist. **No webfont is loaded** — the stack is deliberately system-only, so the page never waits on a download and letters don't jump on load. Bold on statements and titles, regular on body.

If a tool asks for "the font file": there isn't one and there shouldn't be. The stack `Helvetica Neue → Helvetica → Arial → sans-serif` resolves locally on every device. The substitute used when rendering images and video in a container is a separate matter and lives in file `04`.

- **sentence case everywhere.** No CAPS, no Title Case
- **"credit republic" always lowercase**, including at the start of a sentence
- one statement per screen or section, left-aligned
- rare exclamations; no superlatives without backing

Scale is a 1.25 ratio anchored on 17px body; the statement (`--cr-t-afirmatie`) is the only step that jumps, using `clamp()`.

---

## The pill, and text on photography

**The pill is the signature of the graphic pattern, and it only goes on flat color-block backgrounds.**

**Never place a pill on a photograph.** There, text runs free: cream on a dark image, plum on a light one. No shadow, no outline, no semi-transparent box. Coral, mint and sunshine are not used for text on photography. If contrast isn't enough, **change the frame** — don't add a shadow.

*(This corrects earlier versions of this system, which said text always lives in a pill.)*

---

## The offer queue

The brand's visual signature. A row of offers: the first circled in coral — the one accepted on reflex — and one further down filled with mint — the one chosen after comparing.

**The number of rows is arbitrary and does not represent a number of banks.** It isn't labelled, isn't counted, and never becomes a chart.

---

## The visual frame

One anchor grid: two verticals at 1/3 and 2/3, three horizontal bands — head 28%, body 44%, foot 28%.

- **subject in the body band, text in the head or the foot** — never both in the same band
- subject on the 1/3 or 2/3 vertical, not between
- three scale steps only: 68% close · 44% medium · 20% wide. Nothing in between
- max two statement lines per band, plus one secondary line
- level horizon, no tilt

Five frame families, on a nine-post rhythm: 3 typographic · 2 object · 2 human candid · 1 product proof · 1 rupture. Never two consecutive posts from the same family.

---

## The product

**No invented interfaces.** Any product screen in a piece is a real capture, cropped as a **UI chip** — one row, one label, one figure. Max two chips per frame. No drawn button that doesn't exist in the platform.

---

## Never appears

**Numbers & compliance** — no bank count (coverage is written **"toate băncile"**, identically everywhere) · no DAE, no representative example, in copy or in a capture · no invented or illustrative figure in a result chip · no bank logo or name visible without an agreement · personal data fully covered.

**People & AI** — no generated portrait presented as broker, team or advisor; the only person explaining anything on camera is Florența, filmed real · no AI avatars, no synthetic voiceover posing as the broker · **AI is never illustrated as a mechanism**: no glowing brain, neural network, hologram, stock chart, or code on screen — only its result is shown · a warm, expressive **humanoid is allowed only in family E (rupture)**, as a recognition character — the one living the situation, not solving it — with five limits: not as broker or team · not next to a CTA, a figure or a simulator · not in the frame with blue · pure first-person recognition line · roughly once every nine posts. No chrome, cables, LEDs or visors — that's a robot-operator, and it stays forbidden.

**Props** — miniature house · keys held up in the air · wedding couple · happy family with a child in arms · handshakes in a glass office · private-banking desk with mahogany and velvet · big smile straight at camera · stacked coins, piggy banks.

**Language** — the reader is never the subject of a mistake (forbidden: „ai lăsat", „nu știi", „nu ai verificat") · no humor next to a simulator, a pre-qualification, a figure or any CTA · no self-irony about our own accuracy.

---

## Voice in the interface

- the CTA verb is **the same across the whole product**. If the button says „verifică gratuit", the confirmation says „verificat" — not „trimis"
- register follows what's on screen: **exact** next to any figure, simulator or CTA · **observațional** in awareness, the only place with humor · **uman** in explanations
- on images, the voice is the client's, first person: „am întrebat trei bănci. am primit trei da-uri și niciun comparativ." Never next to a CTA
- errors don't apologize and aren't vague: they say what happened and what happens next

---

## Before delivering a design

1. does blue appear **exactly once**?
2. one primary button only?
3. is the CTA verb the same as everywhere else in the product?
4. one statement per section, left-aligned?
5. one color family per section?
6. in visual frames: subject in body, text in head or foot, max two lines?
7. free text on photography, not a pill?
8. "credit republic" lowercase, sentence case throughout?
9. no bank count, no DAE, no bank logo?
10. no generated people; humanoid only in family E, with the five limits?
11. **substitution test:** cover the wordmark. Is it still obvious whose screen this is?

---

## CSS layers

`styles.css` is the entry point and imports, in order:

```
tokens/tokens.css        values — color, type, spacing, shape, motion, frame bands
base.css                 reset, page wrapper, focus ring
patterns.css             components: pastilă · butoane · coada de oferte · cipul de rezultat · cadrul · banda de transparență
page.css                 page grammar: antet · erou · dovadă · cifre · master · piața · proces · produse · poziția ta · comparație · broker · final · subsol
social.css               the .s-* social-plate canvas layer (4:5, 1:1, 9:16) + its render helpers
tokens/legacy-aliases.css  compatibility bridge — see below
```

**`tokens/legacy-aliases.css` is a bridge, not part of the system.** The React components in `components/`, the `.s-*` social layer, and the older specimen cards were written against earlier token names (`--plum`, `--space-4`, `--cr-r-pill`, …). The bridge maps those onto the canonical `--cr-*` names from `tokens/tokens.css` so nothing broke during the swap. Add nothing to it; remove it once `components/` is ported.

---

## Components (`components/`)

The React component set (Badge, Button, IconButton, Tag, Card, Toast, Tooltip, Checkbox, RadioGroup, Switch, Input, Select, Tabs, Dialog…) predates this package and was authored to the earlier rules, not recreated from product code. It still renders correctly through the bridge, but **`patterns.css` is now the canonical component layer** — build new work from those classes and from `guidelines/reference/components.html`. Two of the React components conflict with the current rules and need a pass: any button defaulting to signal blue (should default to plum), and anything placing a pill over an image.

## UI kits (`ui_kits/`)

- `simulator/` — the mobile product simulator (390×844): start, form, results, pre-qualification, broker screens
- `social-templates/` — social cover formats (Facebook 820×312, X 1500×500, Reddit 1920×384)

Both predate this package; the pill-on-photo and blue-once rules should be re-checked against them before reuse.

## Assets (`assets/`)

`logo/credit-republic-logo.png` · `logo/avbs-partner-logo.png` · `photography/broker-portrait.png` (Florența) · `video/brand-clip.mp4` · `social/og-image-1200x630.png` · `social/exemplu-qa-cu-grila.png`.

The logo file sets the wordmark in caps — for body copy and UI, always write `credit republic` lowercase.

## Tools

`tools/randeaza.py` — renders `.s-*` social canvases from an HTML file to PNG via Playwright at 2× (fonts fall back to Helvetica Neue by design; the network is blocked in render).

---

## Caveats — please help iterate

1. **Fonts** — nothing to do. The stack is deliberately system-only (`Helvetica Neue → Helvetica → Arial → sans-serif`), no webfont is loaded, and no font file exists or should. The container render substitute is a separate matter, covered in file `04`.
2. **Icons** — no icon set was provided. Lucide is still the substitute in `components/`.
3. **`components/` and `ui_kits/` are pre-package** and reach the new tokens through the compatibility bridge. Tell me when to port them and I'll drop the bridge.
4. **The Google Slides / Docs links** shared earlier still aren't reachable directly (no export access). Everything incorporated so far came from uploaded files.
5. **The offer queue, the frame bands and the humanoid rule** are the three places where automatic extraction loses the most — `guidelines/import-in-claude-design.md` §2 covers why, and recommends repeating a short briefing at the start of each session.
