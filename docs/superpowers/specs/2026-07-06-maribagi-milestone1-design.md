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
  name: string             // "Hotel" or "Drink"
  amount: number           // total line amount in Rupiah (e.g. 90000 for "Drink 3x @ 30000")
  quantity: number         // total units ordered (e.g. 3 for "Drink 3x")
  paidBy: string           // FK -> userbagi.id (who fronted the money)
  allocation: [            // per-member share (replaces splitBetween)
    { memberId: string, quantity: number }
    // e.g. [{ memberId: "asep-id", quantity: 2 }, { memberId: "ucup-id", quantity: 1 }]
    // equal split is a special case: everyone has quantity 1
  ]
  createdAt: number
}
```

### Identity modeling decisions

- **IDs over names for references.** `item.paidBy` and `item.splitBetween[]` store `userbagi.id` values, NOT display names. This is entity primary-key plumbing, NOT authentication. It ensures renaming a member propagates correctly to all items referencing them (no stale name references). Names are resolved to display values at render time via lookup.
- **No `shared` boolean.** Whether an item is "shared" is derived from `splitBetween.length > 1`. A separate boolean would create two sources of truth that can disagree.
- **No comma-separated strings.** `allocation` is a proper array of objects. Comma-separated strings are a relational anti-pattern (breaks querying, integrity, editing, and names containing commas).
- **Weighted allocation (junction-style).** `item.allocation` is an array of `{ memberId, quantity }` pairs, storing per-member share quantities. This replaces the earlier `splitBetween: string[]` model. It handles both equal split (everyone has quantity 1) and weighted split (e.g. asep 2, ucup 1 for "Drink 3x") with one structure. When the real DB arrives, this maps to a proper junction table.
- **No split calculation in milestone 1.** Milestone 1 only STORES the allocation data. The "who owes whom" proportional math, rounding, and settlement logic are deferred to milestone 2. The added complexity for milestone 1 is limited to the data shape and the Step 3 chip+quantity UI.

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

### Form factor

Mobile-first. All layouts are designed for phone-width viewports first, scaling up responsively for larger screens. The 3-step wizard flow is designed specifically for mobile tap targets and one-concern-per-screen focus.

### Flow structure — 3-step wizard

A hybrid wizard that groups concerns sensibly. The user moves linearly through three steps, with back/forward navigation and a persistent step indicator.

**Step 1 — Setup (Bagi + Members combined)**
- Name the bagi session (e.g. "Tiket Dufan")
- Toggle tax / service charge options
- Add members (display names only — no auth). Min 2 members validation carried over from old app.
- "Next → Items" advances to step 2.
- Combining bagi header + members on one screen because both are "setup" concerns — no need for separate screens.

**Step 2 — Items**
- List of expense line items, each with `name`, `amount` (Rupiah), `quantity` (total ordered).
- Add items manually (inline add row) OR via receipt scan (mocked AI returns a fixture of items).
- Review/correct any extracted data before advancing.
- No social assignment here — that's step 3.
- "Next → Sharing" advances to step 3.

**Step 3 — Sharing allocation**
- For each item, assign who paid (`paidBy`) and how the cost is shared (`allocation`).
- Two allocation modes per item, selected via a per-item toggle:
  - **Equal share** — tap chips to include/exclude members. Amount splits equally among selected. Used for shared costs where quantity is irrelevant (Hotel qty 1 shared by 3 people, service charge, tax).
  - **By quantity** — tap chips to distribute units (+1 per tap). A "remaining of N" counter tracks unallocated units. Chips with quantity 0 disable when remaining hits 0 (cannot over-assign). Used for countable items (Drink 3x, Rice 2x).
- "Save Bagi" commits. Disabled until all items are fully allocated (form-level validation).

### Home page — list of bagi sessions

`/bagi` renders a stacked list of all saved sessions (name, date, member count, item count). Tap a session → opens detail/edit. "+ New bagi" entry point starts the wizard.

### Routing

```
/                        → redirect to /bagi
/bagi                    → List page (all sessions)
/bagi/new                → Wizard Step 1 (Setup)
/bagi/new/items          → Wizard Step 2 (Items)
/bagi/new/sharing        → Wizard Step 3 (Sharing)
/bagi/:bagiId            → Read-only detail view of a saved bagi
/bagi/:bagiId/edit       → Edit mode (re-enters wizard at relevant step)
```

**Key routing decisions:**
- Wizard steps are separate URLs (not internal component state). Enables: browser-back per step, deep-linking, refresh-safe.
- `/bagi/new` (create) vs `/bagi/:bagiId/edit` (edit). Wizard component shared between both; reads mode from URL.
- `/bagi/:bagiId` (no /edit) = read-only summary. "Edit" button re-enters wizard.
- No separate scan route — the scan button lives inside Step 2 and populates the form without leaving the step.

### Form state — one instance across all steps

A single react-hook-form instance lives at the wizard-root level. Each step renders a subset of the fields. State persists naturally as the user moves between steps. `useFieldArray` manages the items and allocation arrays at the form root.

Rationale: splitting into separate per-step forms would require manually syncing the arrays between steps — error-prone. One large form is simpler and more correct than three small forms with handoffs.

### Receipt scan integration

The scan button lives in Step 2. Flow: user uploads image → MSW handler returns a fixture of `{ bagi header, items[] }` → the form's `items` field array is populated with the extracted rows → user reviews/adjusts → proceeds to Step 3 to assign allocation.

Scan pre-fills steps 1+2 data only (header + items with name/amount/quantity). Social fields (`paidBy`, `allocation`) are left empty for the user to assign in Step 3.

### Component structure (rough)

```
pages/
  BagiListPage.tsx          → /bagi — list of sessions
  BagiWizardPage.tsx        → /bagi/new/* and /bagi/:id/edit/* — hosts the form + step router
  BagiDetailPage.tsx        → /bagi/:id — read-only summary

wizard/
  WizardSteps.tsx           → step indicator + navigation
  Step1Setup.tsx            → bagi header + member list
  Step2Items.tsx            → item list + scan button
  Step3Sharing.tsx          → allocation (equal share / by quantity) per item
  ScanButton.tsx            → receipt upload + MSW call

components/ui/              → reusable primitives (Button, Input, Chip, etc.)
```

### Visual design — deferred

The look (colors, spacing, typography, component shapes) is NOT specified in this spec. Wireframes were used during brainstorming to decide flow and interaction only. Visual design happens during implementation when Tailwind styles are written against real components.

---

## 5. Error Handling

Three categories of errors, each with a distinct strategy. No try/catch in components — all error states come from TanStack Query's `isError` / `error` fields, populated automatically when a fetch or mutation rejects.

### Form validation errors (client-side, synchronous)

- Handled by react-hook-form + zod at the form level.
- Displayed inline next to the offending field (red text below the input).
- Examples: empty bagi name, fewer than 2 members, item amount ≤ 0, allocation not fully distributed (sum of allocation quantities !== item.quantity).
- The "Save Bagi" button stays disabled until the form is valid. zod validates the whole form on submit attempt, surfacing all errors at once.

### Network / mutation errors (from MSW or future real backend)

- TanStack Query exposes `mutation.isError` and `mutation.error`.
- Displayed as a toast or banner at the top of the current screen: "Failed to save — try again."
- MSW handlers simulate failures during dev (random error rate or specific error fixtures) so the failure path is actually exercised, not just the happy path.
- No automatic retry in milestone 1 (keep it simple). User taps "Retry" or re-triggers the action.

### Query fetch errors (loading a bagi that doesn't exist, etc.)

- TanStack Query exposes `query.isError`.
- List page (`/bagi`): error state with a retry button.
- Detail page of a non-existent bagi (`/bagi/:bagiId`): "Bagi not found" message with a link back to `/bagi`.

### Loading & empty states (not errors, but adjacent)

- `query.isLoading` / `mutation.isPending` → spinner or skeleton placeholder.
- Empty list (no bagi sessions yet) → friendly empty state with a "Create your first bagi" call-to-action.

---

## 6. Testing

### Milestone 1 — no test framework

Milestone 1 ships without a formal test runner. Verification is manual: run `npm run dev`, click through the wizard flows, and watch the TanStack Query DevTools panel to confirm cache behavior.

Rationale: milestone 1 is a learning milestone on a new stack (TanStack Query, Tailwind, MSW, react-hook-form, zod). Adding Vitest + React Testing Library on top would split focus without commensurate value — the code is expected to be rewritten as fluency grows, and the MSW layer already exercises the real data flow during manual dev.

### Automated quality gates

Two commands are gating and must pass before any milestone 1 work is considered done:

- `npm run lint` — ESLint flat config, `--max-warnings 0`. Warnings are fixed, not downgraded.
- `npm run build` — Vite production build must succeed.

### Future trigger for adding tests

Formal testing arrives when either of these happens (whichever comes first):

- **Milestone 2** — the split calculation. Proportional math, rounding, and settlement are exactly the kind of logic that demands automated tests.
- **Real backend arrival** — when data correctness against a real DB becomes critical.

At that point: Vitest + React Testing Library. The MSW handlers written in milestone 1 are reused directly as test fixtures (zero rework) — this is the compounding benefit of choosing MSW as the mock layer.
