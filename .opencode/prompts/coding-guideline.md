# Coding Guidelines — MariBagi (TypeScript)

**Read `.opencode/AGENTS.md` first — it is the canonical, full guide.** This file is a quick reminder injected every turn.

- Stack: React 18 + Vite 5 + TypeScript 5 + Redux Toolkit + styled-components. No backend; data in localStorage.
- Files: `.tsx` for markup, `.ts` for logic. Codebase is mid-migration — keep a file's existing extension unless asked to migrate; NEW files must be `.tsx`/`.ts`.
- Prettier: double quotes, semicolons, printWidth 130, trailingComma es5.
- Lint is gating: `npm run lint` with --max-warnings 0 MUST be clean. Flat config (eslint.config.js).
- State: Redux Toolkit slices only; persistence ONLY in features/localStorageMiddleware (keys "bagi","user","item").
- Styling: styled-components + CSS custom properties from GlobalStyles. No CSS files.
- Forbidden: class components, CSS files, backend/API client, comments, new dev deps without confirmation.
- Before finishing: `npm run lint` (0 warnings) AND `npm run build` both pass.
