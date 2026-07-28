# MariBagi — Milestone 1 Diary

> **Personal progress tracker.** NOT a technical implementation plan.
> The "what to build" lives in [`docs/superpowers/specs/2026-07-20-maribagi-design-spec.md`](superpowers/specs/2026-07-20-maribagi-design-spec.md).
> This file tracks the journey — schedule, slices, wins, struggles.

## Goal

Clean-slate rebuild of MariBagi as Vite + React + TypeScript SPA with the flow described in the design spec: **Setup (with Form|AI mode) → Items → Review**. Mocked backend via MSW. Mobile-first.

## Stack

React 18, Vite 5, TypeScript 5 (strict), TanStack Query 5, react-hook-form 7, zod 3, Tailwind v4, MSW 2, react-router-dom 6, uuid 11, native fetch.

## The Commitment (read this when motivation dips)

- **Schedule:** Tue / Thu / Sat × 90 min, Sun × 2–3 hours
- **Off days are real off days, not guilt days**
- **The whole project doesn't need courage. Only the next slice does.**
- **Ugly and shipped > perfect and unfinished.**

**Weeks 1–6:** the only metric is "did I show up?" Yes → win. Skipped 4 sessions → loss.
**Week 6+:** habit locked. Now care about velocity.

## Slices Menu

> Pick the next slice from this list OR from the design spec. Order is suggestion, not law — pick whatever feels doable that session. Each slice = one commit.

- [x] **Slice 0:** Vite skeleton renders "MariBagi v2", `npm run lint` clean, `npm run build` succeeds — pre-existing, verified 2026-07-27
- [x] **Slice 1a:** Color tokens (light + dark via `prefers-color-scheme`) + avatar palette — DONE 2026-07-27
- [ ] **Slice 1b:** Scallop component (the `<ScallopEdge>` wrapper from spec §2.3) — fiddly, save for fresh brain
- [ ] **Slice 2:** Routing skeleton (Home / Setup / Items / Review routes as placeholders)
- [ ] **Slice 3:** Page 1 Setup static layout (Nama Bagi input + Form|AI toggle + Anggota row) — no logic yet
- [ ] **Slice 4:** Anggota add/remove inline (local state only, no backend)
- [ ] **Slice 5:** MSW mock backend skeleton (one endpoint, one seed)
- [ ] **Slice 6:** Page 2 Items static layout (scalloped unified card, empty state)
- [ ] **Slice 7:** "New Item" sheet — Nama + Amount + Qty + "Untuk Semua" toggle
- [ ] **Slice 8:** Per-Anggota allocation picker with qty badge (progressive disclosure)
- [ ] **Slice 9:** Page 3 Review static layout (member row + items summary + tax 10% toggle + service manual amount toggle)
- [ ] **Slice 10:** Save flow — persist via MSW, redirect to a confirmation
- [ ] **Slice 11:** History rows on Home (ticket-stub anatomy)
- [ ] **Slice 12:** Bottom nav (Home · Riwayat · Settings)

> Add more slices as the work clarifies. Cross them out when done — the dopamine is the point.

## Session Log

> After each session, drop a one-liner: date, duration, what got done, what was hard, how it felt.

- **2026-07-27 (Mon, ~75min):** Slice 1a shipped. Added 4 color tokens (`--color-page/card/ink/accent`), dark mode overrides via `@media (prefers-color-scheme: dark)`, and 3 avatar colors to `src/index.css`. Mind-blown moment: `prefers-color-scheme` just reads the OS dark-mode setting — no JS, no React context, no toggle UI. Just CSS. Watched the page go dark when I tested it because my Mac was in dark mode. Existing components still use old tokens (`brand`/`gray`/`danger`) and are dark-mode-broken — migration is Slice 2+. Felt: actually good. Didn't freeze on day 1. Mentor mode (ask "why" before typing) made the difference.

- **2026-07-28 (Tue, ~90min):** Session 2. Did NOT ship code. Long architectural discussion
  about routing structure for the 3-page flow. Key decisions made:
  - **Flat routing** (not nested children) — `/bagi/new`, `/bagi/:id/items`, `/bagi/:id`
  - **No Review page** (deviates from spec §3) — Items page has "Save" that goes straight to Detail
  - **Tax/service ephemeral** — lives in Share popup on Detail page, not persisted with Bagi data
  - **Edit mode** — `/bagi/:id/edit` points to MainForm (same component, mode detection via URL param)
  - **`/bagi/:bagiId`** canonical for Detail (dropped the `/details` suffix — redundant)
  - **Create-then-edit pattern** — Setup page POSTs to create, redirect with new ID
  Honest reflection: started as avoidance behavior (researching RTK, v6 vs v7, TanStack).
  Mentor flagged it. Pivoted to actual architectural planning — productive once engaged.
  Felt: frustrated at self for the avoidance detour, but good about the architectural clarity
  we reached. Ready to ship code tomorrow.

## Wins (read this when motivation dips)

