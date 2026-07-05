# AGENTS.md

Guidance for AI coding agents working in the **MariBagi** repository — a
React + Vite single-page app for splitting expenses ("Mari Bagi" = "let's
share/split"). Persistence is via `localStorage`; there is **no backend**.

## Build / Lint / Test Commands

```bash
npm run dev        # Start Vite dev server with HMR (--host exposes on LAN)
npm run build      # Production build -> dist/
npm run preview    # Serve the production build locally
npm run lint       # ESLint, --max-warnings 0 (must be clean)
```

- **Package manager:** npm (`package-lock.json` is authoritative).
- **Lint is gating:** `--max-warnings 0` means even `warn` rules fail the run.
  Fix the warnings rather than downgrading them.
- **No test framework is configured.** There is no `test` script, no Jest/Vitest.
  If asked to "run a single test", first confirm with the user — one likely needs
  to be added (e.g. Vitest) before any test can run.

## Tech Stack

- **React 18** (functional components + hooks only; no class components).
- **Vite 5** as the bundler/dev server; ESM (`"type": "module"`).
- **Redux Toolkit** + **react-redux** for state; **reselect** for memoized selectors.
- **React Router v6** data router (`createBrowserRouter` + `RouterProvider`,
  layout route with `<Outlet />`).
- **styled-components v6** for all styling (components AND `createGlobalStyle`).
- **vite-plugin-svgr** — `.svg` files import as default React components.
- Deployed to **Vercel** (SPA rewrite in `vercel.json`).

## Project Structure

```
src/
  main.jsx            # Entry; wraps App in <StyleSheetManager shouldForwardProp>
  App.jsx             # Router config + <Provider store>
  store.js            # configureStore + rootReducer; prepends localStorage middleware
  GlobalStyles.js     # createGlobalStyle; defines all CSS custom properties (colors, etc.)
  features/           # Redux Toolkit slices + listener middleware
  selector/           # Memoized reselect selectors (selectorState.js)
  pages/              # Routed screens: Home, CalculatePage, Result
  ui/                 # Reusable presentational components (Button, Input, Form, ...)
  calculate/          # Feature components for the Calculate page
  home/               # Feature components for the Home page
  assets/             # Pure helpers (getLocalStorage, currencyFormat) + icon/
```

## Code Style

### Formatting (enforced by Prettier — `.prettierrc.json`)
- **Double quotes**, semicolons always, `trailingComma: "es5"`, `printWidth: 300`.
- Match the surrounding file; do not reformat unrelated code.

### File conventions
- **`.jsx`** for anything with JSX/markup; **`.js`** for slices, selectors, utils.
- **Components:** `default export`, named `PascalCase` (e.g. `FormRow.jsx`).
- **Helpers/slices/selectors:** `export default` reducer/util, `export const` for
  named actions/selectors (camelCase).
- Styled components are declared as `PascalCase` consts (e.g. `StyledAppLayout`).

### Imports — keep this ordering (matches existing files)
1. React hooks (`useState`, `useRef`, `useEffect`).
2. Third-party libs (`styled-components`, `react-redux`, `react-router-dom`).
3. Redux actions/slice imports (from `../features/*`).
4. Pure helpers (from `../assets/*`).
5. Local UI/feature components (`../ui/*`, `../home/*`, etc.).
6. Selectors (from `../selector/selectorState`).
Leave a blank line between groups.

### React patterns
- Functional components + hooks only. Arrow-function components are the norm
  (`const Home = () => { ... }; export default Home;`).
- Use the hooks `useSelector`, `useDispatch`, `useNavigate`. Prefer the memoized
  selectors in `selector/selectorState.js` over inline `state => ...` mapping.
- Styling uses styled-components referencing **CSS custom properties** defined in
  `GlobalStyles.js` (e.g. `var(--color-green-500)`). Do not hardcode colors that
  already exist as variables.
- Variant styling via transient/props on styled components (see `Button.jsx`:
  `props.variant`, `props.color`).

### Redux / state
- All state changes go through **Redux Toolkit `createSlice`** reducers. Use
  `prepare` callbacks when an action needs to derive an id/timestamp.
- IDs are generated with `Date.now()` / `new Date().getUTCMilliseconds()`.
- **Side effects (persistence) live in `features/localStorageMiddleware.js`**
  via `createListenerMiddleware` + `startListening` keyed on action creators.
  Do NOT write to `localStorage` inside components or reducers.
- `localStorage` keys are `"bagi"`, `"user"`, `"item"`. Always read via the
  `getLocalStorage` helper (safe JSON parse -> `[]` fallback).

### Error handling
- There is no try/catch network layer. User-facing validation errors flow through
  the **`errorSlice`**: dispatch `clearError()` before `addError({ form, message })`.
  `FormRow` renders the message when its `name` matches `error.form`.
- Validate inside event handlers (`onSubmit`, `onChange`) and `return` early on
  failure before dispatching the success action.

### Localization
- Currency is Indonesian Rupiah via `Intl.NumberFormat("id-ID", ...)`. Use the
  existing `currencyFormat` helper; UI strings are a mix of English/Indonesian.

## Things to Avoid
- Do not add class components, CSS files, or CSS-in-JS libraries other than
  styled-components.
- Do not introduce a backend/API client — data is local-only.
- Do not add comments unless explicitly requested.
- Do not introduce new dev dependencies (test runner, lint plugins) without
  confirming with the user.

## Verification Checklist Before Finishing
1. `npm run lint` passes with **zero** warnings.
2. `npm run build` succeeds.
3. If Redux state shape changed, update the corresponding selector in
   `selector/selectorState.js` and the listener in
   `features/localStorageMiddleware.js`.
