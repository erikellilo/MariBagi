---
status: approved — pending implementation
date: 2026-07-08
relates-to: PRD.md (§6.2 split calc, §7 milestone 1). Note: PRD §7.1 overrides the original split-calc deferral; split calc is IN milestone 1.
---

# MariBagi — Split Calculation & Result View Design

## 1. Overview

Milestone 1's data-entry half is complete (session/member/item CRUD, 3-step wizard, receipt scan, read-only detail page). The PRD §7 overrides the older milestone-1 spec by moving the split calculation and result view INTO milestone 1: "a splitter that doesn't split isn't a portfolio-quality deliverable." This spec designs that missing half.

Per product direction, the result is **each member's share of the total bill** (allocation-weighted) — NOT the PRD's "net = paid − owed / who owes whom" reconciliation. The group reads their shares and settles informally. `paidBy` is captured for display only and is not used in any calculation.

## 2. Scope

**In scope:**
- A pure client-side calculation function: turns `members[]` + `items[]` (each item carrying `allocation: [{ memberId, quantity }]`) into per-member shares.
- A result view at `/bagi/:id` (replaces the current read-only detail page) showing each member's total share + a per-item breakdown.
- Round-to-nearest rupiah with a reconciliation pass so shares always sum exactly to each item's amount (and member totals to the grand total).

**Out of scope (explicit):**
- Net reconciliation / "who owes whom" (product decision: shares only).
- Settle-up minimization (fewest-transactions algorithm) — already out per PRD §6.1.
- Automated tests — deferred per product decision (calc is pure and demo-verifiable).
- Any change to the wizard, zod schema, entities, API, or MSW handlers. `paidBy` capture is unchanged; the calc ignores it.

## 3. The Calculation

### 3.1 Location & signature

Pure function in `src/lib/splitCalc.ts`:

```typescript
import type { Item, Userbagi } from "@/types/entities";

interface MemberShare {
  memberId: string;
  share: number;
}

interface ItemShareBreakdown {
  itemId: string;
  amount: number;
  shares: { memberId: string; amount: number }[];
}

interface SplitResult {
  grandTotal: number;
  members: MemberShare[];
  itemBreakdown: ItemShareBreakdown[];
}

export const computeSplit = (members: Userbagi[], items: Item[]): SplitResult => {
  // see algorithm below
};
```

### 3.2 Algorithm

For each item:
1. `totalQty = sum(item.allocation.quantity)`.
2. Per allocation entry: `exact = (entry.quantity / totalQty) * item.amount`.
3. Round-to-nearest: `rounded = Math.round(exact)`.
4. Reconcile: `diff = item.amount - sum(rounded)`. If `diff !== 0`, adjust `|diff|` members by ±1 — selecting the members with the largest rounding error (`exact - rounded`) — until shares sum exactly to `item.amount`. (`diff > 0` → add 1 to the members rounded down the most; `diff < 0` → subtract 1 from the members rounded up the most.)
5. Emit the item's per-member shares.

Member totals: sum each member's per-item shares across all items. `grandTotal = sum(item.amount)`. By construction, member totals sum to grandTotal.

### 3.3 Guards

- `totalQty === 0` (all-zero allocation — should not occur given wizard semantics, but defensive): split the item's amount equally among its allocation member ids.
- Item with a single allocation entry: that member gets the full amount, no rounding needed.
- Member appearing in no allocation: share 0.

### 3.4 Rounding rationale

Round-to-nearest is the product choice. Plain rounding alone can leave shares short/over the item amount (e.g. Rp 100.000 ÷ 3 → 33.333 × 3 = 99.999, one rupiah short). The reconciliation pass preserves the "round to nearest" intent while guaranteeing shares sum exactly — a splitter whose numbers don't add up to the bill would read as broken. The correction is typically 0–2 rupiah spread across 1–2 members.

## 4. Result View

### 4.1 Placement

`/bagi/:id` — the existing `src/pages/BagiDetailPage.tsx` is rewritten from a raw allocation dump into the result view. The wizard's post-save redirect already targets this route, so a fresh save lands on the result.

### 4.2 Layout

1. **Header** — bagi name, date, **grand total** (prominent, Rupiah).
2. **Per-member summary (headline)** — each member's total share, Rupiah, sorted by share desc. Visually the primary answer ("how much it's split"). A small "shares sum to grand total" affordance reinforces correctness.
3. **Per-item breakdown (working)** — each item: name, amount, **"paid by {name}"** (display only, not calculated), and how that item's amount divided among its members.

Reuses `useBagiDetail`, existing UI primitives (`Spinner`, `ErrorBanner`, `Button`), and `formatRupiah`. Loading / error / empty states retained from the current page.

### 4.3 Data flow

`useBagiDetail(id)` → `{ members, items }` → `useMemo(() => computeSplit(members, items))` → render. The calculation is pure and synchronous; no new hook, endpoint, or state.

## 5. Non-Goals / Deferred

- Tests (Vitest) — deferred; revisit when calc logic grows or before milestone 2.
- `paidBy`-based reconciliation / settlement — not wanted for this context.
- Minimized settlement (fewest transactions) — PRD §6.1 out of scope.
- Persisting the computed result — it's derived on read from stored allocations; no new persistence.

## 6. Files

- **Add:** `src/lib/splitCalc.ts` (the `computeSplit` function + `SplitResult` / `MemberShare` / `ItemShareBreakdown` types).
- **Rewrite:** `src/pages/BagiDetailPage.tsx` (raw allocation dump → result view).
- No other files touched.
