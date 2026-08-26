# 2. Consolidate the Elder Futhark ecosystem into a monorepo

Date: 2026-08-25

## Status

Accepted

## Context

The Elder Futhark line was spread across four directories with no shared tooling:

- `elder-futhark-academy` — a MERN app in its own repository, deployed to Render as two services.
- `elder-futhark-etl` — a pnpm workspace in its own repository, producing the JSON datasets the Academy serves.
- `einarr_bindrunes_package` and `elder-futhark-final-agent-package` — datasets and agent specifications tracked by no repository at all.

Three problems followed from the split:

1. **The dataset hand-off was a manual copy.** The ETL's whole purpose is to produce the JSON that lands in the Academy's `src/data/`. Across two repositories that transfer had no mechanical link and no version relationship.
2. **Tooling had already drifted.** The Academy's documentation specified pnpm while the working tree was npm-installed, and its sub-packages pinned pnpm 9.15.0 against the ETL's 10.8.1.
3. **Two of the four units were not version-controlled**, contradicting the standing rule that anything worth keeping is a file in a repo.

## Decision

Consolidate all four into one pnpm workspace, using the ETL as the structural base because it was already a workspace with an established `@efa/*` scope.

Both source repositories are brought in with `git subtree add` so their complete histories become ancestors of the monorepo, then flattened into `apps/` and `packages/` with `git mv` so rename detection preserves blame.

The two untracked packages are folded in as `packages/bindrunes-data` (the datasets) and `docs/agent-ops` (the specifications).

pnpm 10.8.1 becomes the single package manager; the Academy's npm lockfiles are dropped for the root `pnpm-lock.yaml`.

## Alternatives considered

**npm workspaces.** Rejected: it would require rewriting the ETL's seven `workspace:*` protocol dependencies and regenerating its lockfile, producing more churn for a package manager none of the project's documentation asks for.

**Leaving the repositories separate and linking via a published package.** Rejected: publishing and consuming a dataset package between two private repositories is more machinery than a one-engineer project can justify, and it does not solve the untracked packages.

**Starting the monorepo with a fresh history.** Rejected by the repository owner in favour of preserving both histories.

## Consequences

- One `pnpm install`, one lockfile, one set of gates across the whole ecosystem.
- Blame and log survive for both original codebases; `MenokoOG/elder-futhark-academy` and `MenokoOG/elder-futhark-etl` stay on GitHub untouched as the rollback path.
- The Render blueprint's `rootDir` values are now stale and must be repointed before it is re-enabled.
- CI's single `ubuntu-latest` runner now covers a codebase that must work on Windows. Two tests were already failing on Windows while passing in CI; a Windows matrix entry would have caught them and is recommended.
- The four source directories remain on disk, gitignored, until the owner removes them — one of them holds a live `.env` that only he may move.

---
LAHA — Love All Humans Always.
