# MariBagi v2 — Milestone 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean-slate rebuild of MariBagi as a Vite + React + TypeScript SPA with full CRUD for `bagi`, `userbagi`, and `item` entities, a 3-step wizard UI, and a mocked backend (MSW).

**Architecture:** Vite SPA with TanStack Query for server state, react-hook-form + zod for the wizard form, MSW intercepting fetch at the network layer as a mock backend with an in-memory store. One react-hook-form instance spans all three wizard steps. Mobile-first layout with Tailwind v4.

**Tech Stack:** React 18, Vite 5, TypeScript 5 (strict), @tanstack/react-query 5, react-router-dom 6, tailwindcss 4, msw 2, react-hook-form 7, zod 3, @hookform/resolvers, uuid 11, native fetch.

## Global Constraints

These apply to EVERY task. Copy values verbatim — do not improvise.

- **Node version:** 22 (Active LTS). `.nvmrc` contains `22`.
- **Package manager:** npm (`package-lock.json` is authoritative).
- **Lint is gating:** `npm run lint` with `--max-warnings 0` MUST be clean (zero warnings). Fix warnings, never downgrade.
- **Build is gating:** `npm run build` MUST succeed.
- **No test framework** in milestone 1. Verification is manual click-through + lint + build.
- **TypeScript strict mode** is on. No `any` — use `unknown` or proper types.
- **File extensions:** `.tsx` for anything with JSX; `.ts` for logic/types/utils.
- **Formatting:** Prettier — double quotes, semicolons, printWidth 130, trailingComma es5, arrowParens avoid.
- **Imports:** No comments. Follow existing ordering (React hooks → third-party → local).
- **Currency:** Indonesian Rupiah via `Intl.NumberFormat("id-ID", ...)`.
- **No new dev dependencies** beyond those listed in the spec's Section 2 without confirmation.

---

## File Structure

This is the target structure after all tasks complete. Each file has one clear responsibility.

```
.nvmrc                              # pins Node 22
index.html                          # Vite entry HTML (exists, minor edits)
package.json                        # deps (rewritten in Task 1)
vite.config.ts                      # Vite + React + Tailwind + SVGR plugins
tsconfig.json                       # TS strict config (exists, minor edits)
eslint.config.js                    # ESLint flat config (exists, keep)
src/
  main.tsx                          # Entry: QueryClientProvider + MSW init + RouterProvider
  App.tsx                           # Router config (createBrowserRouter)
  index.css                         # Tailwind v4 import (@import "tailwindcss")
  vite-env.d.ts                     # Vite + SVGR type declarations

  types/
    entities.ts                     # Bagi, Userbagi, Item, Allocation TS types
    api.ts                          # Request/response shapes for API

  lib/
    format.ts                       # currencyFormat (Intl.NumberFormat id-ID)
    cn.ts                           # className merge helper (for Tailwind)

  api/
    client.ts                       # fetch wrapper: apiGet/apiPost/apiPatch/apiDelete
    bagiApi.ts                      # bagi endpoint functions
    userbagiApi.ts                  # userbagi endpoint functions
    itemApi.ts                      # item endpoint functions
    scanApi.ts                      # scan endpoint function

  mocks/
    browser.ts                      # MSW setupWorker (dev only)
    handlers.ts                     # all MSW request handlers
    db.ts                           # in-memory store (Map-based, seedable)
    fixtures.ts                     # scan response fixture data

  hooks/
    queryKeys.ts                    # centralized query key factory
    useBagiList.ts                  # useQuery: GET /api/bagi
    useBagiDetail.ts                # useQuery: GET /api/bagi/:id
    useCreateBagi.ts                # useMutation: POST /api/bagi
    useUpdateBagi.ts                # useMutation: PATCH /api/bagi/:id
    useDeleteBagi.ts                # useMutation: DELETE /api/bagi/:id (cascade)
    useScanReceipt.ts               # useMutation: POST /api/bagi/:id/scan

  pages/
    BagiListPage.tsx                # /bagi — list of sessions
    BagiWizardPage.tsx              # /bagi/new/* and /bagi/:id/edit/*
    BagiDetailPage.tsx              # /bagi/:id — read-only summary

  wizard/
    bagiFormSchema.ts               # zod schema for the whole wizard form
    WizardSteps.tsx                 # step indicator + back/next nav
    Step1Setup.tsx                  # bagi header + member list
    Step2Items.tsx                  # item list + scan button
    Step3Sharing.tsx                # allocation (equal share / by quantity)
    ScanButton.tsx                  # receipt upload + scan mutation

  components/ui/
    Button.tsx                      # variant button (primary/ghost/danger)
    Input.tsx                       # text input with label + error
    Chip.tsx                        # selectable chip (for member selection)
    Spinner.tsx                     # loading indicator
    EmptyState.tsx                  # empty list placeholder
    ErrorBanner.tsx                 # mutation/query error display
```

**Key decomposition decisions:**
- **API layer (`api/`)** is separate from **hooks (`hooks/`)**. API functions are pure fetch calls returning promises. Hooks wrap them in TanStack Query. This separation means swapping MSW for a real backend touches only `api/` + `mocks/`.
- **MSW handlers (`mocks/handlers.ts`)** read/write an **in-memory store (`mocks/db.ts`)**. The store is a plain object of Maps, reset on page reload. This simulates a real DB session.
- **The wizard form schema (`wizard/bagiFormSchema.ts`)** is the single zod schema spanning all 3 steps. One `useForm` instance at `BagiWizardPage` level.
- **UI primitives (`components/ui/`)** are dumb presentational components. No data fetching, no business logic.

---

## Task 1: Clean Slate + Tooling Setup

**Goal:** Wipe the old `src/`, install the new dependency set, configure Vite + Tailwind v4 + ESLint, and render a "hello world" page.

**Files:**
- Delete: entire `src/` directory contents
- Create: `.nvmrc`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`
- Modify: `package.json`, `vite.config.ts`, `tsconfig.json`

**Interfaces:**
- Produces: a running dev server at `localhost:5173` showing "MariBagi v2", `npm run lint` clean, `npm run build` succeeds.

- [ ] **Step 1: Delete old source code**

```bash
# Remove the entire src directory contents (old Redux/styled-components code)
rm -rf src/*
```

The old code is preserved in git history. We are starting fresh.

- [ ] **Step 2: Create `.nvmrc`**

Create `.nvmrc` with content:
```
22
```

- [ ] **Step 3: Rewrite `package.json`**

Replace the entire `package.json` with:
```json
{
  "name": "maribagi",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "tsc -b && vite build",
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@tanstack/react-query": "^5.62.0",
    "@tanstack/react-query-devtools": "^5.62.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.0",
    "react-router-dom": "^6.28.0",
    "uuid": "^11.0.3",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react": "^7.37.3",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "msw": "^2.7.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2",
    "typescript-eslint": "^8.18.2",
    "vite": "^5.4.11",
    "vite-plugin-svgr": "^4.3.0"
  }
}
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

- [ ] **Step 5: Create `src/vite-env.d.ts`**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 6: Create `src/index.css`**

```css
@import "tailwindcss";
```

Tailwind v4 uses CSS-first config. This single import pulls in all of Tailwind. No `tailwind.config.js` needed.

- [ ] **Step 7: Update `vite.config.ts`**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
  ],
});
```

- [ ] **Step 8: Update `tsconfig.json`**

Keep strict settings. Add `@/` path alias for clean imports. Replace the full file:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true,
    "strictFunctionTypes": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["./src/**/*.ts", "./src/**/*.tsx"]
}
```

Also update `tsconfig.build.json` if it exists to match, or delete it if `tsc -b` in the build script doesn't need it. Check: if `tsconfig.build.json` exists, ensure it extends `tsconfig.json` or delete it and change the build script to `tsc && vite build`.

- [ ] **Step 9: Create `src/App.tsx`**

```tsx
const App = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900">MariBagi v2</h1>
    </div>
  );
};

export default App;
```

- [ ] **Step 10: Create `src/main.tsx`**

```tsx
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 11: Update `eslint.config.js`**

The existing flat config works. Add the react-hooks plugin and react-refresh. Replace the full file:
```javascript
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
];
```

- [ ] **Step 12: Verify lint passes**

```bash
npm run lint
```
Expected: passes with 0 warnings.

- [ ] **Step 13: Verify build passes**

```bash
npm run build
```
Expected: builds successfully to `dist/`.

- [ ] **Step 14: Verify dev server**

```bash
npm run dev
```
Expected: `localhost:5173` shows "MariBagi v2" centered on a light gray background, styled by Tailwind (text is bold, dark gray — NOT default browser styles).

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "chore: clean slate — new stack (Vite + React + TS + Tailwind v4 + TanStack Query deps)"
```

---

## Task 2: Types + Utility Library

**Goal:** Define the TypeScript entity types and the currency formatting helper. These are the foundation everything else imports.

**Files:**
- Create: `src/types/entities.ts`, `src/types/api.ts`, `src/lib/format.ts`, `src/lib/cn.ts`

**Interfaces:**
- Produces: `Bagi`, `Userbagi`, `Item`, `Allocation` types (used everywhere); `currencyFormat()` function; `cn()` className helper.

- [ ] **Step 1: Create `src/types/entities.ts`**

```typescript
export interface Allocation {
  memberId: string;
  quantity: number;
}

