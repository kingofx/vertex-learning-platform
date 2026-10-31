# Set up Clerk authentication

## Goal
Add Clerk to Vertex using the existing Clerk application the Dashboard selected (`app_3LTHRy8nGt1RkU4T7230fOCtpxV`). Browsing stays public. The homepage nav gets sign-in, sign-up and a signed-in user menu.

## Skills and docs read
- `AGENTS.md` (sections 5, 7, 12): Clerk through Next.js middleware, browsing public, secret key server-only, only the publishable key reaches the browser.
- `.claude/skills/clerk-setup/SKILL.md` and `.claude/skills/clerk-nextjs-patterns/SKILL.md`.
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`: in this Next.js version middleware is `proxy.ts`.

## Code inspected
- No auth dependencies, routes, middleware, sessions or user records exist. No `@clerk/*` packages. No `proxy.ts` or `middleware.ts`.
- No `.env*` files exist, and `.env*` is gitignored. I did not read any env files.
- Next 16.4.3, React 19.3.0, Node 25.8 (meets Clerk's 20.9 minimum). `cacheComponents` is on, so anything reading auth/request data must sit inside `<Suspense>`.
- Homepage nav in `src/app/page.tsx` currently shows a bell and a placeholder avatar.

## Decisions and assumptions
- **Use the selected app.** Run `npx -y clerk@latest init --app app_3LTHRy8nGt1RkU4T7230fOCtpxV --no-skills`. `--no-skills` because the Clerk skills are already installed in `.claude/skills/`. No new accountless app is created.
- **CLI sign-in needed (yours).** The CLI is not authenticated by the Dashboard. If `init` needs access, you run `npx -y clerk@latest auth login` in your own terminal first. I never see credentials or keys.
- **Keys** are written by the CLI to an env file that is gitignored. I won't read or print it. A committed `.env.example` lists variable names only (no values).
- **Bare `clerkMiddleware()`** in `proxy.ts`. No route matchers, no routes protected yet: AGENTS.md keeps browsing public. Later private pages call `await auth.protect()` themselves.
- **Auth UI** in the existing nav, replacing the placeholder avatar: signed-out shows Sign in (tertiary/text button) and Sign up (primary); signed-in shows `UserButton`. Wrapped in `<Suspense>` with a same-size fallback so the header doesn't shift. Reuse existing `Button`/`ButtonLink` styles.
- **Sign-in and sign-up pages** at `/sign-in/[[...sign-in]]` and `/sign-up/[[...sign-up]]` as `init` generates them, with the prebuilt components wrapped in `<Suspense>` and centered on the page background. No custom theme beyond the primary color if Clerk's appearance API supports it cheaply.
- `ClerkProvider` goes inside `<body>` in `layout.tsx`.
- Out of scope: protecting routes, progress tracking, My Learning gating, webhooks, organizations, production deploy.

## Files expected to touch
- `package.json`, `package-lock.json` (`@clerk/nextjs`)
- `src/proxy.ts` (new)
- `src/app/layout.tsx` (provider)
- `src/app/page.tsx` (nav auth controls)
- `src/app/sign-in/[[...sign-in]]/page.tsx`, `src/app/sign-up/[[...sign-up]]/page.tsx` (new)
- `.env.example` (new, names only)
- Gitignored env file written by the CLI (not committed, not read)

## Requirements
- `CLERK_SECRET_KEY` never appears in client code or committed files.
- Public pages (`/`, `/design-system`) still render signed-out.
- `await auth()` wherever used; any `auth()` or `<Show>` in a Server Component sits inside `<Suspense>`.
- Keyboard focus visible on the new controls; no layout overflow at 375px.

## Security
- No keys in chat, prompt files, commits or logs. I never read the env file.
- Only the publishable key is `NEXT_PUBLIC_*`.
- Verify `git status` shows no env file staged before any commit.

## Acceptance criteria
- Signed out: nav shows Sign in and Sign up; both pages load and the Clerk form renders.
- After you sign up, the nav shows the user menu and signing out returns to the signed-out nav.
- `npx -y clerk@latest doctor` reports no problems.

## Checks to run
- `npx -y clerk@latest doctor`
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` (catches missing `<Suspense>` under Cache Components)
- Browser pass: `/`, `/sign-in`, `/sign-up`, at 375 and 1280.

## Manual test steps
1. `npm run dev`, open `/`. Confirm Sign in and Sign up show in the nav.
2. Click Sign up and create your account (you enter the details).
3. Confirm you return to the app and the user menu appears; open it and sign out.
4. Open `/design-system` while signed out. It must still load.
5. Run `git status` and confirm no env file is listed.
