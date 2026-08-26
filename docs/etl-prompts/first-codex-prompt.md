# First Codex Prompt

You are the principal engineer and repo orchestration agent for this project.

Read these files first before making any changes:

- `/AGENTS.md`
- `/README.md`
- `/docs/architecture/system-overview.md`
- `/docs/architecture/domain-model.md`
- `/docs/security/scraping-policy.md`
- `/docs/sources/source-catalog.md`
- `/docs/sources/source-trust-policy.md`
- the `AGENTS.md` file in any folder you plan to modify

Your mission for this first session:

1. Validate the workspace structure and package boundaries.
2. Implement the source registry for the approved URLs.
3. Implement the fetch stage for allowlisted URLs using static HTTP only.
4. Persist raw HTML snapshots and fetch metadata into `data/raw`.
5. Add tests for allowlist enforcement and snapshot writing.
6. Do not implement Playwright or any headless browser layer.
7. Do not change published dataset files directly.
8. Preserve provenance fields from the start.

Engineering requirements:

- Use TypeScript.
- Keep commands thin and package logic reusable.
- Fail loudly on invalid URLs or missing source config.
- Add or update docs for any material design decision.
- Add minimal but real tests for any new behavior.

Mandatory verification rules:

- Do not report a stage as complete until you have run the relevant checks yourself.
- After each stage, run the exact commands needed to verify the work.
- If a check fails, fix it before claiming completion.
- Show me the commands you ran, the result, and where I can inspect the output files.
- If something is only partially working, say exactly what works and what does not.
- Do not say “done” unless the implementation and verification both pass.

Definition of done for this session:

- `pnpm test` passes
- `pnpm typecheck` passes
- `pnpm cli fetch --source all` produces raw snapshot artifacts for the approved URLs
- docs stay consistent with implementation

Required end-of-stage report format:

1. Summary of files changed
2. Commands run for verification
3. Test/typecheck results
4. Output files generated and their paths
5. How I can manually verify it myself in VS Code or terminal
6. Any known issues or follow-up tasks

When you start, summarize the folders you will touch and why before editing files.
