# Design review — Organic redesign, Elder Futhark Academy

**Reviewed:** 2026-08-27 · **Bundle:** `design_handoff_organic_redesign` · **Status:** applied 2026-08-27 with both blockers fixed in implementation (see addendum)

The bundle is coherent, well-documented and internally consistent. The token set is complete, the graphics are genuinely data-derived rather than decorative, and the instruction to keep every `api.get`/`api.post` call unchanged is the right call. Two things block application, and one collision needs resolving before it lands.

## 1. Blocking — contrast fails WCAG AA at normal text size

The palette is warm and low-contrast by design, and several documented pairs fall below AA (4.5:1 for normal text). This repo treats accessibility-first design as a standard, not a nice-to-have, so these need resolving in the design rather than patched during implementation.

Measured against ground `#f5ead8`:

| Pair | Ratio | Needs | Where it is used |
|---|---|---|---|
| `white` on `accent-500 #d67f48` | **3.00** | 4.5 | **primary button label** — the most-used control |
| `white` on `sage-500 #8fa073` | **2.82** | 4.5 | sage button label |
| `neutral-500 #a19786` on ground | **2.42** | 4.5 | hints, placeholder text |
| `accent-500 #d67f48` on ground | **2.52** | 4.5 | accent text |
| `sage-500 #8fa073` on ground | **2.37** | 4.5 | sage accent text |
| `neutral-600 #82796a` on ground | **3.61** | 4.5 | aett label in `Runes.jsx`, set at 10.5px |
| `neutral-600` on surface `#ebddc5` | **3.21** | 4.5 | muted text on cards |
| `accent-600 #b2622d` on ground | **3.77** | 4.5 | links and emphasis |

Passing cleanly: `ink` on ground (13.95) and on surface (12.40), `neutral-700` (5.53), `accent-700` (5.72), `ink` on `accent-500` (5.53).

Two notes on the near-misses:

- `white` on `accent-600` is **4.49** — it misses AA by 0.01. Worth nudging the ramp rather than leaving it to round-off.
- The focus outline `#c67139` on ground is **3.03**, just over the 3:1 that WCAG 2.1 requires for a non-text indicator. It passes, but with no margin on a lighter surface.

**Suggested direction, for the designer to decide:** the cleanest fix is to shift button labels from `white` to `ink` on the accent and sage fills — `ink` on `accent-500` already measures 5.53 and keeps the warmth. For small muted text, moving `neutral-600` to `neutral-700` clears AA without changing the feel. These are suggestions, not decisions: the ramps are the designer's.

## 2. Blocking — no responsive coverage below ~1100px

Called out in the bundle's own known gaps: the shell assumes a desktop two-column grid, and the sidebar is a fixed 268px. The current app is usable on a phone, and this repo carries an open mobile drawing fix in `docs/agent-ops/plans/mobile-draw-fix-notes.md`, so shipping desktop-only is a regression rather than a deferral.

What is needed to land desktop and mobile together:

- A collapsing or drawer behaviour for the 268px sidebar, and what the trigger looks like
- Single-column fallback for the two-column page grid
- How `PageHeader` reflows — the rune line-geometry figure alongside kicker, title and blurb
- The Draw canvas and the Stones canvas at narrow widths, given the existing mobile fix
- Touch target sizes for the aett pill filter and the 0–5 rating row in Decks

## 3. Collision — `Runes.jsx` reverts work already on `main`

The bundle's `src/views/Runes.jsx` hardcodes:

```js
const AETTS = [["", "All"], ["1", "Aett 1"], ["2", "Aett 2"], ["3", "Aett 3"]];
```

Those bare numbers were replaced on `main` (PR #4) with the real aett names, themes and groupings, served from `@efa/futhark-aetts`. Dropping the bundle file in verbatim would revert shipped work.

Not a design problem — the redesign's pill-filter treatment is an improvement on the old dropdown. It only needs the labels sourced from the module rather than hardcoded, so the pills read **"Freyr's Aett"**, **"Hagal's Aett"**, **"Tyr's Aett"**. The implementation will merge the two; noted here so it is not lost.

## Non-blocking notes

- **Fonts load from Google Fonts** via an `@import` at the top of `src/styles.css`. That is a runtime dependency on an external host and a render-blocking import. Worth confirming it is acceptable, and preloading or self-hosting if not.
- **`tailwind.config.cjs` and `postcss.config.cjs` are already tracked** in `apps/academy-web/`. An earlier report that they were missing was mistaken — they are on `main`. The bundle legitimately replaces the Tailwind config with the Organic tokens; there is nothing to restore.
- **`GodClusters` reads `/lore/gods`**, which is the hand-maintained `gods.json` — correct. Note that `data/published/deities.json` is *not* a usable alternative: all 21 records carry `domains: ["reference_like"]`, which is the source-classification enum rather than a deity domain. That is a separate ETL defect.
- The instruction to verify `rg "zinc-" src/` comes back empty is a good gate. Current count is 149 occurrences.

## Addendum — applied 2026-08-27

Lawrence redirected: implement now, fixing the blockers in the implementation rather than a designer round trip. What changed relative to the bundle:

- **Contrast:** every documented failing pair was moved to a passing step of the same ramp. Primary buttons are ink-on-accent (5.53 at rest, 8.03 hover; pressed deepens to accent-700 with cream at 6.22). Small muted text moved `neutral-600` → `neutral-700` throughout. Placeholders `neutral-500` → `neutral-700`. Focus ring darkened to accent-600 (3.77 non-text). Quiz state borders 500 → 600.
- **Responsive:** below 1100px the sidebar becomes a top bar plus slide-in drawer (closes on navigate/Escape/backdrop, aria-expanded on the toggle). Fixed-aside views collapse to one column below 900px. Rating rows wrap; the Draw canvas is bounded by its container. All fifteen routes verified at 375px with zero horizontal overflow.
- **Aett labels:** every hardcoded `Aett 1/2/3` (Runes filter, Flashcards deck picker, Home, Progress) now reads from `@efa/futhark-aetts`.

The design's own tokens and ramps were used for every substitution — no new colors were invented.

## What happens next

Held pending items 1 and 2. When the bundle returns with contrast and responsive coverage, implementation branches from `main` — which now carries the aett work — reconciles `Runes.jsx` so the pill labels come from `@efa/futhark-aetts`, and walks the fifteen routes as the bundle's step 5 describes.

---
LAHA — Love All Humans Always.
