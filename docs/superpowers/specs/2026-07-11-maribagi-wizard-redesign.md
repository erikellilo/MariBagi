# MariBagi — Wizard Redesign (Single-Page Layout)

> **Status:** Draft — pending user review.
> **Date:** 2026-07-11
> **Context:** Replaces the 3-step wizard (`BagiWizardPage` + Step1/Step2/Step3) with a single scrollable form page.

---

## 1. Motivation

The current 3-step wizard splits Bagi creation across Setup → Items → Sharing. In practice:

- Users want to see members and items together — allocation decisions are item-driven, not a separate step.
- The AI/receipt scan flow should be a first-class input mode, not a step-2 button.
- Tax & service are per-item (e.g. "Vacation" Bagi: dinner has tax, ticket doesn't).

This redesign flattens the flow into one page with three sections, makes AI scan a header-level mode choice, and inlines allocation into each item card.

---

## 2. Page Layout

Single scrollable page. Routes:

| Route | Purpose |
|-------|---------|
| `/bagi/new` | Create |
| `/bagi/:id/edit` | Edit |

Removed: `/bagi/new/items`, `/bagi/new/sharing`.

### Section 1 — Bagi Header

```
┌─────────────────────────────────────────────┐
│  Nama Bagi                                   │
│  [___________________________]               │
│                                              │
│  Mode:   [ Form ]  [ AI Scan ]               │
│  (AI):   [📷 Scan Receipt]                   │
└─────────────────────────────────────────────┘
```

| Field | Behavior |
|-------|----------|
| Nama Bagi | Text input, required |
| Mode toggle | Form (manual entry) or AI Scan (receipt extraction) |
| Scan button | Visible only in AI mode. Fires `useScanReceipt` — populates items from fixture. User can still add items manually after scan. |

**Decision:** Tax/service toggles live in Section 3, not here. Section 1 is name + mode only.

### Section 2 — Members

```
┌─────────────────────────────────────────────┐
│  Anggota                           [+ Tambah]│
│                                              │
│  [Andi ✕]  [Budi ✕]  [Cici ✕]               │
└─────────────────────────────────────────────┘
```

| Behavior | Detail |
|----------|--------|
| Add member | Inline input + confirm, or a small modal/drawer |
| Remove member | ✕ button on each chip |
| Cascading | Adding a member adds an unselected chip to every item card below. Removing a member removes their chip from all items. |
| Delete validation | Deferred — removing a member with active allocations warns but allows. (Ponytail: guard later, not now.) |

### Section 3 — Items + Tax/Service Toggle

Global toggle at the top of Section 3:

```
[☐ Sertakan Pajak & Service]
```

**Off (default):** Items show base prices. Tax/service checkboxes hidden.
**On:** Tax/service fields appear in every item card. Toggling on/off never clears data — just shows/hides the fields.

Each item card:

```
┌──────────────────────────────────────────────────┐
│  [Nama Item___]  Qty[_2_]  Harga[_50000_]  [✕]  │
│                                                   │
│  ☐ Service 10%    ☐ Tax 11%     → Rp 60.500      │
│  Dibayar oleh: [Budi ▾]                           │
│                                                   │
│  [ Shared All ]  [ Per User ]                     │
│                                                   │
│  [Andi ✓] [Budi] [Cici ✓]         0 remaining     │
│  2 × Rp 30.250                                    │
└──────────────────────────────────────────────────┘
```

| Field | Behavior |
|-------|----------|
| Nama Item | Text input |
| Qty | Number, default 1 |
| Harga | Number (Rupiah), base price (before tax/service) |
| Service/Tax | Checkboxes; only visible when Section 3 toggle is ON. Price preview updates live. |
| Dibayar oleh | `<select>` dropdown of members |
| Shared All | All members auto-allocated (qty 1 each). Tap a chip to remove that member from this item. |
| Per User | Tap member chips to increment their allocation qty. Shows remaining counter. Max = item qty. |
| Member chips | Initials (first letter). ✓ checkmark when allocated. Count badge in Per User mode. |
| Summary line | Per-person cost when fully allocated. Hides when allocation is incomplete. |

Bottom of section:

```
  [+ Tambah Item]
  [Simpan Bagi]    [Bagikan ▸]  (deferred)
```

**"Bagikan" button** — deferred to a follow-up. Converts the Bagi to an image/PDF or shares via WhatsApp.

---

## 3. Data Model Changes

### 3.1 Bagi entity

Remove `includeService` and `includeTax`:

```typescript
interface Bagi {
  id: string;
  name: string;
  date: number;
  createdAt: number;
}
```

### 3.2 Item entity

Add `includeService` and `includeTax`:

```typescript
interface Item {
  id: string;
  bagiId: string;
  name: string;
  amount: number;       // base price (before tax/service)
  quantity: number;
  paidBy: string;       // userbagi.id
  includeService: boolean;  // NEW
  includeTax: boolean;      // NEW
  allocation: Allocation[];
  createdAt: number;
}
```

### 3.3 Form state (transient, not persisted)

```typescript
interface BagiFormData {
  name: string;
  inputMode: "form" | "scan";        // transient
  showTaxService: boolean;           // transient — Section 3 toggle
  members: { id: string; name: string }[];
  items: {
    id: string;
    name: string;
    amount: number;
    quantity: number;
    paidBy: string;
    includeService: boolean;
    includeTax: boolean;
    allocation: { memberId: string; quantity: number }[];
  }[];
}
```

### 3.4 Scan fixture

Add `includeService` and `includeTax` (default `false`) to scan fixture items.

---

## 4. API Changes

### 4.1 MSW handlers

| Handler | Change |
|---------|--------|
| `POST /api/bagi` | Body no longer includes `includeService`/`includeTax` |
| `PUT /api/bagi/:id` | Same — remove fields |
| `POST /api/bagi/:id/item` | Body now includes `includeService`/`includeTax` |
| `PUT /api/bagi/:id/item/:itemId` | Same |

### 4.2 API client

- `bagiApi.create` / `bagiApi.update` — drop tax/service params
- `itemApi.create` / `itemApi.update` — add tax/service params

### 4.3 Query hooks

- `useCreateItem` / `useUpdateItem` — pass through new fields
- Existing hooks unchanged otherwise

---

## 5. Save Flow

Same sequential pattern as current `handleSave`:

1. `form.trigger()` — zod validates entire form
2. `createBagi({ name })` → get `createdBagi.id`
3. For each member: `userbagiApi.create(bagiId, { name })`, track ID remap
4. For each item: `itemApi.create(bagiId, { name, amount, quantity, paidBy, includeService, includeTax, allocation })` with remapped member IDs
5. `navigate(/bagi/:id)`

Edit mode: `useUpdateBagi` + per-entity PATCH instead of create.

---

## 6. Components

### 6.1 New files

| File | Purpose |
|------|---------|
| `src/pages/BagiFormPage.tsx` | Replaces `BagiWizardPage`. Hosts `useForm`, renders all sections. |
| `src/wizard/Section1Header.tsx` | Bagi name + mode toggle + scan button |
| `src/wizard/Section2Members.tsx` | Member chip list + add/remove |
| `src/wizard/Section3Items.tsx` | Tax/service toggle + item card list + add/save buttons |
| `src/wizard/ItemCard.tsx` | Single item card with inline allocation |

### 6.2 Files to remove

| File | Reason |
|------|--------|
| `src/wizard/WizardSteps.tsx` | No step indicator needed |
| `src/wizard/Step1Setup.tsx` | Absorbed into Section1Header + Section2Members |
| `src/wizard/Step2Items.tsx` | Absorbed into Section3Items |
| `src/wizard/Step3Sharing.tsx` | Allocation inlined into ItemCard |

### 6.3 Files to keep (modified)

| File | Modification |
|------|-------------|
| `src/wizard/bagiFormSchema.ts` | Restructure for new form shape |
| `src/wizard/ScanButton.tsx` | Move into Section1Header |
| `src/App.tsx` | Remove `/new/items`, `/new/sharing` routes |

### 6.4 Files untouched

| File |
|------|
| `src/lib/splitCalc.ts` |
| `src/lib/format.ts` |
| `src/lib/cn.ts` |
| `src/pages/BagiDetailPage.tsx` |
| `src/pages/BagiListPage.tsx` |
| `src/components/ui/*` |
| `src/hooks/*` (minor field additions only) |
| `src/api/*` (minor field additions only) |

---

## 7. Validation

Zod schema for the new form shape. Key rules:

- Bagi name: min 1 character, required
- Members: min 2, no duplicate names
- Items: min 1 (validated on save, not on add)
- Per item: name required, amount > 0, quantity ≥ 1, paidBy required (dropdown never empty if members exist)
- Allocation: at least one member per item
- Tax/service: booleans only, no calculation in validation

---

## 8. What stays unchanged

- `splitCalc.ts` — `computeSplit` works on `Item.allocation` which is untouched
- `BagiDetailPage` — result view, no changes needed
- `BagiListPage` — list view, no changes
- Design system tokens in `index.css`
- TanStack Query pattern (invalidation on mutation success)
- MSW in-memory store + delay helpers

---

## 9. Out of scope

- "Bagikan" share button (deferred)
- AI/receipt scan image upload → real OCR integration (MSW fixture only)
- Delete-member-with-allocations validation (warn-only for now)
- Price preview for tax/service (computed display only, not stored)
