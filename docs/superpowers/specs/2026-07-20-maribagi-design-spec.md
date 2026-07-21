---
status: canonical — single source of truth for milestone 1 frontend (visual language + page flow)
replaces:
  - maribagi-design-spec.md (root, 2026-07 design exploration — folded in here, then deleted)
  - docs/superpowers/specs/2026-07-11-maribagi-wizard-redesign.md (functional redesign, superseded — deleted)
relationship-to-prd: supplements PRD.md (canonical product spec). Where this conflicts with the PRD, PRD wins; flag the conflict rather than silently resolving it.
date: 2026-07-20
---

# MariBagi — Design Spec (Milestone 1 Frontend)

## 1. Design Concept

MariBagi's UI is built around a **festival/cinema ticket stub metaphor**: cream/parchment card surfaces with a die-cut scalloped edge, dashed "tear line" dividers, and a barcode as an honest ornamental detail. The metaphor reinforces the product's actual nature — a single-sitting, ephemeral, no-account artifact, similar to a paper ticket you use once and (per the PRD's milestone 1 scope) don't expect to persist past the session.

Reference points: festival/cinema ticket poster (scalloped die-cut edges, two-tone palette, dotted perforation with punch-hole notches, barcode); receipt/price-list design (bold headline + eyebrow subtitle, numbered list rows, bold total line). Two false starts — Persona-game diagonal red/black skin, arcade/coin-op pixel-font skin — explicitly rejected as too loud/busy or too gamified for a money app; documented so they aren't re-explored.

## 2. Visual Language

### 2.1 Color

Single accent discipline: **one neutral pairing + one accent.**

| Token | Light | Dark |
|---|---|---|
| `--page` (app background) | `#EDE8DC` | `#121110` |
| `--card` (ticket/surface) | `#F8F5EC` | `#1C1A17` |
| `--ink` (body text, icons, hairlines) | `#2A2622` | `#EDE6D6` |
| `--accent` (borders, CTAs, headline, AI marker) | `#2F4C7A` (blue) | `#6E93D6` |

Dark mode = same token relationships inverted, not a separate palette.

Per-member avatar colors (consistent across the whole app — Home, item chips, allocation, result): `#C0432B` (rust), `#3F8F5C` (green), `#B0862F` (gold) — extend as needed. Never reuse `--accent` blue for member colors (reserved for system/UI meaning).

### 2.2 Typography — three faces, three strict jobs

- **Archivo Black (display)** — exactly one hero moment per screen (bagi name headline on Items screen, "ANGGOTA" on Setup, "TOTAL" on Review). Never on list rows, labels, or non-primary CTAs. If it shows up in more than one place per screen, that's a regression — the whole point is that it stays special.
- **IBM Plex Mono** — every number without exception: amounts, quantities, dates, member counts, barcode caption. This is what makes list/result screens read as a ledger rather than generic UI.
- **Inter** — everything else: labels, buttons, chip text, body copy, placeholders. Eyebrow labels are always Inter, 10–11px, uppercase, 1–1.5px letter-spacing, ~55% opacity (NAMA BAGI, ANGGOTA, ITEM, etc.).

### 2.3 The scallop / die-cut edge

**Left-only** scalloped edge on every ticket-shaped surface: Setup card, unified item-list card, history rows, Home method card. Earlier passes tried scallop on all four sides, or none, or only on isolated notches — left-only, generated evenly, was the version that stuck.

Implementation: generate notches programmatically (`<ScallopEdge>` wrapper or CSS/JS utility that measures container height and places evenly-spaced semicircle notches down the left edge) rather than hand-placing. Build once as a real reusable component, reuse across screens — do NOT re-implement per screen.

Notch shape: true semicircle (flat edge flush with card border, curved edge biting into card). A full circle straddling the edge produces a visible stray outline artifact once border has its own stroke color.

```css
.nl { width:8px; height:16px; border-radius:0 8px 8px 0; border-left:none; }
```

Background of the notch = `var(--page)`, border = `var(--accent)` — reads as a punched hole showing the page color through the card.

### 2.4 Divider convention

**Dashed** lines (not dotted — dotted was tried and rejected as "too narrow"/thin) in `--accent`. Used between logical sections, not decoratively between every individual row.

## 3. Page Flow (Information Architecture)

```
Entry: Home ("Buat Bagi Baru") OR nav-bar "+" button
   ↓
[Page 1 — Setup]
   ↓
[Page 2 — Items]
   ↓
[Page 3 — Review]

Bottom nav (always visible): Home · Riwayat · Settings
```

### Page 1 — Setup

Fields, top to bottom:

1. **NAMA BAGI** (eyebrow label) → name input (inline editable text field)
2. **MODE** — toggle: **Form | AI**
   - **Form mode:** manual item entry on Page 2 (starts with empty list)
   - **AI mode:** receipt scan on Page 2 (scan button prominent). Manual "New Item" still available in AI mode — user can fix AI mistakes or add missed items.
3. **ANGGOTA** (eyebrow label) → members list — ALWAYS inline on this page, never hidden behind a popup.
   - 48px avatar circles, each member's color persistent across the whole app
   - Edit (pencil) + delete (x) badges directly on each circle (top-right / bottom-right)
   - Add via persistent inline field + button (NOT a modal) — kept visible deliberately so this page doesn't read as empty/plain
4. **"Lanjut Item"** → Page 2

**Why members come before items:** so item creation on Page 2 can assign "who this item is for" at creation time, not as a deferred step. This resolves a PRD ambiguity about picking a payer while adding an item — that only works if members already exist. AI-scanned items are the one exception: they land with nobody assigned (the model can't know who ordered what) and must be edited afterward via the same pencil icon / same sheet used for manual entry.

### Page 2 — Items

Header: Bagi name breadcrumb (small, top) + item-list headline (Archivo Black).

**Unified scalloped list card** — one wrapper card, hairline dividers between rows. NOT individually scalloped/bordered per row (earlier pass tried this; doesn't scale past a handful of rows before repeated scallop reads as noise, and dilutes the sense that the Nama Bagi header is more important than a plain line item). Nama Bagi header, when unified into the same card as the item list, gets a stronger (dashed, not hairline) divider beneath it so it doesn't read as "just another row" — it's a header, not a row.

Each item row shows:
- Item name
- Qty × price
- Line total
- Assigned-member avatar stack
- Edit (pencil) + delete (x) icons

**"New Item" button — ALWAYS present, in BOTH Form AND AI modes.** This is non-negotiable. In AI mode it is essential: when the AI misreads or misses an item, the user must be able to add it manually via the same flow as Form mode. No mode should leave the user unable to add an item.

**"New Item" popup / bottom sheet fields:**

1. **Nama Item** (text, bold-bordered field box + icon)
2. **Amount / Qty** — side by side
3. **Untuk Siapa?** (who this item is for) — allocation happens here, at creation time, NOT as a separate later step:
   - **"Untuk Semua"** button (toggle): tap to mark equal-among-everyone. When active (filled accent), the individual Anggota picker below is grayed out/disabled — nothing to configure.
   - When "Untuk Semua" is NOT active, the individual Anggota picker becomes live: tap a member to select them (jumps to a quantity of 1); a small +/− control appears ONLY on chips that have been tapped/selected (progressive disclosure — not shown on every chip by default) to adjust the quantity for weighted splits. This single mechanic covers both "equal split among a subset" (everyone selected gets 1) and "weighted" (different numbers per person) without needing a separate Rata/Per-Qty mode switch.
   - Each selected Anggota chip shows the member's initial + a small qty badge at the bottom indicating how many of this item they have.
4. **"Simpan Item"** button. Sheet stays open after Simpan so multiple items can be added back-to-back (receipts rarely have just one line item).

**"Done" / "Lanjut" button** → Page 3.

### Page 3 — Review / Conclusion

- All member names (avatar row, read-only)
- All items listed (read-only summary)
- **Tax toggle** — separate toggle. When active, applies fixed **10%**. No manual amount entry (10% is standard Indonesia PPN, regulation-fixed for milestone 1).
- **Service toggle** — separate toggle. When active, user enters a manual amount (service varies by establishment — needs flexibility).
- Final per-member breakdown (mono numbers)
- **"Simpan"** button — persists the bagi

**Why separate tax/service toggles:** tax is a fixed % by regulation (10%), service varies by establishment so needs a manual amount. Combining them would force loss of one or both behaviors. This is a deliberate change from earlier specs that grouped them as one toggle.

### History (from Home's "Lihat Semua" or bottom nav)

Ticket-stub rows: scalloped left edge, **vertical** dashed tear at ~1/3 width (not horizontal — this was corrected mid-exploration), left column = date (with year) + member count, right column (wider) = session name + amount in accent-colored mono.

### Bottom nav

3 tabs: Home · Riwayat · Settings. No "Reports"/analytics tab — out of PRD scope, and milestone 1's data is ephemeral (resets on refresh), so a dashboard would mostly reflect the last few minutes, not real history.

## 4. Components & Interaction Patterns

### Bottom sheets: used for adding, not for editing in place

- Adding a member: **inline on Setup page** (NOT a sheet) — keeps Page 1 from feeling sparse.
- Adding an item ("New Item"): **bottom sheet**. Chosen over a full new screen (loses list/running-total context) or an inline-expanding row (too cramped for this many fields). Sheet stays open after "Simpan" so multiple items can be added back-to-back.
- Editing an item: same sheet used for adding, pre-filled.

### Anggota (members) chip pattern

Large (48px) avatar circles in a row, each member's color persistent across the whole app. Edit (pencil) and delete (x) badges sit directly on the circle (top-right / bottom-right) rather than in a separate list row. **Open concern:** badge tap targets are small and close together at this scale — worth testing on-device, and/or moving to a tap-to-reveal state (badges only appear once a chip is selected) rather than always-visible.

### List rows vs. unified list cards

Two patterns were tried: (a) each row individually scalloped/bordered, and (b) one scalloped wrapper card with hairline dividers between rows. (b) was chosen because (a) doesn't scale past a handful of rows before the repeated scallop reads as noise, and because (a) diluted the sense that the Nama Bagi header was more important than a plain line item. Nama Bagi inside the same card gets a stronger (dashed, not hairline) divider so it doesn't read as "just another row."

### History row anatomy

Ticket-stub shape, distinct from the item-list pattern: scalloped edge on the left only, a **vertical** dashed divider at roughly 1/3 width (not horizontal — corrected mid-exploration), left column = date (with year) + member count, right column (wider) = session name + amount in accent-colored mono.

## 5. Explicitly Rejected Directions (do not re-propose without new reasoning)

- **Persona-game diagonal red/black skin** — too many bold moves competing at once (solid red header + gold stamp + skewed everything); Persona's own menus stay mostly quiet and only detonate color in one or two spots, which the first pass didn't respect.
- **Arcade/coin-op pixel-font skin** — fun for short labels, fails at any real content density (item lists, split numbers); also reads as more "gamified" than trustworthy for a money app.
- **Home screen as analytics dashboard** — rejected because milestone 1 data is ephemeral (resets on refresh), so a dashboard would show near-nothing most of the time. "Hybrid: add-first + inline stats on history" was the chosen resolution.
- **Merging Setup + Items + Review onto one non-scrolling screen** — rejected; forcing everything onto one viewport shrank type/controls back down. Items screen is allowed to scroll (item count is genuinely open-ended); Home/History are the ones deliberately capped.
- **Combined tax+service toggle** — loses the ability to handle fixed-% tax separately from variable-amount service. Tax (10% fixed) and service (manual amount) are now separate toggles on the Review page.

## 6. Open Questions

- **Per-Anggota qty badge — exact increment interaction.** Tap-to-select-then-reveal-stepper is the direction settled on; rejected: pure tap-to-cycle 0→1→2→3→0 because overshooting requires cycling all the way back around.
- **Anggota badge tap targets** (pencil + x on the avatar circle) — small and close together. Test on-device, and/or move to tap-to-reveal state.
- **Row-wrap vs. horizontal-scroll** for the Anggota row when member count exceeds one line (PRD allows up to 8 members).
- **Removing a member who's part of a weighted (non-equal) item allocation** — needs a validation rule. Flagged as "will be tackled with validation."
- **Auto-recalculation on member add/remove** should only touch equal-split ("Untuk Semua") items; weighted items should never silently change — needs a visual indicator so it's obvious which items just changed vs. which still need manual attention.
- **Whether Qty (item's own quantity field) factors into the "Untuk Semua" calculation,** or whether equal-split always just divides by member count regardless of Qty. To be resolved when building the split-math functions, not the sheet's visual design.
- **The barcode/scallop-generator component** should be built once as a shared piece (see §2.3) rather than re-implemented per screen.
