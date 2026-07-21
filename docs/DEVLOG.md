# MariBagi — Milestone 1 Diary

> **Personal progress tracker.** NOT a technical implementation plan.
> The "what to build" lives in [`docs/superpowers/specs/2026-07-20-maribagi-design-spec.md`](superpowers/specs/2026-07-20-maribagi-design-spec.md).
> This file tracks the journey — schedule, slices, wins, struggles.

## Goal

Clean-slate rebuild of MariBagi as Vite + React + TypeScript SPA with the flow described in the design spec: **Setup (with Form|AI mode) → Items → Review**. Mocked backend via MSW. Mobile-first.

## Stack

React 18, Vite 5, TypeScript 5 (strict), TanStack Query 5, react-hook-form 7, zod 3, Tailwind v4, MSW 2, react-router-dom 6, uuid 11, native fetch.

## The Commitment (read this when motivation dips)

- **Schedule:** Tue / Thu / Sat × 90 min, Sun × 2–3 hours
- **Off days are real off days, not guilt days**
- **The whole project doesn't need courage. Only the next slice does.**
- **Ugly and shipped > perfect and unfinished.**

**Weeks 1–6:** the only metric is "did I show up?" Yes → win. Skipped 4 sessions → loss.
**Week 6+:** habit locked. Now care about velocity.

## Slices Menu

> Pick the next slice from this list OR from the design spec. Order is suggestion, not law — pick whatever feels doable that session. Each slice = one commit.

- [ ] **Slice 0:** Vite skeleton renders "MariBagi v2", `npm run lint` clean, `npm run build` succeeds
- [ ] **Slice 1:** Design tokens (CSS custom properties for color tokens) + scallop component — visual language only, no app yet
- [ ] **Slice 2:** Routing skeleton (Home / Setup / Items / Review routes as placeholders)
- [ ] **Slice 3:** Page 1 Setup static layout (Nama Bagi input + Form|AI toggle + Anggota row) — no logic yet
- [ ] **Slice 4:** Anggota add/remove inline (local state only, no backend)
- [ ] **Slice 5:** MSW mock backend skeleton (one endpoint, one seed)
- [ ] **Slice 6:** Page 2 Items static layout (scalloped unified card, empty state)
- [ ] **Slice 7:** "New Item" sheet — Nama + Amount + Qty + "Untuk Semua" toggle
- [ ] **Slice 8:** Per-Anggota allocation picker with qty badge (progressive disclosure)
- [ ] **Slice 9:** Page 3 Review static layout (member row + items summary + tax 10% toggle + service manual amount toggle)
- [ ] **Slice 10:** Save flow — persist via MSW, redirect to a confirmation
- [ ] **Slice 11:** History rows on Home (ticket-stub anatomy)
- [ ] **Slice 12:** Bottom nav (Home · Riwayat · Settings)

> Add more slices as the work clarifies. Cross them out when done — the dopamine is the point.

## Session Log

> After each session, drop a one-liner: date, duration, what got done, what was hard, how it felt.

- _YYYY-MM-DD (Day, Xmin): …_

## Wins (read this when motivation dips)

> Tiny counts. Got the dev server running on first try counts. Figured out a Tailwind class counts. Showing up on a tired day really counts.

- _…_

## When I'm Stuck

- Open the design spec — pick the smallest next slice. Do only that. Commit.
- If a slice feels too big, cut it in half. Then half again.
- The pomodoro is 25 min. Just sit down for one pomodoro. If you want to stop after, stop.
- Ugly and shipped > perfect and unfinished.
- Off days are real off days. Guilt is not a productivity tool.

## Tech Notes (parking lot — not a plan)

> Stuff to remember but not act on yet. Gotchas, deferred decisions, things learned.

- _…_
