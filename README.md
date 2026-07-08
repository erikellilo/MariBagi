# MariBagi

> "Mari Bagi" = "let's share/split" (Indonesian)

A single-device, no-account expense-splitting web app. One person creates a session, adds the group's expenses (manually or by scanning a receipt), allocates who had what, and sees how the total splits among everyone — all in one sitting, no signup, no server.

Built as a clean-slate rebuild to learn the modern frontend stack: **TanStack Query + Tailwind v4 + MSW + react-hook-form + zod**.

## Stack

- **React 18 + Vite 5 + TypeScript 5** (strict)
- **TanStack Query 5** — server state (cache, mutations, invalidation)
- **Tailwind v4** — styling; design tokens via `@theme` in `src/index.css`
- **MSW 2** — mock backend (intercepts `fetch` in-browser; in-memory store)
- **react-hook-form 7 + zod 3** — the 3-step wizard form + validation
- **react-router-dom 6** — routing
- Native `fetch`, `uuid`, `Intl.NumberFormat("id-ID")` for Rupiah

No backend, no database, no auth. The mock API lives entirely in the browser via MSW.

## Getting started

Requires **Node 22** (see `.nvmrc`).

```bash
git clone <repo-url>
cd maribagi
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server (MSW mocks active) |
| `npm run build` | Type-check (`tsc -b`) + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint (flat config, `--max-warnings 0` — must be clean) |

## How it works

1. **Create a bagi** — name it, add 2+ members.
2. **Add items** — manually, or "Scan receipt" (MSW returns a fixture of extracted line items).
3. **Allocate** — per item, pick who paid (display only) and how it's shared: equal share, or by quantity (click a member = +1 unit).
4. **Save** — see the result: each member's share of the total, with a per-item breakdown.

The split is **allocation-weighted**: each member's share is their portion of each item, summed. Rupiah rounds to nearest with a reconcile pass so shares always sum exactly to the bill.

## ⚠️ Known limitations (milestone 1)

- **Data resets on page refresh.** The MSW store is in-memory; there's no database. Durable persistence arrives with the backend in milestone 2.
- **Edit mode is a stub.** `/bagi/:id/edit` renders an empty wizard — pre-filling existing data is deferred.
- **No automated tests.** The split-calculation logic (`src/lib/splitCalc.ts`) is the one place that would benefit; deferred.
- **Quantity mode only increments** (+1 per click; no decrement — switch modes to reset).
- **No "who owes whom" settlement.** The result shows each member's share, not a minimized transaction list.

## Project structure

```
src/
  api/           fetch wrapper + per-entity API functions
  components/ui/ presentational primitives (Button, Input, Chip, …)
  hooks/         TanStack Query hooks (queries + mutations)
  lib/           formatRupiah, cn, computeSplit
  mocks/         MSW handlers + in-memory db + fixtures
  pages/         BagiListPage, BagiWizardPage, BagiDetailPage (result view)
  types/         entity + API shapes
  wizard/        zod schema + 3 steps + scan button
  index.css      Tailwind v4 @theme (design tokens)
```

## Docs

- `PRD.md` — product requirements (canonical)
- `docs/superpowers/specs/` — design specs (milestone 1, design system, split calc)
- `docs/superpowers/plans/` — implementation plans
