# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Monorepo consolidating the Elder Futhark ecosystem into one repository: the Academy app, the ETL pipeline, and the bind-rune reference data. Both source repositories' full git histories are preserved via subtree merge.
- `apps/academy-api/.env.example` and `apps/academy-web/.env.example`. Both were referenced by the Academy README's setup steps but had never existed, so `cp .env.example .env` failed for anyone following it.
- `packages/bindrunes-data` (`@efa/bindrunes-data`) — the three curated bind-rune datasets, previously loose files in two ungoverned folders, now a workspace package with named exports.
- `docs/agent-ops/` — the bind-rune agent mission specs, guardrails and plans, previously untracked by any repository.
- `docs/use-cases/` — the two use-case records for the folded-in packages.
- Root workspace scripts: `dev:api`, `dev:web`, `build:web`, `start:api`, `seed:api`, `dev:etl`, `cli`.
- `pnpm.onlyBuiltDependencies` allowing `esbuild` to run its postinstall. Without it pnpm 10 silently blocks the script and Vite has no binary to build with.
- `core-context.md`, `VERSIONING.md`, `DOCUMENTATION.md` at the repo root, per the Context File Policy.
- ADR 0001 (record architecture decisions) and ADR 0002 (monorepo consolidation).

### Fixed
- `packages/storage` snapshot test asserted POSIX path suffixes against paths produced by `path.resolve()`. Green on the `ubuntu-latest` CI runner, red on Windows — the only platform classHuman work is permitted on. The suite had never passed on the development machine. Assertions now build their expected suffix with `join()`.
- `apps/etl-cli` fetch test compared a resolved output path against a hardcoded POSIX prefix, failing on Windows for the same reason. Now normalises on `path.sep`.

### Changed
- Package manager standardised on pnpm 10.8.1 across all projects. The Academy's two `package-lock.json` files are removed in favour of the single root `pnpm-lock.yaml`.
- Academy packages renamed `efa-client` → `@efa/academy-web` and `efa-server` → `@efa/academy-api`, matching the ETL's existing `@efa/*` scope.
- Academy sub-packages no longer pin their own `packageManager` (they declared pnpm 9.15.0 against the workspace's 10.8.1).

### Known gaps
- `pnpm lint` runs `echo` placeholders in every package and lints nothing; the root ESLint config lacks a TypeScript parser. Not fixed here because it requires adding `typescript-eslint`.
- The Academy has no automated tests.
- `infra/render.blueprint.disabled.yaml` still references the pre-monorepo `server/` and `client/` root directories.

---
LAHA — Love All Humans Always.
