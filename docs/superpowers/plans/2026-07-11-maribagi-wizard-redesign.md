# Wizard Redesign — Single-Page Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3-step wizard (`BagiWizardPage` + Step1/Step2/Step3) with a single scrollable form page (Section1: name+mode, Section2: members, Section3: items with inline allocation).

**Architecture:** Single `BagiFormPage` hosts `useForm` with all form state. Three child sections render inline — no URL-driven step navigation. Tax/service moves from `Bagi` entity to `Item`. Scan populates items directly.

**Tech Stack:** React 18, TypeScript 5, TanStack Query 5, react-hook-form 7 + zod 3, Tailwind 4, Vite 5.

## Global Constraints

- `npm run lint` with `--max-warnings 0` MUST be clean
- `npm run build` MUST pass
- No comments in code
- No new dependencies
- Follow existing patterns: atomic mutations + query invalidation
- Currency: `Intl.NumberFormat("id-ID")` via `lib/format.ts`

---

### Task 1: Update data model — types and API contracts

**Files:**
- Modify: `src/types/entities.ts`
- Modify: `src/types/api.ts`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: `Bagi` without tax/service, `Item` with tax/service, updated `CreateBagiRequest`/`UpdateBagiRequest`/`CreateItemRequest`/`UpdateItemRequest`/`ScanResponse`

- [ ] **Step 1: Update `src/types/entities.ts`**

Remove `includeService` and `includeTax` from `Bagi`:

```typescript
export interface Bagi {
  id: string;
  name: string;
  date: number;
  createdAt: number;
}
```

Add `includeService` and `includeTax` to `Item`:

```typescript
export interface Item {
  id: string;
  bagiId: string;
  name: string;
  amount: number;
  quantity: number;
  paidBy: string;
  includeService: boolean;
  includeTax: boolean;
  allocation: Allocation[];
  createdAt: number;
}
```

All other interfaces (`Allocation`, `Userbagi`, `BagiDetail`, `BagiListItem`) stay unchanged.

- [ ] **Step 2: Update `src/types/api.ts`**

Remove tax/service from `CreateBagiRequest` and `UpdateBagiRequest`:

```typescript
export interface CreateBagiRequest {
  name: string;
}

export interface UpdateBagiRequest {
  name?: string;
}
```

Add tax/service to `CreateItemRequest` and `UpdateItemRequest`:

```typescript
export interface CreateItemRequest {
  name: string;
  amount: number;
  quantity: number;
  paidBy: string;
  includeService: boolean;
  includeTax: boolean;
  allocation: { memberId: string; quantity: number }[];
}

export interface UpdateItemRequest {
  name?: string;
  amount?: number;
  quantity?: number;
  paidBy?: string;
  includeService?: boolean;
  includeTax?: boolean;
  allocation?: { memberId: string; quantity: number }[];
}
```

Update `ScanResponse` — remove tax/service from `bagi`, add them to scanned `items`:

```typescript
export interface ScanResponse {
  bagi: {
    name: string;
    date: number;
  };
  items: { name: string; amount: number; quantity: number; includeService: boolean; includeTax: boolean }[];
}
```

- [ ] **Step 3: Verify type consistency**

Run: `rtk tsc`
Expected: type errors only in files we haven't updated yet (BagiWizardPage, handlers, fixtures, etc.). No new errors in `entities.ts` or `api.ts` themselves.

- [ ] **Step 4: Commit**

```bash
git add src/types/entities.ts src/types/api.ts
git commit -m "feat: move tax/service from Bagi to Item entity, update API contracts"
```

---

### Task 2: Update MSW handlers, mock DB, and scan fixture

**Files:**
- Modify: `src/mocks/db.ts`
- Modify: `src/mocks/handlers.ts`
- Modify: `src/mocks/fixtures.ts`

**Interfaces:**
- Consumes: updated `Bagi`, `Item`, `CreateBagiRequest`, `CreateItemRequest`, `UpdateItemRequest`, `ScanResponse` from Task 1
- Produces: MSW layer matches new data model

- [ ] **Step 1: Update `src/mocks/db.ts`**

Remove tax/service from seed data Bagi:

```typescript
db.bagi.set(bagiId, {
  id: bagiId,
  name: "Tiket Dufan",
  date: now,
  createdAt: now,
});
```

