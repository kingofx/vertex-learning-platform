# Intelligent search: Sanity Context MCP, server-side search API, results page

## Goal
A learner types a plain-language query and gets a full results page (`/search?q=…`) of ranked cards, in two kinds from the design: **video** results (a lesson's video at a matched second) and **lesson** results. The server route connects to the Sanity Context MCP, lets an LLM write GROQ over the schema, and returns structured results that are verified against the real data before they reach the UI.

## Skills and docs read
- `AGENTS.md` sections 5, 7, 9, 10, 11, 12.
- `.claude/skills/dial-your-context` (instructions and GROQ filter, written as pure deltas) and `shape-your-agent` (minimal system prompt, boundaries, "when you don't know").
- `create-agent-with-sanity-context`: **not installed** in this repo or in `~/.claude/skills`; I used the Sanity docs instead ([Context MCP](https://www.sanity.io/docs/ai/sanity-context-mcp), [configure an MCP](https://www.sanity.io/docs/ai/sanity-context-configure-mcp), AI SDK `createMCPClient`).
- `design/vertex-search.png`.

## Code inspected
- Data layer (`src/sanity/lib/{client,queries,data}.ts`), lesson/course schemas, seeded content (10 courses, 120 lessons, no video documents).
- Homepage search box (`src/app/page.tsx`): presentational `<label><input>`; the shared `SearchInput` and `Select` in `src/components/ui/input.tsx`.
- No AI dependencies installed. `.env.local` has Clerk, Sanity project/dataset/read token and PostHog names; **no OpenAI key and no Context MCP URL/token**.

## Where this differs from AGENTS.md (current Sanity docs win)
- **Search config lives in a Context MCP endpoint, not a Context document.** The Context app in the Sanity Dashboard holds the endpoint's GROQ filter and Instructions. I write both texts for you to paste; I never write the endpoint config. AGENTS.md sections 10 and 12 describe a Context document imported by NDJSON; that is out of date for this product.
- **A hosted Studio deploy is not required.** The docs say `sanity schema deploy` is enough for GROQ mode (AGENTS.md says a deployed Studio application). I will run `npx sanity schema deploy` (it writes the schema to your project) and verify the endpoint live; if the endpoint still refuses, we fall back to deploying the Studio.

## Decisions and assumptions
**Grounded by construction.** The model does not write the cards. It returns only `{ kind: "lesson" | "video", lessonSlug, startSeconds? }[]` in rank order (Zod-validated, `generateText` with MCP tools and structured output). The server then loads each lesson, its course, module label (e.g. "Lesson 5.1") and key points from Sanity with the existing read client, **drops any slug that does not exist**, and builds the card fields itself. Nothing in a card (course, label, thumbnail, duration, key points, description) comes from model text.

**Video results need video documents, which do not exist yet.** The seed has no chapters or transcripts and the ingestion pipeline is a separate task (AGENTS.md section 9). So in this task:
- I add a `video` document type (id, url, `chapters[{startSeconds,label}]`, `chunks[{startSeconds,text}]`) so ingestion has a target and the agent can query it; it is hidden from the Studio list (internal lookup).
- The search flow supports video moments end to end: a video result is only kept if its second matches a chapter or chunk of the video document that belongs to that lesson's video URL; otherwise it is downgraded to a lesson result. Chapters are matched first, transcript second.
- **Until ingestion runs you will see lesson results only.** I will not fabricate timestamps. The video card, "Watch from 12:45" link (`/lessons/<slug>?t=<seconds>`, which the lesson page already honours) and its states are built and checked with a fixture, not shown live.

**Ranking and shape (AGENTS.md section 11).** All matches, best first, no cap beyond a hard server limit of 40 for cost. Count line "Found N results across M courses". Sort control: Most relevant (default), Title A-Z, Shortest first (client-side, no refetch). Empty state points to the catalog (`/`).

**System prompt and Context instructions.** A short inline system prompt (role, ranking rule: title/exact concept beats broad keyword, chapters before transcript, wildcard and OR tokens, never match a whole phrase, `pt::text(notes)` for Portable Text, never return whole transcripts, never invent) plus the same critical rules in the endpoint Instructions. Delta-only Instructions text and the GROQ filter (`_type in ["course","lesson","instructor","category","video"]`) are in the file `docs/context-mcp-config.md` for you to paste.

**Server route.** `POST /api/search`, Node runtime. Zod-validates `{ query }` (1-200 chars), per-IP in-memory rate limit (best effort, 20/min) because it calls a paid LLM, no auth required (browsing is public), 4xx/5xx with generic messages, no stack or key in responses. MCP client created per request with the bearer token from env, closed in `finally`. The endpoint's `/initial-context` is fetched once and cached in memory (changes need a server restart, as AGENTS.md says). Model id from `OPENAI_MODEL`, default `gpt-4.1-mini`.

**Results page.** `/search` renders a static shell, and a client component posts the query to `/api/search`, shows a loading skeleton, then the cards, sort control and the "Can't find what you're looking for?" banner, exactly per the design (video card with thumbnail and duration badge, lesson card with key-points panel; course name with its icon slot, lesson label and module). The search field submits to `/search?q=`; the homepage search box now does too. Mobile: cards stack, thumbnail on top.

**Not built:** the ⌘K shortcut behaviour (the keycap is decorative as on the homepage), PostHog "search performed" event (PR #5 is still open), per-user history, streaming partial results, a reply paragraph (cards only), react-markdown (not needed without a prose reply).

## Things only you can do
1. **Context app (Sanity Dashboard):** have an org admin enable Context in Manage > Labs; create an MCP endpoint on the `production` dataset named e.g. `vertex-search`; paste the filter and Instructions from `docs/context-mcp-config.md`.
2. **Organization API token with Context Viewer** (Manage > API > Tokens, organization level).
3. **OpenAI API key.**
4. Put these in `.env.local` (never in chat): `SANITY_CONTEXT_MCP_URL`, `SANITY_CONTEXT_API_TOKEN`, `OPENAI_API_KEY`, optionally `OPENAI_MODEL`. I add the names (no values) to `.env.example`. These are server-only; none is `NEXT_PUBLIC_`.
I do the code, the schema deploy and the Instructions text before you do these, so you can set up in parallel; live verification waits for them.

## Files expected to touch
- New: `src/app/api/search/route.ts`, `src/app/search/page.tsx`, `src/components/search/{search-results,result-cards,search-form}.tsx`, `src/lib/search/{agent,hydrate,schema,rate-limit}.ts`, `src/sanity/schemaTypes/video.ts`, `docs/context-mcp-config.md`, `.env.example` entries
- Edit: `src/sanity/schemaTypes/index.ts`, `src/sanity/structure.ts` (hide `video`), `src/sanity/lib/queries.ts` (hydration queries), `src/app/page.tsx` (search form), `src/components/ui/icons.tsx` (if needed), `package.json`, `package-lock.json`, `sanity.types.ts`, `schema.json`
- New dependencies: `ai`, `@ai-sdk/openai`, `@ai-sdk/mcp`, `zod`

## Requirements
- The browser never holds the MCP token, OpenAI key or any Sanity token, and never calls the MCP or LLM; only `/api/search`.
- Every returned slug and second is verified against Sanity; unverifiable items are dropped or downgraded, never shown.
- Whole transcripts and `chunks` arrays are never returned to the model or the client.
- Server logs never include keys or the full model prompt.
- Cards, count, sort, empty state and loading/error states match the design and work at 375px.

## Security
Secrets only in `.env.local`; `git status` shows no env file before commit. Rate limiting and a query length cap bound cost and abuse. Query text is only ever passed to the model as data inside a delimited user message and never interpolated into GROQ by my code; hydration queries use parameters.

## Acceptance criteria
- With config in place, a query like "caching in next.js" returns ranked lesson cards from the seeded course, with a correct count, courses and labels; sorting works; a nonsense query shows the empty state.
- A forged slug or second from the model is dropped or downgraded (unit-style check with a fixture).
- `/api/search` rejects empty and over-long queries and returns 429 past the rate limit.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` pass; `npx sanity schema validate` passes.
- Verified against the live MCP endpoint (tools list shows `initial_context` and `groq_query`).

## Checks to run
`npm run typegen`, `npx sanity schema validate`, `npx sanity schema deploy`, `npx tsc --noEmit`, `npm run lint`, `npm run build`; MCP `tools()` listing; three real queries through `/api/search`; browser pass on `/search` at desktop and 375 px.

## Manual test steps
1. Do the "only you" steps and restart `npm run dev`.
2. Open http://localhost:3000, type "caching in next.js" in the search box, press Enter.
3. Check the count line, cards, course names, "Lesson 3.1"-style labels and key points; change the sort.
4. Click a lesson card: it opens the lesson page.
5. Search "zzzz qqqq": the empty state shows with the catalog link.
6. `git status`: no `.env*` listed.
