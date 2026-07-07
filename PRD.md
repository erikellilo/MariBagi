---
status: canonical — upstream product spec; all other docs defer to this PRD
date: 2026-07-06
stack: target rebuild (TanStack Query + Tailwind v4 + MSW + react-hook-form + zod) — NOT the legacy src/ stack
supersedes: docs/superpowers/specs/2026-07-06-maribagi-milestone1-design.md (partially — see §7; notably moves split calc INTO milestone 1)
---

# MariBagi Product Requirements Document

## 1. Problem Statement

Splitting a group expense — dinner, a shared ride, a household bill — is a small arithmetic problem that turns into friction every time it comes up. Someone fronts the cash, everyone else owes them, and the group goes through a manual negotiation: "You had the drink, right?" "Did we include service?" "Who paid?" Spreadsheets are overkill. Pen-and-paper gets lost. Existing expense-splitting apps require accounts, cross-device sync, and often charge for receipt-scanning or split-calculation features.

MariBagi ("let's share/split" in Indonesian) solves this at the smallest viable point: a single-device, no-account-required web app. One person enters the session, the group gathers around a phone, adds expenses, and sees who owes whom — all in one sitting, no signup, no sync, no server.

## 2. Target Users

Small groups (2–8 people) of friends, colleagues, or housemates who share expenses and settle up afterward. Indonesia-contextualized: IDR currency, Indonesian-language interface where present. The canonical usage pattern is a single-device pass-around during or after the shared expense — one person enters data while the group looks on and agrees.

Not targeting anonymous or remote-only groups (that requires accounts + cross-device sync, which is a backend concern out of scope for the frontend MVP).

## 3. Goals & Non-Goals

**Goals:** Deliver a portfolio-quality, polished, design-system-adherent frontend application built on the rebuild stack (TanStack Query + Tailwind v4 + MSW + react-hook-form + zod) that a small group can use on one device to split a real bill end-to-end: create a session → add members → add expenses (manually or via receipt scan) → view the who-owes-whom result. Demoable without external services. Lint-clean, build-passes.

**Non-Goals (explicit):**
- Real authentication / user accounts
- Cross-device sync or multi-user real-time collaboration
- Real AI receipt OCR (server-side model + API key management)
- Server-side or cloud persistence
- Cross-refresh persistence in milestone 1 (MSW in-memory store resets on refresh — see §6.1 and §8)
- Multi-currency support
- Recurring expenses / subscriptions
- Notifications or reminders
- Scale or hardening for many concurrent users
- Data export/import

## 4. User Stories

