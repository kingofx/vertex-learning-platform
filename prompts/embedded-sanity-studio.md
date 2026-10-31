# Embed the Sanity Studio in the Next.js app (one dev server, one deploy)

## Goal
Run the Sanity Studio at `/studio` inside the Next.js app, so there is one dev server and one deploy. This reverses the standalone-Studio change and the `AGENTS.md` rule against embedding. The user has decided: one dev server and one deploy matter more to them than the standalone benefits.

## Skills and docs read
- `AGENTS.md` sections 5, 6, 12 (this decision overrides the "do not embed" rule: "build to these unless the user changes them").
- `.claude/skills/sanity-best-practices/references/nextjs.md` (Option B: embedded Studio, and what it costs).
- `node_modules/next/dist/docs/` for route segment config under `cacheComponents` (the cause of the earlier 500).

## Code inspected
- The embedded setup the Sanity CLI generated earlier: `src/app/studio/[[...tool]]/page.tsx`, `sanity.config.ts`, `sanity.cli.ts`, `src/sanity/structure.ts`, `src/sanity/schemaTypes/index.ts`. I removed these in the standalone change and will recreate them from that generated version.
- Current branch state: `studio/` workspace and edits to `package.json`, `tsconfig.json`, `eslint.config.mjs`.
- Cause of the original 500: `export const dynamic = 'force-static'` is rejected when `cacheComponents` is on.

## Decisions and assumptions
- **Undo the standalone work:** delete `studio/` and `prompts/standalone-sanity-studio.md`; remove the `studio` exclusions from `tsconfig.json` and `eslint.config.mjs`.
- **Restore:** `src/app/studio/[[...tool]]/page.tsx` (without the `dynamic` line), root `sanity.config.ts` (`basePath: '/studio'`) and `sanity.cli.ts`, `src/sanity/structure.ts`, `src/sanity/schemaTypes/index.ts` (empty schema).
- **Reinstall in web:** `sanity`, `@sanity/vision`, `styled-components` (matching the earlier versions).
- **Env:** reuses `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` already in `.env.local`. I will not print values. The web `.env.example` gains those two names, no values.
- **Layout fit:** the root layout sets page background/flex classes and wraps in `ClerkProvider`. If the Studio renders wrong inside it, I will isolate it with a route-group layout (for example `(site)` and `(studio)`), without changing the site's look.
- **Clerk:** `proxy.ts` is bare, so `/studio` stays public. Studio access is controlled by Sanity login, not Clerk.
- **Out of scope:** content schema, Context MCP setup, and editing `AGENTS.md`. `AGENTS.md` still says not to embed, so it is now out of date; I will leave it and flag it for the user.

## Tradeoffs the user accepted
- Studio updates need a dependency bump and a redeploy of the whole site (no auto-updates).
- Slower `next dev` and `next build` once the schema grows.
- `sanity typegen` must be re-run by hand after query changes (no watch mode).
- The Context MCP needs a deployed Studio application. An embedded Studio does not provide one. If search work needs it, a standalone Studio config may be needed later.

## Files expected to touch
- Delete: `studio/`, `prompts/standalone-sanity-studio.md`
- Restore or create: `src/app/studio/[[...tool]]/page.tsx`, `sanity.config.ts`, `sanity.cli.ts`, `src/sanity/structure.ts`, `src/sanity/schemaTypes/index.ts`
- Edit: `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `.env.example`
- Possibly: route-group layouts if the Studio clashes with the root layout

## Requirements
- `/studio` loads the Studio and asks for a Sanity sign-in. No 500.
- Homepage, `/design-system`, `/sign-in` and `/sign-up` look and work the same.
- No project id, dataset or key is printed or committed.

## Security
No tokens involved. Env files stay gitignored. Check `git status` for no `.env*` before any commit.

## Acceptance criteria
- `curl localhost:3000/studio` returns 200.
- Web `npx tsc --noEmit`, `npm run lint` and `npm run build` pass, and the build lists `/studio`.
- Browser check: the Studio UI renders at `/studio` with no console errors that block it.

## Checks to run
- `npx tsc --noEmit`, `npm run lint`, `npm run build`
- Dev server: request `/studio` and `/`, and read the browser console on `/studio`.

## Manual test steps
1. Run `npm run dev` in the repo folder (one server only).
2. Open http://localhost:3000/studio. The Studio loads; sign in with Sanity if asked.
3. If it says the origin isn't allowed, run `npx sanity cors add http://localhost:3000 --credentials` (your sign-in) and reload.
4. Open http://localhost:3000 and confirm the homepage and Sign in / Sign up work.
5. `git status`: no `.env*` files listed.
