# Sanity content model, Studio setup and server-side data layer

## Goal
Define the Vertex content model in Sanity (course, module, lesson, instructor, category), organise the embedded Studio around it, and add a server-only read client plus a typed data layer that the pages will use later. No page is changed in this task.

## Skills and docs read
- `AGENTS.md` sections 5, 7, 8, 12 (model shape, private dataset, server-only token, cache rules).
- `sanity-best-practices`: `schema.md`, `groq.md`, `nextjs.md`, `studio-structure.md`, `typegen.md`, `image.md`, `portable-text.md`.
- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` and `use-cache.md` (this app has `cacheComponents` on, so data functions use `'use cache'`, `cacheLife`, `cacheTag`).
- Designs `design/vertex-course.png` and `design/vertex-lesson.png`, to confirm which fields each page shows.

## Code inspected
- Embedded Studio from PR #2: `sanity.config.ts`, `src/app/studio/[[...tool]]/page.tsx`, empty `src/sanity/schemaTypes/index.ts`, default `structure.ts`.
- `src/sanity/lib/client.ts`: public client with `useCdn: true` and no token. Not safe for a private dataset.
- `src/sanity/lib/live.ts`: `defineLive` with no token. It is built around a browser token, which `AGENTS.md` forbids, and nothing imports it.
- `src/sanity/lib/image.ts` (`urlFor`) and `env.ts`: fine, they use only public ids.
- Nothing outside `src/sanity/` imports Sanity code yet.

## Decisions and assumptions
**Branch.** This builds on PR #2, which is still open. I branch `feature/content-model` from `feature/embedded-studio` and open the PR against that branch. GitHub retargets it to `main` once PR #2 merges.

**Schema** (documents: `course`, `lesson`, `instructor`, `category`; object: `courseModule`). Generated `_id`s, icons from `@sanity/icons`, `defineType`/`defineField`/`defineArrayMember`, slugs sourced from the title, required where the model needs it.
- `category`: title, slug, description.
- `instructor`: name, slug, photo (hotspot, alt), expertise, bio.
- `lesson`: title, slug, `summary` (short text), `videoUrl` (url, validated to YouTube, Vimeo or Bunny hosts), poster image, `durationSeconds` (number), `freePreview` (boolean), `studentCount`, `notes` (Portable Text), `keyPoints` (array of strings), `proTip` (optional text), `resources` (array of `{type, title, description, url}`; `type` is a list: article, repository, video, download). The course is not stored on the lesson; it is derived by reverse reference.
- `courseModule` (embedded object, not a document): title, summary, `lessons` (ordered references to lessons). Module and lesson numbers (Module 5, Lesson 5.1) and module durations are derived from order and lesson durations, never stored.
- `course`: title, slug, summary, cover image (hotspot, alt), `level` (list: beginner, intermediate, advanced), `price` (number, 0 = free), `popular` (boolean), `studentCount`, `outcomes` (array of `{icon, title, description}`; `icon` is a list: layers, database, gauge, cloud, code, shield, rocket), `instructor` and `category` references, `modules` (array of `courseModule`).
- **Added beyond the fixed model:** `lesson.summary`. The lesson page header and the search result cards both show a short description, and no listed field covers it. Say if you want it dropped.

**Studio structure.** Content list: Courses, Lessons, divider, Instructors, Categories. No singletons yet. The search Context document comes with the search task.

**Read client and data layer (server only).**
- `src/sanity/lib/client.ts`: `import 'server-only'`; `createClient` with `token: SANITY_API_READ_TOKEN`, `useCdn: false`, `perspective: 'published'`. It throws a clear error if the token is missing.
- Delete `src/sanity/lib/live.ts` (unused, and built around a browser token).
- `src/sanity/lib/queries.ts`: `defineQuery` queries with explicit projections and `_key` on arrays. They cover the catalog, course by slug (modules and lessons in order, with derived counts and durations), lesson by slug (with its course and module derived by reverse reference, and neighbouring lessons), instructor by slug (with their courses), categories, and slug lists.
- `src/sanity/lib/data.ts`: async functions `getCourses`, `getCourse`, `getLesson`, `getInstructor`, `getCategories`. Each uses `'use cache'`, `cacheLife('minutes')` and `cacheTag(...)`. Revalidation webhooks come later.
- A lesson that appears in several courses resolves to the first matching course. Flagged as a limitation.
- Types: add `typegen` config to `sanity.cli.ts` and an npm script; commit the generated `sanity.types.ts` and `schema.json`.
- New dependency: `server-only`.

**Out of scope.** Pages, homepage wiring, Clerk-based progress, video ingestion, seed content, webhooks, the Context document, access control.

## Things only you can do
1. Create a read token in sanity.io/manage (API, Tokens, Viewer role) and add `SANITY_API_READ_TOKEN=` to `.env.local`. Never paste it in chat.
2. Make the dataset private if it is not: `npx sanity dataset visibility set <dataset> private`. I will not change project settings.

## Files expected to touch
- New: `src/sanity/schemaTypes/{category,instructor,lesson,course,course-module}.ts`, `src/sanity/lib/{queries,data}.ts`, `sanity.types.ts`, `schema.json`
- Edit: `src/sanity/schemaTypes/index.ts`, `src/sanity/structure.ts`, `src/sanity/lib/client.ts`, `sanity.cli.ts`, `package.json`, `package-lock.json`, `.env.example`
- Delete: `src/sanity/lib/live.ts`

## Requirements
- The token is read only on the server; nothing imports `client.ts` or `data.ts` from a client component. `server-only` enforces this at build time.
- No env value is printed or committed.
- All query results are typed through TypeGen.
- The Studio at `/studio` still loads and shows the five content types.

## Acceptance criteria
- `npx sanity schemas extract` and `npx sanity typegen generate` succeed.
- `npx tsc --noEmit`, `npm run lint` and `npm run build` pass.
- Every query runs without a syntax error against the dataset (empty results are fine if there is no content).
- With your token in place, a data-layer function returns real data once a document exists.
- `git status` shows no env file.

## Checks to run
- `npm run typegen`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Run each query through `npx sanity documents query` to prove it is valid GROQ.
- Check `/studio` renders in the browser and lists the content types.

## Manual test steps
1. Add the read token to `.env.local` and restart `npm run dev`.
2. Open http://localhost:3000/studio and create an instructor, a category, two lessons and a course that uses them (one module).
3. Tell me, and I run the data-layer check against your content.
4. Confirm the Studio shows Courses, Lessons, Instructors and Categories in that order.
