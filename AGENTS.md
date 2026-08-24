# AGENTS.md

Electron + React desktop POS app (FidePOS). Renderer: React 19 / TS / Vite / Tailwind 4 (`src/`). Main process: plain JS CommonJS (`electron/`). DB is local sql.js (SQLite) accessed only from the main process.

## Commands

Use **pnpm** (see `packageManager` field + `pnpm-lock.yaml`). The README says npm — that is stale.

```bash
pnpm install
pnpm dev        # concurrently: vite + wait-on http://localhost:6969 && electron .
pnpm lint       # eslint .  (only rule check available)
pnpm build      # tsc -b && vite build   ← use as typecheck; there is no separate typecheck script
pnpm package    # clean + build + electron-builder (output to releases/)
```

- There are **no tests** in this repo. Verification = `pnpm lint` + `pnpm build`.
- Dev server port is **6969** (`strictPort: true`), not 5173 as the README claims.
- `.env` at repo root: `EMAIL_USER`, `EMAIL_PASS` (Gmail app password), `EMAIL_SERVICE`; loaded via `dotenv` inside `electron/main.cjs`.

## Architecture rules

- `"type": "module"` is set, so all Electron main-process files use the **`.cjs` extension** (`electron/**/*.cjs`). Keep new main-process files as `.cjs` with `require()`.
- The renderer never touches SQL or Node directly. All data access goes: React component → `window.electronAPI` (IPC bridge in `electron/preload.js`) → `ipcMain.handle` in `electron/main.cjs` → query functions in `electron/db/queries/*.cjs`. To add a feature touching data, you must edit both sides (preload exposure if new channel, main.cjs handler, queries file).
- Runtime data lives in `%APPDATA%/fidepos/`: `app.db` (SQLite) + `config.bin` (encrypted DB/email keys). Delete these to test the fresh-install/onboarding flow.

## Conventions

- Path aliases are declared in **three places that must stay in sync**: `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json` (`@/`, `@components/`, `@utility/`, `@hooks/`, `@forms/`, `@modals/`, `@columns/`, `@context/`, `@icons/`, `@img/`, `@typesm/`). Note `@typesm` already diverges: it points to `src/types` in Vite but `src/types/models` in the tsconfigs.
- UI strings go through i18next — add keys to **both** `src/locales/es.json` and `src/locales/en.json`.
- Forms: react-hook-form + Zod schemas in `src/components/forms/schemas/`.
- shadcn/ui is configured (`components.json`, components in `src/components/ui/`); custom icons live in `src/assets/icons/` typed by `@typesm/icons`.
