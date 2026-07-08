---
status: active — working document, update estimates as you learn
date: 2026-07-09
purpose: treat the remaining MariBagi work like a job — backlog, estimates, milestones, definition of done
---

# MariBagi — Delivery Roadmap

> Treat this like a job: a backlog with estimates, milestones, and a definition of done. **Track your actual time against the estimates** — that's how you get better at scoping. Estimates are ranges, not deadlines; learning tasks sometimes spike, and that's normal.

## Assumptions

- **Solo developer, learning** (not expert pace).
- **Capacity:** ~10–15 focused hours/week (part-time). Compress proportionally if full-time.
- **Goal:** portfolio-quality SaaS + genuine learning.
- **Starting point:** Milestone 1 COMPLETE — full CRUD, 3-step wizard, receipt scan, split calculation, result view, design system applied, mock backend (MSW, in-memory — resets on refresh by design), lint clean, build green.

---

## Phase 1 — Frontend polish (≈ 1–2 weeks part-time, 15–25 hrs)

**Goal:** a polished, demoable app shell. Still mock data (no backend yet).

| # | Task | Estimate | Definition of done |
|---|------|----------|--------------------|
| 1 | **App nav/layout** | 3–5 hrs | Shared top bar on all `/bagi/*` pages via a layout route + `<Outlet />`. Logo "MariBagi" (→ home), "New bagi" button, login placeholder. Every app page sits inside it. |
| 3 | **Per-step validation** | 5–8 hrs | Step 2 "Next → Sharing" validates only name/amount/quantity (NOT paidBy/allocation). Step 3 / Save validates the rest. No broken gates. |
| 4 | **Share result** | 2–3 hrs | Button on the result page copies a text summary (member → share) to clipboard AND/OR opens a `wa.me` WhatsApp link. |
| 5 | **Visual share bars** | 2–3 hrs | Per-member horizontal bar on the result page (width = their % of the total, brand-green). |
| — | Buffer + polish | 3–5 hrs | Spacing, edge cases, a full manual click-through, lint+build green. |

**Milestone 1.1 — Polished frontend:** demoable end-to-end against mock data, feels like a product.

**Recommended order:** 1 → 3 → (4 + 5 together, both on the result page).

---

## Phase 2 — Astro marketing site (≈ 1 week part-time, 8–12 hrs)

**Goal:** learn Astro + ship a marketing site on its own subdomain. Separate track from the app.

| Task | Estimate | Definition of done |
|------|----------|--------------------|
| Learn Astro basics | 2–3 hrs | Comfortable with `.astro` files, `src/pages/` routing, components. |
| Build the landing | 4–6 hrs | Hero, how-it-works (3 steps), CTA → app URL. Reuses the design-system tokens. |
| Deploy + subdomain | 2–3 hrs | Live at `maribagi.com`; app at `app.maribagi.com`. |

**Milestone 2 — Marketing site live**, separate from the app.

---

## Phase 3 — Backend + auth (≈ 3–6 weeks part-time, 30–60 hrs)

**Goal:** real SaaS — accounts, persistent data, login. Biggest phase; new skill area.

### Pick a path first (decision required)

- **Path A — Supabase (ship fast):** Postgres DB + auth + auto-API mostly built-in. Less code, more wiring. Best if the goal is a *working* SaaS. (~3–4 weeks)
- **Path B — Custom Node + Express + Postgres (learn deep):** you build the server, schema, auth (hashed passwords, JWT/sessions), routes. More code, deeper mastery. Best if *learning backend* is itself a goal. (~5–6 weeks)

### Tasks (either path)

| Task | Estimate |
|------|----------|
| Backend stack + DB schema | 8–15 hrs |
| Real API (replace MSW) | 8–15 hrs |
| Auth (login/signup/sessions) | 8–15 hrs |
| Per-user data scoping | 4–6 hrs |
| **Edit-mode prefill** (feature #2 — now valuable on real persistence) | 4–6 hrs |
| Deploy + connect domains | 4–6 hrs |

**Milestone 3 — Real SaaS:** users sign up, data persists across refresh, login works, edits stick.

---

## How to work (the "job" operating model)

1. **One feature per work session.** Don't mix #1 and #3 in the same sitting.
2. **Definition of done before you start.** Read the DoD row; don't stop until you hit it.
3. **Commit per logical chunk** — small commits, clear messages (you've seen the style in `git log`).
4. **Track actual vs estimated.** Jot down how long each task *really* took. After Phase 1, compare — you'll see where your estimates are off (most people underestimate validation and testing).
5. **Weekly self-review.** End of each week: what shipped, what slipped, what you learned.
6. **Lint + build must stay green.** No exceptions — it's your safety net and your "merge gate."
7. **Stuck > 30 min → ask.** Don't spiral. (Coach, docs, rubber-duck — any of them.)

---

## The challenge (optional hard mode)

**Ship Phase 1 in 7 days (part-time).** That's ~15 hrs across a week — tight but achievable. It forces tight scoping and kills gold-plating. Hit the Milestone 1.1 definition of done in 7 days and you've genuinely leveled up.

---

## Total realistic horizon

- Phase 1 (frontend polish): **1–2 weeks**
- Phase 2 (Astro marketing): **1 week**
- Phase 3 (backend + auth): **3–6 weeks**
- **Full SaaS: ~5–9 weeks part-time.** The backend phase is where most learning-dev timelines slip — that's expected. Path A (Supabase) is your friend if "ship it" matters more than "build every layer myself."
