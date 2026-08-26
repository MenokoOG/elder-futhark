# AGENTS.md Addendum — Einarr's Journey Bindrunes Integration

This addendum extends the main `AGENTS.md` for the bind-rune workstream.

## Source priority

Use `einarrs_journey_bindrunes_dataset.json` as the primary bind-rune reference source for:
- bind-rune taxonomy
- FAQ content
- historical framing notes
- builder mode design
- visual direction notes

Use the existing Elder Futhark rune dataset as the canonical source for the app's base rune objects unless a deliberate migration is approved.

## Graphics guardrail

The Einarr's Journey page is useful for:
- composition patterns
- mood
- spacing
- contrast treatment
- visual hierarchy

Do not copy site artwork directly into production assets unless usage rights are explicitly cleared.
Instead:
- create original backgrounds
- create original rune cards
- create original bind-rune preview illustrations
- document inspiration sources in internal notes, not shipped UI copy

## Implementation rule for Stones replacement

Because the current repo already has a working `/stones` route:
1. do not delete it blindly
2. first create `/bindrunes`
3. wire bind-rune components and builder
4. test navigation and regressions
5. only then decide whether `/stones` redirects, is renamed, or remains as legacy content

## Builder modes required

The builder must support three first-class composition modes:
- stacked
- same stave
- radial / sigil-style

Each mode must expose deterministic controls and a reset action.
Do not ship an opaque or random generator as the only build method.

## Content requirements

At minimum, implement:
- bind-rune landing page
- three type cards with descriptions
- FAQ block
- builder page with three presets
- provenance note or "modern interpretation" note where appropriate

## Completion gate additions

Bind-rune work is complete only when:
- the bind-runes route renders without runtime errors
- the builder works on mobile and desktop
- the old rune-learning routes still work
- the current draw tool still works after theme and nav changes
- no current auth-protected routes are broken
