# Coding Guidelines — MariBagi (React + Vite + Redux)

This is a client-side expense-splitting SPA. There is **no backend**; all data
lives in `localStorage`. Follow the patterns below strictly. Full project context
lives in `AGENTS.md` at the repo root — read it first.

## Build / Lint

```bash
npm run dev        # Vite dev server (--host for LAN)
npm run build      # Production build -> dist/
npm run lint       # ESLint, --max-warnings 0 — MUST be clean
npm run preview    # Serve the production build
```

- **npm is the only package manager** (`package-lock.json` is authoritative).
- **Lint is gating:** `--max-warnings 0` means `warn` rules fail the run. Fix
  warnings; never downgrade them.
- **No test framework exists.** If asked to "run a test", confirm with the user
  first — one must be added (e.g. Vitest) before any test can run.

## Tech Stack (do not deviate)
- React 18 — functional components + hooks ONLY. No class components.
- Vite 5 (ESM, `"type": "module"`).
- Redux Toolkit + react-redux; reselect for memoized selectors.
- React Router v6 data router (`createBrowserRouter` + `RouterProvider`).
- styled-components v6 for ALL styling (no CSS files, no other CSS-in-JS libs).
- vite-plugin-svgr — `.svg` imports as default React components.

## Formatting (Prettier — `.prettierrc.json`)
- **Double quotes**, semicolons always, `trailingComma: "es5"`, `printWidth: 300`.
- Match surrounding file; never reformat unrelated code.

## File Conventions
- `.jsx` for anything with JSX/markup; `.js` for slices, selectors, utils.
- Components: `default export`, `PascalCase` (e.g. `FormRow.jsx`).
- Helpers/slices/selectors: `export default` reducer/util, `export const` for
  named actions/selectors (camelCase).
- Styled components: `PascalCase` consts (e.g. `StyledAppLayout`).

## Import Ordering (keep groups separated by blank lines)
1. React hooks (`useState`, `useRef`, `useEffect`).
2. Third-party libs (`styled-components`, `react-redux`, `react-router-dom`).
3. Redux actions/slices (`../features/*`).
4. Pure helpers (`../assets/*`).
5. Local UI/feature components (`../ui/*`, `../home/*`, etc.).
6. Selectors (`../selector/selectorState`).

## React Patterns
- Arrow-function components:
  `const Home = () => { ... }; export default Home;`
- Use `useSelector`, `useDispatch`, `useNavigate`. Prefer memoized selectors in
  `selector/selectorState.js` over inline `state => ...` mapping.
- Styling references CSS custom properties from `GlobalStyles.js`
  (e.g. `var(--color-green-500)`). Don't hardcode colors that exist as variables.
- Variant styling via transient props on styled components
  (see `Button.jsx`: `props.variant`, `props.color`).

## Redux / State
- All mutations through Redux Toolkit `createSlice` reducers. Use `prepare`
  callbacks to derive ids/timestamps.
- IDs via `Date.now()` / `new Date().getUTCMilliseconds()`.
- **Persistence lives ONLY in `features/localStorageMiddleware.js`**
  (`createListenerMiddleware` + `startListening`). Never write `localStorage`
  inside components or reducers.
- `localStorage` keys: `"bagi"`, `"user"`, `"item"`. Always read via the
  `getLocalStorage` helper (safe JSON parse → `[]` fallback).

## Error Handling
- No try/catch network layer. Validation errors flow through **`errorSlice`**:
  `dispatch(clearError())` BEFORE `dispatch(addError({ form, message }))`.
  `FormRow` renders the message when its `name` matches `error.form`.
- Validate inside handlers (`onSubmit`, `onChange`) and `return` early on
  failure before dispatching the success action.

## Localization
- Currency: Indonesian Rupiah via `Intl.NumberFormat("id-ID", ...)`. Use the
  existing `currencyFormat` helper. UI strings mix English/Indonesian.

## Forbidden
- Class components, CSS files, CSS-in-JS libs other than styled-components.
- A backend/API client — data is local-only.
- Comments unless explicitly requested.
- New dev dependencies (test runner, lint plugins) without user confirmation.

## Before Finishing — Verification Checklist
1. `npm run lint` passes with **zero** warnings.
2. `npm run build` succeeds.
3. If Redux state shape changed, update the matching selector in
   `selector/selectorState.js` AND the listener in
   `features/localStorageMiddleware.js`.
