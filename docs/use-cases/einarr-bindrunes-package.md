# Einarr Bindrunes Package — Use Case

**One-liner:** A focused data-and-spec package pairing a curated bind-rune JSON dataset with an AGENTS.md addendum that governs how the bind-rune workstream integrates into Elder Futhark Academy.
**Status:** Active development
**Stack:** JSON reference dataset, Markdown agent-spec addendum

## Problem
The bind-rune feature for Elder Futhark Academy needed a single authoritative reference source — taxonomy, FAQ content, historical framing, and builder-mode design — plus explicit rules for how an AI agent may use it. Without that, the agent could copy third-party artwork, overwrite canonical rune data, or blur modern interpretation with historical fact.

## What I Built
This package holds the einarrs_journey_bindrunes_dataset.json reference dataset and an addendum to the main AGENTS.md that sets source priority (this dataset for bind-rune content, the existing Elder Futhark dataset as canonical for base runes), a graphics guardrail (original art only; inspiration documented internally, never copied), and a safe migration rule for the live /stones route (build /bindrunes first, test, then decide). It also specifies the three required builder composition modes — stacked, same-stave, and radial/sigil-style — each with deterministic controls and a reset action, plus completion gates covering mobile, regressions, and auth-protected routes.

## Skills Demonstrated
Dataset curation, AI-agent instruction design, intellectual-property guardrails, incremental migration planning, product-spec writing for interactive tools

## Outcome / Evidence
A small, honest package: one curated dataset plus one governing spec. It exists to be consumed by the larger elder-futhark agent workflow rather than to run on its own, and it demonstrates that I treat data sources and usage rights as first-class engineering concerns.

## Interview Talking Points
- I wrote explicit IP guardrails into the agent spec — take composition and mood as inspiration, never copy artwork — which is the kind of judgment AI-assisted teams currently lack.
- The /stones-to-/bindrunes migration rule (build new alongside old, test, then decide) is a textbook strangler-fig migration expressed in three sentences.
- Requiring deterministic builder controls instead of an opaque random generator shows product thinking about user agency.

---
LAHA — Love All Humans Always.
