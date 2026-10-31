# Lesson page (`/lessons/[slug]`) with the video playing on the page

## Goal
Build the lesson page from `design/vertex-lesson.png`, filled from the seeded Sanity content through the server-only data layer (`getLesson`), with the lesson's YouTube video playing in an embed on the page. Desktop matches the reference; mobile is adapted (sidebar collapses).

## Skills and docs read
- `AGENTS.md` sections 3, 5, 7, 8, 12 (embeds only, no custom player; start-seconds query param; notes are Portable Text; Notes tab and free-preview badge are presentational; progress is separate app state).
- `sanity-best-practices` (`portable-text.md`, `nextjs.md`).
- `node_modules/next/dist/docs/01-app/` (dynamic routes, `searchParams`, caching): `cacheComponents` is on, so `searchParams` (the start second) must be read inside `<Suspense>`.
- `design/vertex-lesson.png`.

## Code inspected
- Data layer: `getLesson(slug)` already returns the lesson, its course (first course that references it), the numbered modules with lessons, and `position` (`label` like `1.2`, module number/title/count, `previous`, `next` with title, slug and duration).
- Seed content: 120 lessons, all `https://www.youtube.com/watch?v=<id>`; notes are Portable Text (normal, h2, bullet list, no marks/links); each lesson has key points, a pro tip, and one `link` resource.
- Shared `SiteFrame` header, `Breadcrumbs`, `Badge`, `Icon` (needs: arrowLeft, check circle exists, external exists, lightbulb, github/document), `format.ts`.
- `@portabletext/react` 6.2.0 is installed only as a transitive dependency; `.env.local` now has the read token, so I can test against live data.
- Course page links already point to `/lessons/<slug>`.

## Decisions and assumptions
- **Route:** `src/app/lessons/[slug]/page.tsx`, Server Component; `generateStaticParams` from `getLessonSlugs`; `notFound()` (also from `generateMetadata`) for an unknown slug. Public page, no `auth()`.
- **Layout:** same `SiteFrame`, then a two-column body: left sidebar (course cover tile, course title, "Module N of M" header, module list), right content column; a sticky-looking bottom bar with Previous Lesson / Next Lesson, each showing the neighbour's title and duration.
- **Sidebar:** server data, small client component for expand/collapse. The current module is open and lists its lessons with a timeline dot, the current lesson marked "Now playing" with the orange play circle; other modules collapse and expand. Lessons link to `/lessons/<slug>`. On screens below `lg` the sidebar collapses behind a "Course content" button above the content.
- **Main column:** breadcrumb (All Courses, course, module, lesson); "LESSON 5.1" badge (plus "Free preview" label when set); serif title; bookmark icon button (presentational, no backend); summary; meta row (duration, level, students); video; tabs; bottom bar.
- **Video:** a plain provider iframe, no custom player (the design's controls are the provider's own). YouTube is supported now: `https://www.youtube-nocookie.com/embed/<id>?start=<t>&rel=0`. `?t=<seconds>` on the page URL sets the start second (the search task will use this). A `videoUrl` from an unsupported provider falls back to an outbound-free message ("Video unavailable"); Vimeo and Bunny are not supported until their ingestion and playback exist (AGENTS section 9). The player sits inside `<Suspense>` because it reads `searchParams`; the rest of the page stays static.
- **Tabs:** Lesson Content and Notes. Lesson Content shows: "Overview" (the lesson's Portable Text notes), "In this lesson you will:" (key points with check icons), the Pro Tip card (only if set), and Resources cards (title, description, external icon, opening in a new tab with `rel="noopener noreferrer"`). The Notes tab is presentational with an empty-state message and no saving (AGENTS section 7).
- **Portable Text:** `@portabletext/react` with a small component map (paragraph, h2/h3, bullet/number lists, strong/em/code, link) styled with existing tokens. Added as a direct dependency.
- **Left out on purpose** (depend on the progress task): the "35% complete" bar, completion check marks in the sidebar, and the video's resume position. A lesson that belongs to no course renders without the sidebar and bottom bar neighbours.
- **Known limitation:** a lesson used by several courses resolves to the first course (documented earlier).
- **Out of scope:** progress, bookmarks backend, Vimeo/Bunny, search deep links, PostHog events for video (PR #5 is still open).

## Things only you can do
None. The read token is in place; I do not read it.

## Files expected to touch
- New: `src/app/lessons/[slug]/page.tsx`, `src/components/lesson/{lesson-sidebar,lesson-tabs,lesson-video,portable-text}.tsx`
- Edit: `src/components/ui/icons.tsx` (arrowLeft, lightbulb, github), `package.json`, `package-lock.json`

## Requirements
- All content comes from `getLesson`; numbers (Lesson 5.1, Module 5 of 12), durations and neighbours are derived, nothing hardcoded.
- No client component imports the Sanity client or token.
- Embed and external links are `https` only; the iframe has a `title`, `allow` and `allowFullScreen`; Portable Text never uses `dangerouslySetInnerHTML`.
- Keyboard focus visible, expanders are buttons with `aria-expanded`, tabs use `role="tablist"`.
- No horizontal scroll at 375px.

## Security
No new secrets. Only embed URLs derived from a validated YouTube id are used (id must match `[A-Za-z0-9_-]{11}`), so content cannot inject an arbitrary iframe source.

## Acceptance criteria
- `/lessons/nextjs-app-router-in-depth-file-system-routing` renders title, summary, meta, a playing YouTube embed, overview, key points, pro tip, resource, sidebar with the right module open and the right lesson "Now playing", and working Previous/Next.
- `?t=90` makes the embed start at 90 seconds.
- Unknown slug gives the not-found page.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` pass and the build lists the lesson route.

## Checks to run
- `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Browser pass at desktop width and 375 on a lesson in the middle of a course, the first lesson and the last lesson (Previous/Next edges); expand modules; switch tabs.

## Manual test steps
1. `npm run dev`; open http://localhost:3000/courses/nextjs-app-router-in-depth and click "Start Learning".
2. Confirm the video loads and plays on the page; compare with `design/vertex-lesson.png`.
3. Use the sidebar and Previous/Next to move between lessons and modules.
4. Open the same lesson URL with `?t=90` and confirm the video starts at 1:30.
5. Open `/lessons/does-not-exist` for the not-found page.
