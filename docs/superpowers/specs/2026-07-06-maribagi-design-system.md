---
status: draft — pending user review
date: 2026-07-06
source-reference: notion-design-system-analysis.md
---

# MariBagi Design System

> ⚠️ **Delivery note — read first.** This spec was authored against the legacy styled-components stack. The **token VALUES** below (color ramps, typography scale, spacing, radius, elevation) are stack-agnostic and remain authoritative for the rebuild. The **delivery mechanism** is NOT — the rebuild uses **Tailwind v4**, where tokens are declared via `@theme` in `src/index.css` and components use utility classes (not the styled-components patterns shown in §6). The §6 component snippets and the Migration Notes are legacy-flavored; they will be re-spec'd for Tailwind at rebuild time. See `PRD.md` §8 (Styling) for the canonical target. The current `src/GlobalStyles.ts` is legacy code the rebuild wipes.

## 1. Overview & Identity

Expense-splitting SPA anchored in a green primary, red/pink danger, and sky-blue accent. Nunito Sans as single display/UI family (mirroring Notion's NotionInter discipline). Philosophy: Notion's systematic rigor (4px grid, token-based values, strict radius/spacing) applied to MariBagi's warm-green identity.

**Key characteristics:** Green-primary brand. Red danger. Blue accent. Nunito Sans single-family (200–1000). IDR with no decimals. 4px grid, on-grid radius. All values as CSS custom properties — no raw hex in components.

## 2. Color Tokens

### 2.1 Full Ramps

Anchors marked with † are shipped brand values — preserved exactly. Missing steps are generated for a reasonable lightness gradient.

**Green (Brand primary)**

| Token | Hex | Role |
|-------|-----|------|
| `--color-green-50` | #F7FBF7 | Hover on green-tinted surfaces |
| `--color-green-100`† | #F2F8F2 | Background tint, green surfaces |
| `--color-green-200` | #DFF0DE | |
| `--color-green-300` | #C5E3C2 | |
| `--color-green-400` | #A8D3A4 | |
| `--color-green-500`† | #8cc084 | **Brand primary** — buttons, CTAs |
| `--color-green-600` | #71A668 | Button hover |
| `--color-green-700` | #517F48 | Button active |
| `--color-green-800` | #2E5327 | Text on light green bg |
| `--color-green-900`† | #080D07 | Text on light surfaces |

**Red (Danger)**

| Token | Hex | Role |
|-------|-----|------|
| `--color-red-50` | #FFEAF2 | Light danger bg |
| `--color-red-100`† | #FFD6E6 | Surface highlight (danger) |
| `--color-red-200` | #FFC0D8 | |
| `--color-red-300` | #FFA0C2 | |
| `--color-red-400` | #FF8CB4 | |
| `--color-red-500`† | #FF70A6 | Danger medium, secondary markings |
| `--color-red-600` | #FF4D8A | |
| `--color-red-700` | #FA1E72 | |
| `--color-red-800`† | #F5005E | **Danger primary** — delete buttons |
| `--color-red-900`† | #140008 | Danger text on light |

<!-- ponytail: red-800 #F5005E is the danger-primary anchor (kept frozen); ramp is approximately monotonic but tuned for brand, not pure luminance — refine when seen on device -->

**Blue (Accent)**

| Token | Hex | Role |
|-------|-----|------|
| `--color-blue-50` | #F5FCFF | Light accent bg |
| `--color-blue-100`† | #EBF9FF | Surface highlight (info) |
| `--color-blue-200` | #D6F2FF | |
| `--color-blue-300` | #B4E8FF | |
| `--color-blue-400` | #94DFFF | |
| `--color-blue-500`† | #70D6FF | **Accent primary** — links, info badges |
| `--color-blue-600` | #50C5FF | Link hover |
| `--color-blue-700` | #1A9CDF | Link active |
| `--color-blue-800` | #00527A | Text on light blue bg |
| `--color-blue-900`† | #000F14 | Accent text on light |

**Gray (Neutral)**

| Token | Hex | Role |
|-------|-----|------|
| `--color-gray-0`† | #FFFFFF | Page bg, card bg |
| `--color-gray-50` | #FCF7FF | Subtle surfaces (moved from deprecated `grey-500`) |
| `--color-gray-100` | #F0EDF5 | Tertiary surfaces, disabled bg |
| `--color-gray-200` | #E0DCE8 | Borders, dividers |
| `--color-gray-300` | #C8C2D1 | Subtle borders |
| `--color-gray-400` | #AAA0B3 | Icon fills, disabled text |
| `--color-gray-500` | #8A8294 | **Proper mid-gray** — placeholder, muted |
| `--color-gray-600` | #6B6475 | Disabled text, secondary icons |
| `--color-gray-700` | #4D4557 | Secondary body text |
| `--color-gray-800` | #2E2933 | Subtle headings |
| `--color-gray-900`† | #0D0014 | **Primary text** — headings, body copy |

### 2.2 Brand Aliases

`--color-brand-*` maps 1:1 to `--color-green-*` (50 through 900). Semantic contexts use brand aliases:

```css
--color-brand-50: var(--color-green-50);
/* ... through ... */
--color-brand-900: var(--color-green-900);
```

### 2.3 Semantic Role Mappings

| Role | Token | Typical use |
|------|-------|-------------|
| `--color-bg` | `var(--color-gray-0)` | Page background, default card |
| `--color-bg-secondary` | `var(--color-gray-50)` | Alternate surfaces, hover states |
| `--color-bg-tertiary` | `var(--color-gray-100)` | Disabled inputs, muted sections |
| `--color-text-primary` | `var(--color-gray-900)` | All body and heading text |
| `--color-text-secondary` | `var(--color-gray-600)` | Labels, metadata |
| `--color-text-muted` | `var(--color-gray-400)` | Placeholder text, disabled content |
| `--color-text-inverse` | `var(--color-gray-0)` | Text on brand/dark backgrounds |
| `--color-border` | `var(--color-gray-200)` | Default borders on inputs, cards |
| `--color-border-strong` | `var(--color-gray-300)` | Focused/active border states |
| `--color-brand-primary` | `var(--color-brand-500)` | Buttons, CTAs, active indicators |
| `--color-brand-hover` | `var(--color-brand-600)` | Button hover |
| `--color-brand-active` | `var(--color-brand-700)` | Button pressed |
| `--color-focus-ring` | `var(--color-brand-500)` | Focus outline (input:focus) |
| `--color-danger` | `var(--color-red-800)` | Destructive buttons, danger text |
| `--color-danger-hover` | `var(--color-red-700)` | Danger button hover |
| `--color-accent` | `var(--color-blue-500)` | Links, info badges |

## 3. Typography

### 3.1 Font Family

```css
--font-family: "Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
```

Loaded via Google Fonts (`index.html` line 10), weight range 200–1000. No other family for UI.

### 3.2 Type Scale

Base font-size `62.5%` on `<html>` (`1rem = 10px`).

| Role | Weight | Size | Ln Ht | Letter Spacing | Usage |
|------|--------|------|-------|----------------|-------|
| Display | 700 (Bold) | 2.4rem / 24px | 1.2 | -0.02em | Page title — one per view |
| H1 | 700 (Bold) | 2.0rem / 20px | 1.3 | -0.01em | Section titles |
| H2 | 600 (Semi-Bold) | 1.8rem / 18px | 1.3 | normal | Sub-section titles |
| H3 | 600 (Semi-Bold) | 1.6rem / 16px | 1.4 | normal | Card titles |
| Body | 400 (Regular) | 1.6rem / 16px | 1.5 | normal | Default text |
| Body Small | 400 (Regular) | 1.4rem / 14px | 1.5 | normal | UI labels, helper text |
| Caption | 400 (Regular) | 1.2rem / 12px | 1.4 | normal | Metadata, footnotes |

### 3.3 Token Aliases

```css
--font-size-display: 2.4rem;    /* 24px */
--font-size-h1: 2.0rem;         /* 20px */
--font-size-h2: 1.8rem;         /* 18px */
--font-size-h3: 1.6rem;         /* 16px */
--font-size-body: 1.6rem;       /* 16px */
--font-size-body-sm: 1.4rem;    /* 14px */
--font-size-caption: 1.2rem;    /* 12px */
--font-weight-bold: 700;
--font-weight-semibold: 600;
--font-weight-regular: 400;
--line-height-tight: 1.2;
--line-height-normal: 1.4;
--line-height-relaxed: 1.5;
```

## 4. Spacing

4px base unit. All margin/padding/gap values must be multiples of 4px.

| Token | Value | Usage context |
|-------|-------|--------------|
| `--space-1` | 4px | Micro-spacing — icon-to-text gaps |
| `--space-2` | 8px | Tight padding — buttons, badges |
| `--space-3` | 12px | Inner padding — inputs, list rows |
| `--space-4` | 16px | Standard padding — cards, form sections |
| `--space-5` | 20px | Generous padding — desktop cards |
| `--space-6` | 24px | Component gap — between cards |
| `--space-8` | 32px | Section gap — between form groups |
| `--space-10` | 40px | Large section gap |
| `--space-12` | 48px | Page section padding (mobile vertical) |
| `--space-16` | 64px | Page section padding (desktop vertical) |

## 5. Radius & Elevation

### 5.1 Border Radius

On-grid scale (replaces current off-grid `3px/5px/7px/9px`):

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Buttons, inputs, chips |
| `--radius-md` | 8px | Cards, dropdowns, medium containers |
| `--radius-lg` | 12px | Large cards, modals, primary containers |
| `--radius-xl` | 20px | Decorative containers, large media |
| `--radius-full` | 9999px | Pills, avatars |

### 5.2 Elevation

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.04)` | Default card — subtle separation |
| `--shadow-md` | `0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06)` | Modals, elevated containers |
| `--shadow-lg` | `0 2.4rem 3.2rem rgba(0, 0, 0, 0.12)` | Floating elements, dropdowns |
| `--shadow-card` | `rgba(25, 25, 25, 0.027) 0px 8px 12px 0px, rgba(25, 25, 25, 0.027) 0px 2px 6px 0px` | Default card — Notion-style multi-layer |
| `--shadow-card-hover` | `rgba(0, 0, 0, 0.01) 0px 1px 3px 0px, rgba(0, 0, 0, 0.02) 0px 3px 7px 0px, rgba(0, 0, 0, 0.02) 0px 7px 15px 0px, rgba(0, 0, 0, 0.04) 0px 14px 28px 0px` | Card hover — multi-layer lift |

Z-index: `dropdown=100`, `sticky=200`, `modal=1000`, `toast=1100`.

## 6. Component Specs

### 6.1 Button

```typescript
import styled, { css } from "styled-components";

