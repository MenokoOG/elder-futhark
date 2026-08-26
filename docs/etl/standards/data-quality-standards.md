# Data Quality Standards

Published records require validation, provenance, stable identifiers, and explicit classification.

## Manual Quality Gate

Before accepting new dataset artifacts:

1. Run `pnpm cli run --source all`.
2. Run `pnpm cli diff`.
3. Inspect preview output via `pnpm cli preview --port 4280`.

Release criteria:

- validation and review stages complete without errors
- canonical record counts remain plausible for the configured source set
- no unexplained removals in diff output
- provenance and classification fields remain present on transformed records
