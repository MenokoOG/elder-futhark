# CORE-CONTEXT.md — classHuman AI Single Source of Truth
<!-- v1.7 | 2026-08-21 | The ONE standards file. Every CLAUDE.md, slash command, and agent charter references this instead of restating rules. If a rule appears anywhere else, it is a bug. -->
<!-- v1.7 changes: synced to CLASSHUMAN.md v2.4 — the canon optimization pass. This file ABSORBED canon's Engineering Standards, the "Model & Context" standing practice, and the Windows/git/paths rules; canon now points here instead of restating them. NEW: ARCHIVE.md exists at the library root for dated, closed history, and the four canon rules that keep it there are in the Context File Policy below. Build Doctrine corrected: the Ag3nt24 rebuild is underway — Phase 1 (kernel port) complete 2026-08-18, conformance 5/5. -->
<!-- v1.6 changes: synced to CLASSHUMAN.md v2.2 — the 2026-08-15 stop ruling (HADES, TACO Loop, Ag3nt24 v1.0.0 ENDED; "paused" retired as a status word; nothing ships), Ag3nt24 rebuilt not shipped, build state corrected (24 SOULs are registered stubs, not implemented agents). NEW: standing commit authority replaces "do NOT auto-commit" — diff still shown, cross-platform gate still stands. -->
<!-- v1.5 | 2026-08-14: synced to CLASSHUMAN.md v2.1 — Ag3nt24 descriptor ruled ("a multi-agent engineering framework for legacy modernization"), "autonomous" banned company-wide, legacy modernization named the specialization (Home does not re-center). -->
<!-- v1.4 changes: synced to CLASSHUMAN.md v1.9 — Ag3nt24 is the product (Build Doctrine rewritten), 24 pattern SOULs company-wide, HADES its own project. NEW: Context File Policy (CLASSHUMAN.md never copied into repos; agent operating files gitignored), CONTEXT-MANIFEST.md wired into ship.md, fetch-before-branch rule, cross-platform commit gate. -->
<!-- v1.3 | 2026-08-10: machine rebuilt on F: dev drive, paths repointed; synced to CLASSHUMAN.md v1.7; NEW: Production Definition of Done. -->

