# Context MCP endpoint configuration (Sanity Dashboard, Context app)

Create an MCP endpoint on the `production` dataset (name it e.g. `vertex-search`; the name cannot be changed later), then paste the two values below. Verified against the seeded dataset: the reverse-reference and `pt::text(notes)` patterns return results; there are currently no `video` documents (ingestion has not run).

## GROQ filter

```
_type in ["course", "lesson", "instructor", "category", "video"]
```

## Instructions

```
### Schema notes
- A lesson does not store its course. Find it with `*[_type == "course" && references(^._id)][0]` from the lesson.
- Course `modules` is an array of objects, each with a `lessons` array of references to lessons. Module and lesson numbers (Lesson 5.1) come from array order and are not stored.
- Lesson `notes` is Portable Text. Match its text with `pt::text(notes)`, never `notes match`.
- Lesson `duration` is seconds. Lesson `thumbnail` is the image. Lesson `keyPoints` is an array of strings.
- Course outcomes are in `learningOutcomes`.

### Video moments
- A `video` document belongs to a lesson when `video.url == lesson.videoUrl`. `video` documents are an internal lookup: never return them as results, only the lesson that uses the video.
- Match `chapters[].label` first. Only if no chapter matches, match `chunks[].text`. Return only the matching chapters or chunks, never a whole `chunks` array.
- There may be no `video` documents yet. Then return lessons only.

### Query patterns
- Text match is token based: `title match "*caching*" || summary match "*caching*" || pt::text(notes) match "*caching*" || keyPoints[] match "*caching*"`. OR several keywords, one wildcard each.
- Rank a lesson whose title or chapter contains the exact concept above a lesson that only mentions it in notes.
```

## Token and URL
- Organization API token with **Context Viewer** (Manage > API > Tokens, organization level) goes in `.env.local` as `SANITY_CONTEXT_API_TOKEN`.
- The endpoint URL (`https://api.sanity.io/v1/context/organizations/<orgId>/mcp/<name>`) goes in `SANITY_CONTEXT_MCP_URL`.
- Changes to Instructions reach the app after the in-memory cache expires (10 minutes) or a server restart.
