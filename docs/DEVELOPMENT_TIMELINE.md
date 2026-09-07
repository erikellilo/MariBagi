# MariBagi — Development Timeline

> ⚠️ **Pre-rebuild legacy roadmap — phase tables and original dates are void.** Superseded by the clean-slate rebuild; the live plan is the slices menu in `docs/DEVLOG.md`. The calendar below was re-dated 2026-08-30 to the realistic rebuild schedule.

> **Assumption:** 2 hours/day, 5 days/week.
> **Stack:** React + TypeScript (frontend), Go/.NET (backend), Supabase Auth (later).
> **Status:** ✅ done · (blank) = open. Update as tasks complete.

---

## Phase 1: Frontend Fixes & Stability
**Goal:** Kill all bugs. Mode toggle, save flow, validation UX.

| # | Task | Sessions | Hours | Days |
|---|------|----------|-------|------|
| 1.1 | Fix mode toggle (Shared All / Per User) | 2 | 4 | 2 |
| 1.2 | Fix save validation — clear per-field error display | 1 | 2 | 1 |
| 1.3 | Item card edge cases (0 qty, delete with allocations) | 1 | 2 | 1 |
| 1.4 | Member deletion when allocated to items | 1 | 2 | 1 |
| | **Subtotal** | **5** | **10** | **5 days** |

---

## Phase 2: Frontend Feature Completion
**Goal:** Share, receipt scan, settle-up — all remaining frontend features.
**Note:** OCR is the riskiest item — first time working with AI vision APIs. Learning curve baked into estimates.

| # | Task | Sessions | Hours | Days |
|---|------|----------|-------|------|
| 2.1 | Share button — WhatsApp link + PDF/image export | 3 | 6 | 3 |
| 2.2a | Learn AI vision API (OpenAI/Gemini — structured output, function calling, testing with Indonesian receipts) | 3 | 6 | 3 |
| 2.2b | Camera/upload UI + image capture | 1 | 2 | 1 |
| 2.2c | Prompt engineering for Indonesian receipts (warung, minimarket, restaurant — varied formats) | 3 | 6 | 3 |
| 2.2d | Parse AI output → mapped items with confidence scores | 2 | 4 | 2 |
| 2.2e | Manual correction UI + error recovery | 2 | 4 | 2 |
| 2.3 | Settle-up view — who pays whom, net balance | 2 | 4 | 2 |
| | **Subtotal** | **16** | **32** | **16 days** |

---

## Phase 3: Backend API
**Goal:** Go/.NET API with PostgreSQL. CRUD + split calculation.

| # | Task | Sessions | Hours | Days |
|---|------|----------|-------|------|
| 3.1 | Database schema — bagi, userbagi, item, allocation | 1 | 2 | 1 |
| 3.2 | CRUD endpoints — Bagi, Userbagi, Item | 3 | 6 | 3 |
| 3.3 | Split calculation endpoint (server-side compute) | 1 | 2 | 1 |
| 3.4 | Input validation + error handling + API docs | 2 | 4 | 2 |
| | **Subtotal** | **7** | **14** | **7 days** |

---

## Phase 4: Frontend–Backend Integration
**Goal:** Replace MSW mocks with real API. Optimistic updates.

| # | Task | Sessions | Hours | Days |
|---|------|----------|-------|------|
| 4.1 | Swap MSW handlers → real API calls | 3 | 6 | 3 |
| 4.2 | Loading skeletons + error recovery | 1 | 2 | 1 |
| 4.3 | Optimistic updates + cache invalidation polish | 2 | 4 | 2 |
| | **Subtotal** | **6** | **12** | **6 days** |

---

## Phase 5: Authentication
**Goal:** Google Sign-In via Supabase Auth. JWT verification in backend.

| # | Task | Sessions | Hours | Days |
|---|------|----------|-------|------|
| 5.1 | Supabase project setup + Google OAuth config | 1 | 2 | 1 |
| 5.2 | Login/logout UI + session management | 2 | 4 | 2 |
| 5.3 | Backend JWT verification middleware | 2 | 4 | 2 |
| 5.4 | Row-level security + data isolation | 1 | 2 | 1 |
| | **Subtotal** | **6** | **12** | **6 days** |

---

## Phase 6: Design & Polish
**Goal:** One dedicated styling pass. Responsive, animations, ready to show.

| # | Task | Sessions | Hours | Days |
|---|------|----------|-------|------|
| 6.1 | Design system audit — consistency pass | 3 | 6 | 3 |
| 6.2 | Responsive layouts (tablet, desktop) | 2 | 4 | 2 |
| 6.3 | Micro-interactions + transitions | 1 | 2 | 1 |
| | **Subtotal** | **6** | **12** | **6 days** |

---

## Phase 7: Testing & QA
**Goal:** End-to-end flows, edge cases, perf.

| # | Task | Sessions | Hours | Days |
|---|------|----------|-------|------|
| 7.1 | E2E flow testing — create → split → share | 2 | 4 | 2 |
| 7.2 | Edge case deep-dive (concurrency, empty states) | 2 | 4 | 2 |
| 7.3 | Perf optimization (lazy load, bundle split) | 1 | 2 | 1 |
| | **Subtotal** | **5** | **10** | **5 days** |

---

## Phase 8: Deployment & Launch
**Goal:** Live on a domain. CI/CD. Monitoring.

| # | Task | Sessions | Hours | Days |
|---|------|----------|-------|------|
| 8.1 | Backend deploy (Fly.io / Railway / VPS) | 2 | 4 | 2 |
| 8.2 | Frontend deploy (Vercel) + CI/CD | 1 | 2 | 1 |
| 8.3 | Domain, SSL, environment config | 1 | 2 | 1 |
| 8.4 | Smoke tests on production | 1 | 2 | 1 |
| | **Subtotal** | **5** | **10** | **5 days** |

---

## Summary

| Phase | Sessions | Hours | Days |
|-------|----------|-------|------|
| 1. Frontend fixes | 5 | 10 | 5 |
| 2. Frontend features | 16 | 32 | 16 |
| 3. Backend API | 7 | 14 | 7 |
| 4. Integration | 6 | 12 | 6 |
| 5. Authentication | 6 | 12 | 6 |
| 6. Styling | 6 | 12 | 6 |
| 7. Testing | 5 | 10 | 5 |
| 8. Deployment | 5 | 10 | 5 |
| **Total** | **56** | **112** | **~12 weeks** |

---

## Calendar (re-dated 2026-08-30 — rebuild slices)

| When | Capacity | Target |
|------|----------|--------|
| Mon Aug 31 – Wed Sep 2 | 3 × 2h | Slices 2–4: routing skeleton, Setup static layout, Anggota add/remove inline. Start Slice 5 (MSW) if flowing. |
| Sat Sep 5 – Sun Sep 6 | Free weekend, ~6h/day | Slice 1b Scallop (Sat AM, fresh brain) + Slices 5–8: MSW mock backend, Items layout, New Item sheet, allocation picker. |
| Week of Sep 7 | Normal cadence (Tue/Thu/Sat 90min + Sun 2–3h) | Slices 9–11: Detail/review layout, save flow, history rows. |
| Week of Sep 14 | Normal cadence | Slice 12: bottom nav. Buffer / polish. |

**Rebuild skeleton target: ~Sep 20, 2026.** Post-rebuild phases (backend, auth, deployment) get re-estimated from the legacy tables above once the skeleton ships.