export interface Bagi {
  id: string;
  name: string;
  date: number;
  includeService: boolean;
  includeTax: boolean;
  createdAt: number;
}

export interface Userbagi {
  id: string;
  bagiId: string;
  name: string;
  createdAt: number;
}

export interface Item {
  id: string;
  bagiId: string;
  name: string;
  amount: number;
  quantity: number;
  paidBy: string;
  allocation: Allocation[];
  createdAt: number;
}

/** Bagi with nested children — the shape returned by GET /api/bagi/:id */
export interface BagiDetail extends Bagi {
  members: Userbagi[];
  items: Item[];
}

/** Lightweight bagi row — the shape returned by GET /api/bagi (list) */
export interface BagiListItem {
  id: string;
  name: string;
  date: number;
  memberCount: number;
  itemCount: number;
}
```

- [ ] **Step 2: Create `src/types/api.ts`**

```typescript
import type { Bagi, Item, Userbagi } from "./entities";

// --- Request shapes ---

export interface CreateBagiRequest {
  name: string;
  includeService: boolean;
  includeTax: boolean;
}

export interface UpdateBagiRequest {
  name?: string;
  includeService?: boolean;
  includeTax?: boolean;
}

export interface CreateUserbagiRequest {
  name: string;
}

export interface UpdateUserbagiRequest {
  name: string;
}

export interface CreateItemRequest {
  name: string;
  amount: number;
  quantity: number;
  paidBy: string;
  allocation: { memberId: string; quantity: number }[];
}

export interface UpdateItemRequest {
  name?: string;
  amount?: number;
  quantity?: number;
  paidBy?: string;
  allocation?: { memberId: string; quantity: number }[];
}

export interface BatchCreateItemsRequest {
  items: { name: string; amount: number; quantity: number }[];
}

// --- Scan response ---