- As a user, I can create a new bagi session and give it a name.
- As a user, I can add members (by name) to a session, with a minimum of 2 and no duplicate names.
- As a user, I can rename or remove a member before the session is saved.
- As a user, I can manually add an expense item with name, amount, quantity, payer, and allocation.
- As a user, I can upload a receipt image and see extracted line items pre-filled as editable draft rows (mocked via MSW fixture).
- As a user, I can edit or delete any expense item before saving.
- As a user, I can set allocation per item to either equal share (among selected members) or weighted/by-quantity (members get N units each).
- As a user, I can view the split result: who paid what, who owes whom, and net amounts.
- As a user, I can complete a full split in a single session. *(Note: milestone 1's mock store resets on page refresh — cross-session persistence arrives with the backend in milestone 2.)*

## 5. Success Criteria

**Portfolio bar:**
- Cloneable — `git clone && npm install && npm run dev` runs in under 5 minutes.
- Built on the rebuild stack (TanStack Query + Tailwind v4 + MSW + react-hook-form + zod + uuid + native fetch).
- Design-system-adherent — tokens applied via Tailwind `@theme` in `src/index.css` per the design-system spec (see docs/superpowers/specs/2026-07-06-maribagi-design-system.md; its component examples are in styled-components/legacy and will be re-spec'd for Tailwind at rebuild time).
- Demoable end-to-end without any external service or internet connection.
- Lint-clean — `npm run lint` passes with `--max-warnings 0`.
- Build passes — `npm run build` produces a valid production bundle.

**Usability bar:**
- A real small group can complete a full split on one device without hitting a dead-end or data-loss bug.
- All form states (empty, valid, invalid, loading) are handled with no uncaught errors.
- IDR currency is formatted consistently via `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })` with no decimals.

## 6. Scope: Frontend-Only MVP

### 6.1 FE/BE Boundary Matrix

| Capability | Disposition | Rationale |
|---|---|---|
| Bagi (split session) CRUD | FE-now | TanStack Query mutations vs MSW `/api/bagi` endpoints. |
| Member management (add/rename/remove, min-2, no-dup-names) | FE-now | Local form validation + TanStack Query mutations. |
| Expense item CRUD | FE-now | Same pattern — mutations vs MSW endpoints. |
| Manual expense entry | FE-now | react-hook-form + zod — no external dependency. |
| Receipt scan (image → extracted items) | Mock-in-FE (MSW) | Real OCR requires server-side model + API key; MSW `/api/bagi/:id/scan` returns a fixture. |
| Split calculation: equal | FE-now | Pure math — divide amount by member count. |
| Split calculation: weighted/proportional (minimal) | FE-now | Pure math — `(memberQty / totalQty) * amount` over allocation data. |
| Split result view ("who owes whom") | FE-now | Computation of net positions from paidBy vs allocated shares — all local data. |
| Settle-up minimization (fewest transactions) | Out-of-scope | FE-possible (graph algorithm) but deferred for simplicity; MVP shows raw who-owes-whom. |
| Persistence | Mock-in-FE (MSW) | MSW in-memory Map store — **resets on page refresh**. Durable persistence → BE-later. |
| Authentication | BE-later | Requires server-side user model, session management, secure credential storage. |
| Cross-device sync / multi-user real-time | BE-later | Requires server or WebRTC signaling — at minimum a document store and conflict resolution. |
| Multi-currency | Out-of-scope | IDR-only MVP. Conversion rates + exchange UI are additive complexity with zero value for the core use case. |
| Notifications / reminders | BE-later | Push or email notifications require a server. |
| Data export/import | Out-of-scope | YAGNI for MVP — data is ephemeral in milestone 1; durable persistence arrives with the backend. |

### 6.2 In-Scope Features (MVP)

**Session management:**
- Create a bagi with a name and optional tax/service-charge toggles.
- View a list of all saved bagi sessions.
- Edit a session's name or toggles.
- Delete a session (with cascade — removes its members and items).

**Member management:**
- Add members by display name (no authentication).
- Rename a member.
- Remove a member.
- Validation: minimum 2 members, no duplicate names within a session.

**Expense entry (manual):**
- Add an expense with name, amount (IDR), quantity, paidBy (who fronted the money), and allocation.
- Edit or delete any expense before finalizing the session.

**Expense entry (receipt scan — mocked via MSW):**
- A "Scan Receipt" button triggers a POST to `/api/bagi/:id/scan`; MSW returns a fixture of extracted header + line items.
- Extracted items (name, amount, quantity) are pre-filled as editable draft rows.
- PaidBy and allocation are left empty for the user to assign (these are social decisions the scanned data cannot infer).
- User reviews, edits, and confirms extracted items before batch-saving.

**Split calculation (equal + weighted):**
- Equal split: divide an item's amount equally among selected members.
- Weighted/proportional split: distribute an item's cost based on per-member unit quantities (e.g., 3 drinks total, Asep gets 2, Ucup gets 1 — Asep pays 2/3).
- Net result: for each member, compute `totalPaid - totalOwed` to show who owes whom.

**Split result view:**
- Per-member summary: what they paid, what they owe, their net position.
- A clear, scannable who-owes-whom breakdown.

**Persistence (milestone 1 only):**
- MSW in-memory store (`mocks/db.ts` — Map-based, resets on page refresh).
- Data survives only for the current browser session. Cross-refresh persistence arrives with the real backend in milestone 2.
- The API layer (`api/*.ts`) is structured so swapping MSW for a real backend touches only `api/` + `mocks/`.

### 6.3 Out of Scope (explicit)

**Deferred to backend milestone (BE-later):**
- Authentication & user accounts — requires server-side session management.
- Cross-device sync / real-time collaboration — requires server or WebRTC.
- Real receipt OCR — requires server-side model + API keys.
- Durable (cross-refresh) persistence — requires a real database.
- Notifications / reminders — requires push infrastructure.

**Cut for simplicity or YAGNI (Out-of-scope):**
- Settle-up minimization (fewest-transactions algorithm) — MVP shows raw who-owes-whom; groups can manually pick one person to collect or split into multiple transfers.
- Multi-currency — IDR-only for MVP.
- Data export/import — not needed at milestone 1's scale.

## 7. Milestones

### Milestone 1 (Frontend MVP)

All in-scope features from §6.2: session CRUD, member management, expense entry (manual + mocked receipt scan via MSW), split calculation (equal + weighted), result view, and MSW in-memory persistence (honest about refresh-reset). Built entirely on the rebuild stack: TanStack Query + Tailwind v4 + MSW + react-hook-form + zod + uuid + native fetch.

**This PRD revises the prior milestone-1 spec** (docs/superpowers/specs/2026-07-06-maribagi-milestone1-design.md) in two ways:
1. **Split calculation moves INTO milestone 1.** That spec deferred split calc and the "who owes whom" result view to milestone 2. The PRD overrides: a splitter that doesn't split isn't a portfolio-quality deliverable. Split calc (equal + weighted) and result view are in scope for milestone 1.
2. **Stack claims are now canonical.** That spec correctly identified the target stack (TanStack Query, Tailwind, MSW, react-hook-form, zod). An earlier draft of this PRD wrongly anchored to the legacy `package.json` (Redux, styled-components, localStorage) — this redraft corrects that. The rebuild stack, as described in the milestone-1 design spec, is the authoritative direction.

Cross-refresh persistence is NOT in milestone 1. The MSW in-memory store resets on refresh. This is an explicit tradeoff (mock-backend fidelity over persistence). Real persistence arrives with milestone 2.

### Milestone 2 (Backend) — Preview Only, Not Scoped Here

The BE-later capabilities from §6.3 grouped together: authentication, cross-device sync, real receipt OCR, durable server-side persistence. Each requires a server component. Milestone 2 will receive its own PRD when prioritized. This PRD only marks the FE/BE boundary; it does not specify the backend architecture.

### Cross-Cutting

The design system (see docs/superpowers/specs/2026-07-06-maribagi-design-system.md) defines the token values (color ramps, typography scale, spacing 4px grid, radius/elevation). The design-system spec's current component examples are written in styled-components (legacy stack). At rebuild time, these tokens are applied via Tailwind v4's `@theme` directive in `src/index.css`, and component specs are re-expressed as Tailwind utility classes — not as styled-components. The token values remain authoritative; the delivery mechanism changes.

## 8. Technical Constraints & Assumptions

**Stack (target rebuild — from the milestone-1 design spec and plan, NOT the legacy stack):**
- React ^18, React DOM ^18
- Vite ^5 (bundler/dev server), TypeScript ^5 (strict mode)
- **@tanstack/react-query ^5** + **@tanstack/react-query-devtools** — server state (cache, mutations, invalidation). The primary data-management library.
- **react-router-dom ^6** — routing.
- **tailwindcss ^4** + **@tailwindcss/vite** — styling. Utility-first; CSS-first config via `@import "tailwindcss"`.
- **msw ^2** — Mock Service Worker; intercepts fetch at the network layer; in-memory Map-based store (`mocks/db.ts`).
- **react-hook-form ^7** — form state. One form instance spans the 3-step wizard; `useFieldArray` manages items + allocation arrays.
- **zod ^3** + **@hookform/resolvers** — schema validation. Single source of truth for form validation and extracted-data validation.
- **uuid ^11** — entity IDs (replaces legacy `Date.now()` hacks).
- Native `fetch` — no axios.
- **vite-plugin-svgr** — SVG as React components (carried over).
- ESLint flat config (`--max-warnings 0`), Prettier (double quotes, printWidth 130, trailingComma es5, arrowParens avoid).
- Node 22 (`.nvmrc`).

**NOT the legacy stack:** no Redux, no Redux Toolkit, no styled-components, no zustand, no localStorage middleware. No files from the current `src/` — the rebuild wipes it. The legacy code is preserved in git history for reference only.

**State management:**
- Server (mock) state → TanStack Query (queries + mutations vs MSW endpoints).
- Form state → react-hook-form (single instance at wizard root).
- Local UI state → `useState` / `useReducer`. No Redux, no zustand (per the spec: deferred until a concrete client-state need appears).

**Styling:**
- Tailwind v4 utility classes exclusively. No CSS files (except `src/index.css` for the `@import "tailwindcss"` entry point).
- Design tokens declared as CSS custom properties via `@theme` in `src/index.css`. Token values from the design-system spec; delivery re-spec'd for Tailwind (the design-system spec's current example code is in styled-components/legacy — those are not used in the rebuild).

**Mock backend (MSW):**
- MSW intercepts `fetch` at the network layer in the browser. No actual HTTP server runs.
- Handlers (`mocks/handlers.ts`) read/write an in-memory Map store (`mocks/db.ts`).
- **Critical honesty: the in-memory store resets on page refresh.** Milestone 1 does NOT persist data across refreshes. This is a deliberate tradeoff (mock-backend fidelity over persistence). Real persistence arrives with the backend in milestone 2.
- The API layer (`api/*.ts`) is a thin fetch wrapper; swapping MSW for a real backend touches only `api/` + `mocks/`.

**Forms:**
- One react-hook-form instance spans the 3-step wizard (Step 1: Setup, Step 2: Items, Step 3: Sharing). State persists naturally between steps.
- `useFieldArray` manages items and allocation arrays at the form root.
- The zod schema (`wizard/bagiFormSchema.ts`) is the single source of truth — used for both manual-entry validation and validating extracted scan data before populating the form.

**Currency:**
- Indonesian Rupiah (IDR) — formatted via `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })`.
- No decimal places. `Rp` prefix with `.` thousands separator.

**Receipt scan (mocked):**
- MSW handler for `POST /api/bagi/:id/scan` returns a fixture of extracted header + line items.
- `paidBy` and `allocation` are absent from scan results (social decisions the scanned data cannot infer).
- User reviews, edits, and batch-saves via `POST /api/bagi/:id/item/batch`.

**Code rules (per AGENTS.md rebuild banner):**
- No comments in code unless requested.
- Lint must pass with `--max-warnings 0`.
- No CSS files — Tailwind utility classes only.
- No new dependencies without confirmation.
- Functional components + hooks only.
- `.tsx` for markup, `.ts` for logic. Full TypeScript — no `.jsx`/`.js` in the rebuild.

**Design system:**
- Adhere to tokens in docs/superpowers/specs/2026-07-06-maribagi-design-system.md.
- Colors, spacing, typography, radius, and elevation values from that spec are declared via Tailwind `@theme` in `src/index.css`.
- The design-system spec's current component snippets are in styled-components/legacy — those are not used. Components are built with Tailwind utility classes.

**Assumptions:**
- Single-user-data per device — no multi-tenant isolation needed in the FE MVP.
- The app runs entirely in the browser — no server round-trips required (MSW intercepts in-browser).
- Mobile-first UI but works on desktop viewports.
- Existing `src/` is legacy code; the rebuild starts from a clean directory (per the implementation plan's Task 1).
