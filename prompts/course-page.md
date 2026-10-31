# Course detail page (`/courses/[slug]`), wired to the seeded Sanity content

## Goal
Build the course page from `design/vertex-course.png` and fill it from the seeded Sanity dataset through the existing server-only data layer (`getCourse`, `getCourses`/`getCourseSlugs`). Desktop matches the reference; mobile is adapted.

## Skills and docs read
- `AGENTS.md` sections 3, 5, 7, 8, 12 (read-only pages, server-only client, derived module/lesson numbers, progress is separate app state).
- `sanity-best-practices` (`nextjs.md`, `image.md`) for the image URL builder and Next integration.
- `node_modules/next/dist/docs/01-app/01-getting-started/` (`06-fetching-data.md`, `08-caching.md`, `12-images.md`): `cacheComponents` is on, so uncached request data must be in `<Suspense>`, and dynamic routes need `generateStaticParams`.
- `design/vertex-course.png`.

## Code inspected
- Homepage header lives inline in `src/app/page.tsx` (Logo, Courses / My Learning links, bell, Clerk `Show`/`UserButton` in `<Suspense>`). No shared header yet.
- UI kit: `Badge` (has `popular`), `ButtonLink`, `Breadcrumbs`, `ProgressBar`, `Icon` (has chart, clock, document, bookmark, arrowRight, chevronDown), `course-logos.tsx`.
- Data layer: `getCourse(slug)` returns the course with instructor, category, modules numbered 1..n, each module with `summary`, derived `durationSeconds` and numbered lessons; `moduleCount`, `durationSeconds`, `outcomes` are present.
- Seed content: 10 courses, each 4 modules of 3 lessons, 4 outcomes, cover image (picsum), `level`, `popular`, `studentCount`. Outcome icons used: code, gauge, layers, puzzle, sparkles, workflow (design shows layers, database, gauge, cloud; `Icon` has none of these).
- `next.config.ts` has no `images.remotePatterns`.
- `.env.local` has **no `SANITY_API_READ_TOKEN`** and the dataset is currently **public**.

## Decisions and assumptions
- **Route:** `src/app/courses/[slug]/page.tsx`, a Server Component. `generateStaticParams` from `getCourseSlugs`. `notFound()` for an unknown slug. Metadata from the course title and summary.
- **Shared header:** extract the homepage header into `src/components/site-header.tsx` (same markup, `Courses` marked current via a prop) and use it on both pages. The homepage must look identical.
- **Sections, top to bottom:** breadcrumb (All Courses > title); hero with the cover image tile, Popular badge (only when `popular`), serif title, summary, meta row (level, duration, module count, students), actions; "What you'll learn" card with a 2-column grid of outcomes; "Course Content" list with module number, title, summary, duration and a chevron; "Show all N modules" button; bottom bar.
- **Cover image:** `urlFor(coverImage)` through `next/image` (add `cdn.sanity.io` to `images.remotePatterns`), square tile with rounded corners. The design shows a Next.js logo tile, the seed has a photo cover; I use the seeded cover.
- **Outcome icons:** add the missing line icons (database, cloud, code, shield, rocket, puzzle, sparkles, workflow) to `icons.tsx`, drawn in the same stroke style. Unknown icon falls back to a neutral one.
- **Course content:** the first 6 modules show, "Show all N modules" reveals the rest. Each module row expands to list its lessons (number, title, duration, free-preview label), each linking to `/lessons/<slug>`. The lesson page does not exist yet, so those links 404 until that task. This needs one small client component (`ModuleList`) for expand/collapse; everything else is server-rendered.
- **Formatting helpers** (`1h 12m`, `18.2k students`, level label) in `src/lib/format.ts`.
- **Primary action:** "Start Learning" linking to the first lesson. The design's "Continue Learning", the bottom "Your Progress 35%" bar and its second Continue button depend on learner progress, which is a later task (Clerk-keyed, server-written). **I leave the bottom bar out for now** rather than show a fake 35%; the progress task adds it. Say if you want it shown with a placeholder instead.
- **Bookmark button:** rendered as in the design, presentational only (no backend, not in the spec). It does nothing yet.
- **Responsive:** hero stacks (image on top, full width up to a cap), meta row wraps, outcomes grid becomes one column, module rows keep number, title and chevron with the duration moving under the title.
- **Auth:** the page is public, no `auth()` call.
- **Out of scope:** lesson page, progress, bookmarks, search, instructor on the page (the design doesn't show it), Studio changes.

## Things only you can do
1. Create a read token (sanity.io/manage, API, Tokens, Viewer role) and add `SANITY_API_READ_TOKEN=...` to `.env.local`, then restart `npm run dev`. Without it `client.ts` throws and the page cannot load real data. Never paste the token in chat.
2. Optional, per AGENTS.md: make the dataset private with `npx sanity dataset visibility set production private`. I will not change project settings.

## Files expected to touch
- New: `src/app/courses/[slug]/page.tsx`, `src/components/site-header.tsx`, `src/components/course/module-list.tsx`, `src/lib/format.ts`
- Edit: `src/app/page.tsx` (use shared header), `src/components/ui/icons.tsx`, `next.config.ts`
- Maybe: `src/sanity/lib/data.ts` (only if a field the page needs is missing)

## Requirements
- Data comes only from the data layer; nothing client-side touches the Sanity client or token.
- Numbers shown (modules, duration, students, Module N) come from content and derivation, never hardcoded.
- Reuse existing components and tokens; no new colors.
- Keyboard focus visible, expandable rows use buttons with `aria-expanded`, images have alt text from the content.

## Security
No new secrets. The read token stays server-only. `git status` must show no env file before any commit.

## Acceptance criteria
- `/courses/nextjs-app-router-in-depth` renders title, summary, meta, 4 outcomes and 4 modules from Sanity, matching the layout of the reference at 1280px.
- Unknown slug returns 404.
- Homepage unchanged visually after the header extraction.
- No horizontal scroll at 375px.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` pass, and the build lists the course route.

## Checks to run
- `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Browser pass at 1280 and 375 on `/courses/nextjs-app-router-in-depth` and `/`, comparing against the reference; expand a module and "Show all".

## Manual test steps
1. Add the read token to `.env.local` and restart `npm run dev`.
2. Open http://localhost:3000/courses/nextjs-app-router-in-depth.
3. Compare with `design/vertex-course.png`; expand a module; click "Show all".
4. Open http://localhost:3000/courses/does-not-exist and confirm a 404.
5. Open http://localhost:3000 and confirm the header and homepage look as before.
