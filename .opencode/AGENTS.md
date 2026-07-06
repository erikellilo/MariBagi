# AGENTS.md

Guidance for AI coding agents working in the **MariBagi** repository — a
React + Vite + TypeScript single-page app for splitting expenses ("Mari Bagi"
= "let's share/split"). Persistence is via `localStorage`; there is **no backend**.

## Build / Lint / Test Commands

```bash
npm run dev        # Start Vite dev server with HMR (--host exposes on LAN)
npm run build      # Production build -> dist/
npm run preview    # Serve the production build locally
npm run lint       # ESLint (flat config — eslint.config.js), --max-warnings 0 (must be clean)
```

- **Package manager:** npm (`package-lock.json` is authoritative).
- **Lint is gating:** `--max-warnings 0` means even `warn` rules fail the run.
  Fix the warnings rather than downgrading them.
- **No test framework is configured.** There is no `test` script, no Jest/Vitest.
  If asked to "run a single test", first confirm with the user — one likely needs
  to be added (e.g. Vitest) before any test can run.
- Lint uses **flat config** (`eslint.config.js`); `--ext` is not supported.

## Tech Stack

- **React 18** (functional components + hooks only; no class components).
- **Vite 5** as the bundler/dev server; ESM (`"type": "module"`).
- **TypeScript 5** (strict mode, `tsconfig.json`).
- **Redux Toolkit** + **react-redux** for state; **reselect** (via RTK's `createSelector`) for memoized selectors.
- **React Router v6** data router (`createBrowserRouter` + `RouterProvider`, layout route with `<Outlet />`).
- **styled-components v6** for all styling (components AND `createGlobalStyle`).
- **vite-plugin-svgr** — `.svg` files import as default React components.
- **zustand** and **uuid** are also available dependencies.
- Deployed to **Vercel** (SPA rewrite in `vercel.json`).

## Project Structure

```
src/
  main.tsx            # Entry; wraps App in <StyleSheetManager shouldForwardProp>
  App.tsx             # Router config + <Provider store>
  store.ts            # configureStore + rootReducer; prepends localStorage middleware
  GlobalStyles.ts     # createGlobalStyle; defines all CSS custom properties (colors, etc.)
  types/              # Shared TypeScript types
  features/           # Redux Toolkit slices + listener middleware
  selector/           # Memoized selectors
  pages/              # Routed screens: Home, CalculatePage, Result
  ui/                 # Reusable presentational components (all .tsx)
  home/               # Feature components for the Home page
  calculate/          # Feature components for the Calculate page
  result/             # Feature components for the Result page
  assets/             # Pure helpers (getLocalStorage, currencyFormat) + icon/
```

Note: `src/store.ts` and `src/store/` directory coexist — see Known Issues below.

## Code Style

### Formatting (enforced by Prettier — `.prettierrc.json`)
```json
{
  "printWidth": 130,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```
- Match the surrounding file; do not reformat unrelated code.

### File conventions
- **`.tsx`** for anything with JSX/markup; **`.ts`** for slices, selectors, utils, types.
- **Components:** `default export`, named `PascalCase` (e.g. `FormRow.tsx`).
- **Helpers/slices/selectors:** `export default` reducer/util, `export const` for named actions/selectors (camelCase).
- Styled components are declared as `PascalCase` consts (e.g. `StyledAppLayout`).

**Mid-migration caveat:** The codebase is mid-migration from JSX/JS to TypeScript. Most of `ui/`, the entry points (`main.tsx`, `App.tsx`), `GlobalStyles.ts`, and `store.ts` are TypeScript. Some files under `features/`, `pages/`, `selector/`, `home/`, `calculate/`, `assets/` are still `.jsx`/`.js`. When editing an existing file, KEEP its current extension unless explicitly asked to migrate it. New files MUST be `.tsx`/`.ts`.

### TypeScript patterns
- Type component props with `interface` or `type` (e.g. `interface ButtonProps { variant?: string; }`).
- Type Redux state/slices (RootState from store, typed actions).
- Avoid `any` — use `unknown` or proper types. Leverage `types/` for shared types.
- Strict mode is enabled in `tsconfig.json`.

### Imports — keep this ordering (matches existing files)
1. React hooks (`useState`, `useRef`, `useEffect`).
2. Third-party libs (`styled-components`, `react-redux`, `react-router-dom`).
3. Redux actions/slice imports (from `../features/*`).
4. Pure helpers (from `../assets/*`).
5. Local UI/feature components (`../ui/*`, `../home/*`, etc.).
6. Selectors (from `../selector/selectors` or `../selector/selectorState`).
Leave a blank line between groups.

### React patterns
- Functional components + hooks only. Arrow-function components are the norm (`const Home = () => { ... }; export default Home;`).
- Use the hooks `useSelector`, `useDispatch`, `useNavigate`. Prefer the memoized selectors in `selector/` over inline `state => ...` mapping.
- Styling uses styled-components referencing **CSS custom properties** defined in `GlobalStyles.ts` (e.g. `var(--color-green-500)`). Do not hardcode colors that already exist as variables.
- Variant styling via transient/props on styled components (see `Button.tsx`: `props.variant`, `props.color`).

### Redux / state
- All state changes go through **Redux Toolkit `createSlice`** reducers. Use `prepare` callbacks when an action needs to derive an id/timestamp.
- IDs are generated with `Date.now()` / `new Date().getUTCMilliseconds()`.
- **Side effects (persistence) live in `features/localStorageMiddleware.js`** via `createListenerMiddleware` + `startListening` keyed on action creators. Do NOT write to `localStorage` inside components or reducers.
- `localStorage` keys are `"bagi"`, `"user"`, `"item"`. Always read via the `getLocalStorage` helper (safe JSON parse -> `[]` fallback).

### Error handling
- There is no try/catch network layer. User-facing validation errors flow through the **`errorSlice`**: dispatch `clearError()` before `addError({ form, message })`. `FormRow` renders the message when its `name` matches `error.form`.
- Validate inside event handlers (`onSubmit`, `onChange`) and `return` early on failure before dispatching the success action.

### Localization
- Currency is Indonesian Rupiah via `Intl.NumberFormat("id-ID", ...)`. Use the existing `currencyFormat` helper; UI strings are a mix of English/Indonesian.

## Things to Avoid
- Do not add class components, CSS files, or CSS-in-JS libraries other than styled-components.
- Do not introduce a backend/API client — data is local-only.
- Do not add comments unless explicitly requested.
- Do not introduce new dev dependencies (test runner, lint plugins) without confirming with the user.

## Known Issues
- **`src/store.ts` vs `src/store/` directory:** Both exist, causing TS/ESM resolution ambiguity. To be resolved in a follow-up.
- **Half-migrated source:** ~25 files remain `.jsx`/`.js` — most of `features/`, `pages/`, `selector/`, `home/`, `calculate/`, `assets/`. Pending TS migration (out of scope for flatten).

## Verification Checklist Before Finishing
1. `npm run lint` passes with **zero** warnings.
2. `npm run build` succeeds.
3. If Redux state shape changed, update the corresponding selector in `selector/` and the listener in `features/localStorageMiddleware.js`.
