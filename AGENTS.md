# AGENTS.md

Guidance for AI coding agents in the **MariBagi** repository (React expense-splitting SPA, "mari bagi" = let's split). This file is deliberately thin — read the canonical docs below before doing real work.

## Rebuild status — read first

`src/` is mid-rebuild: single-page wizard → 3-page flow (Setup → Items → Review).

- **New work** — target stack: Vite + React 18 + TypeScript 5 + TanStack Query 5 + Tailwind v4 + MSW 2 + react-hook-form 7 + zod 3. Canonical: `PRD.md` + `docs/superpowers/specs/2026-07-20-maribagi-design-spec.md`.
- **Legacy code** — parts of `src/` still use Redux Toolkit + styled-components + localStorage. Full rules live in `.opencode/AGENTS.md`; follow them when touching those files (keep a file's existing style; don't mix stacks).

## Hard rules

- Gates before reporting any change done: `npm run lint` (clean — the script enforces `--max-warnings 0`) AND `npm run build` both pass.
- No comments in code unless explicitly requested. No new dependencies without user confirmation.
- `docs/DEVLOG.md` is the user's personal file — **never write to it**.
- Token economy: if `rtk` is installed, prefix shell commands with it (e.g. `rtk git diff`, `rtk npm run build`) — it filters output to what matters and saves tokens. If `rtk` is not installed (e.g. on Windows), run commands plainly; never install or require it.
