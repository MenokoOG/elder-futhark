# Source Catalog

Approved domains are limited to:

- `norse-mythology.org`
- `andreashelley.com`

Runtime source configuration is loaded from `SOURCE_REGISTRY.json` at repository root.
Registry loading fails loudly when any entry is invalid.

Each source entry must define:

- `id`: stable source key used by CLI selection and raw snapshot file naming
- `url`: full allowlisted URL for static HTTP fetch
- `classification`: one of `reference_like`, `practical_guide`, `modern_interpretation`, `adjacent_symbolic_system`

Validation rules enforced at load time:

- `id` must match `^[a-z0-9-]+$`
- `url` must use `http` or `https`
- `url` host must be in the approved domain allowlist
- duplicate source ids are rejected

`SOURCE_REGISTRY.example.json` remains the template reference and should mirror the approved source set.

Subpage coverage requirement:

- For `norse-gods`, `norse-worlds`, and `norse-runes`, extraction expects pertinent topic subpages to be registered explicitly.
- `pnpm cli extract --source all` fails loudly if key same-topic subpages are discovered in the raw source pages but missing from the registry.
- When this happens, add the missing URLs to `SOURCE_REGISTRY.json`, mirror them in `SOURCE_REGISTRY.example.json`, and update this source catalog.

## Runtime Registry Fetch Flow

`pnpm cli fetch --source all` performs this sequence:

1. Resolve `SOURCE_REGISTRY.json` from the current directory or a parent directory.
2. Load and validate every source entry (id format, protocol, allowlisted host, unique ids).
3. Fetch each source URL using static HTTP with the configured user agent and delay.
4. Persist raw artifacts under `data/raw` as:
   - `<source-id>.raw.txt`
   - `<source-id>.metadata.json`

`pnpm cli fetch --source <source-id>` runs the same flow for one registry entry and fails loudly if the source id is unknown.
