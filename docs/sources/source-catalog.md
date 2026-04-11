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