interface ButtonProps { $variant?: "primary" | "secondary" | "danger"; }

const variants = {
  primary: css`
    background-color: var(--color-brand-500); color: var(--color-text-inverse);
    border-color: transparent;
    &:hover:not(:disabled) { background-color: var(--color-brand-600); }
    &:active:not(:disabled) { background-color: var(--color-brand-700); }
  `,
  secondary: css`
    background-color: transparent; color: var(--color-text-primary);
    border-color: var(--color-border);
    &:hover:not(:disabled) { background-color: var(--color-bg-secondary); }
  `,
  danger: css`
    background-color: var(--color-danger); color: var(--color-text-inverse);
    border-color: transparent;
    &:hover:not(:disabled) { background-color: var(--color-danger-hover); }
  `,
};

const Button = styled.button<ButtonProps>`
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-1); padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-body); font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-sm); border: 1px solid; cursor: pointer;
  transition: background-color 0.2s ease-out;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  ${({ $variant = "primary" }) => variants[$variant]}
`;
```

### 6.2 Card

```typescript
import styled from "styled-components";

const Card = styled.div`
  background-color: var(--color-bg); border-radius: var(--radius-md);
  padding: var(--space-4); box-shadow: var(--shadow-card);
  transition: box-shadow 0.25s ease-out, transform 0.25s ease-out;
  &:hover { box-shadow: var(--shadow-card-hover); transform: translateY(-1px); }
`;
```

### 6.3 Input

```typescript
import styled from "styled-components";

