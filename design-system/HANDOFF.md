# Handoff: credit republic design system → social media creator (Claude Code)

## Goal
Use Claude Code to build/extend the social media post generator at
`social-creator/` in `luciannistoroiu-ctrl/credit-republic`, brought into
compliance with the credit republic design system in `design-system/`.

## What already exists in the repo
`social-creator/index.html` is a working 3-step studio (post type → content →
prompt/export) with its own CSS (`css/brand-templates.css`, `css/motion.css`,
`css/studio.css`) and JS engines (`copy-engine.js`, `brand-validator.js`,
`templates.js`, `exporter.js`, `motion-engine.js`, `media-engine.js`,
`video-recorder.js`, `script-engine.js`, `script-grader.js`, `micro-personas.js`,
`app.js`). It already has its own color swatches (plum/cream/coral/sunshine/mint)
and a "Brand Linter" panel — this is a parallel system to `design-system/`, not
built from it. That's the gap to close.

## What's in `design-system/` (this handoff)
The canonical, verbatim source of truth:
- `tokens/tokens.css` — all values (color, type, spacing, shape, motion, frame bands)
- `tokens/legacy-aliases.css` — bridge for old token names; don't add to it
- `base.css`, `patterns.css`, `page.css`, `social.css` — component and page CSS layers, in load order via `styles.css`
- `readme.md` — the brand rules. **Read this first.** Key constraints for a social post generator:
  - `--cr-semnal` blue (#2C86F6) appears **at most once per post**, only on a confirmed result belonging to the viewer, or the one active primary button — never decorative
  - buttons default to plum (`.cr-btn--plum`), not blue
  - pills only on flat color-block backgrounds, **never over a photo** — on photography text runs free (cream on dark image, plum on light)
  - "credit republic" always lowercase, sentence case everywhere, no CAPS/Title Case
  - no bank count, no DAE, no bank logos, no generated portraits (except the one limited "family E" humanoid case)
  - the offer-queue motif: one row circled coral (reflex pick), one further down filled mint (the compared pick) — row count is arbitrary, never a chart
  - one color family per section/frame
  - full pre-delivery checklist is at the bottom of `readme.md`

## Task for Claude Code
1. Read `design-system/readme.md` in full before touching code.
2. Diff `social-creator`'s current CSS/JS against the tokens and rules above:
   - Replace hardcoded hex values in `css/brand-templates.css` / `css/studio.css` with `var(--cr-*)` from `tokens/tokens.css` (add the legacy-alias bridge only if needed for a fast port, then plan to remove it)
   - Fix `brand-validator.js`'s linter rules to check the *actual* brand rules (blue-once, pill-never-on-photo, lowercase wordmark, no bank count/DAE) instead of/in addition to whatever it currently checks
   - Check `templates.js`'s 7 layout templates against the visual frame grammar (1/3–2/3 verticals, 28/44/28 horizontal bands, subject in body, text in head or foot)
3. Keep `social-creator/` as the one social tool — don't fork a second generator.
4. Re-run the readme's "before delivering a design" checklist against generated output before calling it done.

## Not in scope
This handoff does not include the React `components/`, `ui_kits/`, or brand PPTX/fonts — the readme explains those predate this package and are being ported separately. Pull them from the design-system project only if a specific task needs them.