Add tax/service to seed data Item:

```typescript
db.item.set(itemId, {
  id: itemId,
  bagiId,
  name: "Hotel",
  amount: 400000,
  quantity: 1,
  paidBy: asepId,
  includeService: false,
  includeTax: false,
  allocation: [
    { memberId: asepId, quantity: 1 },
    { memberId: ucupId, quantity: 1 },
  ],
  createdAt: now,
});
```

- [ ] **Step 2: Update `src/mocks/handlers.ts`**

POST /api/bagi — remove tax/service from stored Bagi:

```typescript
const bagi = {
  id,
  name: body.name,
  date: now,
  createdAt: now,
};
```

PATCH /api/bagi — spread `...body` works since `UpdateBagiRequest` only has `name` now (unchanged, but verify).

POST /api/bagi/:bagiId/item — add tax/service to stored Item:

```typescript
const item = {
  id,
  bagiId: bagiId as string,
  name: body.name,
  amount: body.amount,
  quantity: body.quantity,
  paidBy: body.paidBy,
  includeService: body.includeService,
  includeTax: body.includeTax,
  allocation: body.allocation,
  createdAt: now,
};
```

PATCH /api/bagi/:bagiId/item — spread `...body` includes new optional fields (unchanged, verify).

POST /api/bagi/:bagiId/item/batch — add default tax/service to batch-created items:

```typescript
const item = {
  id,
  bagiId: bagiId as string,
  name: itemInput.name,
  amount: itemInput.amount,
  quantity: itemInput.quantity,
  paidBy: "",
  includeService: false,
  includeTax: false,
  allocation: [],
  createdAt: now,
};
```

- [ ] **Step 3: Update `src/mocks/fixtures.ts`**

```typescript
export const scanFixture: ScanResponse = {
  bagi: {
    name: "Restoran Padang",
    date: Date.now(),
  },
  items: [
    { name: "Nasi Rendang", amount: 45000, quantity: 2, includeService: true, includeTax: true },
    { name: "Ayam Pop", amount: 40000, quantity: 1, includeService: true, includeTax: true },
    { name: "Es Teh", amount: 8000, quantity: 3, includeService: true, includeTax: true },
    { name: "Nasi Putih", amount: 5000, quantity: 3, includeService: true, includeTax: true },
  ],
};
```

- [ ] **Step 4: Verify**

Run: `rtk tsc`
Expected: remaining type errors only in wizard components and BagiWizardPage (not yet updated).

- [ ] **Step 5: Commit**

```bash
git add src/mocks/db.ts src/mocks/handlers.ts src/mocks/fixtures.ts
git commit -m "feat: update MSW layer for tax/service on Item, remove from Bagi"
```

---

### Task 3: Update API client and hooks

**Files:**
- Modify: `src/api/bagiApi.ts` (no changes needed — types flow through generics)
- Modify: `src/api/itemApi.ts` (no changes needed — types flow through generics)
- Modify: `src/hooks/useCreateBagi.ts` (no changes needed)
- Modify: `src/api/scanApi.ts` — check for any type usage
- Verify: all hooks compile with new types

**Interfaces:**
- Consumes: updated types from Task 1, MSW handlers from Task 2
- Produces: hooks that work with new data model

- [ ] **Step 1: Read `src/api/scanApi.ts`**

Read the file to check if it needs changes for the updated `ScanResponse` type.

- [ ] **Step 2: Update if needed**

The scan API likely just returns `ScanResponse`, which is already updated. No code changes expected — the generic `apiPost` infers the return type.

- [ ] **Step 3: Verify hooks compile**

Run: `rtk tsc`
Check that `useCreateBagi`, `useUpdateBagi`, `useCreateItem`, `useUpdateItem` compile without errors (types flow from generics). Fix any type issues.

- [ ] **Step 4: Verify lint**

Run: `rtk lint`
Expected: 0 warnings, 0 errors (hooks and API files should be clean).

- [ ] **Step 5: Commit**

```bash
git add src/api/ src/hooks/
git commit -m "feat: verify API client and hooks compile with new types"
```

---

### Task 4: Update zod form schema

**Files:**
- Modify: `src/wizard/bagiFormSchema.ts`

