# AGENTS.md

## Mission

This repository powers Elder Futhark Academy. The agent must learn the repository before changing it, preserve working behavior, and extend the app safely.

Primary goals:
- review the repository to understand the current application
- scan and compare current data with new data
- add bind-rune support safely
- improve the app appearance with light/dark themes and original graphics
- fix the mobile drawing issue on the rune draw page
- keep the app stable

---

## Non-negotiable rules

1. Do not delete existing logic without explicit explanation and approval.
2. Do not mark a task complete until build, tests, and manual verification are done.
3. Prefer additive changes over destructive rewrites.
4. Preserve current rune-learning behavior unless a replacement is explicitly approved.
5. Do not copy third-party graphics directly into production assets without rights review.
6. Do not invent historical certainty where the source is modern or interpretive.
7. Document all meaningful decisions in the agents memory files.

---

## Repository-specific facts already confirmed

### Frontend routes
The router currently exposes:
- `/`
- `/signin`
- `/runes`
- `/flashcards`
- `/study`
- `/quiz`
- `/tools/draw`
- `/tools/transliterate`
- `/ritual`
- `/stones`
- `/lore`
- `/progress`
- `/stats`

Because `/stones` is live, do not remove it blindly.

### Current rune model
The active Elder Futhark rune records are compact and power current study tools. Preserve them.

### Draw-page architecture
The draw tool uses canvas and pointer events. A minimal mobile-safe patch is preferred before any larger rewrite.

### New data
The uploaded new-data bundle includes additional lore/reference material and should be integrated additively.

### Bind-rune source strategy
Use:
- `data/bindrunes.merged.reference.json` as the internal reference dataset
- current Elder Futhark rune data as canonical base rune data
- bind-rune records as a separate dataset and API model

---

## Required work order

### Phase 1 — learn
1. scan repo
2. update `agents/memory/repo-map.md`
3. update `agents/memory/data-diff.md`
4. identify current stones implementation
5. identify current nav implementation
6. identify theme/styling entry points
7. identify backend data/API entry points

No code changes before these notes exist.

### Phase 2 — backend
1. add bind-rune datasets
2. add bind-rune schema/loaders
3. add APIs only where needed
4. add tests
5. verify no existing rune endpoints break

### Phase 3 — frontend
1. add bind-runes landing page
2. add type gallery
3. add FAQ block
4. add builder page with first-class modes:
   - stacked
   - same stave
   - radial / sigil-style
5. keep `/stones` intact on first merge unless approval says otherwise
6. add or update tests

### Phase 4 — mobile draw fix
1. patch current canvas implementation
2. verify desktop still works
3. verify mobile/touch works
4. add regression notes

### Phase 5 — appearance
1. add light mode and dark mode
2. improve hierarchy, cards, surfaces, and spacing
3. create original graphics inspired by bind-rune visual direction
4. preserve accessibility and performance

### Phase 6 — regression pass
Task is not done until:
- build passes
- tests pass
- changed routes render
- auth still works
- draw page still works on desktop and mobile
- no existing learning route regresses

---

## Stones handling

Default path:
- add `/bindrunes` first
- test it
- only then decide whether `/stones` redirects, remains, or is repurposed

Do not hard-delete the current stones logic.

---

## Bind-rune builder requirements

The builder must:
- support deterministic composition modes
- expose reset controls
- show component rune list
- attach intent/notes metadata
- work on mobile and desktop

Do not ship only a random generator.

---

## Historical and source guardrail

Where the source is modern or interpretive:
- label it as modern interpretation
- keep historical notes separate from builder/play features
- avoid overstating certainty

---

## Required project files to keep updated

- `agents/memory/repo-map.md`
- `agents/memory/data-diff.md`
- `agents/tasks/current-task-board.md`
- `docs/change-log-agent.md`

---

## Completion gate

A task is complete only when:
- code builds
- tests pass
- affected pages/routes render
- affected APIs respond correctly
- manual verification is recorded
- no unexplained regressions remain
