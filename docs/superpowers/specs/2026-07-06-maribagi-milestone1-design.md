# MariBagi v2 — Milestone 1 Design

> **Status:** Working draft. Sections 1 & 2 approved during brainstorming. Sections 3-6 pending.
> **Date:** 2026-07-06
> **Branch context:** Clean-slate rebuild on the `frontend` branch (old code preserved in git history for reference).

---

## 1. Overview & Scope

### What we're building

A clean-slate rebuild of MariBagi (expense-splitting SPA, "Mari Bagi" = "let's share/split") as a Vite + React + TypeScript single-page application. Milestone 1 delivers full CRUD for three related entities — `bagi` (split session), `userbagi` (members under a bagi), and `item` (expenses under a bagi) — with a mocked backend (MSW) that simulates real network behavior including loading, latency, and errors.

### Primary goal

Learn the modern frontend stack (TanStack Query, Tailwind, MSW, react-hook-form + zod) on a real, small, complete feature loop. The code is structured so swapping MSW for a real backend later is a localized change, not a rewrite.

### In scope (milestone 1)

- Create / read / update / delete `bagi`, `userbagi`, `item` via TanStack Query mutations.
- Cascade delete: removing a `bagi` removes its members and items.
- Full TypeScript (no `.js` / `.jsx`).
- Loading states, error states, and empty states rendered in the UI.
- Indonesian Rupiah currency formatting (carried over from old app via `Intl.NumberFormat("id-ID", ...)`).
- Manual validation rules carried over: minimum 2 members per bagi, no duplicate member names within a bagi.
- Two data-entry flows for items:
  - **Manual entry** — user fills the full item form (name, amount, paidBy, splitBetween).
  - **Receipt scan (AI-extracted)** — user uploads an image; MSW returns a fixture of extracted header + line items; form is pre-filled as editable draft rows. Receipt-derived fields (name, amount) are populated; social-derived fields (paidBy, splitBetween) are left empty for the user to assign before saving.

### Explicitly out of scope (deferred)

- The split calculation / "who owes whom" result view → milestone 2. (Decision on whether split calc runs on frontend or backend is also deferred until the real backend exists.)
- Authentication → milestone 3+.
- Real backend (real DB, real API, real AI vision integration) → milestone 2 or later.
- Optimistic updates (keep it simple — re-fetch after mutation).
- shadcn/ui (plain Tailwind first; adopt shadcn when a complex primitive like a focus-trapped modal or combobox is needed).
- Zustand / global client state store (defer until `useState` proves insufficient).
- Weighted / uneven splits (milestone 1 supports equal-split-only via the `splitBetween` member list).
- Multi-currency, tags, receipt file attachment, link-sharing.

### Success criteria

A user can: create a bagi, add members to it, add expense items (manually or via mocked receipt scan), edit any entity, delete a bagi (and see its members and items disappear) — all against the MSW mock backend, with loading spinners during requests and visible errors when something fails.

---

## 2. Tech Stack & Tooling

### Core

- `react` ^18, `react-dom` ^18
- `vite` ^5 — bundler / dev server
- `typescript` ^5 — strict mode

### Data & routing

- `@tanstack/react-query` ^5 — server state (cache, mutations, invalidation). The primary library being learned.
- `@tanstack/react-query-devtools` — in-browser cache inspector, invaluable while learning.
- `react-router-dom` ^6 — routing (keep React Router for milestone 1; TanStack Start migration is a post-milestone-2 consideration).

### Styling

- `tailwindcss` ^4 — utility-first CSS (v4, CSS-first config via `@import "tailwindcss"`, no `tailwind.config.js` by default).
- `@tailwindcss/vite` — Vite plugin (v4 uses the Vite plugin; no PostCSS config needed).
- Plain Tailwind primitives built by hand. shadcn/ui deferred until a complex primitive is needed.

### Mock backend

- `msw` ^2 — Mock Service Worker. Intercepts `fetch` at the network layer so the API client code is identical to a real-backend setup. Used both for:
  - Entity CRUD endpoints (`/api/bagi`, `/api/bagi/:id/userbagi`, etc.).
  - The mocked receipt-scan endpoint (returns a fixture of extracted header + items, simulating the future AI vision response).
- No actual HTTP server runs; MSW intercepts in-browser.

### Forms & validation

- `react-hook-form` ^7 — form state management. Justified by the scan-to-populate flow, which needs `useFieldArray` to manage a batch of pre-filled, editable item rows.
- `zod` ^3 — schema validation, TypeScript-first. Schemas are reused for both manual-entry validation and validation of AI-extracted data before it populates the form. One source of truth.
- `@hookform/resolvers` — bridges zod schemas into react-hook-form.

### IDs & formatting

- `uuid` ^11 — generate entity IDs (replaces the old `Date.now()` / `getUTCMilliseconds()` hack).
- `Intl.NumberFormat("id-ID", ...)` — Rupiah formatting. No library needed.

### HTTP client

- Native `fetch` — no axios. For a mock backend with no auth headers, `fetch` + a small wrapper is sufficient. Less surface area.

### Dev tooling

- `eslint` (flat config, `--max-warnings 0` gating — warnings must be fixed, not downgraded).
- `prettier` — keep existing config (double quotes, printWidth 130, trailingComma es5, arrowParens avoid).
- `vite-plugin-svgr` — `.svg` files import as default React components (carried over from old app).

### Explicitly REMOVED from old `package.json`

- `@reduxjs/toolkit`, `react-redux`, `redux`, `@types/react-redux` — replaced by TanStack Query.
- `styled-components`, `@types/styled-components` — replaced by Tailwind.
- `zustand` — dropped (deferred until a concrete client-state need appears).
- `@types/uuid` — folded into `uuid` v11 which ships its own types.
- `vite-plugin-eslint` — linted during dev server runs, which is noisy and slows HMR. Keep `npm run lint` as a separate gating command instead.

### Node version

- `.nvmrc` pinning Node 22 (Active LTS; Node 20 reached EOL April 2026). Matches local dev environment (v22.21.1) and Vercel.

---

## 3. Data Model & API

> **Status:** Pending — to be drafted after this section is approved in brainstorming.

---

## 4. Architecture & Layout

> **Status:** Pending — to be drafted. Includes the wizard-vs-scroll-vs-dashboard layout decision (visual companion pending).

---

## 5. Error Handling

> **Status:** Pending.

---

## 6. Testing

> **Status:** Pending.