**Interfaces:**
- Consumes: nothing new
- Produces: `BagiFormData` type matching the new form shape, `bagiFormSchema` zod schema

- [ ] **Step 1: Rewrite `src/wizard/bagiFormSchema.ts`**

```typescript
import { z } from "zod";

const allocationSchema = z.object({
  memberId: z.string().min(1),
  quantity: z.number().int().min(0),
});

const memberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Member name cannot be empty"),
});

const itemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Item name cannot be empty"),
  amount: z.number().int().positive("Amount must be greater than 0"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  paidBy: z.string().min(1, "Must assign who paid"),
  includeService: z.boolean(),
  includeTax: z.boolean(),
  allocation: z.array(allocationSchema),
});

export const bagiFormSchema = z
  .object({
    name: z.string().min(1, "Bagi name cannot be empty"),
    inputMode: z.enum(["form", "scan"]),
    showTaxService: z.boolean(),
    members: z.array(memberSchema).min(2, "Need at least 2 members"),
    items: z.array(itemSchema),
  })
  .superRefine((data, ctx) => {
    const names = data.members.map((m) => m.name.toLowerCase());
    const seen = new Set<string>();
    names.forEach((name, index) => {
      if (seen.has(name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate member name",
          path: ["members", index, "name"],
        });
      }
      seen.add(name);
    });

    const memberIds = new Set(data.members.map((m) => m.id));

    data.items.forEach((item, itemIndex) => {
      if (item.allocation.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must assign who shares this item",
          path: ["items", itemIndex, "allocation"],
        });
        return;
      }

      item.allocation.forEach((alloc, allocIndex) => {
        if (!memberIds.has(alloc.memberId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Allocation references an unknown member",
            path: ["items", itemIndex, "allocation", allocIndex, "memberId"],
          });
        }
      });

      if (!memberIds.has(item.paidBy)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "paidBy references an unknown member",
          path: ["items", itemIndex, "paidBy"],
        });
      }
    });
  });

export type BagiFormData = z.infer<typeof bagiFormSchema>;
```

- [ ] **Step 2: Verify schema compiles**

Run: `rtk tsc`
Expected: error only in `BagiWizardPage.tsx` (which uses old schema shape). No errors in the schema file itself.

- [ ] **Step 3: Commit**

```bash
git add src/wizard/bagiFormSchema.ts
git commit -m "feat: restructure zod schema — tax/service on items, add inputMode and showTaxService"
```

---

### Task 5: Create Section1Header component

**Files:**
- Create: `src/wizard/Section1Header.tsx`
- Modify: `src/wizard/ScanButton.tsx` (minor adaptation)

**Interfaces:**
- Consumes: `BagiFormData` type from Task 4
- Produces: `Section1Header` component with signature:
  ```typescript
  interface Section1HeaderProps {
    form: UseFormReturn<BagiFormData>;
  }
  ```

- [ ] **Step 1: Read current ScanButton to understand adaptation needs**

The current `ScanButton` takes `bagiId` and `onScanned`. In the new design, scan happens before the bagi exists. The scan mutation doesn't actually use `bagiId` (the MSW handler ignores it). Update `ScanButton` to not require `bagiId`:

```typescript
// In ScanButton.tsx — change props to not require bagiId
interface ScanButtonProps {
  onScanned: (data: { name: string; items: { name: string; amount: number; quantity: number; includeService: boolean; includeTax: boolean }[] }) => void;
}
```

And call `scanApi.scan("draft")` internally (keeps the API call pattern but removes the prop).

- [ ] **Step 2: Create `src/wizard/Section1Header.tsx`**