export interface ScanResponse {
  bagi: {
    name: string;
    date: number;
    includeTax: boolean;
    includeService: boolean;
  };
  items: { name: string; amount: number; quantity: number }[];
}
```

- [ ] **Step 3: Create `src/lib/format.ts`**

```typescript
const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatRupiah = (amount: number): string => {
  return rupiahFormatter.format(amount);
};
```

- [ ] **Step 4: Create `src/lib/cn.ts`**

A simple className combiner (no external dep — avoids adding clsx/tailwind-merge for milestone 1):
```typescript
export const cn = (...classes: (string | false | null | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
```

- [ ] **Step 5: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add entity types, API shapes, and utility helpers"
```

---

## Task 3: MSW Mock Backend + In-Memory Store

**Goal:** Set up MSW to intercept fetch calls, create an in-memory store that acts as a fake database, and implement the bagi CRUD handlers. After this task, the mock backend responds to `/api/bagi` requests.

**Files:**
- Create: `src/mocks/db.ts`, `src/mocks/handlers.ts`, `src/mocks/browser.ts`, `src/mocks/fixtures.ts`

**Interfaces:**
- Produces: `handlers` array (consumed by MSW worker), `db` in-memory store with `bagi`, `userbagi`, `item` Maps.
- Consumes: entity types from Task 2.

- [ ] **Step 1: Initialize MSW (generate the service worker)**

```bash
npx msw init public/ --save
```
This creates `public/mockServiceWorker.js`. Verify it exists in `public/`.

- [ ] **Step 2: Create `src/mocks/db.ts`**

The in-memory store. Uses Maps to simulate DB tables. Includes a seed function for dev.

```typescript
import { v4 as uuid } from "uuid";
import type { Bagi, Item, Userbagi } from "@/types/entities";

interface DB {
  bagi: Map<string, Bagi>;
  userbagi: Map<string, Userbagi>;
  item: Map<string, Item>;
}

export const db: DB = {
  bagi: new Map(),
  userbagi: new Map(),
  item: new Map(),
};

/** Simulate network latency (100-400ms) */
export const delay = (ms: number = 200): Promise<void> => {
  const jitter = ms + Math.random() * 200;
  return new Promise((resolve) => setTimeout(resolve, jitter));
};

/** Simulate random failures (10% chance) for testing error states */
export const maybeFail = (failRate: number = 0): never | void => {
  if (Math.random() < failRate) {
    throw new HttpResponseError(500, "Simulated server error");
  }
};

export class HttpResponseError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpResponseError";
    this.status = status;
  }
}

/** Seed the DB with a sample bagi for dev/testing */
export const seedDb = (): void => {
  const bagiId = uuid();
  const now = Date.now();

  db.bagi.set(bagiId, {
    id: bagiId,
    name: "Tiket Dufan",
    date: now,
    includeService: false,
    includeTax: false,
    createdAt: now,
  });

  const asepId = uuid();
  const ucupId = uuid();
  db.userbagi.set(asepId, { id: asepId, bagiId, name: "asep", createdAt: now });
  db.userbagi.set(ucupId, { id: ucupId, bagiId, name: "ucup", createdAt: now });

  db.item.set(uuid(), {
    id: uuid(),
    bagiId,
    name: "Hotel",
    amount: 400000,
    quantity: 1,
    paidBy: asepId,
    allocation: [
      { memberId: asepId, quantity: 1 },
      { memberId: ucupId, quantity: 1 },
    ],
    createdAt: now,
  });
};
```

- [ ] **Step 3: Create `src/mocks/fixtures.ts`**

The fixture data returned by the mocked scan endpoint:

```typescript
import type { ScanResponse } from "@/types/api";

export const scanFixture: ScanResponse = {
  bagi: {
    name: "Restoran Padang",
    date: Date.now(),
    includeTax: true,
    includeService: true,
  },
  items: [
    { name: "Nasi Rendang", amount: 45000, quantity: 2 },
    { name: "Ayam Pop", amount: 40000, quantity: 1 },
    { name: "Es Teh", amount: 8000, quantity: 3 },
    { name: "Nasi Putih", amount: 5000, quantity: 3 },
  ],
};
```

- [ ] **Step 4: Create `src/mocks/handlers.ts`** (bagi CRUD only for now — userbagi and item handlers added in later tasks)

```typescript
import { http, HttpResponse } from "msw";
import { db, delay, maybeFail, HttpResponseError, seedDb } from "./db";
import type { BagiDetail, BagiListItem } from "@/types/entities";
import type { CreateBagiRequest, UpdateBagiRequest } from "@/types/api";
import { v4 as uuid } from "uuid";

const API_BASE = "/api";

// Seed once on module load
seedDb();

export const handlers = [
  // --- BAGI ---

  // GET /api/bagi — lightweight list (no children)
  http.get(`${API_BASE}/bagi`, async () => {
    await delay();
    maybeFail();

    const list: BagiListItem[] = Array.from(db.bagi.values()).map((b) => ({
      id: b.id,
      name: b.name,
      date: b.date,
      memberCount: Array.from(db.userbagi.values()).filter((u) => u.bagiId === b.id).length,
      itemCount: Array.from(db.item.values()).filter((i) => i.bagiId === b.id).length,
    }));

    return HttpResponse.json(list);
  }),

  // GET /api/bagi/:bagiId — single bagi with nested children
  http.get(`${API_BASE}/bagi/:bagiId`, async ({ params }) => {
    await delay();
    maybeFail();

    const { bagiId } = params;
    const bagi = db.bagi.get(bagiId as string);

    if (!bagi) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const members = Array.from(db.userbagi.values()).filter((u) => u.bagiId === bagiId);
    const items = Array.from(db.item.values()).filter((i) => i.bagiId === bagiId);

    const detail: BagiDetail = { ...bagi, members, items };
    return HttpResponse.json(detail);
  }),

  // POST /api/bagi — create
  http.post(`${API_BASE}/bagi`, async ({ request }) => {
    await delay();
    maybeFail();

    const body = (await request.json()) as CreateBagiRequest;
    const now = Date.now();
    const id = uuid();

    const bagi = {
      id,
      name: body.name,
      date: now,
      includeService: body.includeService,
      includeTax: body.includeTax,
      createdAt: now,
    };

    db.bagi.set(id, bagi);
    return HttpResponse.json(bagi, { status: 201 });
  }),

  // PATCH /api/bagi/:bagiId — update
  http.patch(`${API_BASE}/bagi/:bagiId`, async ({ params, request }) => {
    await delay();
    maybeFail();

    const { bagiId } = params;
    const bagi = db.bagi.get(bagiId as string);

    if (!bagi) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const body = (await request.json()) as UpdateBagiRequest;
    const updated = { ...bagi, ...body };
    db.bagi.set(bagiId as string, updated);

    return HttpResponse.json(updated);
  }),

  // DELETE /api/bagi/:bagiId — cascade delete
  http.delete(`${API_BASE}/bagi/:bagiId`, async ({ params }) => {
    await delay();
    maybeFail();

    const { bagiId } = params;

    if (!db.bagi.has(bagiId as string)) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    // Cascade: delete children first
    for (const [id, u] of db.userbagi) {
      if (u.bagiId === bagiId) db.userbagi.delete(id);
    }
    for (const [id, i] of db.item) {
      if (i.bagiId === bagiId) db.item.delete(id);
    }
    db.bagi.delete(bagiId as string);

    return new HttpResponse(null, { status: 204 });
  }),
];
```

- [ ] **Step 5: Create `src/mocks/browser.ts`**

```typescript
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

- [ ] **Step 6: Wire MSW into `src/main.tsx`**

MSW only runs in dev (not in production build). Update `src/main.tsx`:

```tsx
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";

async function bootstrap(): Promise<void> {
  // Start MSW only in dev
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();
```

- [ ] **Step 7: Verify MSW intercepts**

```bash
npm run dev
```
Open browser devtools → Network tab. Open the console and run:
```javascript
fetch("/api/bagi").then(r => r.json()).then(console.log)
```
Expected: you see an array with the seeded "Tiket Dufan" bagi. The network request shows as intercepted by MSW (look for `[MSW]` in console).

- [ ] **Step 8: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass. (MSW browser import is dynamic so build handles it.)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: MSW mock backend with in-memory store and bagi CRUD handlers"
```

---

## Task 4: API Client + TanStack Query Setup

**Goal:** Create the fetch wrapper, the bagi API functions, the query key factory, and the TanStack Query hooks for bagi. Wire up `QueryClientProvider` so the app has a query cache.

**Files:**
- Create: `src/api/client.ts`, `src/api/bagiApi.ts`, `src/hooks/queryKeys.ts`, `src/hooks/useBagiList.ts`, `src/hooks/useBagiDetail.ts`, `src/hooks/useCreateBagi.ts`, `src/hooks/useUpdateBagi.ts`, `src/hooks/useDeleteBagi.ts`
- Modify: `src/main.tsx` (add QueryClientProvider), `src/App.tsx` (temporary list display for verification)

**Interfaces:**
- Produces: `queryKeys` object, `useBagiList()`, `useBagiDetail(id)`, `useCreateBagi()`, `useUpdateBagi()`, `useDeleteBagi()` hooks.
- Consumes: MSW handlers (Task 3), entity types (Task 2).

- [ ] **Step 1: Create `src/api/client.ts`**

A thin fetch wrapper that throws on non-2xx responses:

```typescript
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(response.status, body.message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const apiGet = <T>(url: string): Promise<T> => request<T>(url);

export const apiPost = <T>(url: string, body: unknown): Promise<T> =>
  request<T>(url, { method: "POST", body: JSON.stringify(body) });

export const apiPatch = <T>(url: string, body: unknown): Promise<T> =>
  request<T>(url, { method: "PATCH", body: JSON.stringify(body) });

export const apiDelete = <T>(url: string): Promise<T> =>
  request<T>(url, { method: "DELETE" });
```

- [ ] **Step 2: Create `src/api/bagiApi.ts`**

```typescript
import { apiGet, apiPost, apiPatch, apiDelete } from "./client";
import type { Bagi, BagiDetail, BagiListItem } from "@/types/entities";
import type { CreateBagiRequest, UpdateBagiRequest } from "@/types/api";

const BASE = "/api/bagi";

export const bagiApi = {
  list: (): Promise<BagiListItem[]> => apiGet(BASE),

  detail: (id: string): Promise<BagiDetail> => apiGet(`${BASE}/${id}`),

  create: (body: CreateBagiRequest): Promise<Bagi> => apiPost(BASE, body),

  update: (id: string, body: UpdateBagiRequest): Promise<Bagi> =>
    apiPatch(`${BASE}/${id}`, body),

  delete: (id: string): Promise<void> => apiDelete(`${BASE}/${id}`),
};
```

- [ ] **Step 3: Create `src/hooks/queryKeys.ts`**

Centralized query keys so invalidation is type-safe and consistent:

```typescript
export const queryKeys = {
  bagi: {
    all: ["bagi"] as const,
    lists: () => [...queryKeys.bagi.all, "list"] as const,
    detail: (id: string) => [...queryKeys.bagi.all, "detail", id] as const,
  },
};
```

- [ ] **Step 4: Create `src/hooks/useBagiList.ts`**

```typescript
import { useQuery } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import { queryKeys } from "./queryKeys";

export const useBagiList = () => {
  return useQuery({
    queryKey: queryKeys.bagi.lists(),
    queryFn: bagiApi.list,
  });
};
```

- [ ] **Step 5: Create `src/hooks/useBagiDetail.ts`**

```typescript
import { useQuery } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import { queryKeys } from "./queryKeys";

export const useBagiDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.bagi.detail(id),
    queryFn: () => bagiApi.detail(id),
    enabled: !!id,
  });
};
```

- [ ] **Step 6: Create `src/hooks/useCreateBagi.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import type { CreateBagiRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useCreateBagi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBagiRequest) => bagiApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.lists() });
    },
  });
};
```

- [ ] **Step 7: Create `src/hooks/useUpdateBagi.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import type { UpdateBagiRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useUpdateBagi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBagiRequest }) =>
      bagiApi.update(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(id) });
    },
  });
};
```

- [ ] **Step 8: Create `src/hooks/useDeleteBagi.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import { queryKeys } from "./queryKeys";

export const useDeleteBagi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bagiApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.lists() });
    },
  });
};
```

- [ ] **Step 9: Update `src/main.tsx` — add QueryClientProvider + DevTools**

```tsx
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

async function bootstrap(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}

bootstrap();
```

- [ ] **Step 10: Temporary verification in `src/App.tsx`**

Replace `App.tsx` with a temporary component that calls `useBagiList()` and displays results, so we can verify the full data flow works:

```tsx
import { useBagiList } from "@/hooks/useBagiList";

const App = () => {
  const { data, isLoading, isError } = useBagiList();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8">Error loading bagi</div>;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Bagi List (temp verification)</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default App;
```

- [ ] **Step 11: Verify data flow**

```bash
npm run dev
```
Expected: the page shows "Loading..." briefly, then displays the JSON of the seeded bagi list (`[{ "id": "...", "name": "Tiket Dufan", ... }]`). The TanStack Query DevTools panel (bottom of screen) shows the `["bagi","list"]` query as fresh.

- [ ] **Step 12: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: API client, query keys, and TanStack Query hooks for bagi CRUD"
```

---

## Task 5: Userbagi Handlers + API + Hooks

**Goal:** Extend the mock backend with userbagi CRUD handlers, create the userbagi API functions, and add TanStack Query hooks for member mutations.

**Files:**
- Modify: `src/mocks/handlers.ts` (add userbagi handlers)
- Create: `src/api/userbagiApi.ts`, `src/hooks/useAddMember.ts`, `src/hooks/useUpdateMember.ts`, `src/hooks/useDeleteMember.ts`

**Interfaces:**
- Produces: `userbagiApi` object, `useAddMember()`, `useUpdateMember()`, `useDeleteMember()` hooks.
- Consumes: MSW db (Task 3), entity types (Task 2), queryKeys (Task 4).

- [ ] **Step 1: Add userbagi handlers to `src/mocks/handlers.ts`**

Add these handlers inside the `handlers` array (after the bagi handlers), before the closing `]`:

```typescript
  // --- USERBAGI ---

  // POST /api/bagi/:bagiId/userbagi — add member
  http.post(`${API_BASE}/bagi/:bagiId/userbagi`, async ({ params, request }) => {
    await delay();
    maybeFail();

    const { bagiId } = params;
    if (!db.bagi.has(bagiId as string)) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const body = (await request.json()) as CreateUserbagiRequest;
    const now = Date.now();
    const id = uuid();

    const member = {
      id,
      bagiId: bagiId as string,
      name: body.name,
      createdAt: now,
    };

    db.userbagi.set(id, member);
    return HttpResponse.json(member, { status: 201 });
  }),

  // PATCH /api/bagi/:bagiId/userbagi/:id — rename member
  http.patch(`${API_BASE}/bagi/:bagiId/userbagi/:id`, async ({ params, request }) => {
    await delay();
    maybeFail();

    const { id } = params;
    const member = db.userbagi.get(id as string);

    if (!member) {
      return HttpResponse.json({ message: "Member not found" }, { status: 404 });
    }

    const body = (await request.json()) as UpdateUserbagiRequest;
    const updated = { ...member, name: body.name };
    db.userbagi.set(id as string, updated);

    return HttpResponse.json(updated);
  }),

  // DELETE /api/bagi/:bagiId/userbagi/:id — remove member
  http.delete(`${API_BASE}/bagi/:bagiId/userbagi/:id`, async ({ params }) => {
    await delay();
    maybeFail();

    const { id } = params;
    if (!db.userbagi.has(id as string)) {
      return HttpResponse.json({ message: "Member not found" }, { status: 404 });
    }

    db.userbagi.delete(id as string);
    return new HttpResponse(null, { status: 204 });
  }),
```

You also need to add the imports for `CreateUserbagiRequest` and `UpdateUserbagiRequest` at the top of `handlers.ts`. Update the existing api import line to:
```typescript
import type {
  CreateBagiRequest,
  UpdateBagiRequest,
  CreateUserbagiRequest,
  UpdateUserbagiRequest,
} from "@/types/api";
```

- [ ] **Step 2: Create `src/api/userbagiApi.ts`**

```typescript
import { apiPost, apiPatch, apiDelete } from "./client";
import type { Userbagi } from "@/types/entities";
import type { CreateUserbagiRequest, UpdateUserbagiRequest } from "@/types/api";

export const userbagiApi = {
  create: (bagiId: string, body: CreateUserbagiRequest): Promise<Userbagi> =>
    apiPost(`/api/bagi/${bagiId}/userbagi`, body),

  update: (bagiId: string, id: string, body: UpdateUserbagiRequest): Promise<Userbagi> =>
    apiPatch(`/api/bagi/${bagiId}/userbagi/${id}`, body),

  delete: (bagiId: string, id: string): Promise<void> =>
    apiDelete(`/api/bagi/${bagiId}/userbagi/${id}`),
};
```

- [ ] **Step 3: Create `src/hooks/useAddMember.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userbagiApi } from "@/api/userbagiApi";
import type { CreateUserbagiRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useAddMember = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateUserbagiRequest) => userbagiApi.create(bagiId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
```

- [ ] **Step 4: Create `src/hooks/useUpdateMember.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userbagiApi } from "@/api/userbagiApi";
import type { UpdateUserbagiRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useUpdateMember = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserbagiRequest }) =>
      userbagiApi.update(bagiId, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
```

- [ ] **Step 5: Create `src/hooks/useDeleteMember.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userbagiApi } from "@/api/userbagiApi";
import { queryKeys } from "./queryKeys";

