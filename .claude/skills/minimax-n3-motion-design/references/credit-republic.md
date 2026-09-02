# Brand override — credit republic

Loaded whenever a request targets Credit Republic (named explicitly, or the working repo is `credit-republic`). Everything below REPLACES the generic "Hard defaults" and the Higgs* naming/palette convention in SKILL.md for this brand. Everything not overridden here (beat rhythm, response format, the five laws, MiniMax/segmentation guidance) still applies as written.

Source of truth: `claude-project-import/knowledge/credit-republic-ghid-de-brand-v4.2.pdf`, `claude-project-import/knowledge/credit-republic-sistem-de-prompt-v4.md`, `claude-project-import/knowledge/credit-republic-video-workflow.md`, `00-CITESTE.md`.

## Wordmark

`credit republic` — always lowercase, never capitalized, never a logotype rendered by the generator. If a model renders it as on-screen type, treat it like any other COPY LIST string: exact lowercase string, nothing else in that position.

## Palette (locked — v4, replaces house acid)

- `#FFF8F0` — cream (default background candidate)
- `#2B2640` — plum (default background candidate)
- `#FF6B4A` — coral (default background candidate)
- `#FFD166` — sunshine (default background candidate)
- `#06D6A0` — mint (default background candidate)
- `#2C86F6` — accent positive / house blue. **Not a surface-percentage rule — a time rule.** In video it may appear at most ONCE, in the single beat where a result is confirmed (approval, savings figure, "done" state). If it appears before that beat, or lingers after, or tints anything else (glow bleed, early hint, residual card border), the film is off-brand. Never use it for a CTA that hasn't been earned by a confirmed result.

Any one of cream/plum/coral/sunshine/mint may be the main background — build the rest of the palette system (secondary type, card fills, inactive states) as tints/near-neutrals of whichever is chosen, the same way the base skill asks you to build a system around a user-named color.

## Typography

Headlines: **Omnes** (geometric, confident, slightly rounded terminals). Body/secondary lines: **Helvetica Neue**. If the render pipeline can't load Omnes (most text-to-video and Playwright/HTML paths block external font fetches), fall back to Helvetica Neue everywhere — that fallback is accepted brand-wide, not a bug to flag.

Accent/CTA text never floats free on the background — it always sits inside a rounded pill (border-radius ~999, ~20px/34px padding), matching the compositing pattern already used for stills (text is composed in HTML/CSS pills over clean generated footage, not rendered as in-frame text by the model itself).

## Copy rules

- Coverage is always phrased **"toate băncile"** — never a number of banks, anywhere: not in copy, not in a UI mockup, not in a captured screen, not in a pill.
- No DAE / representative-example mentions, in copy or on-screen.
- No superlatives.
- No invented figures — a savings/rate number shown on screen must read as a placeholder/silhouette (blurred or non-numeric), never a specific fabricated value presented as real.
- Tone of voice: witty — recognition humor, calm-confident. Not manufactured urgency, not chaos-as-energy even in high-motion styles.

## Cast / avatar rule (video-specific, non-negotiable)

**No AI avatar, no synthetic face, no AI-generated voice narration — ever.** The only person who speaks on camera for Credit Republic is Florența, filmed for real. AI/text-to-video generation is for composition, motion, and UI-logic sequences only (product/UI films like the ones this skill writes) — never for a talking presenter. If a request implies a spokesperson explaining the product, say explicitly that this needs a real Florența shoot, not a generated one, and scope the AI prompt to the non-speaking parts only.

## Real-footage compositing note

Not part of the AI-generation prompt itself, but binding once a generated clip is combined with real screen captures or real footage (per `credit-republic-video-workflow.md`): any real bank name or logo visible in a captured comparison screen must be blurred or reframed out — never left identifiable, even though a text comparison is fine. Blur the whole card on scrolling content, not just a fixed-coordinate strip.

## Identity anchor substitute

Credit Republic has no single hero physical product, so Law 2 ("identity anchor") maps differently: use a persistent brand motif as the anchor instead of a product feature — most often the progress-pill/result-confirmation chip described in the beat sheet, or the credit republic mark itself (`social-creator/assets/cr_semn_light.svg` / `cr_semn_dark.svg` / `cr_semn_mono.svg`) as a small static corner bug. Name whichever one you use explicitly as "the identity anchor" in the CONSISTENCY block, same as the base skill requires.

## Non-IP block, adjusted

Skip the Higgs* naming convention — the product is real (`credit republic`), not invented, so the NON-IP block should instead state what real fintech/neobank trade dress the design does NOT copy (e.g., not reproducing N26's specific card geometry or iconography), plus the standard no-real-bank-logos / no-real-people-other-than-Florența / no-OS-chrome rules.

## Closing QA (restate before handing off the prompt)

- `credit republic` lowercase, nowhere capitalized
- no bank count anywhere, only "toate băncile"
- no DAE, no superlatives
- `#2C86F6` used at most once, only at the confirmed-result beat
- headlines Omnes / body Helvetica Neue (or Helvetica Neue fallback throughout)
- accent copy in pills, never free-floating
- no AI avatar / no synthetic narration
