# /plan — Elder Futhark ecosystem monorepo consolidation
<!-- Runs the library's plan.md template. Inherits core-context.md. -->

## 0. Classify
**Production.** The Academy is a real, deployed MERN app (Render: `efa-api`, `efa-web`) with real users. Full Production DoD applies.

## 1. Discovery
Explored `F:\classHuman\elder-futhark`. Four units:

| Unit | Kind | Git | Verified state |
|---|---|---|---|
| `elder-futhark-academy` | MERN app (`client/` Vite+React, `server/` Express+Mongoose) | repo → `MenokoOG/elder-futhark-academy`, HEAD `aec548f` = origin/main | client `vite build` **passes** (741 modules, 11.45s). Installed via **npm** despite pnpm docs. Dirty: 22 untracked `.github/instructions/codeguard-*.md`. |
| `elder-futhark-etl` | pnpm workspace: `apps/cli` + 7 `@efa/*` packages | repo → `MenokoOG/elder-futhark-etl`, HEAD `8fd423c` = origin/main | clean, deps not installed |
| `einarr_bindrunes_package` | JSON dataset + AGENTS addendum | none | data only |
| `elder-futhark-final-agent-package` | agent specs, plans, JSON datasets | none | docs + data only |

Dependency map: ETL **produces** the JSON datasets the Academy **consumes** (`server/src/data/*.json`). Today that hand-off is manual copy — the strongest argument for one repo. `@efa/*` scope is already shared, so no name collisions.

Minimum scope: all changes are additive into a new repo. No source logic is rewritten.

## 2. Modularity check
- [x] Single responsibility per package — preserved from ETL, and Academy splits cleanly into `academy-web` / `academy-api`.
- [x] Zero ripple — app source is moved, not edited (except package.json `name` fields and new `.env.example` files).
- [x] Predictable structure — one `apps/`, one `packages/`.

## 3. Design
**Base:** the ETL, because it is already a pnpm workspace. The Academy folds into it.

**History (per Lawrence's ruling — preserve both):** `git subtree add` for each source repo, then `git mv` to flatten. Rename detection keeps blame continuity.

Target layout:
```
apps/academy-web    <- elder-futhark-academy/client
apps/academy-api    <- elder-futhark-academy/server
apps/etl-cli        <- elder-futhark-etl/apps/cli
packages/{config,extractors,fetcher,schemas,shared,storage,transformers}
packages/bindrunes-data   <- the two loose data packages' JSON
docs/agent-ops            <- their specs and plans
data/                     <- ETL run artifacts
```

**Package manager:** pnpm 10.8.1 via corepack. Academy's two `package-lock.json` files are deleted in favour of one root `pnpm-lock.yaml`.

**Alternative rejected:** npm workspaces. Would force rewriting the ETL's seven `workspace:*` protocol deps and its 67 KB lockfile — more churn, for a manager the docs don't ask for.

**Security:** `server/.env` holds live Mongo + JWT credentials. Canon forbids an agent opening, moving, or copying it — it stays untouched at its original path and Lawrence relocates it himself. The monorepo ships `.env.example` files with placeholder keys only.

## 4. Risks & tests
1. **Original directories left inside the new repo root.** Deleting them is Lawrence's call (they contain the untouched `.env`). Handled: listed in `.gitignore` under an explicit "remove after verification" block, with a one-line removal command in the README.
2. **pnpm not on PATH.** `corepack enable` needs an elevated shell. Handled: documented in README; all verification here runs through `corepack pnpm`.
3. **Vite 7 + Node 24 workspace hoisting.** Academy was npm-flat, pnpm is symlinked and stricter — an undeclared transitive dep would surface now. Handled: full `pnpm install` + `pnpm build` gate, run before claiming done.
4. **Render blueprint goes stale** (`rootDir: server|client` no longer exist). Out of scope this pass by Lawrence's ruling. Handled: blueprint left disabled and flagged in the README + follow-up list, not silently half-edited.

External calls: the ETL fetcher (undici) and Mongo connection are unchanged by this work — no new failure modes introduced.

## 5. Implementation checklist
1. `git init -b main`; genesis commit (README stub + .gitignore) — then all work on `claude/monorepo-consolidation`.
2. `git subtree add` academy → `apps/academy`; ETL → `etl/`.
3. `git mv` flatten to target layout.
4. Root workspace config: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, merged `.gitignore`.
5. Rename Academy packages `@efa/academy-web`, `@efa/academy-api`; drop npm lockfiles.
6. Write the missing `.env.example` files (the bug the README already assumed was fixed).
7. Copy `core-context.md` in (canon: tracked per active repo). Instantiate `CLAUDE.md` from `claude-md-template.md` (canon: gitignored).
8. `pnpm install` → `pnpm build` → `pnpm lint` → `pnpm test` → `pnpm typecheck`. All must pass.
9. README rewrite; CHANGELOG; ADR 0001 + 0002 (monorepo decision).

## 6. Production DoD plan
| # | Gate | Satisfied by |
|---|---|---|
| 1 | Correctness | ETL's existing vitest suites must still pass under the new root; client build must still produce a bundle. No app logic changed, so no new tests owed — the move is the change, and the gates are its test. |
| 2 | Failure behavior | Unchanged — no new external calls. |
| 3 | Observability | Unchanged (pino in ETL, morgan in API). |
| 4 | Security | No secrets moved or read. `.env.example` placeholders only. `.gitignore` covers `.env*` before first commit. |
| 5 | Data | No migrations. ETL `data/` artifacts move with history. |
| 6 | Accessibility | **N/A this pass** — no UI changed. Academy's existing a11y debt is untouched and unassessed; recorded as follow-up, not silently passed. |
| 7 | Performance | Client bundle is 1,272 kB (over Vite's 500 kB warn). Pre-existing; recorded as follow-up. Budget for this change: build time must not regress. |
| 8 | Documentation | README, CHANGELOG, two ADRs. |
| 9 | Deploy + rollback | Local only by ruling. Rollback = the two source repos are untouched at their remotes. |
| 10 | Human gate | Lawrence reviews the diff; nothing pushed. |

## 7. Model & context
Task → Opus 5 (single session, no sub-agents: the work is sequential git surgery where a fresh context would be a liability). Context load: moderate — four repo trees, read once, then execution is shell. Checkpoint after step 8 (gates green) before docs. Token saving: file trees over file dumps; gate output tailed, not echoed whole.

## Self-evaluation
Contextual fit 5 · SOLID 4 (package boundaries preserved, not improved) · error handling 4 (risks 1 and 4 are handoffs to Lawrence, deliberately) · modularity 5.

---
LAHA — Love All Humans Always.