export const useDeleteMember = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userbagiApi.delete(bagiId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
```

- [ ] **Step 6: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: userbagi CRUD handlers, API, and hooks"
```

---

## Task 6: Item Handlers + API + Hooks

**Goal:** Extend the mock backend with item CRUD handlers (including batch create for the scan flow), create the item API functions, and add hooks.

**Files:**
- Modify: `src/mocks/handlers.ts` (add item handlers)
- Create: `src/api/itemApi.ts`, `src/hooks/useCreateItem.ts`, `src/hooks/useUpdateItem.ts`, `src/hooks/useDeleteItem.ts`, `src/hooks/useBatchCreateItems.ts`

**Interfaces:**
- Produces: `itemApi` object, `useCreateItem()`, `useUpdateItem()`, `useDeleteItem()`, `useBatchCreateItems()` hooks.
- Consumes: MSW db (Task 3), entity types (Task 2), queryKeys (Task 4).

- [ ] **Step 1: Add item handlers to `src/mocks/handlers.ts`**

Add these handlers inside the `handlers` array (after the userbagi handlers), before the closing `]`:

```typescript
  // --- ITEM ---

  // POST /api/bagi/:bagiId/item — add single item
  http.post(`${API_BASE}/bagi/:bagiId/item`, async ({ params, request }) => {
    await delay();
    maybeFail();

    const { bagiId } = params;
    if (!db.bagi.has(bagiId as string)) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const body = (await request.json()) as CreateItemRequest;
    const now = Date.now();
    const id = uuid();

    const item = {
      id,
      bagiId: bagiId as string,
      name: body.name,
      amount: body.amount,
      quantity: body.quantity,
      paidBy: body.paidBy,
      allocation: body.allocation,
      createdAt: now,
    };

    db.item.set(id, item);
    return HttpResponse.json(item, { status: 201 });
  }),

  // POST /api/bagi/:bagiId/item/batch — batch create (scan flow)
  http.post(`${API_BASE}/bagi/:bagiId/item/batch`, async ({ params, request }) => {
    await delay();
    maybeFail();

    const { bagiId } = params;
    if (!db.bagi.has(bagiId as string)) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const body = (await request.json()) as BatchCreateItemsRequest;
    const now = Date.now();
    const created = body.items.map((itemInput) => {
      const id = uuid();
      const item = {
        id,
        bagiId: bagiId as string,
        name: itemInput.name,
        amount: itemInput.amount,
        quantity: itemInput.quantity,
        paidBy: "",
        allocation: [],
        createdAt: now,
      };
      db.item.set(id, item);
      return item;
    });

    return HttpResponse.json(created, { status: 201 });
  }),

  // PATCH /api/bagi/:bagiId/item/:id — update item
  http.patch(`${API_BASE}/bagi/:bagiId/item/:id`, async ({ params, request }) => {
    await delay();
    maybeFail();

    const { id } = params;
    const item = db.item.get(id as string);

    if (!item) {
      return HttpResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const body = (await request.json()) as UpdateItemRequest;
    const updated = { ...item, ...body };
    db.item.set(id as string, updated);

    return HttpResponse.json(updated);
  }),

  // DELETE /api/bagi/:bagiId/item/:id — remove item
  http.delete(`${API_BASE}/bagi/:bagiId/item/:id`, async ({ params }) => {
    await delay();
    maybeFail();

    const { id } = params;
    if (!db.item.has(id as string)) {
      return HttpResponse.json({ message: "Item not found" }, { status: 404 });
    }

    db.item.delete(id as string);
    return new HttpResponse(null, { status: 204 });
  }),
```

Update the api import at the top of `handlers.ts` to also include the item request types:
```typescript
import type {
  CreateBagiRequest,
  UpdateBagiRequest,
  CreateUserbagiRequest,
  UpdateUserbagiRequest,
  CreateItemRequest,
  UpdateItemRequest,
  BatchCreateItemsRequest,
} from "@/types/api";
```

- [ ] **Step 2: Create `src/api/itemApi.ts`**

```typescript
import { apiPost, apiPatch, apiDelete } from "./client";
import type { Item } from "@/types/entities";
import type {
  CreateItemRequest,
  UpdateItemRequest,
  BatchCreateItemsRequest,
} from "@/types/api";

export const itemApi = {
  create: (bagiId: string, body: CreateItemRequest): Promise<Item> =>
    apiPost(`/api/bagi/${bagiId}/item`, body),

  batchCreate: (bagiId: string, body: BatchCreateItemsRequest): Promise<Item[]> =>
    apiPost(`/api/bagi/${bagiId}/item/batch`, body),

  update: (bagiId: string, id: string, body: UpdateItemRequest): Promise<Item> =>
    apiPatch(`/api/bagi/${bagiId}/item/${id}`, body),

  delete: (bagiId: string, id: string): Promise<void> =>
    apiDelete(`/api/bagi/${bagiId}/item/${id}`),
};
```

- [ ] **Step 3: Create `src/hooks/useCreateItem.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemApi } from "@/api/itemApi";
import type { CreateItemRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useCreateItem = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateItemRequest) => itemApi.create(bagiId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
```

- [ ] **Step 4: Create `src/hooks/useUpdateItem.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemApi } from "@/api/itemApi";
import type { UpdateItemRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useUpdateItem = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateItemRequest }) =>
      itemApi.update(bagiId, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
```

- [ ] **Step 5: Create `src/hooks/useDeleteItem.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemApi } from "@/api/itemApi";
import { queryKeys } from "./queryKeys";

export const useDeleteItem = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemApi.delete(bagiId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
```

- [ ] **Step 6: Create `src/hooks/useBatchCreateItems.ts`**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemApi } from "@/api/itemApi";
import type { BatchCreateItemsRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useBatchCreateItems = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: BatchCreateItemsRequest) => itemApi.batchCreate(bagiId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
```

- [ ] **Step 7: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: item CRUD handlers, batch create, API, and hooks"
```

---

## Task 7: UI Primitives

**Goal:** Build the reusable presentational components used across the wizard and pages. These are dumb components — no data fetching, no business logic, just props in and Tailwind classes out.

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/Chip.tsx`, `src/components/ui/Spinner.tsx`, `src/components/ui/EmptyState.tsx`, `src/components/ui/ErrorBanner.tsx`

**Interfaces:**
- Produces: `Button`, `Input`, `Chip`, `Spinner`, `EmptyState`, `ErrorBanner` components.
- Consumes: `cn` helper (Task 2).

- [ ] **Step 1: Create `src/components/ui/Button.tsx`**

```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
  ghost: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

export const Button = ({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
```

- [ ] **Step 2: Create `src/components/ui/Input.tsx`**

```tsx
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
            "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            "placeholder:text-gray-400",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
```

- [ ] **Step 3: Create `src/components/ui/Chip.tsx`**

A selectable chip for member selection. Two display modes: simple toggle (equal share) and counter (by quantity).

```tsx
import { cn } from "@/lib/cn";

interface ChipProps {
  label: string;
  selected?: boolean;
  count?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export const Chip = ({ label, selected, count, disabled, onClick }: ChipProps) => {
  const hasCount = count !== undefined;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
        "border",
        selected
          ? "border-blue-600 bg-blue-50 text-blue-600"
          : "border-gray-300 bg-white text-gray-500 hover:border-gray-400",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <span>{label}</span>
      {hasCount && (
        <span
          className={cn(
            "min-w-[18px] rounded px-1 text-center text-[10px] font-bold",
            selected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};
```

- [ ] **Step 4: Create `src/components/ui/Spinner.tsx`**

```tsx
import { cn } from "@/lib/cn";

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        className
      )}
    />
  );
};
```

- [ ] **Step 5: Create `src/components/ui/EmptyState.tsx`**

```tsx
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {description && <p className="max-w-xs text-xs text-gray-400">{description}</p>}
      {action}
    </div>
  );
};
```

- [ ] **Step 6: Create `src/components/ui/ErrorBanner.tsx`**

```tsx
interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-medium text-red-600 underline hover:text-red-800"
        >
          Retry
        </button>
      )}
    </div>
  );
};
```

- [ ] **Step 7: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: UI primitives (Button, Input, Chip, Spinner, EmptyState, ErrorBanner)"
```

