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

### Entities

```typescript
bagi {
  id: string               // uuid
  name: string             // "Tiket Dufan"
  date: number             // Date.now() at creation
  includeService: boolean  // carried over from old app; default false
  includeTax: boolean      // carried over from old app; default false
  createdAt: number
}

userbagi {
  id: string               // uuid (primary key — NOT auth, just entity identity)
  bagiId: string           // FK -> bagi.id
  name: string             // "asep" (display name only, no login/account)
  createdAt: number
}

item {
  id: string               // uuid
  bagiId: string           // FK -> bagi.id
  name: string             // "Hotel"
  amount: number           // 400000 (Rupiah, integer)
  paidBy: string            // FK -> userbagi.id (who fronted the money)
  splitBetween: string[]   // array of userbagi.id (who shares this cost; equal split only)
  createdAt: number
}
```

### Identity modeling decisions

- **IDs over names for references.** `item.paidBy` and `item.splitBetween[]` store `userbagi.id` values, NOT display names. This is entity primary-key plumbing, NOT authentication. It ensures renaming a member propagates correctly to all items referencing them (no stale name references). Names are resolved to display values at render time via lookup.
- **No `shared` boolean.** Whether an item is "shared" is derived from `splitBetween.length > 1`. A separate boolean would create two sources of truth that can disagree.
- **No comma-separated strings.** `splitBetween` is a proper array of IDs. Comma-separated strings are a relational anti-pattern (breaks querying, integrity, editing, and names containing commas).
- **Equal splits only.** Milestone 1 has no split calculation, so "split equally among these members" is all the model needs to express. Weighted/uneven splits (junction table) are a milestone 2+ concern.

### MSW endpoint surface (mock API)

```
BAGI
  GET    /api/bagi                       -> list all bagi (lightweight: id, name, date only — no children)
  GET    /api/bagi/:bagiId               -> single bagi WITH nested { members, items }
  POST   /api/bagi                       -> create bagi
  PATCH  /api/bagi/:bagiId               -> update bagi (name, toggles)
  DELETE /api/bagi/:bagiId               -> cascade delete (removes members + items)

USERBAGI (mutations only — no GET; children come nested with the parent GET)
  POST   /api/bagi/:bagiId/userbagi      -> add member
  PATCH  /api/bagi/:bagiId/userbagi/:id  -> rename member
  DELETE /api/bagi/:bagiId/userbagi/:id  -> remove member

ITEM (mutations only — no GET; children come nested with the parent GET)
  POST   /api/bagi/:bagiId/item          -> add item (single, manual entry)
  POST   /api/bagi/:bagiId/item/batch    -> add items in batch (scan review flow)
  PATCH  /api/bagi/:bagiId/item/:id      -> update item
  DELETE /api/bagi/:bagiId/item/:id      -> remove item

RECEIPT SCAN (mocked AI — implementation details TBD within milestone 1)
  POST   /api/bagi/:bagiId/scan          -> upload image, returns fixture:
       {
         bagi: { name, date, includeTax, includeService },  // header (merchant-derived)
         items: [{ name, amount }, ...]                       // NO paidBy/splitBetween
       }
```

### API design notes

- **No redundant child GETs.** `GET /api/bagi/:bagiId` already returns members and items nested. Separate `GET .../userbagi` and `GET .../item` list endpoints are omitted because child collections per bagi are small (a handful of members, maybe 20 items). Fetching nested is correct, not lazy. This is the idiomatic TanStack Query pattern for small nested data.
- **Lightweight list endpoint.** `GET /api/bagi` (no id) returns only `{ id, name, date }` per row — no members/items. Avoids loading every item of every bagi just to render a session-name list. Eager loading is scoped to the detail view.
- **Cascade delete is implicit.** `DELETE /api/bagi/:bagiId` removes the bagi AND its members + items in one call. The MSW handler performs the cascade.
- **Scan returns a partial draft.** Header + items with name/amount only. `paidBy` and `splitBetween` are absent — the user assigns these social fields in the review form before hitting the batch-save endpoint.
- **Batch save endpoint** (`POST .../item/batch`) saves N reviewed scanned items in one request rather than N round-trips. Manual entry uses the single `POST .../item`.
- **TanStack Query implications.** One detail query (`useGetBagiDetail(id)`) fetches parent + children and caches the whole tree. After any child mutation, invalidate the parent detail query → refetch → children update. No optimistic updates in milestone 1 (refetch-after-mutation). Child mutation responses can be empty/204.

### Receipt scan — deferred implementation details

The scan endpoint exists in the API surface because the data model must account for it, but the exact implementation (how MSW returns the fixture, the review-form UX, batch-save flow) is to be designed in a later pass within milestone 1. The react-hook-form + zod stack choice is already justified by this feature's need for `useFieldArray` (managing a batch of pre-filled, editable item rows).

---

## 4. Architecture & Layout

> **Status:** Pending — to be drafted. Includes the wizard-vs-scroll-vs-dashboard layout decision (visual companion pending).

---

## 5. Error Handling

> **Status:** Pending.

---

## 6. Testing

> **Status:** Pending.
