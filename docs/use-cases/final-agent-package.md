# Elder Futhark Final Agent Package — Use Case

**One-liner:** A complete agent-operations package — mission spec, guardrails, phased work order, plans, and reference datasets — that directs an AI coding agent to safely extend the Elder Futhark Academy app with bind-rune features.
**Status:** Active development
**Stack:** Markdown agent specs (AGENTS.md), JSON reference datasets, structured agents/ directories (tasks, guardrails, memory, security, skills), migration and visual-direction plans

## Problem
Letting an AI coding agent loose on a working production codebase risks destructive rewrites, broken routes, and invented facts. I needed a way to add bind-rune support, theming, and a mobile draw fix to Elder Futhark Academy without losing working behavior. This package is my answer: engineering the *instructions* with the same rigor as the code.

## What I Built
I wrote a mission-scoped AGENTS.md with non-negotiable rules (no deletions without approval, additive changes preferred, no invented historical certainty, no unlicensed third-party graphics) and a phased work order that forces the agent to learn the repo and write memory files (repo-map, data-diff) before any code change. The package includes merged bind-rune reference datasets (bindrunes.merged.reference.json plus a source dataset), a documented backend schema, plans for stones-route migration, frontend route/component structure, theme visual direction, and mobile draw fixes, and an agents/ tree separating tasks, guardrails, memory, security, and skills. Completion gates require build, tests, and manual verification — including that all existing routes still work.

## Skills Demonstrated
AI-agent orchestration and guardrail design, technical specification writing, phased migration planning, data-integration strategy, risk management for AI-assisted development, content-provenance discipline

## Outcome / Evidence
A complete, internally consistent operations package — specs, plans, datasets, and completion gates — that drives the bind-rune workstream in Elder Futhark Academy. It is documentation-and-data rather than executable code, and that is the point: the deliverable is a safely steerable agent workflow.

## Interview Talking Points
- This is applied AI engineering from the operator side: I designed the constraint system that makes an AI coding agent productive without letting it break a live app.
- The "learn before you touch" phase — mandatory repo-map and data-diff memory files before any code change — mirrors how a senior engineer onboards to an unfamiliar codebase.
- Completion gates are behavioral (routes render, mobile works, auth intact), not just "tests pass" — I defined done in user terms.

---
LAHA — Love All Humans Always.