---

## Task 8: Zod Wizard Form Schema

**Goal:** Define the single zod schema that spans all three wizard steps. This schema validates the bagi header, members array, items array (with allocations), and the cross-field rules (min 2 members, no duplicate member names, allocation quantities must sum to item.quantity).

**Files:**
- Create: `src/wizard/bagiFormSchema.ts`

**Interfaces:**
- Produces: `bagiFormSchema` (zod schema), `BagiFormData` type (inferred), `BagiFormInput` type (what react-hook-form sees before parsing).
- Consumes: none (this is the source of truth for form validation).

- [ ] **Step 1: Create `src/wizard/bagiFormSchema.ts`**

```typescript
import { z } from "zod";

// --- Sub-schemas ---

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
  allocation: z.array(allocationSchema),
});

// --- Root schema ---

export const bagiFormSchema = z
  .object({
    name: z.string().min(1, "Bagi name cannot be empty"),
    includeService: z.boolean(),
    includeTax: z.boolean(),
    members: z.array(memberSchema).min(2, "Need at least 2 members"),
    items: z.array(itemSchema),
  })
  .superRefine((data, ctx) => {
    // Rule 1: no duplicate member names (case-insensitive)
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

    // Rule 2: each item's allocation quantities must sum to item.quantity
    //         (when allocation has entries; empty allocation = unassigned, which is invalid at save)
    data.items.forEach((item, itemIndex) => {
      if (item.allocation.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must assign who shares this item",
          path: ["items", itemIndex, "allocation"],
        });
        return;
      }

      const allocated = item.allocation.reduce((sum, a) => sum + a.quantity, 0);
      if (allocated !== item.quantity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Allocation (${allocated}) must sum to quantity (${item.quantity})`,
          path: ["items", itemIndex, "allocation"],
        });
      }

      // Rule 3: allocation memberId must reference a member in the members array
      const memberIds = new Set(data.members.map((m) => m.id));
      item.allocation.forEach((alloc, allocIndex) => {
        if (!memberIds.has(alloc.memberId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Allocation references an unknown member",
            path: ["items", itemIndex, "allocation", allocIndex, "memberId"],
          });
        }
      });

      // Rule 4: paidBy must reference a member
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

- [ ] **Step 2: Verify the schema compiles and exports**

Create a temporary check by importing it in App.tsx (will be removed in the next task):

```typescript
// Add to top of src/App.tsx temporarily:
import { bagiFormSchema } from "@/wizard/bagiFormSchema";

// In the App component, add:
console.log("schema:", bagiFormSchema);
```

- [ ] **Step 3: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass. The zod import resolves and the schema object is valid.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: zod wizard form schema with cross-field validation rules"
```

---

## Task 9: Routing + BagiListPage

**Goal:** Set up the React Router configuration with all routes, and build the BagiListPage (the home screen showing all bagi sessions). Remove the temporary App.tsx verification code.

**Files:**
- Create: `src/pages/BagiListPage.tsx`
- Modify: `src/App.tsx` (replace temporary verification with real router)

**Interfaces:**
- Produces: `BagiListPage` component, working router with all routes defined (other pages as placeholders).
- Consumes: `useBagiList` (Task 4), `useDeleteBagi` (Task 4), UI primitives (Task 7).

- [ ] **Step 1: Create placeholder pages for routes that don't have full implementations yet**

Create these minimal placeholder files so the router compiles:

`src/pages/BagiWizardPage.tsx`:
```tsx
const BagiWizardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Wizard (Task 10-12 will implement)</h1>
    </div>
  );
};

export default BagiWizardPage;
```

`src/pages/BagiDetailPage.tsx`:
```tsx
const BagiDetailPage = () => {
  const { bagiId } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bagi Detail: {bagiId}</h1>
      <p className="text-sm text-gray-500">(Read-only view — full implementation in a later task)</p>
    </div>
  );
};

import { useParams } from "react-router-dom";

export default BagiDetailPage;
```

Note: fix the import order — `useParams` import goes at the top of the file, before the component.

`src/pages/NotFoundPage.tsx`:
```tsx
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/bagi" className="text-blue-600 underline">
        Back to Bagi list
      </Link>
    </div>
  );
};

export default NotFoundPage;
```

- [ ] **Step 2: Create `src/pages/BagiListPage.tsx`**

```tsx
import { useNavigate } from "react-router-dom";
import { useBagiList } from "@/hooks/useBagiList";
import { useDeleteBagi } from "@/hooks/useDeleteBagi";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

