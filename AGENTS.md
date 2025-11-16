# Repository Guidelines

## Project Structure & Module Organization
- App Router project (`app/`) with `page.tsx` as the entry point; shared UI blocks live in `app/components/`.
- React context providers sit in `context/` (e.g., `location-selection.tsx`), enabling cross-page state such as selected locations or theme.
- Reusable configuration and UI tokens are in `lib/` (e.g., `themes.ts`); global styles live in `app/globals.css`.
- Static assets go in `public/`; mock or seed data currently lives in `data.ts`.

## Build, Test, and Development Commands
- `npm run dev` — run the Next.js dev server (App Router, Next 16) with hot reload.
- `npm run build` — production build; keep it green before opening PRs.
- `npm run start` — serve the built app locally to verify optimized output.
- `npm run lint` — run ESLint (TypeScript + Next rules). Fix lint errors before committing.

## Coding Style & Naming Conventions
- TypeScript + React; prefer function components with hooks. Mark client components with `"use client"` when they use state/effects or browser APIs.
- Follow existing patterns: 2-space indentation, double quotes, and named exports for shared modules.
- Component/layout files live under the route folder they serve; colocate small helpers with their consumers.
- Run `npm run lint` to enforce spacing/import rules; add nullable/optional types explicitly rather than using `any`.

## Testing Guidelines
- No automated suite is present yet. When adding logic-heavy code, include unit/integration coverage (e.g., Jest + React Testing Library) and document new scripts in `package.json`.
- Keep test files near their subjects using `*.test.ts(x)` naming; prefer rendering components with realistic props and asserting user-visible outcomes.
- Manual checks: after UI changes, smoke-test `npm run dev` across primary flows and map interactions.

## Commit & Pull Request Guidelines
- Commit messages in this repo are short, present-tense summaries (e.g., `rounded`, `estilo`). Continue with concise, imperative titles; include a scoped prefix if it clarifies the area (e.g., `map:` or `search:`).
- For PRs, include: purpose/overview, before/after screenshots for UI changes, affected routes, and any manual test notes.
- Link related issues or tickets, and call out breaking changes or new environment/config requirements explicitly.