```typescript
import type { UseFormReturn } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Input } from "@/components/ui/Input";
import { ScanButton } from "./ScanButton";
import { cn } from "@/lib/cn";

interface Section1HeaderProps {
  form: UseFormReturn<BagiFormData>;
}

export const Section1Header = ({ form }: Section1HeaderProps) => {
  const { register, watch, setValue } = form;
  const inputMode = watch("inputMode");
  const errors = form.formState.errors;

  const handleScanned = (data: { name: string; items: { name: string; amount: number; quantity: number; includeService: boolean; includeTax: boolean }[] }) => {
    if (!form.getValues("name")) {
      form.setValue("name", data.name);
    }
    form.setValue(
      "items",
      data.items.map((item) => ({
        id: crypto.randomUUID(),
        name: item.name,
        amount: item.amount,
        quantity: item.quantity,
        paidBy: "",
        includeService: item.includeService,
        includeTax: item.includeTax,
        allocation: [],
      }))
    );
  };

  return (
    <div className="space-y-4">
      <Input
        label="Nama Bagi"
        placeholder="Tiket Dufan, Makan Senop..."
        {...register("name")}
        error={errors.name?.message}
      />

      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setValue("inputMode", "form")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            inputMode === "form" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
          )}
        >
          Form
        </button>
        <button
          type="button"
          onClick={() => setValue("inputMode", "scan")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            inputMode === "scan" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
          )}
        >
          AI Scan
        </button>
      </div>

      {inputMode === "scan" && <ScanButton onScanned={handleScanned} />}
    </div>
  );
};
```

- [ ] **Step 3: Update ScanButton props**

Modify `src/wizard/ScanButton.tsx`:

```typescript
import { useRef } from "react";
import type { ChangeEvent } from "react";
import { useScanReceipt } from "@/hooks/useScanReceipt";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

interface ScanButtonProps {
  onScanned: (data: { name: string; items: { name: string; amount: number; quantity: number; includeService: boolean; includeTax: boolean }[] }) => void;
}

export const ScanButton = ({ onScanned }: ScanButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanMutation = useScanReceipt("draft");

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    scanMutation.mutate(undefined, {
      onSuccess: (data) => {
        onScanned({ name: data.bagi.name, items: data.items });
      },
    });

    e.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="ghost"
        fullWidth
        onClick={handleClick}
        disabled={scanMutation.isPending}
      >
        {scanMutation.isPending ? (
          <span className="flex items-center gap-2">
            <Spinner className="h-4 w-4" /> Scanning...
          </span>
        ) : (
          "📷 Scan Receipt"
        )}
      </Button>
      {scanMutation.isError && (
        <p className="mt-1 text-xs text-danger">Scan failed — try again</p>
      )}
    </>
  );
};
```

- [ ] **Step 4: Verify**

Run: `rtk tsc`
Expected: errors only in files not yet updated (BagiWizardPage, etc.). `Section1Header.tsx` and `ScanButton.tsx` should compile.

- [ ] **Step 5: Commit**

```bash
git add src/wizard/Section1Header.tsx src/wizard/ScanButton.tsx
git commit -m "feat: add Section1Header with name input, mode toggle, and scan integration"
```

---

### Task 6: Create Section2Members component

**Files:**
- Create: `src/wizard/Section2Members.tsx`

**Interfaces:**
- Consumes: `BagiFormData` from Task 4
- Produces: `Section2Members` component with signature:
  ```typescript
  interface Section2MembersProps {
    form: UseFormReturn<BagiFormData>;
  }
  ```

- [ ] **Step 1: Create `src/wizard/Section2Members.tsx`**

```typescript
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Button } from "@/components/ui/Button";

interface Section2MembersProps {
  form: UseFormReturn<BagiFormData>;
}

export const Section2Members = ({ form }: Section2MembersProps) => {
  const { register, control } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "members" });
  const errors = form.formState.errors;

  useEffect(() => {
    if (fields.length === 0) {
      append({ id: crypto.randomUUID(), name: "" });
      append({ id: crypto.randomUUID(), name: "" });
    }
  }, [fields.length, append]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Anggota
        </span>
        <Button variant="ghost" size="sm" onClick={() => append({ id: crypto.randomUUID(), name: "" })}>
          + Tambah
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="relative">
            <input
              {...register(`members.${index}.name` as const)}
              placeholder={`Anggota ${index + 1}`}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 pr-7 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {fields.length > 2 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-danger"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {errors.members && (
        <p className="mt-1 text-xs text-danger">
          {errors.members.message ?? errors.members.root?.message ?? "Minimal 2 anggota"}
        </p>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify**

Run: `rtk tsc`
Expected: `Section2Members.tsx` compiles. Errors only in unreached files.

- [ ] **Step 3: Commit**

```bash
git add src/wizard/Section2Members.tsx
git commit -m "feat: add Section2Members with inline member add/remove"
```

---

### Task 7: Create ItemCard component

**Files:**
- Create: `src/wizard/ItemCard.tsx`

**Interfaces:**
- Consumes: `BagiFormData`, `Chip` component, `formatRupiah`, `cn`
- Produces: `ItemCard` component with signature:
  ```typescript
  interface ItemCardProps {
    form: UseFormReturn<BagiFormData>;
    index: number;
    onRemove: () => void;
    showTaxService: boolean;
  }
  ```

- [ ] **Step 1: Create `src/wizard/ItemCard.tsx`**

```typescript
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { useWatch } from "react-hook-form";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

