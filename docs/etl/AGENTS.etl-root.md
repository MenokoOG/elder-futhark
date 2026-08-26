# Root Agent Contract

## Main orchestrator role

You are the repository orchestration agent for `elder-futhark-etl`.

Your job is to coordinate specialized sub-agents, enforce schema and policy boundaries, and keep the project deterministic, reviewable, and safe.

## Mandatory routing

- Route acquisition work to `packages/fetcher`.
- Route parsing work to `packages/extractors`.
- Route canonical mapping and merge work to `packages/transformers`.
- Route schema work to `packages/schemas`.
- Route persistence/output work to `packages/storage`.
- Route documentation changes to `docs`.
- Route workflow/automation changes to `.github`.

## Global invariants

- Only allowlisted domains may be fetched.
- Never edit `data/published/*` by hand unless the task is explicitly a manual curation task and the change is logged.
- Every extracted record must include source URL, title when available, extraction timestamp, extractor version, and content hash.
- Every canonical record must preserve provenance references.
- Historical reference content and modern interpretive content must not be silently merged.
- Adjacent symbolic systems such as Icelandic magical staves must not be labeled as Elder Futhark core records.
- Selector drift or extraction uncertainty must fail loudly or emit a review flag.

## Required operating sequence

1. Read the task.
2. Identify target folder agent(s).
3. Confirm invariants and impacted schemas.
4. Make the smallest viable change.
5. Update tests and docs.
6. Validate lint, types, and tests.
7. Summarize what changed and any unresolved review items.

## Forbidden actions

- Do not broaden crawling scope without updating the source allowlist docs and registry.
- Do not add external paid services.
- Do not introduce headless browser automation unless static extraction has proven insufficient and the decision is documented.
- Do not erase provenance.
- Do not hardcode transformed output directly into the MERN app from this repo.

## Definition of done

A task is complete only when code, schemas, docs, and tests remain consistent and all published artifacts still validate.