const Input = styled.input`
  width: 100%; padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-body); line-height: var(--line-height-relaxed);
  color: var(--color-text-primary); background-color: var(--color-bg);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
  &:focus { outline: none; border-color: var(--color-brand-primary); box-shadow: 0 0 0 2px var(--color-focus-ring); }
  &:disabled { background-color: var(--color-bg-tertiary); color: var(--color-text-muted); cursor: not-allowed; }
  &::placeholder { color: var(--color-text-muted); }
`;
```

### 6.4 ListRow

```typescript
import styled from "styled-components";

const ListRow = styled.div`
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4); background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border); cursor: pointer;
  transition: background-color 0.15s ease-out;
  &:hover { background-color: var(--color-bg-secondary); }
  &:last-child { border-bottom: none; }
`;

const ListRowLabel = styled.span`
  flex: 1; font-size: var(--font-size-body); color: var(--color-text-primary);
`;

const ListRowMeta = styled.span`
  font-size: var(--font-size-body-sm); color: var(--color-text-secondary);
`;
```

## 7. Currency Formatting

Rules: no decimals, `Rp` prefix, `.` thousands separator. Use `Intl.NumberFormat` — no library.

```typescript
const formatIDR = (amount: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(amount);
// formatIDR(15000) → "Rp 15.000"   formatIDR(0) → "Rp 0"   formatIDR(2500000) → "Rp 2.500.000"
```

In styled-components use `font-variant-numeric: tabular-nums` for aligned amounts.

## 8. Do's and Don'ts

### Do

- Use `--color-text-primary` (`gray-900`) for all body text — AAA against white.
- Use `--color-text-secondary` (`gray-600`) for labels — passes AA on `gray-0`/`gray-50`.
- Apply `--radius-sm` to buttons/inputs, `--radius-md` or `--radius-lg` to cards.
- Reserve brand green for the single primary CTA per view. Use `--color-border` (`gray-200`) for all default borders.
- Use the `formatIDR` helper for all monetary display. Use `var(--space-*)` tokens exclusively.
- Cards must have `:hover` shadow-lift + `translateY(-1px)`. Input `:focus` must show `--color-focus-ring` ring.

### Don't

- Don't use raw hex in styled-components — always reference a CSS custom property.
- Don't mix `gray`/`grey` spelling — the system uses **`gray`** (American). Existing `grey` is legacy and must be migrated.
- Don't use `--color-red-500` for body text on white — contrast fails AA at body size.
- Don't use radii outside the on-grid scale (`5px`, `7px` are legacy off-grid values).
- Don't use spacing outside the 4px scale (`10px`, `18px`, `30px`). Don't apply shadows to text or inline elements.
- Don't introduce a second font family for UI. Don't show IDR with decimal places.

---

## Migration Notes

Issues in `src/GlobalStyles.ts` and consuming components to fix during adoption (not now).

**Broken/missing token references:**

| Location | Token | Problem | Fix |
|----------|-------|---------|-----|
| `GlobalStyles.ts:60` | `--color-grey-700` | Undefined — no `grey-700` exists | Bind or alias to `--color-gray-700` (or `--color-gray-900`) |
| `GlobalStyles.ts:86` | `--color-grey-200` | Undefined | Bind to `--color-gray-200` (#E0DCE8) |
| `GlobalStyles.ts:87` | `--color-grey-500` | Exists but value #FCF7FF is wrong for text | Bind to `--color-gray-500` (#8A8294) |
| `GlobalStyles.ts:94` | `--color-brand-600` | Undefined — no brand ramp | Define `--color-brand-600: var(--color-green-600)` |
| `GlobalStyles.ts:99` | `--color-gray-500` | Undefined | Define `--color-gray-500: #8A8294` |
| `MenuBar.tsx:23` | `--color-gray-900` | Undefined (only `grey-900` exists) | Bind to `--color-gray-900` |
| `ButtonRectangle.tsx:11` | `--color-gray-900` | Same | Same |
| `Button.tsx:11` | `--color-grey-900` | Spelling inconsistency | Bind to `--color-gray-900` |

**Radius rename:** `tiny(3px)→sm(4px)`, `sm(5px)→md(8px)`, `md(7px)→lg(12px)`, `lg(9px)→xl(20px)`.

**Neutral relocation:** `grey-0→gray-0`, `grey-500(#FCF7FF)→gray-50`, `grey-900→gray-900`.

**Spelling normalization:** scan all `.ts`/`.tsx` files for `--color-grey-` → `--color-gray-`.

**Nunito Sans:** confirmed loaded via Google Fonts in `index.html` (200–1000). No import changes needed.
