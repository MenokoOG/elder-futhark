# Backend JSON Schema Recommendation

## Objective

Add bind-rune support without breaking the existing compact Elder Futhark dataset.

The current live rune objects are compact and optimized for learning tools:
- `key`
- `glyph`
- `name`
- `phonetic`
- `meaning`
- `aett`
- `notes`

Keep that model intact for current rune features.

Add a new bind-rune schema beside it.

---

## Recommended `BindRuneRecord`

```json
{
  "id": "protection",
  "slug": "protection",
  "name": "Protection",
  "type": "stacked",
  "summary": "Protective bindrune example combining defense-oriented runes.",
  "componentRunes": ["algiz", "thurisaz", "uruz"],
  "intentTags": ["protection", "strength", "defence"],
  "historicalFraming": "modern_interpretation",
  "description": "Short educational explanation for learners.",
  "builderPreset": "stacked_axis_basic",
  "notes": [
    "Use as educational example",
    "Component runes should map to canonical Elder Futhark records"
  ],
  "provenance": {
    "sourceIds": ["northern_black_faq"],
    "sourceUrls": ["https://northernblack.shop/en-us/blogs/news/runes-sigils-and-bindrunes-faqs"]
  }
}
```

---

## Recommended `BindRuneTypeRecord`

```json
{
  "id": "stacked",
  "name": "Stacked Bindrunes",
  "description": "Runes sharing a central axis or main stave.",
  "builderMode": "shared_axis_overlay",
  "historicalNote": "Compression-style form, useful for compact composition."
}
```

---

## Recommended `BindRuneBuilderPreset`

```json
{
  "id": "stacked_axis_basic",
  "label": "Stacked Axis",
  "type": "stacked",
  "defaultOptions": {
    "flip": false,
    "mirror": false,
    "overlap": 0.55,
    "rotation": 0
  }
}
```

---

## Recommended endpoints

- `GET /bindrunes`
- `GET /bindrunes/types`
- `GET /bindrunes/presets`
- `GET /bindrunes/:slug`
- `POST /bindrunes/compose/preview` (optional, computed preview payload only)
- `POST /bindrunes/custom` (optional, authenticated save for user-created bindrunes)

Do not remove existing rune endpoints while adding these.
