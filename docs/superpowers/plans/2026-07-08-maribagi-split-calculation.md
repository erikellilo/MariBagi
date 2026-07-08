# MariBagi — Split Calculation & Result View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the missing "split" half of milestone 1 — a pure allocation-weighted calculation that turns a saved bagi's items into per-member shares, and a result view at `/bagi/:id` showing each member's share + a per-item breakdown.

**Architecture:** One pure synchronous function (`computeSplit`) derived on read via `useMemo` inside the existing `BagiDetailPage`. No new endpoint, hook, or state. Round-to-nearest rupiah with a reconciliation pass so shares always sum exactly to each item's amount. `paidBy` is displayed but never calculated on.

**Tech Stack:** React 18, TypeScript 5 (strict), TanStack Query (existing `useBagiDetail`), Tailwind v4, `Intl.NumberFormat("id-ID")`.

**Spec:** `docs/superpowers/specs/2026-07-08-maribagi-split-calculation-design.md`

## Global Constraints

- **No test framework** in this feature (per spec — product decision). Verification is `npm run lint` + `npm run build` + manual demo of the result page.
- **Lint is gating:** `npm run lint` (includes `--max-warnings 0`) MUST be clean. No `eslint-disable`.
- **Build is gating:** `npm run build` MUST succeed.
- **TypeScript:** strict + `exactOptionalPropertyTypes` + `noImplicitAny`. No `any`.
- **No comments** in source files.
- **Extensions:** `.ts` for `splitCalc.ts`, `.tsx` for the page.
- **Formatting:** double quotes, semicolons, printWidth 130, trailingComma es5, arrowParens avoid.
- **Currency:** `formatRupiah` from `@/lib/format` (already exists). No decimals.

---

## File Structure

```
src/lib/splitCalc.ts          # NEW — pure computeSplit + result types
src/pages/BagiDetailPage.tsx  # REWRITE — raw allocation dump → result view
```

No other files touched. Existing `useBagiDetail`, `BagiDetail`/`Item`/`Userbagi` types, and UI primitives are consumed as-is.

---

## Task 1: The `computeSplit` Function

**Goal:** A pure function that turns `members[]` + `items[]` (each item carrying `allocation: [{ memberId, quantity }]`) into per-member shares, with round-to-nearest + reconcile so each item's shares sum exactly to its amount.

**Files:**
- Create: `src/lib/splitCalc.ts`

**Interfaces:**
- Consumes: `Item`, `Userbagi` from `@/types/entities` (both already exist).
- Produces: `computeSplit(members, items): SplitResult`, plus exported types `SplitResult`, `MemberShare`, `ItemShareBreakdown` (consumed by Task 2).

- [ ] **Step 1: Create `src/lib/splitCalc.ts`**

```typescript
import type { Item, Userbagi } from "@/types/entities";

export interface MemberShare {
  memberId: string;
  share: number;
}

export interface ItemShareBreakdown {
  itemId: string;
  amount: number;
  shares: { memberId: string; amount: number }[];
}

export interface SplitResult {
  grandTotal: number;
  members: MemberShare[];
  itemBreakdown: ItemShareBreakdown[];
}

interface Rounded {
  memberId: string;
  amount: number;
  error: number;
}

const splitItem = (item: Item): { memberId: string; amount: number }[] => {
  const allocation = item.allocation;
  if (allocation.length === 0) return [];

  const totalQty = allocation.reduce((sum, a) => sum + a.quantity, 0);
  const effective = totalQty === 0 ? allocation.map((a) => ({ memberId: a.memberId, qty: 1 })) : allocation.map((a) => ({ memberId: a.memberId, qty: a.quantity }));

  if (effective.length === 1) {
    return [{ memberId: effective[0].memberId, amount: item.amount }];
  }

  const total = effective.reduce((sum, e) => sum + e.qty, 0);
  const rounded: Rounded[] = effective.map((e) => {
    const exact = (e.qty / total) * item.amount;
    return { memberId: e.memberId, amount: Math.round(exact), error: exact - Math.round(exact) };
  });

  const diff = item.amount - rounded.reduce((sum, r) => sum + r.amount, 0);
  if (diff !== 0) {
    const order = [...rounded.keys()].sort((a, b) => (diff > 0 ? rounded[b].error - rounded[a].error : rounded[a].error - rounded[b].error));
    const delta = diff > 0 ? 1 : -1;
    const count = Math.abs(diff);
    for (let i = 0; i < count; i++) {
      rounded[order[i]].amount += delta;
    }
  }

  return rounded.map(({ memberId, amount }) => ({ memberId, amount }));
};

export const computeSplit = (members: Userbagi[], items: Item[]): SplitResult => {
  const itemBreakdown: ItemShareBreakdown[] = items.map((item) => ({
    itemId: item.id,
    amount: item.amount,
    shares: splitItem(item),
  }));

  const totals = new Map<string, number>();
  for (const m of members) totals.set(m.id, 0);
  for (const item of itemBreakdown) {
    for (const share of item.shares) {
      totals.set(share.memberId, (totals.get(share.memberId) ?? 0) + share.amount);
    }
  }

  const memberShares: MemberShare[] = members.map((m) => ({
    memberId: m.id,
    share: totals.get(m.id) ?? 0,
  }));

  const grandTotal = items.reduce((sum, item) => sum + item.amount, 0);

  return { grandTotal, members: memberShares, itemBreakdown };
};
```

