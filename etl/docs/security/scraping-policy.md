# Scraping Policy

Only fetch allowlisted domains and approved paths. Keep concurrency low.

## Acceptable Use

- Respect robots directives, source terms, and rate limits.
- Do not broaden crawling scope without updating the source allowlist docs and registry.
- Do not fetch authenticated, private, or paywalled content.

## Public Repository Guidance

- Keep raw snapshots (`data/raw/*.raw.txt`, `data/raw/*.metadata.json`) out of version control by default.
- Treat source-derived content as externally owned material; keep provenance fields intact.
- Publish only vetted transformed artifacts after `validate`, `review`, and `diff` checks.