> **Business context lives next door:** `CLASSHUMAN.md` (this repo's root) is the canonical company/product/roadmap context. This file is standards, environment, and engineering rules only. **Read both.**
>
> **History lives in `ARCHIVE.md`** (library root) — version changelogs, settled decisions, closed sprints, design records for lines nobody is building. **Do not load it.** It contains retired status words and superseded claims by design. Read it only when someone explicitly asks for history.
>
> **Reasoning behind a ruling lives in `governance/DECISIONS.md`**, by date.

## Who / What
- classHuman AI — driven by LAHA (Love All Humans Always).
- Lawrence Jefferson II (MenokoOG) — CEO, CTO, Top Engineer, Architect. Owns all engineering, product, and operations outside Nicale's remit — everything else.
- Nicale Jefferson (LuxgirlOG) — Part-Time UX/UI Designer; co-author of the governance, harness and ethics framework. Internal ops/HR and AI-ethics admin. **Public listing rule: sites say only "Part-Time UX/UI Designer" plus co-author credits.** Officer titles are provisional pending the operating agreement.
- Rune Onyx — VP of Agentic Operations, the #1 agent seat and the default. Full seat roster and platform homes: `CLASSHUMAN.md` → Agent Roster, and `ops/STAFFING-PLAN.md`.
- **Agents propose; Lawrence approves; everything is logged.** Humans keep final authority on every engagement.
- Working style: short, clear instructions. One task at a time. If priorities are unclear, ask: "What is the one thing we should focus on right now?"
- PRIVACY (non-negotiable): no personal health details of family members, ever. Say only "accessibility-first design."

## Machine & Paths (rebuilt 2026-08-10 — F: is the dev drive)
- **Code and repos live on F:. Tooling installs to C: (default Windows locations).** Do not install runtimes to the dev drive.
- `F:\classHuman` — all classHuman working repos. Everything active is here.
- `F:\learning` — coursework, lessons, educational project code (BS in AI, certs). Not company work.
- `F:\repos-github` — non-classHuman repos. Currently empty; destination for school and personal projects.
- **WINDOWS ONLY (non-negotiable).** All classHuman work runs on the Windows side — git, builds, edits. **WSL is not installed and is not to be used** unless Lawrence explicitly activates it for a named task. Committing from WSL against a Windows checkout rewrites every line of a file.
- **Nothing under OneDrive.** OneDrive sync corrupts `.git`. F: is deliberately outside it.
- **Remote canonicity: `MenokoOG/*` is the source of truth.** New repos are created under MenokoOG, private by default. The `classHuman` org forks *from* MenokoOG when it needs an org-facing copy — never the reverse.
- **Prompt & Agent Library is the SOT for prompts, skills and canon:** `F:\classHuman\classHuman-M3n0ko0g-Prompt-Agent-mds-library` · remote `github.com/MenokoOG/classHuman-M3n0ko0g-Prompt-Agent-mds-library` (private). **Pull from it first — don't reinvent what's there.** Root holds `CLASSHUMAN.md` (canon), this file, `ARCHIVE.md` (history), `CONTEXT-MANIFEST.md` (the cascade), `plan.md` / `review.md` / `ship.md`, `claude-md-template.md`, `engineering-os.md`, `classHuman_Model_Context_Playbook.md`, plus `classHuman-forge/`, `claude-mds/library/INDEX.md`, `ops/`, `governance/`.

## Where repo state is measured (RULED 2026-08-11, after three wrong surveys)

**Repository state is measured on Windows. Full stop.**

- `git status`, `git diff`, dirty/clean judgments, line-ending analysis, file-mode analysis, and "is anything at risk" questions are answered by running the command **on Windows, in the real checkout**, and reading that output.
- **An agent sandbox reading a mounted Windows checkout cannot answer these questions.** Different `core.autocrlf`, different `core.fileMode`, filenames that are legal on NTFS and impossible on Linux, and a lazily-synced view of the filesystem that changes between reads. Its readings are advisory at best and actively misleading at worst.
- A sandbox may read **file contents** freely. It may not pronounce on **repository state.**
- **Every survey of repo state records the machine it ran on, at the top of the document.** A survey without that line is not evidence.
- **When the human at the keyboard says the repos look fine and a tool says otherwise, the human is looking at the real thing.** Investigate the tooling before alarming the human.

- **Do not run a `.gitattributes` renormalize.** Standing prohibition. The CRLF/fileMode "problem" it would fix never existed — three sandbox surveys measured themselves. A renormalize rewrites every line of every file across the repos and destroys the diff signal the cross-platform gate depends on.

*Why this rule exists: `ops/REPO-STATUS-2026-08-12.md`, retracted in full. Three surveys reported thousands of phantom diffs, unsaved work at risk, and an urgent nine-repo remediation. All of it was the sandbox measuring itself. Lawrence deleted and re-cloned repositories over a condition that did not exist.*

## Build Doctrine (governing rule — canonical statement in CLASSHUMAN.md)
- **Proven tools first for client engagements.** Established frameworks, agent SDKs, orchestrators, eval and observability tooling. Best fit for the project wins. We are judged on outcomes, not on originality of stack.
- **Ag3nt24 is the product, and it is being REBUILT** (ruled 2026-08-12; descriptor ruled 2026-08-14; **rebuild ruled 2026-08-15**): **"a multi-agent engineering framework for legacy modernization"** — 24 personas, the pattern SOULs, instantiated as templates per client, on a deterministic integrity kernel. It enters a build only when it clears the Production DoD *and* the engagement needs it — which nothing does yet. **Nothing ships, and nothing about the rebuild goes public.** **Every agent classHuman produces is built from the 24 pattern SOULs; there is no 25th.** **Current rebuild state, the repo, the stack and the doctrine-SOT location are stated in `CLASSHUMAN.md` → Ag3nt24 and are not restated here** — that state changes every sprint, and the second copy is the one that goes stale.
- **ENDED 2026-08-15 — stopped, not paused. Do not build, do not consume, do not queue behind:** **HADES** · **TACO Loop** · **Ag3nt24 v1.0.0.** Their repos come down later. **Nothing ships.** There is no `HOW_TO_CONSUME_Ag3nt24` path and no stable v1.0.0 dependency — that framing is withdrawn. Published work survives the stop: the white papers stay published and stay citable.
- **"Paused" is a retired status word** (ruled 2026-08-15). A line is **active** or it is **ended.** Do not write "paused," "parked," or "on hold" as a project status in any classHuman artifact, board, commit message, or copy.
- **Never claim "24 implemented agents"** (corrected 2026-08-15). The 24 SOULs are **registered, not implemented** — five static declarations each, no behavior. What is real: the **compiled COBOL kernel (four `.bin` gates)** and a **24-slot pattern registry with load-time validation.** Operating Doctrine 4 applies to claims about our own build before it applies to our copy.
- **Banned word: "autonomous"** (ruled 2026-08-14). Never used for Ag3nt24 or any classHuman agent, in code comments, docs, or public copy. Agents propose; humans sign. Honest alternatives: *governed*, *gated*, *human-approved*.
- **Out of the workflow and out of all builds:** gstack, gbrain (2026-08-09). Tools, not lines — either returns only on evidence, one at a time.
- **No single prescribed pattern.** Strangler fig is one option among several — chosen per engagement from evidence, never presented as *the* method.

## Engineering Standards
- SOLID for all object-oriented code. DRY and KISS — radical simplicity beats clever abstraction. Separate concerns: business logic, data, API, presentation.
- Defensive programming: never swallow exceptions unless the domain context says so.
- Strict typing: TS strict / Python type hints. No `any`, no lazy typing on public interfaces.
- Semver in `VERSION` + `CHANGELOG.md` (Keep-a-Changelog). Every PR includes a CHANGELOG entry — non-negotiable.
- ADRs in `docs/adr/`, starting with `0001-record-architecture-decisions.md`. `VERSIONING.md` + `DOCUMENTATION.md` live in the repo root.
- **Anything worth keeping is a file in a repo — never artifact-only.** Cowork artifacts do not survive an OS reinstall (learned 2026-08-10).
- **LAHA is cited at the bottom of every standards file.**
- **No effort on empty space.** A repo exists to version something real — working code or original content. Never create one to reserve a name, hold scaffolding, or track files that already live somewhere else. Same rule for CI, `docs/adr/`, and `CHANGELOG.md`: they arrive with the first real commit, not before. Setup is not progress.
- **Consume, don't fork.** One canonical copy per product or doc. Reference it; never duplicate it into another repo.

## AI-Labor Modularity Rules (why: token windows are physical constraints)
1. One responsibility per file. If a file serves two purposes, split it.
2. Keep files small enough to rewrite in one output (~4-8k tokens). Monoliths force error-prone partial rewrites.
3. Predictable structure and explicit names, so the right file is findable without loading the whole repo.
4. Zero ripple effects: a feature change should touch a minimal set of files. If it touches more, refactor first.
5. Discovery before code: search, inspect dependencies, confirm minimum scope. Never code straight from the prompt.

## Guardrails (solo-speed, no-risk)
- All work on a `claude/[description]` feature branch. Never on main. A bad branch is thrown away — zero rollback cost.
- **Fetch before you branch.** `git fetch && git status` before cutting any branch. A stale local main turns a clean edit into a merge conflict (cost us 2026-08-12).
- **Cross-platform commit gate.** Commits from a non-Windows environment (agent sandbox) are allowed only behind a check: plain `git diff --stat` plus a context-line count (`git diff -U3 <file> | grep -c '^ '`). Whole-file change or zero context lines = stop, hand the commit to Windows. Push happens from Windows only — sandboxes hold no credentials, by design. Note: `commit`'s `rewrite (NN%)` summary is a display heuristic, and `-B0` *forces* a break — use plain diff.
- **Standing commit authority (ruled 2026-08-15).** Lawrence: *"always commit if good, you don't need me unless there's a question."* Commit settled work on a `claude/*` branch without waiting for a per-commit go-ahead. **Supersedes** "Do NOT auto-commit — commit only when explicitly asked," and the no-auto-commit clause in the 2026-08-14 split-on-block ruling. **Non-negotiable conditions, all still in force:**
  - **Show the diff, every time, before committing.** Authority to commit is not permission to commit unseen.
  - **The cross-platform commit gate above still runs first** on any commit from a non-Windows environment. Push from Windows only.
  - **`git fetch && git status` before cutting the branch.** `claude/*` only, never main. Never `--no-verify`.
  - **A question stops the commit.** If the work is not settled — an unruled decision, a scope call, anything that makes the diff a proposal rather than a result — ask instead. **"If it's bigger than scope: STOP and ASK" is the boundary of this authority**, not an exception to it.
  - **Unchanged:** the AI Work Journal (Lawrence reviews and edits every entry before it commits) and **Production DoD gate 10**, the human approval gate on anything shipping to production. ~~Cadence still holds **no commit authority** — this ruling does not grant it any.~~ **AMENDED 2026-08-23:** Cadence commits its own standup and board drafts to a `claude/cadence-YYYY-MM-DD` branch, **scoped to `ops/` and `.cadence/` only.** Anything it writes outside those paths is left for Lawrence. Push stays Windows-only. It still sets no scope and still never commits to `main`. See `governance/DECISIONS.md` → 2026-08-23.
- **Split-on-block (ruled 2026-08-14).** If a branch is ready except for one artifact waiting on a review, ruling, or external input, that artifact moves to its own `claude/*` branch. The ready branch commits; the blocked branch commits when its blocker clears. Settled work never sits uncommitted behind one open item. Mechanics in one working tree: stage and commit only the settled files on branch A, then cut branch B carrying the still-dirty files.
- **Never open, paste, summarize, or move** `.env`, token, key, credential, or private-key files. API-key setup is always Lawrence's to execute — never an agent's.
- **If it's bigger than scope: STOP and ASK.** Do not expand a task silently.
- Claude is empowered to make implementation decisions inside these guardrails without asking permission on minor details.
- Flag explicitly when an implementation went down a rabbit hole; propose abandoning the branch.

## Automated Chores (always, without being asked)
- Detailed conventional commit messages (`feat:` / `fix:` / `refactor:`) matching recent `git log` style.
- Update docstrings/JSDoc for touched functions; draft README updates when interfaces change.
- Warn before adding any new third-party dependency; list alternatives.

## Production Definition of Done
**A task is not "done" when it compiles. It is done when it is safe to leave running for someone else.** This gate is what `ship.md` enforces.

Applies to production software — anything a client, an employer, or a real user will touch. **Spikes, R&D and prototypes are exempt but must declare themselves as such in the plan, and must never be deployed to a client.** Any item genuinely not applicable is declared N/A out loud with a reason — silence is not a pass.

1. **Correctness** — tests written *for this change*, not just an existing suite that stayed green. Happy path, failure path, and one edge case minimum. Judge coverage of the new code, not a global percentage.
2. **Failure behavior** — every external call (network, disk, DB, model API) has a timeout, an explicit retry policy or an explicit none, and a defined failure mode. No swallowed exceptions.
3. **Observability** — structured logs at system boundaries; errors carry enough context to trace them without a debugger. If it can fail silently in production, it is not done.
4. **Security** — no secrets in code, config, or logs. Inputs validated at trust boundaries. Authorization enforced server-side. New dependencies checked for known vulnerabilities.
5. **Data** — migrations are reversible. Destructive operations are gated. The restore path is known *before* the first write, not after the first loss.
6. **Accessibility (any UI)** — keyboard reachable, visible focus, WCAG AA contrast, every control labeled. Accessibility-first design is a standard here, not a nice-to-have.
7. **Performance** — a stated budget, measured and met. Route/page load or endpoint p95 — a number, not a feeling.
8. **Documentation** — README and API docs reflect the change. An ADR for any decision that constrains future work. CHANGELOG entry.
9. **Deployed and verified** — confirmed *running* in the target environment, not merely built. Rollback documented, and exercised at least once per release line.
10. **Human gate** — Lawrence has seen the diff and approved. Agents propose, Lawrence approves. **Unchanged by the 2026-08-15 standing commit authority:** that authority covers committing settled work to a `claude/*` branch; it does not cover shipping to production, to a client, or to a live surface.

## Quality Gates (mechanical checks, run before the DoD review)
- Build compiles, tests pass, lint passes — using THIS repo's commands from its CLAUDE.md.
- Self-check against SOLID + modularity rules; refactor before presenting, not after.

## Per-Repo Slots (each repo's CLAUDE.md defines ONLY these + a roadmap; everything above is inherited)
- Stack: [languages, frameworks]
- Commands: build `[...]` | run `[...]` | test `[...]` | lint `[...]`
- Domain constraints: [anything project-specific]
- DoD exceptions: [any Production DoD item that is permanently N/A for this repo, with reason]

## Context File Policy (RULED 2026-08-12 — ends the mirror drift)
Eleven stale copies of CLASSHUMAN.md were found across project repos on 2026-08-12, some three versions behind canon. This policy ends that.
- **CLASSHUMAN.md lives in the prompt library only.** It is never copied into another repo again. Existing mirrors are deleted as each repo gets its cleanup pass (tracked in `CONTEXT-MANIFEST.md`). Agents needing business context read it from `F:\classHuman\classHuman-M3n0ko0g-Prompt-Agent-mds-library\CLASSHUMAN.md`.
- **core-context.md (this file) IS tracked in each active repo.** A fresh clone or client handoff must carry the standards standalone. It is a mirror: **edit in the library, then sync out** — never edit a repo copy.
- **Agent operating files are gitignored in project repos:** `CLASSHUMAN.md`, `CLAUDE.md`, `AGENTS.md`, `.claude/`, `.remember/`, `ai-code-reviews/`. Product code ships without agent scaffolding. Exception: the prompt library itself tracks them — they are its product.
- **Canon cascade:** any edit to CLASSHUMAN.md or this file triggers the checklist in `CONTEXT-MANIFEST.md` (library root). `ship.md` enforces it. Owner: the Prompt/Context Engineer seat.

### The canon rules (RULED 2026-08-21 — ends the context bloat)

Canon had grown to 665 lines / ~21,000 tokens, loaded into every agent session — roughly half of it version changelogs and settled decisions nobody re-read. A file that publishes "token windows are physical constraints" was the largest violator of it. Four rules:

1. **Canon states what is true now.** Anything dated and closed moves to `ARCHIVE.md` **in the same commit that closes it.** Not later, not "when we tidy up."
2. **Size budget: `CLASSHUMAN.md` stays under 40 KB / 500 lines.** Exceeding it triggers an archive pass, not a new version header. `ship.md` checks it.
3. **No changelog tables in canon.** A ruling gets *one line + a date* in canon and a **full dated entry in `governance/DECISIONS.md`.** Never both narrated in canon.
4. **One place each.** Engineering rule → this file. Business truth → `CLASSHUMAN.md`. Dated and closed → `ARCHIVE.md`. Why a ruling was made → `governance/DECISIONS.md`. A rule in two places is a bug, and the second copy is the one that goes stale.

**`ARCHIVE.md` is append-only and is never loaded by default.** History is not rewritten to match a later ruling — that is how canon loses its audit trail. Agents do not answer from it, quote it as current, or cite its retired statuses.

## Workflow Commands (the library's verb set — this is the loop)
Every substantial task runs: **plan.md → build → review.md → ship.md**
- `plan.md` (/plan) — discovery-first design doc BEFORE touching code. Required for any feature. Declares production vs. spike.
- `review.md` (/review) — SOLID review of changed files; saves ai-code-reviews/*.review.md.
- `ship.md` (/ship) — quality gates, **Production Definition of Done**, **CONTEXT-MANIFEST.md check when canon files changed**, conventional commit + CHANGELOG entry, business update.
- `use-case-writer.md` — drafts/updates a repo's use-case.md + digital twin record (central copies live in `F:\classHuman\use-cases\`).
- `claude-md-template.md` — starter for any repo's slim CLAUDE.md. New repo = instantiate this first.
- `engineering-os.md` — how work compounds: the ratchet rule, capability ladder, momentum queues, verification standard. Read when deciding whether a one-off becomes a skill, script, or workflow.
- `classHuman_Model_Context_Playbook.md` — model lineup (Haiku 4.5 / Sonnet 5 / Opus 5 / Fable 5), sub-agent routing, context/compaction rules, token-saving strategies. **Standing practice: every plan includes a short "Model & Context" section built from this file** — task → model → sub-agent (and its model) → expected context load → checkpoint/compact point → token-saving note.
These live in the Prompt Library root; copy into a repo's .claude/commands/ for slash use, or invoke by name in chat.

## Ops — scrum lives in this repo
- `ops/BACKLOG.md`, `ops/SPRINT-XX.md`, `ops/STAFFING-PLAN.md`, `ops/boards/` (CEO / CTO / Agent Partners), `ops/dashboard.html` (also the control-plane registry v0).
- **Cadence and ceremonies are defined in `CLASSHUMAN.md` → Ops.** Not restated here. The one rule that binds engineering: **a sprint is never planned or built off an assumed scope — kickoff is a conversation with Lawrence first.**

## Agent Forge (ag3nt-forge-classHuman) — check before building
- Shared home for reusable agent **tools, skills, harnesses, and MCP servers**: `F:\classHuman\ag3nt-forge-classHuman`. Index: its `REGISTRY.md`.
- Before building a new tool/skill for an agent task, check the forge REGISTRY first — don't reinvent what's there. E.g. **Asymptote** (time & space Big-O complexity of code), **Design Health Check** (SOLID structure).
- New shared agent tooling is built in the forge to these standards. Existing prompt-library skills are *linked* from the forge, not duplicated (DRY).

---
LAHA — Love All Humans Always.