Algorithm notes (verify by reading the code against these worked examples — there are no automated tests per spec):
- Equal split, Rp 100.000 ÷ 3 → exact 33.333.33 each, round 33.333, diff +1 → first member +1 → `33.334 / 33.333 / 33.333`, sums to 100.000.
- Rp 100.000 ÷ 6 → round 16.667 each, sum 100.002, diff −2 → two members −1 → four ×16.667 + two ×16.666 = 100.000.
- Weighted, Rp 90.000 qty 3 (A 2, B 1) → A 60.000, B 30.000, diff 0.
- `totalQty === 0` guard → equal split among allocation members. Single allocation → full amount.

- [ ] **Step 2: Verify lint**

```bash
npm run lint
```
Expected: clean, 0 warnings.

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: succeeds (the new module compiles under strict + exactOptionalPropertyTypes).

- [ ] **Step 4: Commit**

```bash
git add src/lib/splitCalc.ts
git commit -m "feat: pure computeSplit function (allocation-weighted, round-to-nearest with reconcile)"
```

---

## Task 2: Result View (`BagiDetailPage` rewrite)

**Goal:** Replace the current raw-allocation dump at `/bagi/:id` with a result view: grand total, each member's share (headline), and a per-item breakdown showing "paid by" (display only).

**Files:**
- Rewrite: `src/pages/BagiDetailPage.tsx` (entire file replaced)

**Interfaces:**
- Consumes: `computeSplit`, `SplitResult` from `@/lib/splitCalc` (Task 1); `useBagiDetail` from `@/hooks/useBagiDetail`; `formatRupiah` from `@/lib/format`; UI primitives `Button`, `Spinner`, `ErrorBanner`.

- [ ] **Step 1: Rewrite `src/pages/BagiDetailPage.tsx`**

Replace the entire file with:

```tsx
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBagiDetail } from "@/hooks/useBagiDetail";
import { computeSplit } from "@/lib/splitCalc";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { formatRupiah } from "@/lib/format";

const BagiDetailPage = () => {
  const { bagiId } = useParams();
  const navigate = useNavigate();
  const { data: bagi, isLoading, isError, refetch } = useBagiDetail(bagiId ?? "");

  const split = useMemo(() => (bagi ? computeSplit(bagi.members, bagi.items) : null), [bagi]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <ErrorBanner message="Bagi not found or failed to load" onRetry={() => refetch()} />
        <Button variant="ghost" onClick={() => navigate("/bagi")} className="mt-4">
          ← Back to list
        </Button>
      </div>
    );
  }

  if (!bagi || !split) return null;

  const memberName = (id: string): string => bagi.members.find((m) => m.id === id)?.name ?? "?";

  const sortedMembers = [...split.members].sort((a, b) => b.share - a.share);

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4">
        <button onClick={() => navigate("/bagi")} className="text-sm text-blue-600">
          ‹ Back
        </button>
      </div>

      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{bagi.name}</h1>
        <p className="text-xs text-gray-400">{new Date(bagi.date).toLocaleDateString("id-ID")}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{formatRupiah(split.grandTotal)}</p>
        <p className="text-xs text-gray-400">total · split among {bagi.members.length}</p>
      </header>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Each member's share</h2>
        <ul className="space-y-2">
          {sortedMembers.map((m) => (
            <li key={m.memberId} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
              <span className="font-medium text-gray-900">{memberName(m.memberId)}</span>
              <span className="font-semibold text-gray-900">{formatRupiah(m.share)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Item breakdown</h2>
        {bagi.items.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No items recorded.</p>
        ) : (
          <ul className="space-y-2">
            {split.itemBreakdown.map((item) => {
              const original = bagi.items.find((i) => i.id === item.itemId);
              return (
                <li key={item.itemId} className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{original?.name ?? "?"}</p>
                      <p className="text-xs text-gray-400">paid by {memberName(original?.paidBy ?? "")}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{formatRupiah(item.amount)}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.shares.map((s, i) => (
                      <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                        {memberName(s.memberId)}: {formatRupiah(s.amount)}
                      </span>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Button variant="ghost" fullWidth onClick={() => navigate("/bagi")}>
        ← Back to list
      </Button>
    </div>
  );
};

export default BagiDetailPage;
```

- [ ] **Step 2: Verify lint**

```bash
npm run lint
```
Expected: clean, 0 warnings.

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: succeeds.

- [ ] **Step 4: Verify dev server boots**

```bash
npm run dev
```
Expected: Vite prints the localhost URL, no errors. Kill it. (Full click-through verification — create a bagi, save, land on the result page, confirm shares sum to total — is done manually by the controller/human after this task.)

- [ ] **Step 5: Commit**

```bash
git add src/pages/BagiDetailPage.tsx
git commit -m "feat: result view at /bagi/:id — per-member shares + item breakdown (paidBy display-only)"
```

---

## Post-Implementation Checklist

- [ ] `npm run lint` passes with 0 warnings.
- [ ] `npm run build` succeeds.
- [ ] Create a bagi with 2 members + a qty-1 item shared equally → result page shows each member ~half, summing to the item amount exactly.
- [ ] Create a bagi with a qty-3 item split 2/1 → result page shows the weighted shares (2/3 and 1/3 of the amount), summing exactly.
- [ ] Confirm "paid by" appears per item but does not affect the share numbers.
- [ ] Member shares always sum exactly to the grand total (no off-by-one rupiah).
