# Elder Futhark Ecosystem

Monorepo for the Elder Futhark line: the **Academy** learning app and the **ETL pipeline** that produces the datasets it teaches from.

**Inherits:** `core-context.md` (classHuman AI single source of truth). Business context lives in the Prompt & Agent Library's `CLASSHUMAN.md` — never copied here.

## What's in here

| Path | What it is |
|---|---|
| `apps/academy-web` | React + Vite client (`@efa/academy-web`) |
| `apps/academy-api` | Express + Mongoose API (`@efa/academy-api`) |
| `apps/etl-cli` | ETL command line (`@efa/cli`) — fetch → extract → transform → validate → publish |
| `packages/config` | Env + source-registry loading, host allowlist |
| `packages/fetcher` | Policy-controlled HTTP (undici) |
| `packages/extractors` | Source-specific HTML extraction (cheerio) |
| `packages/transformers` | Canonical normalisation, merge, provenance, quality scoring |
| `packages/schemas` | Zod schemas for records and published datasets |
| `packages/storage` | Snapshot and dataset writing |
| `packages/shared` | Shared logging (pino) |
| `packages/bindrunes-data` | Curated bind-rune reference datasets |
| `data/` | ETL run artifacts and published JSON |
| `docs/` | ADRs, plans, ETL docs, agent-ops specs, use cases |
| `infra/` | Render blueprint (currently disabled — see Known gaps) |

The ETL **produces** the JSON the Academy **consumes**. That hand-off used to be a manual copy between two repos; one repo is the point.

## Prerequisites

- Node **>= 22** (developed on 24.19.0)
- pnpm **10.8.1**, pinned via `packageManager`

If `pnpm` is not on your PATH, enable the corepack shims once:

```bash
corepack enable --install-directory "$APPDATA/npm" pnpm
```

`corepack enable` on its own writes to `C:\Program Files\nodejs` and needs an elevated shell; the command above installs into your existing npm global directory instead.

## Quick start

```bash
pnpm install
```

Then configure the two app environments:

```bash
cp apps/academy-api/.env.example apps/academy-api/.env
cp apps/academy-web/.env.example apps/academy-web/.env
```

Fill in `MONGODB_URI` and `JWT_SECRET` in `apps/academy-api/.env`. Both are asserted at boot — the API refuses to start without them.

## Commands

Run from the repo root.

| Task | Command |
|---|---|
| Install | `pnpm install` |
| Build everything | `pnpm build` |
| Test everything | `pnpm test` |
| Typecheck everything | `pnpm typecheck` |
| Lint | `pnpm lint` — **see Known gaps** |
| Format | `pnpm format` |
| Run the API | `pnpm dev:api` (http://localhost:4000) |
| Run the web client | `pnpm dev:web` (http://localhost:5173) |
| Seed runes into Mongo | `pnpm seed:api` |
| ETL CLI | `pnpm cli <command>` — e.g. `pnpm cli doctor` |
| ETL dev loop | `pnpm dev:etl` |

The web client proxies `/api` to `http://localhost:4000` in dev, so start the API first.

## Verified state

Last full gate run on Windows 11, Node 24.19.0, pnpm 10.8.1:

- `pnpm build` — 11/11 projects pass
- `pnpm test` — all suites pass (39 tests)
- `pnpm typecheck` — 11/11 projects pass
- `pnpm cli doctor` — passes; resolves all 39 registry sources from the new root
- `apps/academy-api` — full module graph loads; boots to the expected env assertion

## Known gaps

Recorded honestly rather than papered over.

1. **`pnpm lint` does not lint.** Every package's lint script is `echo <name> lint placeholder`. The root `eslint.config.js` has no TypeScript parser, so real ESLint cannot parse a single `.ts` file. Fixing it needs `typescript-eslint` added and the resulting findings worked through — a deliberate follow-up, not a silent dependency addition.
2. **The Academy has no tests.** `apps/academy-web` and `apps/academy-api` contribute nothing to `pnpm test`. All 39 passing tests come from the ETL side.
3. **`infra/render.blueprint.disabled.yaml` is stale.** It still points at `rootDir: server` and `rootDir: client`, which no longer exist. It must be repointed at `apps/academy-api` / `apps/academy-web` before it is re-enabled.
4. **Client bundle is 1,285 kB** (over Vite's 500 kB warning). Pre-existing; wants code-splitting.
5. **Accessibility is unassessed.** No audit has been run against the Academy UI.

## Provenance

This monorepo was assembled on 2026-08-25 from four separate units: `elder-futhark-academy`, `elder-futhark-etl`, `einarr_bindrunes_package` and `elder-futhark-final-agent-package`. Those directories have been removed; their contents live here now.

Both source repositories' full histories are preserved in this repo — `git blame` on a moved file still attributes lines to the original commits. `MenokoOG/elder-futhark-academy` and `MenokoOG/elder-futhark-etl` remain untouched on GitHub as the rollback path.

## License

MIT — see `LICENSE`.

---
LAHA — Love All Humans Always.
