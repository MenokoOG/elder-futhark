# Data Flow

Known source URLs in `SOURCE_REGISTRY.json` -> static HTTP fetch (allowlisted only) -> raw snapshots in `data/raw` -> extracted records -> canonical records -> quality review -> published datasets.

Fetch stage outputs for each source id:

- `data/raw/<source-id>.raw.txt`
- `data/raw/<source-id>.metadata.json`

Raw snapshot metadata preserves provenance fields from stage 1:

- `sourceId`
- `classification`
- `url`
- `fetchedAt`
- `contentHash`
- `statusCode`

Extract stage outputs per source id:

- `data/extracted/<source-id>.records.json`

Transform stage outputs:

- `data/normalized/runes.json`
- `data/normalized/deities.json`
- `data/normalized/worlds.json`
- `data/normalized/practices.records.json`
- `data/normalized/adjacent-systems.records.json`

Build-dataset stage outputs:

- `data/published/dataset.json`
- `data/published/runes.json`
- `data/published/deities.json`
- `data/published/worlds.json`
- `data/published/metadata.json`