interface ItemCardProps {
  form: UseFormReturn<BagiFormData>;
  index: number;
  onRemove: () => void;
  showTaxService: boolean;
}

type AllocMode = "shared" | "perUser";

export const ItemCard = ({ form, index, onRemove, showTaxService }: ItemCardProps) => {
  const { register, setValue, getValues } = form;
  const members = useWatch({ control: form.control, name: "members" });
  const item = useWatch({ control: form.control, name: `items.${index}` });

  const [mode, setMode] = useState<AllocMode>("shared");

  const updateItem = (updater: (item: BagiFormData["items"][number]) => BagiFormData["items"][number]) => {
    const current = getValues("items");
    setValue("items", current.map((it, i) => (i === index ? updater(it) : it)));
  };

  const toggleMemberShared = (memberId: string) => {
    updateItem((it) => {
      const existing = it.allocation.find((a) => a.memberId === memberId);
      const allocation = existing
        ? it.allocation.filter((a) => a.memberId !== memberId)
        : [...it.allocation, { memberId, quantity: 1 }];
      return { ...it, allocation };
    });
  };

  const incrementMemberQty = (memberId: string) => {
    updateItem((it) => {
      const allocated = it.allocation.reduce((sum, a) => sum + a.quantity, 0);
      if (allocated >= it.quantity) return it;
      const existing = it.allocation.find((a) => a.memberId === memberId);
      const allocation = existing
        ? it.allocation.map((a) => (a.memberId === memberId ? { ...a, quantity: a.quantity + 1 } : a))
        : [...it.allocation, { memberId, quantity: 1 }];
      return { ...it, allocation };
    });
  };

  const switchMode = (newMode: AllocMode) => {
    setMode(newMode);
    updateItem((it) => ({ ...it, allocation: [] }));
  };

  const getAllocated = (): number => {
    if (!item) return 0;
    return item.allocation.reduce((sum, a) => sum + a.quantity, 0);
  };

  const getRemaining = (): number => {
    if (!item) return 0;
    return item.quantity - getAllocated();
  };

  const allocated = item ? getAllocated() : 0;
  const remaining = getRemaining();
  const isFullyAllocated = allocated > 0 && (mode === "shared" ? true : remaining === 0);

  const serviceMultiplier = (item?.includeService ? 0.1 : 0) + (item?.includeTax ? 0.11 : 0);
  const displayAmount = item ? Math.round(item.amount * (1 + serviceMultiplier)) : 0;

  const perPersonAmount = allocated > 0 ? Math.round(displayAmount / allocated) : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2">
        <input
          {...register(`items.${index}.name` as const)}
          placeholder="Nama item"
          className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        />
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Qty</span>
          <input
            type="number"
            {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
            className="w-12 rounded-md border border-gray-300 px-1.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
            min={1}
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Rp</span>
          <input
            type="number"
            {...register(`items.${index}.amount` as const, { valueAsNumber: true })}
            className="w-24 rounded-md border border-gray-300 px-1.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
            placeholder="Harga"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-gray-400 hover:text-danger"
        >
          ✕
        </button>
      </div>

      {showTaxService && (
        <div className="mb-2 flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={item?.includeService ?? false}
              onChange={(e) => updateItem((it) => ({ ...it, includeService: e.target.checked }))}
            />
            Service 10%
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={item?.includeTax ?? false}
              onChange={(e) => updateItem((it) => ({ ...it, includeTax: e.target.checked }))}
            />
            Tax 11%
          </label>
          {serviceMultiplier > 0 && (
            <span className="text-xs font-medium text-brand-600">
              → {formatRupiah(displayAmount)}
            </span>
          )}
        </div>
      )}

      <div className="mb-2">
        <select
          value={item?.paidBy ?? ""}
          onChange={(e) => updateItem((it) => ({ ...it, paidBy: e.target.value }))}
          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs"
        >
          <option value="">Dibayar oleh ▾</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2 flex rounded-md bg-gray-100 p-0.5">
        <button
          type="button"
          onClick={() => switchMode("shared")}
          className={cn(
            "flex-1 rounded px-2 py-1 text-xs font-medium",
            mode === "shared" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
          )}
        >
          Shared All
        </button>
        <button
          type="button"
          onClick={() => switchMode("perUser")}
          className={cn(
            "flex-1 rounded px-2 py-1 text-xs font-medium",
            mode === "perUser" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
          )}
        >
          Per User
        </button>
      </div>

      {mode === "perUser" && (
        <p className={cn("mb-2 text-xs", remaining === 0 ? "text-green-600" : "text-gray-500")}>
          {remaining === 0 ? "Fully allocated" : `${remaining} remaining of ${item?.quantity ?? 0}`}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {members?.map((m) => {
          const allocEntry = item?.allocation.find((a) => a.memberId === m.id);
          const isSelected = !!allocEntry;
          const isDisabled = mode === "perUser" && !isSelected && remaining === 0;

          return (
            <Chip
              key={m.id}
              label={m.name.charAt(0).toUpperCase()}
              selected={isSelected}
              {...(mode === "perUser" && allocEntry ? { count: allocEntry.quantity } : {})}
              disabled={isDisabled}
              onClick={() => {
                if (mode === "shared") {
                  toggleMemberShared(m.id);
                } else {
                  incrementMemberQty(m.id);
                }
              }}
            />
          );
        })}
      </div>

      {isFullyAllocated && (
        <p className="mt-1 text-[10px] text-gray-400">
          {mode === "shared"
            ? `${allocated} × ${formatRupiah(perPersonAmount)} each`
            : item?.allocation
                .map((a) => `${members?.find((m) => m.id === a.memberId)?.name ?? "?"}: ${formatRupiah(perPersonAmount * a.quantity)}`)
                .join(" · ")}
        </p>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify**

Run: `rtk tsc`
Expected: `ItemCard.tsx` compiles. Errors only in unreached files.

- [ ] **Step 3: Commit**

```bash
git add src/wizard/ItemCard.tsx
git commit -m "feat: add ItemCard with inline allocation, tax/service, paidBy dropdown"
```

---

### Task 8: Create Section3Items component

**Files:**
- Create: `src/wizard/Section3Items.tsx`

**Interfaces:**
- Consumes: `BagiFormData`, `ItemCard`, `Button`
- Produces: `Section3Items` component with signature:
  ```typescript
  interface Section3ItemsProps {
    form: UseFormReturn<BagiFormData>;
    onSave: () => void;
    isSubmitting: boolean;
  }
  ```

- [ ] **Step 1: Create `src/wizard/Section3Items.tsx`**

```typescript
import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { ItemCard } from "./ItemCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface Section3ItemsProps {
  form: UseFormReturn<BagiFormData>;
  onSave: () => void;
  isSubmitting: boolean;
}

export const Section3Items = ({ form, onSave, isSubmitting }: Section3ItemsProps) => {
  const { control, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const showTaxService = useWatch({ control, name: "showTaxService" });

  const handleAddItem = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      amount: 0,
      quantity: 1,
      paidBy: "",
      includeService: false,
      includeTax: false,
      allocation: [],
    });
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showTaxService ?? false}
          onChange={(e) => setValue("showTaxService", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-gray-600">Sertakan Pajak & Service</span>
      </label>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <ItemCard
            key={field.id}
            form={form}
            index={index}
            onRemove={() => remove(index)}
            showTaxService={showTaxService ?? false}
          />
        ))}
      </div>

      {fields.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-400">
          Belum ada item. Tambah manual atau scan receipt.
        </p>
      )}

      <Button variant="ghost" fullWidth onClick={handleAddItem}>
        + Tambah Item
      </Button>

      <Button fullWidth onClick={onSave} disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : "Simpan Bagi"}
      </Button>
    </div>
  );
};
```

- [ ] **Step 2: Verify**

Run: `rtk tsc`
Expected: `Section3Items.tsx` compiles.

- [ ] **Step 3: Commit**

```bash
git add src/wizard/Section3Items.tsx
git commit -m "feat: add Section3Items with tax/service toggle, item list, and save button"
```

---

### Task 9: Create BagiFormPage (replaces BagiWizardPage)

**Files:**
- Create: `src/pages/BagiFormPage.tsx`
- (BagiWizardPage.tsx will be removed in Task 11)

**Interfaces:**
- Consumes: all 3 section components, `bagiFormSchema`, TanStack Query hooks, API clients
- Produces: page component at routes `/bagi/new` and `/bagi/:id/edit`

- [ ] **Step 1: Create `src/pages/BagiFormPage.tsx`**

```typescript
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { bagiFormSchema } from "@/wizard/bagiFormSchema";
import type { BagiFormData } from "@/wizard/bagiFormSchema";
import { Section1Header } from "@/wizard/Section1Header";
import { Section2Members } from "@/wizard/Section2Members";
import { Section3Items } from "@/wizard/Section3Items";
import { useCreateBagi } from "@/hooks/useCreateBagi";
import { useBagiDetail } from "@/hooks/useBagiDetail";
import { useUpdateBagi } from "@/hooks/useUpdateBagi";
import { userbagiApi } from "@/api/userbagiApi";
import { itemApi } from "@/api/itemApi";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

const DEFAULT_VALUES: BagiFormData = {
  name: "",
  inputMode: "form",
  showTaxService: false,
  members: [],
  items: [],
};

const BagiFormPage = () => {
  const navigate = useNavigate();
  const { bagiId } = useParams<{ bagiId: string }>();
  const isEdit = !!bagiId;

  const form = useForm<BagiFormData>({
    resolver: zodResolver(bagiFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const { data: existing, isLoading, isError, refetch } = useBagiDetail(bagiId ?? "");

  useEffect(() => {
    if (existing && isEdit) {
      form.reset({
        name: existing.name,
        inputMode: "form",
        showTaxService: existing.items.some((i) => i.includeService || i.includeTax),
        members: existing.members.map((m) => ({ id: m.id, name: m.name })),
        items: existing.items.map((i) => ({
          id: i.id,
          name: i.name,
          amount: i.amount,
          quantity: i.quantity,
          paidBy: i.paidBy,
          includeService: i.includeService,
          includeTax: i.includeTax,
          allocation: i.allocation.map((a) => ({ memberId: a.memberId, quantity: a.quantity })),
        })),
      });
    }
  }, [existing, isEdit, form]);

  const createBagi = useCreateBagi();
  const updateBagi = useUpdateBagi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const valid = await form.trigger();
      if (!valid) return;

      const data = form.getValues();

      if (isEdit && bagiId) {
        await updateBagi.mutateAsync({ id: bagiId, body: { name: data.name } });

        const existingMemberIds = new Set(existing?.members.map((m) => m.id) ?? []);
        const formMemberIds = new Set<string>();

        for (const member of data.members) {
          if (existingMemberIds.has(member.id)) {
            await userbagiApi.update(bagiId, member.id, { name: member.name });
          } else {
            const created = await userbagiApi.create(bagiId, { name: member.name });
            form.setValue(`members.${data.members.indexOf(member)}.id`, created.id);
          }
          formMemberIds.add(member.id);
        }

        for (const existingId of existingMemberIds) {
          if (!formMemberIds.has(existingId)) {
            await userbagiApi.delete(bagiId, existingId);
          }
        }

        const existingItemIds = new Set(existing?.items.map((i) => i.id) ?? []);

        for (const item of data.items) {
          if (existingItemIds.has(item.id)) {
            await itemApi.update(bagiId, item.id, {
              name: item.name,
              amount: item.amount,
              quantity: item.quantity,
              paidBy: item.paidBy,
              includeService: item.includeService,
              includeTax: item.includeTax,
              allocation: item.allocation,
            });
          } else {
            await itemApi.create(bagiId, {
              name: item.name,
              amount: item.amount,
              quantity: item.quantity,
              paidBy: item.paidBy,
              includeService: item.includeService,
              includeTax: item.includeTax,
              allocation: item.allocation,
            });
          }
        }

        for (const existingId of existingItemIds) {
          if (!data.items.some((i) => i.id === existingId)) {
            await itemApi.delete(bagiId, existingId);
          }
        }
      } else {
        const createdBagi = await createBagi.mutateAsync({ name: data.name });

        const memberIdMap = new Map<string, string>();
        for (const member of data.members) {
          const created = await userbagiApi.create(createdBagi.id, { name: member.name });
          memberIdMap.set(member.id, created.id);
        }

        for (const item of data.items) {
          await itemApi.create(createdBagi.id, {
            name: item.name,
            amount: item.amount,
            quantity: item.quantity,
            paidBy: memberIdMap.get(item.paidBy) ?? "",
            includeService: item.includeService,
            includeTax: item.includeTax,
            allocation: item.allocation.map((a) => ({
              memberId: memberIdMap.get(a.memberId) ?? "",
              quantity: a.quantity,
            })),
          });
        }

        navigate(`/bagi/${createdBagi.id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isEdit && isError) {
    return (
      <div className="mx-auto max-w-md px-4 py-6">
        <ErrorBanner message="Gagal memuat Bagi" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-sm text-brand-600">
          ‹ Back
        </button>
        <h1 className="text-lg font-bold text-gray-900">
          {isEdit ? "Edit Bagi" : "Bagi Baru"}
        </h1>
      </div>

      <Section1Header form={form} />
      <Section2Members form={form} />
      <Section3Items form={form} onSave={handleSave} isSubmitting={isSubmitting} />
    </div>
  );
};

export default BagiFormPage;
```

- [ ] **Step 2: Verify**

Run: `rtk tsc`
Expected: `BagiFormPage.tsx` compiles. Still errors in `BagiWizardPage.tsx` (will be removed).

- [ ] **Step 3: Commit**

```bash
git add src/pages/BagiFormPage.tsx
git commit -m "feat: add BagiFormPage — single-page layout with inline allocation, create and edit modes"
```

---

### Task 10: Update App.tsx routes

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `BagiFormPage`
- Produces: updated router config

- [ ] **Step 1: Update `src/App.tsx`**

```typescript
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import BagiListPage from "@/pages/BagiListPage";
import BagiFormPage from "@/pages/BagiFormPage";
import BagiDetailPage from "@/pages/BagiDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/bagi" replace />,
  },
  {
    path: "/bagi",
    element: <BagiListPage />,
  },
  {
    path: "/bagi/new",
    element: <BagiFormPage />,
  },
  {
    path: "/bagi/:bagiId",
    element: <BagiDetailPage />,
  },
  {
    path: "/bagi/:bagiId/edit",
    element: <BagiFormPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
```

- [ ] **Step 2: Verify**

Run: `rtk tsc`
Expected: error in `BagiWizardPage.tsx` because it's still imported nowhere but the file itself exists with old types. That's fine — we remove it next.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update routes — /bagi/new and /bagi/:id/edit use new BagiFormPage"
```

---

### Task 11: Remove old wizard files

**Files:**
- Delete: `src/wizard/WizardSteps.tsx`
- Delete: `src/wizard/Step1Setup.tsx`
- Delete: `src/wizard/Step2Items.tsx`
- Delete: `src/wizard/Step3Sharing.tsx`
- Delete: `src/pages/BagiWizardPage.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: clean build

- [ ] **Step 1: Delete old files**

```bash
rm src/wizard/WizardSteps.tsx
rm src/wizard/Step1Setup.tsx
rm src/wizard/Step2Items.tsx
rm src/wizard/Step3Sharing.tsx
rm src/pages/BagiWizardPage.tsx
```

- [ ] **Step 2: Verify type-check**

Run: `rtk tsc`
Expected: 0 errors. If there are leftover imports, fix them.

- [ ] **Step 3: Commit**

```bash
git add -u
git commit -m "feat: remove old 3-step wizard files"
```

---

### Task 12: Final verification — lint and build

**Files:**
- None (verification only)

- [ ] **Step 1: Run lint**

```bash
rtk lint
```
Expected: 0 warnings, 0 errors.

- [ ] **Step 2: Run type-check**

```bash
rtk tsc
```
Expected: 0 errors.

- [ ] **Step 3: Run build**

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Final commit**

```bash
git status
git add -A
git commit -m "chore: final verification — lint, tsc, build all pass"
```