const BagiListPage = () => {
  const navigate = useNavigate();
  const { data: bagiList, isLoading, isError, refetch } = useBagiList();
  const deleteBagi = useDeleteBagi();

  const handleDelete = (e: React.MouseEvent, bagiId: string) => {
    e.stopPropagation();
    if (confirm("Delete this bagi? All members and items will be removed.")) {
      deleteBagi.mutate(bagiId);
    }
  };

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
        <ErrorBanner message="Failed to load bagi list" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">MariBagi</h1>
        <Button onClick={() => navigate("/bagi/new")}>+ New</Button>
      </header>

      {!bagiList || bagiList.length === 0 ? (
        <EmptyState
          title="No bagi sessions yet"
          description="Create your first expense split to get started."
          action={<Button onClick={() => navigate("/bagi/new")}>Create a bagi</Button>}
        />
      ) : (
        <ul className="space-y-2">
          {bagiList.map((bagi) => (
            <li
              key={bagi.id}
              onClick={() => navigate(`/bagi/${bagi.id}`)}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300"
            >
              <div>
                <p className="font-medium text-gray-900">{bagi.name}</p>
                <p className="text-xs text-gray-500">
                  {bagi.memberCount} members · {bagi.itemCount} items
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, bagi.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BagiListPage;
```

- [ ] **Step 3: Rewrite `src/App.tsx` with the router**

```tsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import BagiListPage from "@/pages/BagiListPage";
import BagiWizardPage from "@/pages/BagiWizardPage";
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
    element: <BagiWizardPage />,
  },
  {
    path: "/bagi/new/items",
    element: <BagiWizardPage />,
  },
  {
    path: "/bagi/new/sharing",
    element: <BagiWizardPage />,
  },
  {
    path: "/bagi/:bagiId",
    element: <BagiDetailPage />,
  },
  {
    path: "/bagi/:bagiId/edit",
    element: <BagiWizardPage />,
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

- [ ] **Step 4: Verify the list page works**

```bash
npm run dev
```
Expected:
- `localhost:5173/` redirects to `/bagi`.
- The list page shows the seeded "Tiket Dufan" bagi with "2 members · 1 items".
- Clicking "+ New" navigates to `/bagi/new` and shows the wizard placeholder.
- Clicking a bagi navigates to `/bagi/:id` and shows the detail placeholder.
- The TanStack Query DevTools shows the `["bagi","list"]` query.

- [ ] **Step 5: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: routing setup and BagiListPage with delete"
```

---

## Task 10: Wizard Step 1 (Setup)

**Goal:** Build Step 1 of the wizard — the form for the bagi header (name, tax/service toggles) and the members list (add/rename/remove). This is the first real wizard step, using react-hook-form's `useForm` and `useFieldArray`.

**Files:**
- Create: `src/wizard/WizardSteps.tsx`, `src/wizard/Step1Setup.tsx`
- Modify: `src/pages/BagiWizardPage.tsx` (wire up the form + step routing)

**Interfaces:**
- Produces: `WizardSteps` (step indicator + nav), `Step1Setup` (form step), wired `BagiWizardPage`.
- Consumes: `bagiFormSchema` (Task 8), `useFieldArray` from react-hook-form, UI primitives (Task 7).

- [ ] **Step 1: Create `src/wizard/WizardSteps.tsx`**

A step indicator showing progress through the wizard. Purely presentational.

```tsx
import { cn } from "@/lib/cn";

interface WizardStepsProps {
  currentStep: 1 | 2 | 3;
}

export const WizardSteps = ({ currentStep }: WizardStepsProps) => {
  const steps: Array<{ num: number; label: string }> = [
    { num: 1, label: "Setup" },
    { num: 2, label: "Items" },
    { num: 3, label: "Sharing" },
  ];

  return (
    <div className="mb-6 flex items-center gap-2">
      {steps.map((step, index) => {
        const isDone = step.num < currentStep;
        const isActive = step.num === currentStep;
        return (
          <div key={step.num} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                isDone && "bg-green-500 text-white",
                isActive && "bg-blue-600 text-white",
                !isDone && !isActive && "bg-gray-200 text-gray-400"
              )}
            >
              {isDone ? "✓" : step.num}
            </div>
            <span
              className={cn(
                "text-xs",
                isActive ? "font-semibold text-blue-600" : "text-gray-400"
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && <div className="mx-1 h-px flex-1 bg-gray-200" />}
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Create `src/wizard/Step1Setup.tsx`**

This step renders the form fields for: bagi name, tax/service toggles, and the members array (with add/remove). It receives `register`, `watch`, `setValue`, and the members field array from the parent form.

```tsx
import { useEffect } from "react";
import type { UseFormReturn, FieldErrors } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Step1SetupProps {
  form: UseFormReturn<BagiFormData>;
}

export const Step1Setup = ({ form }: Step1SetupProps) => {
  const { register, control, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "members" });

  const members = watch("members");
  const includeService = watch("includeService");
  const includeTax = watch("includeTax");

  // Auto-add a member row if the list is empty (so the user sees at least one input)
  useEffect(() => {
    if (fields.length === 0) {
      append({ id: crypto.randomUUID(), name: "" });
      append({ id: crypto.randomUUID(), name: "" });
    }
  }, [fields.length, append]);

  const handleAddMember = () => {
    append({ id: crypto.randomUUID(), name: "" });
  };

  const handleRemoveMember = (index: number) => {
    // Keep at least 2 rows visible; remove just clears if fewer would remain
    if (fields.length > 2) {
      remove(index);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Split group name"
        placeholder="Tiket Dufan, Makan Senop..."
        {...register("name")}
        error={form.formState.errors.name?.message}
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={includeService ?? false}
            onChange={(e) => setValue("includeService", e.target.checked)}
          />
          Service charge
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={includeTax ?? false}
            onChange={(e) => setValue("includeTax", e.target.checked)}
          />
          Tax
        </label>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
          Members
        </label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                {...register(`members.${index}.name` as const)}
                placeholder={`Member ${index + 1} name`}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {fields.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" onClick={handleAddMember} className="mt-2">
          + Add member
        </Button>
        {form.formState.errors.members && (
          <p className="mt-1 text-xs text-red-600">
            {form.formState.errors.members.message ?? "Member validation error"}
          </p>
        )}
      </div>
    </div>
  );
};
```

Note: `crypto.randomUUID()` is available in modern browsers (Node 22 / HTTPS / localhost). It returns a UUID string. This is simpler than importing uuid here.

- [ ] **Step 3: Rewrite `src/pages/BagiWizardPage.tsx`**

The wizard host. Creates the `useForm` instance, determines the current step from the URL, renders the step indicator and the current step, and handles navigation between steps.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { bagiFormSchema } from "@/wizard/bagiFormSchema";
import type { BagiFormData } from "@/wizard/bagiFormSchema";
import { WizardSteps } from "@/wizard/WizardSteps";
import { Step1Setup } from "@/wizard/Step1Setup";
import { Button } from "@/components/ui/Button";

const DEFAULT_VALUES: BagiFormData = {
  name: "",
  includeService: false,
  includeTax: false,
  members: [],
  items: [],
};

const getCurrentStep = (pathname: string): 1 | 2 | 3 => {
  if (pathname.includes("/sharing")) return 3;
  if (pathname.includes("/items")) return 2;
  return 1;
};

const BagiWizardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = getCurrentStep(location.pathname);

  const form = useForm<BagiFormData>({
    resolver: zodResolver(bagiFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const handleNextFromSetup = async () => {
    // Validate step 1 fields only (members + name)
    const valid = await form.trigger(["name", "members"]);
    if (valid) {
      navigate("/bagi/new/items");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        {currentStep > 1 && (
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600"
          >
            ‹ Back
          </button>
        )}
        <h1 className="text-lg font-bold text-gray-900">
          {currentStep === 1 ? "New Bagi" : form.getValues("name") || "Bagi"}
        </h1>
      </div>

      <WizardSteps currentStep={currentStep} />

      {currentStep === 1 && <Step1Setup form={form} />}

      {currentStep === 1 && (
        <Button fullWidth className="mt-6" onClick={handleNextFromSetup}>
          Next → Items
        </Button>
      )}

      {/* Steps 2 and 3 rendered in Tasks 11 and 12 */}
      {currentStep === 2 && (
        <div className="py-12 text-center text-gray-400">Step 2 (Items) — Task 11</div>
      )}
      {currentStep === 3 && (
        <div className="py-12 text-center text-gray-400">Step 3 (Sharing) — Task 12</div>
      )}
    </div>
  );
};

export default BagiWizardPage;
```

- [ ] **Step 4: Verify Step 1 works**

```bash
npm run dev
```
Expected:
- Navigate to `/bagi/new`. Step indicator shows "1 Setup" active.
- Two empty member input rows appear (auto-seeded).
- Typing a name shows it in the header on next render.
- Clicking "+ Add member" adds a third row.
- Clicking "Next → Items" with empty fields shows validation errors (empty name, etc.).
- Filling valid data and clicking "Next → Items" navigates to `/bagi/new/items` (shows Step 2 placeholder).

- [ ] **Step 5: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: wizard Step 1 (setup — bagi header + members) with form validation"
```

---

## Task 11: Wizard Step 2 (Items) + Scan Button

**Goal:** Build Step 2 of the wizard — the items list with add/edit/remove, plus the receipt scan button that calls the MSW scan endpoint and populates the form with extracted items.

**Files:**
- Create: `src/wizard/Step2Items.tsx`, `src/wizard/ScanButton.tsx`, `src/api/scanApi.ts`, `src/hooks/useScanReceipt.ts`
- Modify: `src/pages/BagiWizardPage.tsx` (render Step2Items when on step 2, add "Next → Sharing" button)

**Interfaces:**
- Produces: `Step2Items` component, `ScanButton` component, `scanApi`, `useScanReceipt` hook.
- Consumes: `bagiFormSchema` (Task 8), UI primitives (Task 7), MSW scan handler (Task 3).

- [ ] **Step 1: Create `src/api/scanApi.ts`**

```typescript
import { apiPost } from "./client";
import type { ScanResponse } from "@/types/api";

export const scanApi = {
  scan: (bagiId: string): Promise<ScanResponse> =>
    apiPost(`/api/bagi/${bagiId}/scan`, {}),
};
```

- [ ] **Step 2: Create `src/hooks/useScanReceipt.ts`**

```typescript
import { useMutation } from "@tanstack/react-query";
import { scanApi } from "@/api/scanApi";

export const useScanReceipt = (bagiId: string) => {
  return useMutation({
    mutationFn: () => scanApi.scan(bagiId),
  });
};
```

- [ ] **Step 3: Add scan handler to `src/mocks/handlers.ts`**

Add this handler inside the `handlers` array (after the item handlers), before the closing `]`. Also import the `scanFixture`.

```typescript
  // --- SCAN (mocked AI) ---

  http.post(`${API_BASE}/bagi/:bagiId/scan`, async ({ params }) => {
    await delay(800); // simulate longer AI processing time
    maybeFail();

    const { bagiId } = params;
    if (!db.bagi.has(bagiId as string)) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    return HttpResponse.json(scanFixture);
  }),
```

Add to imports at the top:
```typescript
import { scanFixture } from "./fixtures";
```

- [ ] **Step 4: Create `src/wizard/ScanButton.tsx`**

```tsx
import { useRef } from "react";
import { useScanReceipt } from "@/hooks/useScanReceipt";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

interface ScanButtonProps {
  bagiId: string;
  onScanned: (data: { name: string; items: { name: string; amount: number; quantity: number }[] }) => void;
}

export const ScanButton = ({ bagiId, onScanned }: ScanButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanMutation = useScanReceipt(bagiId);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In milestone 1, we ignore the actual file content and just trigger the MSW mock.
    // The file is captured to simulate a real upload flow; the backend (MSW) returns a fixture.
    scanMutation.mutate(undefined, {
      onSuccess: (data) => {
        onScanned({ name: data.bagi.name, items: data.items });
      },
    });

    // Reset input so the same file can be re-selected
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
          "📷 Scan receipt"
        )}
      </Button>
      {scanMutation.isError && (
        <p className="mt-1 text-xs text-red-600">Scan failed — try again</p>
      )}
    </>
  );
};
```

- [ ] **Step 5: Create `src/wizard/Step2Items.tsx`**

```tsx
import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Button } from "@/components/ui/Button";
import { ScanButton } from "./ScanButton";
import { formatRupiah } from "@/lib/format";

interface Step2ItemsProps {
  form: UseFormReturn<BagiFormData>;
}

export const Step2Items = ({ form }: Step2ItemsProps) => {
  const { register, control, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const items = watch("items");
  const bagiName = watch("name");

  const handleAddItem = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      amount: 0,
      quantity: 1,
      paidBy: "",
      allocation: [],
    });
  };

  // For scan: we need a bagiId. In create mode, the bagi doesn't exist on the server yet.
  // For milestone 1, we use a placeholder and call the scan endpoint with it (the mock ignores it).
  // A more robust approach would create the bagi first, but for simplicity in milestone 1
  // we use "draft" as the bagiId and the MSW handler tolerates it.
  // NOTE: This is a known milestone-1 simplification. When the real backend arrives,
  // the scan flow will require a persisted bagiId (create-then-scan).
  const handleScanned = (data: { name: string; items: { name: string; amount: number; quantity: number }[] }) => {
    // Optionally update the bagi name if the user hasn't typed one
    if (!form.getValues("name")) {
      form.setValue("name", data.name);
    }
    // Replace items with scanned ones
    form.setValue(
      "items",
      data.items.map((item) => ({
        id: crypto.randomUUID(),
        name: item.name,
        amount: item.amount,
        quantity: item.quantity,
        paidBy: "",
        allocation: [],
      }))
    );
  };

  return (
    <div className="space-y-4">
      <ScanButton bagiId="draft" onScanned={handleScanned} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Items ({fields.length})
        </span>
      </div>

      {fields.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          No items yet. Add one manually or scan a receipt.
        </p>
      ) : (
        <ul className="space-y-2">
          {fields.map((field, index) => {
            const item = items?.[index];
            return (
              <li key={field.id} className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <input
                    {...register(`items.${index}.name` as const)}
                    placeholder="Item name"
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                    className="w-14 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    min={1}
                  />
                  <span className="text-xs text-gray-400">x</span>
                  <input
                    type="number"
                    {...register(`items.${index}.amount` as const, { valueAsNumber: true })}
                    className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Amount"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                {item && item.name && item.amount > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    {formatRupiah(item.amount)} total
                    {item.quantity > 1 ? ` · ${formatRupiah(item.amount / item.quantity)} each` : ""}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Button variant="ghost" onClick={handleAddItem}>
        + Add item
      </Button>
    </div>
  );
};
```

- [ ] **Step 6: Update `src/pages/BagiWizardPage.tsx` — render Step2Items**

In the existing `BagiWizardPage.tsx`, replace the Step 2 placeholder block:

```tsx
      {currentStep === 2 && (
        <div className="py-12 text-center text-gray-400">Step 2 (Items) — Task 11</div>
      )}
```

with:

```tsx
      {currentStep === 2 && <Step2Items form={form} />}
```

And add the import at the top:
```tsx
import { Step2Items } from "@/wizard/Step2Items";
```

Also add a "Next → Sharing" button for step 2. Below the step rendering, after the existing `{currentStep === 1 && (...)}` block, add:

```tsx
      {currentStep === 2 && (
        <Button
          fullWidth
          className="mt-6"
          onClick={() => {
            const valid = form.trigger(["items"]);
            valid.then((isOk) => {
              if (isOk) navigate("/bagi/new/sharing");
            });
          }}
        >
          Next → Sharing
        </Button>
      )}
```

- [ ] **Step 7: Verify Step 2 works**

```bash
npm run dev
```
Expected:
- Complete Step 1 with valid data, click "Next → Items".
- Step 2 shows empty state ("No items yet").
- Clicking "📷 Scan receipt" opens file picker. Selecting any image shows "Scanning..." for ~1s, then populates the items list with the fixture (Nasi Rendang, Ayam Pop, Es Teh, Nasi Putih) and fills the bagi name if empty.
- Clicking "+ Add item" adds a blank row. Editing name/qty/amount works. Removing items works.

- [ ] **Step 8: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: wizard Step 2 (items list) + receipt scan button"
```

---

## Task 12: Wizard Step 3 (Sharing) + Save

**Goal:** Build Step 3 of the wizard — the allocation UI with two modes per item (equal share / by quantity), the "Save Bagi" button that persists everything to the mock backend, and the redirect to the detail page on success.

**Files:**
- Create: `src/wizard/Step3Sharing.tsx`
- Modify: `src/pages/BagiWizardPage.tsx` (render Step3Sharing, wire up save)

**Interfaces:**
- Produces: `Step3Sharing` component, working save flow.
- Consumes: `bagiFormSchema` (Task 8), UI primitives (Task 7), `useCreateBagi` + `useBatchCreateItems` + `userbagiApi` (earlier tasks).

- [ ] **Step 1: Create `src/wizard/Step3Sharing.tsx`**

This is the most complex step. For each item, it shows:
- Item name + amount (read-only display)
- A mode toggle: "Equal share" / "By quantity"
- Member chips (equal share = toggle in/out; by quantity = tap to increment with a remaining counter)
- A "Paid by" selector

```tsx
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

interface Step3SharingProps {
  form: UseFormReturn<BagiFormData>;
}

type AllocMode = "equal" | "quantity";

export const Step3Sharing = ({ form }: Step3SharingProps) => {
  const items = useWatch({ control: form.control, name: "items" });
  const members = useWatch({ control: form.control, name: "members" });

  // Track allocation mode per item (index → mode). Default to "quantity" when item.quantity > 1.
  const [modes, setModes] = useState<Record<number, AllocMode>>({});

  const getMode = (index: number, quantity: number): AllocMode => {
    if (modes[index]) return modes[index];
    return quantity > 1 ? "quantity" : "equal";
  };

  const setMode = (index: number, mode: AllocMode) => {
    setModes((prev) => ({ ...prev, [index]: mode }));
    // Reset allocation when switching modes
    const currentItems = form.getValues("items");
    currentItems[index].allocation = [];
    form.setValue("items", currentItems);
  };

  // --- Equal share handlers ---
  const toggleMemberEqual = (itemIndex: number, memberId: string) => {
    const currentItems = form.getValues("items");
    const current = currentItems[itemIndex].allocation;
    const existing = current.find((a) => a.memberId === memberId);
    if (existing) {
      currentItems[itemIndex].allocation = current.filter((a) => a.memberId !== memberId);
    } else {
      currentItems[itemIndex].allocation = [...current, { memberId, quantity: 1 }];
    }
    form.setValue("items", currentItems);
  };

  // --- By quantity handlers ---
  const incrementMemberQty = (itemIndex: number, memberId: string) => {
    const currentItems = form.getValues("items");
    const item = currentItems[itemIndex];
    const allocated = item.allocation.reduce((sum, a) => sum + a.quantity, 0);
    if (allocated >= item.quantity) return; // cannot exceed

    const existing = item.allocation.find((a) => a.memberId === memberId);
    if (existing) {
      existing.quantity += 1;
    } else {
      item.allocation = [...item.allocation, { memberId, quantity: 1 }];
    }
    form.setValue("items", currentItems);
  };

  const getRemaining = (itemIndex: number): number => {
    const item = items?.[itemIndex];
    if (!item) return 0;
    const allocated = item.allocation.reduce((sum, a) => sum + a.quantity, 0);
    return item.quantity - allocated;
  };

  const getMemberName = (memberId: string): string => {
    return members?.find((m) => m.id === memberId)?.name ?? "?";
  };

  return (
    <div className="space-y-4">
      {items?.map((item, index) => {
        const mode = getMode(index, item.quantity);
        const remaining = getRemaining(index);
        const isFullyAllocated = mode === "equal" ? item.allocation.length > 0 : remaining === 0;
        const perPersonAmount =
          item.allocation.length > 0
            ? item.amount / item.allocation.reduce((s, a) => s + a.quantity, 0)
            : 0;

        return (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">
                  qty {item.quantity} · {formatRupiah(item.amount)}
                </p>
              </div>
              {isFullyAllocated && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                  ✓ allocated
                </span>
              )}
            </div>

            {/* Mode toggle */}
            <div className="mb-2 flex rounded-md bg-gray-100 p-0.5">
              <button
                type="button"
                onClick={() => setMode(index, "equal")}
                className={cn(
                  "flex-1 rounded px-2 py-1 text-xs font-medium",
                  mode === "equal" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
                )}
              >
                Equal share
              </button>
              <button
                type="button"
                onClick={() => setMode(index, "quantity")}
                className={cn(
                  "flex-1 rounded px-2 py-1 text-xs font-medium",
                  mode === "quantity" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
                )}
              >
                By quantity
              </button>
            </div>

            {/* Paid by selector */}
            <div className="mb-2">
              <select
                value={item.paidBy}
                onChange={(e) => {
                  const current = form.getValues("items");
                  current[index].paidBy = e.target.value;
                  form.setValue("items", current);
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs"
              >
                <option value="">Who paid? ▾</option>
                {members?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Remaining counter (quantity mode only) */}
            {mode === "quantity" && (
              <p
                className={cn(
                  "mb-2 text-xs",
                  remaining === 0 ? "text-green-600" : "text-gray-500"
                )}
              >
                {remaining === 0 ? "Fully allocated" : `${remaining} remaining of ${item.quantity}`}
              </p>
            )}

            {/* Member chips */}
            <div className="flex flex-wrap gap-1.5">
              {members?.map((m) => {
                const allocEntry = item.allocation.find((a) => a.memberId === m.id);
                const isSelected = !!allocEntry;
                const isDisabled =
                  mode === "quantity" && !isSelected && remaining === 0;

                return (
                  <Chip
                    key={m.id}
                    label={m.name}
                    selected={isSelected}
                    count={mode === "quantity" ? allocEntry?.quantity : undefined}
                    disabled={isDisabled}
                    onClick={() => {
                      if (mode === "equal") {
                        toggleMemberEqual(index, m.id);
                      } else {
                        incrementMemberQty(index, m.id);
                      }
                    }}
                  />
                );
              })}
            </div>

            {/* Per-person amount display */}
            {isFullyAllocated && (
              <p className="mt-1 text-[10px] text-gray-400">
                {mode === "equal"
                  ? `${formatRupiah(perPersonAmount)} each`
                  : item.allocation
                      .map((a) => `${getMemberName(a.memberId)}: ${formatRupiah(perPersonAmount * a.quantity)}`)
                      .join(" · ")}
              </p>
            )}
          </div>
        );
      })}

      {(!items || items.length === 0) && (
        <p className="py-8 text-center text-sm text-gray-400">No items to allocate.</p>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Update `src/pages/BagiWizardPage.tsx` — render Step3Sharing + add save**

Add import at the top:
```tsx
import { Step3Sharing } from "@/wizard/Step3Sharing";
import { useCreateBagi } from "@/hooks/useCreateBagi";
import { userbagiApi } from "@/api/userbagiApi";
import { itemApi } from "@/api/itemApi";
```

Replace the Step 3 placeholder block:
```tsx
      {currentStep === 3 && (
        <div className="py-12 text-center text-gray-400">Step 3 (Sharing) — Task 12</div>
      )}
```

with:
```tsx
      {currentStep === 3 && <Step3Sharing form={form} />}
```

Add the save mutation and handler inside the `BagiWizardPage` component (before `return`):

```tsx
  const createBagi = useCreateBagi();

  const handleSave = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    const data = form.getValues();

    // Step 1: create the bagi
    const createdBagi = await createBagi.mutateAsync({
      name: data.name,
      includeService: data.includeService,
      includeTax: data.includeTax,
    });

    // Step 2: create members (sequentially to get their real IDs)
    const memberIdMap = new Map<string, string>(); // form-id → server-id
    for (const member of data.members) {
      const created = await userbagiApi.create(createdBagi.id, { name: member.name });
      memberIdMap.set(member.id, created.id);
    }

    // Step 3: create items (map form member IDs → server member IDs)
    for (const item of data.items) {
      await itemApi.create(createdBagi.id, {
        name: item.name,
        amount: item.amount,
        quantity: item.quantity,
        paidBy: memberIdMap.get(item.paidBy) ?? "",
        allocation: item.allocation.map((a) => ({
          memberId: memberIdMap.get(a.memberId) ?? "",
          quantity: a.quantity,
        })),
      });
    }

    // Redirect to the detail page
    navigate(`/bagi/${createdBagi.id}`);
  };
```

Add the Save button after the step content (for step 3):
```tsx
      {currentStep === 3 && (
        <Button
          fullWidth
          className="mt-6"
          onClick={handleSave}
          disabled={createBagi.isPending}
        >
          {createBagi.isPending ? "Saving..." : "Save Bagi"}
        </Button>
      )}
```

- [ ] **Step 3: Verify the full wizard flow**

```bash
npm run dev
```
Expected end-to-end flow:
1. `/bagi` → list page with seeded "Tiket Dufan". Click "+ New".
2. Step 1: type "Test Bagi", add 2 members ("Alfa", "Bravo"). Click "Next → Items".
3. Step 2: click "+ Add item", enter "Lunch", qty 1, amount 50000. Click "Next → Sharing".
4. Step 3: for the Lunch item:
   - Set "Paid by" to Alfa.
   - Mode defaults to "Equal share" (qty 1).
   - Tap both Alfa and Bravo chips → both selected, "Rp 25.000 each" shows.
5. Click "Save Bagi". Page redirects to `/bagi/:id`.
6. Click browser back or navigate to `/bagi`. The list now shows "Test Bagi" with 2 members · 1 item.

Also test the scan flow:
1. New bagi, Step 1 minimal data, Next.
2. Step 2: click "📷 Scan receipt", pick any image. Items populate with fixture data.
3. Step 3: assign paidBy + allocation for each scanned item. Save.

- [ ] **Step 4: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wizard Step 3 (sharing allocation) with dual-mode chips and save flow"
```

---

## Post-Implementation Checklist

After all 12 tasks are complete, verify the following end-to-end:

- [ ] `npm run lint` passes with 0 warnings.
- [ ] `npm run build` succeeds.
- [ ] Create a bagi via the wizard → it appears in the list.
- [ ] Delete a bagi from the list → it disappears (cascade).
- [ ] Scan a receipt → items populate → allocate → save → appears in list.
- [ ] Validation blocks save when: empty name, < 2 members, item with no paidBy, item with incomplete allocation.
- [ ] TanStack Query DevTools shows queries refreshing after mutations.
- [ ] Mobile viewport (DevTools device toolbar): all screens are usable at 375px width.
```

---

## Task 13: BagiDetailPage (Read-Only View)

**Goal:** Replace the BagiDetailPage placeholder with a real read-only view showing the bagi name, members, items, and allocations. This completes the save→view flow so landing on `/bagi/:bagiId` after saving shows meaningful data.

**Files:**
- Modify: `src/pages/BagiDetailPage.tsx` (replace placeholder)

**Interfaces:**
- Produces: working `BagiDetailPage` showing a saved bagi with its members and items.
- Consumes: `useBagiDetail` (Task 4), `formatRupiah` (Task 2), UI primitives (Task 7).

- [ ] **Step 1: Rewrite `src/pages/BagiDetailPage.tsx`**

```tsx
import { useParams, useNavigate } from "react-router-dom";
import { useBagiDetail } from "@/hooks/useBagiDetail";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { formatRupiah } from "@/lib/format";

const BagiDetailPage = () => {
  const { bagiId } = useParams();
  const navigate = useNavigate();
  const { data: bagi, isLoading, isError, refetch } = useBagiDetail(bagiId ?? "");

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

  if (!bagi) return null;

  // Build a member-name lookup map
  const memberName = (id: string): string =>
    bagi.members.find((m) => m.id === id)?.name ?? "?";

  const totalAmount = bagi.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/bagi")}
          className="text-sm text-blue-600"
        >
          ‹ Back
        </button>
      </div>

      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{bagi.name}</h1>
        <p className="text-xs text-gray-400">
          {new Date(bagi.date).toLocaleDateString("id-ID")}
          {(bagi.includeService || bagi.includeTax) && (
            <span> · {bagi.includeService && "Service"}{bagi.includeService && bagi.includeTax && ", "}{bagi.includeTax && "Tax"}</span>
          )}
        </p>
      </header>

      {/* Members */}
      <section className="mb-6">
        <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          Members ({bagi.members.length})
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {bagi.members.map((m) => (
            <span
              key={m.id}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
            >
              {m.name}
            </span>
          ))}
        </div>
      </section>

      {/* Items */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Items ({bagi.items.length})
          </h2>
          <span className="text-xs font-semibold text-gray-700">
            Total: {formatRupiah(totalAmount)}
          </span>
        </div>

        {bagi.items.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No items recorded.</p>
        ) : (
          <ul className="space-y-2">
            {bagi.items.map((item) => {
              const allocTotal = item.allocation.reduce((s, a) => s + a.quantity, 0);
              const perUnit = allocTotal > 0 ? item.amount / allocTotal : 0;
              return (
                <li key={item.id} className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        qty {item.quantity} · paid by {memberName(item.paidBy)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {formatRupiah(item.amount)}
                    </p>
                  </div>
                  {item.allocation.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.allocation.map((a, i) => (
                        <span
                          key={i}
                          className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                        >
                          {memberName(a.memberId)}
                          {a.quantity > 1 ? ` ×${a.quantity}` : ""}: {formatRupiah(perUnit * a.quantity)}
                        </span>
                      ))}
                    </div>
                  )}
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

- [ ] **Step 2: Verify the detail page works**

```bash
npm run dev
```
Expected:
- From the list, click any existing bagi (or save a new one).
- The detail page shows: bagi name, date, members as chips, items with name/qty/amount/paidBy, and per-item allocation breakdowns showing each member's share.
- The "Back to list" button returns to `/bagi`.

- [ ] **Step 3: Verify lint + build**

```bash
npm run lint && npm run build
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: BagiDetailPage — read-only view with members, items, and allocations"
```

---

## Known Limitations (Deferred to Later Milestones)

These items are in the spec but intentionally simplified or deferred in this plan:

1. **Edit mode pre-fill** — `/bagi/:bagiId/edit` route exists and renders the wizard, but the form starts empty (does not load existing bagi data). Full edit (loading existing data into the form) is deferred. The create flow is the learning priority; edit can be layered on once the create flow is solid.

2. **Scan `bagiId` simplification** — In Task 11, the scan button uses `bagiId="draft"` because the bagi hasn't been persisted yet during wizard creation. The MSW handler tolerates this. When the real backend arrives, the scan flow will need a persisted bagiId (create-then-scan), or the scan endpoint will accept an unscoped request.

3. **No optimistic updates** — All mutations invalidate + refetch (per spec). Loading spinners show during refetch. This is simpler and correct, just not as snappy as optimistic UI.

4. **Allocation mode not persisted** — Task 12's `modes` state (equal vs quantity) is component-local `useState`, not saved to the backend. The allocation *quantities* are saved correctly; only the UI mode toggle resets on reload. The mode can be derived from the allocation data later if needed.
```
