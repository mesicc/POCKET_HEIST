# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` / `npm run lint:fix` — ESLint (flat config: `eslint-config-next` core-web-vitals + typescript)
- `npm run typecheck` — `tsc --noEmit`
- `npm run test` — Vitest in watch mode
- `npm run test:run` — Vitest single run
- `npm run test:coverage` — Vitest with coverage
- `npm run check` — lint + typecheck + test:run, in that order (run this before considering a change done)
- Single test file: `npx vitest run tests/components/Navbar.test.tsx`
- Single test by name: `npx vitest run -t "renders the main heading"`

## Architecture

Next.js App Router (v16) + React 19 + TypeScript (strict) + Tailwind v4. Path alias `@/*` maps to the repo root (configured in both `tsconfig.json` and `vitest.config.mts` via `vite-tsconfig-paths`).

**Route groups split the app by auth state**, each with its own layout:
- `app/(public)/` — unauthenticated routes (`/`, `/login`, `/signup`, `/preview`). Layout wraps children in `<main className="public">`, no nav.
- `app/(dashboard)/` — authenticated routes (`/heists`, `/heists/create`, `/heists/[id]`). Layout renders `<Navbar />` above `{children}`.

The root `/` page is a splash screen intended to redirect based on auth state (logged in → `/heists`, logged out → `/login`) — that redirect logic is not implemented yet. There is no data layer, auth, or API routes yet; all pages currently render static placeholder content pending backend wiring.

The `/heists` list page has separate sections for active heists, heists you've assigned to others, and expired heists — the intended shape of a "heist" is a mission with an owner/assignee split and a lifecycle (active → expired), even though none of that is modeled yet. `/heists/[id]` and `/heists/create` are stubbed detail/create routes for the same not-yet-built data model. `app/(public)/preview/page.tsx` is a scratch route for previewing new UI components in isolation before they're wired into a real page — check it when adding a component if it's already being used for that.

**Component convention**: each component gets its own directory with a CSS module and a barrel export, e.g. `components/Navbar/{Navbar.tsx, Navbar.module.css, index.ts}` where `index.ts` does `export { default } from "./Navbar"`. Import via the directory (`@/components/Navbar`), not the file.

**Styling**: Tailwind v4 configured via CSS in `app/globals.css`, not a JS/TS config file. Theme tokens live in an `@theme` block there (`--color-primary`, `--color-secondary`, `--color-dark`, `--color-light`, `--color-lighter`, `--color-success`, `--color-error`, `--color-heading`, `--color-body`, `--font-sans`) and are consumed as Tailwind utilities (e.g. `text-body`, `bg-dark`). Shared page-layout utility classes — `.page-content`, `.center-content`, `.form-title` — are defined globally in `globals.css` and reused across pages instead of being redefined per page. Every CSS module that uses `@apply` starts with `@reference "<path to app/globals.css>";` (see `Navbar.module.css`) — without it, Tailwind v4 can't resolve the custom theme tokens/utilities inside the module and the build fails.

**Tests** live under `tests/`, mirroring the source tree (e.g. `components/Navbar` → `tests/components/Navbar.test.tsx`). Vitest runs with `environment: 'jsdom'` and `globals: true` (no need to import `describe`/`it`/`expect`), plus `@testing-library/jest-dom` matchers loaded via `vitest.setup.ts`. Query by role/accessible name (`getByRole`) rather than test IDs, per the existing Navbar test.

## Known quirks

- `app/(public)/login/page.tsx` exports a component named `SignupPage` (copy-paste artifact from the signup page) — it's still the login route, the name is just wrong. Don't rely on the function name when navigating this file.
- Page/section copy across the scaffold is explicitly marked "Placeholder copy" in comments — don't treat it as real product copy to preserve.
