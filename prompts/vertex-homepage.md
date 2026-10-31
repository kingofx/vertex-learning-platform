# Implement the Vertex homepage

## Goal
Replace the placeholder at `src/app/page.tsx` with the homepage in `design/vertex-home.png`: nav, hero, search bar, "All Courses" grid, weekly-updates strip, and the decorative bars at the bottom. Desktop matches the reference; it stacks cleanly down to 375px.

## Skills and docs read
- `AGENTS.md` (sections 3, 5, 7, 14).
- `node_modules/next/dist/docs/` (App Router pages and server/client boundaries) before coding.
- Sanity, Clerk and PostHog skills are not needed yet: this page has no backend (see decisions).

## Code inspected
- `src/components/ui/`: `NavBar`, `Logo`, `Button`/`ButtonLink`, `SearchInput`, `CourseCard`, `Icon`, `Badge`.
- `src/app/globals.css` tokens (Playfair display type, primary/neutral scale, radius, shadows).
- `src/app/page.tsx` (placeholder) and `design/vertex-home.png`.

## Decisions and assumptions
- **Static data.** The Sanity model does not exist yet, so the three courses (Next.js for Production, Docker Essentials, TypeScript Deep Dive) are a typed constant in the page. A later prompt swaps it for a GROQ fetch.
- **Reuse before adding.** Reuse `NavBar`, `ButtonLink`, `CourseCard`. Extend them only where the reference differs (e.g. serif card title, divider above the meta row, a larger search field).
- **New icons:** `arrowRight` and `star` added to `icons.tsx`.
- **Course logos** are small inline SVG components (Next.js "N" tile, Docker whale, TS tile). No external assets.
- **Nav right side:** bell icon plus a round avatar. There is no photo asset and no Clerk yet, so the avatar is a neutral placeholder circle. Clerk replaces it later.
- **Search bar** is presentational: it renders the field and the `⌘ K` hint but does not navigate. The search page and API come later.
- **Background:** off-white page tone, a faint diagonal-hatch edge on the left/right, and the orange bars at the bottom as pure CSS gradients (decorative, `aria-hidden`).
- **Links:** "Explore Courses" and "View all courses" point to `/` for now (no catalog route yet). Cards link to `#`.
- Any token the reference needs that is missing (page tint, serif sizes) is added to `globals.css`, not hardcoded inline.

## Files expected to touch
- `src/app/page.tsx` (rewrite)
- `src/components/ui/icons.tsx` (add `arrowRight`, `star`)
- `src/components/ui/cards.tsx` (CourseCard styling to match the reference)
- `src/components/ui/input.tsx` (hero search size variant, only if needed)
- `src/components/ui/course-logos.tsx` (new)
- `src/app/globals.css` (only if a token is missing)

## Requirements
- Server component. No client JS unless strictly needed.
- Semantic structure: `header`, `nav`, `main`, one `h1`, `h2` for "All Courses", course cards as `article` with a single link.
- Keyboard focus visible on every interactive element; decorative elements `aria-hidden`.
- No horizontal overflow at 375, 768, 1024, 1280.
- Responsive: hero type scales down; course grid goes 3 → 2 → 1 columns; bars shrink and stay at the bottom.

## Security
No user input, no secrets, no network calls, no new dependencies.

## Acceptance criteria
- Side by side with the reference: layout, spacing, type, colors and card contents match at desktop width.
- All three cards show logo, title, description, level, duration and module count.
- No console errors; no overflow at the four widths.

## Checks to run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Browser pass at 375/768/1024/1280, comparing to the reference.

## Manual test steps
1. `npm run dev`, open `/`.
2. Compare to `design/vertex-home.png`.
3. Resize to mobile width and confirm stacking with no sideways scroll.
4. Tab through the page and confirm visible focus on each control.
5. Confirm `/design-system` still renders unchanged.