> Tiny counts. Got the dev server running on first try counts. Figured out a Tailwind class counts. Showing up on a tired day really counts.

- Showed up on day 1 (Mon 2026-07-27) after days of just talking about starting.
- Shipped first real commit of the rebuild (Slice 1a: color tokens + dark mode).
- Discovered how `prefers-color-scheme` works — felt like magic.
- Spotted the `text-gray-900` dark-mode bug myself before mentor explained it. Senior-dev instinct kicking in.
- Questioned the `rtk` rule — learned it's a token-saving tool for AI, not for my own terminal. Stopped using it locally.
- Asked "why" all session instead of just following instructions. Actually understood the reasons behind decisions.

## When I'm Stuck

- Open the design spec — pick the smallest next slice. Do only that. Commit.
- If a slice feels too big, cut it in half. Then half again.
- The pomodoro is 25 min. Just sit down for one pomodoro. If you want to stop after, stop.
- Ugly and shipped > perfect and unfinished.
- Off days are real off days. Guilt is not a productivity tool.

## Tech Notes (parking lot — not a plan)

> Stuff to remember but not act on yet. Gotchas, deferred decisions, things learned.

- **Token naming mismatch:** spec §2.1 uses `--page`, `--card`, etc. Implementation uses `--color-page`, `--color-card` (Tailwind v4 `@theme` convention — generates `bg-page`, `text-card`, etc. utilities). **Update spec to match implementation** — the `--color-*` prefix is correct.
- **Avatar naming:** I used `--avatar-color-red`, spec §2.1 uses "rust". `#c0432b` is technically rust/brick, not pure red. Decide during migration (minor).
- **Old tokens still in code:** `--color-brand-*` (greens), `--color-gray-*` (purple-tinted), `--color-danger`, `--color-danger-dark`. All used by existing wizard components. Migration to new tokens happens Slice 2+.
- **`--color-danger-dark` is misleadingly named:** it's a hardcoded hover shade, NOT a dark-mode variant. Should become `text-danger hover:opacity-80` after migration.
- **Brand scale conflicts with accent:** spec §2.1 says "single accent discipline." `--color-brand-*` (green) competes with new `--color-accent` (blue). Delete brand scale during migration.
- **Dark mode mechanism:** currently `@media (prefers-color-scheme: dark)` — follows OS automatically, no in-app toggle. If we ever need a toggle, migrate to `[data-theme]` attribute selector (~15 min work). Values stay the same, just selector changes.
- **Token naming principle (learned 2026-07-27):** name tokens by PURPOSE (`page`/`card`/`ink`/`accent`), not by APPEARANCE (`cream`/`dark-cream`). Purpose-names survive theme changes; appearance-names don't.
- **CSS variable duplicates fail silently:** always scan for duplicate `--variable` names after copy-pasting. CSS doesn't warn — second value just wins. (Caught one myself today: `--avatar-color-green` was duplicated.)
- **React Router version (resolved 2026-07-28):** Stay on v6. `package.json` says `^6.28.0`
  but installed is 6.30.4 (caret semver behavior). Don't switch to v7 (breaking changes) or
  TanStack Router (different mental model) mid-project. For FUTURE projects: evaluate routers
  BEFORE writing code. TanStack Router's type safety looks interesting for greenfield.

- **Spec §3 deviation (2026-07-28):** Original spec described 3 pages: Setup → Items → Review.
  **NEW plan: 2 form pages + Detail.** Setup → Items → Detail (Detail doubles as the "review"
  with Share popup containing tax/service toggles). Spec §3 has been updated to match.

- **Tax/service location (2026-07-28):** Moved from persisted-on-bagi to ephemeral-in-share-popup.
  - `Bagi` entity should NOT have `includeTax`, `includeService` fields
  - Toggles live in Share popup on Detail page
  - User can preview adjusted breakdown before sharing
  - Affects: entities.ts, API contracts, Items page (no toggles there), Detail page (has Share button)
  - **Existing wizard code has tax/service on items** — needs cleanup in Slice 2+ migration

- **Edit mode pattern (2026-07-28):** MainForm handles both create and edit. URL param drives mode.
  - `/bagi/new` → create mode (empty form, POST on submit)
  - `/bagi/:bagiId/edit` → edit mode (prefill from GET, PATCH on submit)
  - Items page works identically for both — always operates on existing `bagiId`
  - Implementation deferred — route exists in skeleton, mode logic added in later slice

- **Create-then-edit pattern (2026-07-28):** POST on Setup "Next" → backend creates ID →
  redirect to `/bagi/:newId/items`. State lives in backend, not React. No Context, no
  localStorage, no prop drilling. URL is the source of truth.

- **Routing bug (FIXED 2026-07-28):** `App.tsx` had `path: "bagi/:bagiId/item"`
  (missing leading `/`). All top-level routes need absolute paths in `createBrowserRouter`.
  Fixed: now `/bagi/:bagiId/items` (also renamed singular → plural for spec consistency).
