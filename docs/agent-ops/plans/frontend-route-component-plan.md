# Frontend Route and Component Plan

## Existing live routes confirmed

- `/`
- `/signin`
- `/runes`
- `/flashcards`
- `/study`
- `/quiz`
- `/tools/draw`
- `/tools/transliterate`
- `/ritual`
- `/stones`
- `/lore`
- `/progress`
- `/stats`

## Safe bind-rune expansion plan

### Phase 1
Add:
- `/bindrunes`
- `/bindrunes/types`
- `/bindrunes/builder`

Keep `/stones` untouched for the first merge.

### Phase 2
After testing and content verification:
- decide whether `/stones` becomes:
  - a redirect to `/bindrunes`
  - a legacy page with a CTA to bindrunes
  - a renamed component using the same route temporarily

## Recommended components

- `BindRunes.jsx`
- `BindRuneTypes.jsx`
- `BindRuneBuilder.jsx`
- `BindRuneHero.jsx`
- `BindRuneTypeGallery.jsx`
- `BindRuneFAQ.jsx`
- `BindRuneExamplesGrid.jsx`
- `BindRunePreviewCanvas.jsx`
- `BindRuneComposerControls.jsx`

## Reuse opportunities

- reuse card/button primitives
- reuse current rune data model as the canonical rune lookup
- reuse transliteration logic for name-on-stave mode where possible
- reuse draw-page canvas concepts only if extracted carefully; do not couple builder to draw tool on first pass
