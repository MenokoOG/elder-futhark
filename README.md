# Elder Futhark ETL

A provenance-aware, source-allowlisted ETL pipeline for building structured JSON datasets for the Elder Futhark Academy application.

## Objectives

- Fetch content only from approved source URLs.
- Extract structured rune, deity, cosmology, and practice records.
- Preserve provenance and confidence for every transformed field.
- Publish versioned JSON datasets for downstream use in a MERN application.
- Support agentic development in VS Code / Codex with explicit folder-level guardrails.

## Approved initial sources

- [https://norse-mythology.org/gods-and-creatures/](https://norse-mythology.org/gods-and-creatures/)
- [https://norse-mythology.org/cosmology/the-nine-worlds/](https://norse-mythology.org/cosmology/the-nine-worlds/)
- [https://norse-mythology.org/runes/the-meanings-of-the-runes/](https://norse-mythology.org/runes/the-meanings-of-the-runes/)
- [https://andreashelley.com/blog/rune-casting-guide-how-to-read-the-runes/](https://andreashelley.com/blog/rune-casting-guide-how-to-read-the-runes/)
- [https://andreashelley.com/blog/futhark-runes-symbols-and-meanings/](https://andreashelley.com/blog/futhark-runes-symbols-and-meanings/)
- [https://andreashelley.com/blog/what-are-bindrunes-and-how-to-make-your-own/](https://andreashelley.com/blog/what-are-bindrunes-and-how-to-make-your-own/)
- [https://andreashelley.com/blog/icelandic-magic-staves/](https://andreashelley.com/blog/icelandic-magic-staves/)

## Principles

1. Deterministic extraction before cleverness.
2. Preserve provenance; never flatten conflicting interpretations into a single unqualified field.
3. Separate Elder Futhark core data from adjacent symbolic systems.
4. Fail loudly on selector drift.
5. Published JSON is an artifact, not handwritten source-of-truth content.

## Workspace layout

- `apps/cli`: CLI entrypoint for fetch/extract/transform/build/validate.
- `packages/fetcher`: low-level HTTP + policy controls.
- `packages/extractors`: source-specific HTML extractors.
- `packages/transformers`: canonical normalization and merge logic.
- `packages/schemas`: Zod schemas for records and published datasets.
- `packages/storage`: snapshot and dataset writing.
- `data/`: run artifacts and published JSON outputs.
- `docs/`: architecture, security, standards, and tasks.

## Quick start

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
pnpm cli doctor
pnpm cli fetch --source all
pnpm cli extract --source all
pnpm cli transform
pnpm cli validate
pnpm cli review
pnpm cli build-dataset
pnpm cli diff
pnpm cli run --source all
pnpm cli preview --port 4173
```

## Notes

- Start without Playwright.
- Use static fetch + Cheerio first.
- Add SQLite staging only if raw JSON artifacts become too unwieldy.
- Use `pnpm cli preview` for a local read-only browser view of generated `data/*` artifacts.
- Use `pnpm cli review` to run provenance and classification boundary checks on normalized artifacts.
- Use `pnpm cli diff` to compare `data/normalized` and `data/published` canonical records before shipping.

## Operator Quality Gate

Use this sequence before accepting new published artifacts:

```bash
pnpm cli run --source all
pnpm cli diff
pnpm cli preview --port 4280
```

Example `review` stage output shape:

```text
review: canonical runes=24 deities=12 worlds=9 practices=3 adjacent=2
review: classifications reference_like=28 practical_guide=4 modern_interpretation=3 adjacent_symbolic_system=2
```

Interpretation guide:

- unexpected drops in canonical counts should be treated as potential extraction drift
- classification totals should remain plausible for the current source registry
- if `pnpm cli diff` reports unexplained removals, pause publishing and investigate
