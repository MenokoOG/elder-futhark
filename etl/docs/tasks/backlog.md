# Backlog

## Session Handoff (2026-04-11)

Use this checklist when restarting work:

1. Validate baseline health.
   - Run: `pnpm typecheck`
   - Run: `pnpm test`
2. Smoke test the preview dashboard.
   - Run: `pnpm cli preview --port 4280`
   - Verify category list, item list, detail panel, and search behavior.
3. Run a full pipeline pass to confirm artifact continuity.
   - Run: `pnpm cli run --source all`
4. Confirm no legacy raw snapshot extensions are reintroduced.
   - `data/raw` should contain `.raw.txt` snapshots, not `.html` files.

## Immediate Next Steps

- [x] Convert bare URLs in `README.md` to markdown links (resolve markdown lint `MD034`).
- [x] Add one integration test that exercises the preview category -> item -> detail flow end-to-end.
- [x] Add a regression test that fails if snapshot output reverts from `.raw.txt` back to `.html`.
- [x] Capture one sample `review` output in docs for operators running manual quality gates.

## Build-Complete Checklist (Before First Full Scrape Run)

- [ ] Run full pipeline: `pnpm cli run --source all`
- [ ] Run canonical comparison gate: `pnpm cli diff`
- [ ] Review preview dashboard data on `pnpm cli preview --port 4280`
- [ ] Confirm review stage classification counts look plausible for current source set
- [ ] Confirm no unexpected removals in diff summary before publishing

## Near-Term Follow-Ups

- [ ] Improve preview detail rendering for long provenance lists (truncate + expand behavior).
- [ ] Add optional filtering by source domain in preview catalog API.
- [ ] Document expected stage outputs for `fetch`, `extract`, `transform`, `validate`, `review`, and `build-dataset`.
