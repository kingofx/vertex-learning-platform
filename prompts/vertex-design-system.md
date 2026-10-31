# Implement the Vertex Design System

## Goal
Turn `design/vertex-designsystem.png` into working code: tokens in the Tailwind theme, the two fonts, a small set of reusable UI primitives that match the sheet, and a `/design-system` page that renders them like the reference. No product pages yet.

## Skills read
- `AGENTS.md` (workflow, UI rules: reference image is the source of truth, reuse Tailwind patterns, responsive down to mobile).
- Next.js docs in `node_modules/next/dist/docs/01-app/01-getting-started/` (`13-fonts.md`, `11-css.md`).
- No Sanity, Clerk or search skill applies. This is UI only.

## Code inspected
- `src/app/layout.tsx`: loads Geist and Geist Mono via `next/font/google`, still has the "Create Next App" metadata.
- `src/app/globals.css`: Tailwind v4 (`@import "tailwindcss"`, `@theme inline`), default light/dark vars, Arial body font.
- `src/app/page.tsx`: untouched create-next-app starter.
- `next.config.ts`: `cacheComponents` and `partialPrefetching` on, custom Turbopack rule using `@tailwindcss/turbopack`.
- `package.json`: Next 16.4.3, React 19.3, Tailwind 4, no UI or icon libraries.
- `design/` holds only the reference PNG. The README and token files I made earlier are no longer there, so I start from the image.

## Decisions and assumptions
- **Source of truth:** the PNG. It is only 661x992, so small text is approximate. Values I could not read are marked below and listed under "Needs your attention".
- **Tokens live in `globals.css`** inside `@theme`, so Tailwind generates utilities (`bg-primary-500`, `text-neutral-700`, `rounded-md`, `shadow-md`, `font-display`). No separate token files.
- **Fonts:** Playfair Display (display styles) and Inter (everything else) through `next/font/google`. Remove Geist.
- **Light theme only.** The reference has no dark mode, so I remove the dark `prefers-color-scheme` block rather than invent one.
- **No icon library.** The sheet specifies a custom 24px grid, 2px stroke, rounded caps, in outline and filled styles. I draw the shown set as inline SVG components: bell, search, play, document, bookmark, chart, clock, user, chevron. Any icon the sheet does not show is out of scope.
- **Logo:** an inline SVG recreation of the orange "V" mark plus the word "Vertex". It is approximate, since I only have the small image. Swap in the real asset if you have one.
- **Showcase page** at `/design-system`, laid out like the sheet (numbered sections 01–14), built from the same components. It doubles as the visual check. I will remove nothing from `src/app/page.tsx` beyond the starter content, which I replace with a short Vertex placeholder, since the starter conflicts with the new fonts and colors.
- **Components are presentational.** No data fetching, no auth, no state beyond what a control needs (for example the select). Card components take props, and the showcase passes sample text copied from the sheet.

## Tokens (from the image)
**Primary:** 500 `#F97316`, 400 `#FB923C`, 300 `#FDBA74`, 200 `#FED7AA`, 100 `#FFEEE5`.
**Neutral:** 900 `#0F172A`, 700 `#334155`, 500 `#64748B`, 300 `#CBD5E1`, 200 `#E2E8F0`, 100 `#F1F5F9`, 50 `#FAFAFC`, white `#FFFFFF`.
**Type scale (size / line height, weight):**
- Display 1: Playfair, 48/56, bold
- Display 2: Playfair, 36/44, bold
- Heading 1: Inter, 28/36, semibold
- Heading 2: Inter, 22/30, semibold
- Heading 3: Inter, 18/26, medium
- Body Large: Inter, 16/24, regular
- Body: Inter, 14/20, regular
- Small: Inter, 12/16, regular

**Spacing:** base 4px, steps 4, 8, 12, 16, 24, 32, 40, 48, 64 (Tailwind's default scale already covers these).
**Radius:** 4, 8, 12, 16, 24px, full.
**Shadows** (rgb 15 23 42): sm `0 1px 2px 0 /0.05`, md `0 4px 12px -2px /0.08`, lg `0 12px 24px -4px /0.10`, xl `0 20px 40px -8px /0.12`. The lg and xl opacities are estimated.
**Controls:** height 44px, radius 12px, border 1px `#E2E8F0`, padding 0 16px, focus border `#FB923C`.
**Status and badge colors not in the palette:** green for Completed and indigo for the Lesson badge. I pick them to match the sheet's look and flag them.

## Files I expect to touch
- `src/app/globals.css` (tokens, base styles)
- `src/app/layout.tsx` (fonts, metadata, lang)
- `src/app/page.tsx` (replace starter)
- `src/app/design-system/page.tsx` (new)
- `src/components/ui/`: `icons.tsx`, `logo.tsx`, `button.tsx`, `input.tsx` (search input and select), `badge.tsx`, `status-indicator.tsx`, `progress-bar.tsx`, `course-card.tsx`, `lesson-card.tsx`, `resource-card.tsx`, `nav-bar.tsx`, `breadcrumbs.tsx`, `pagination.tsx`
- `public/`: delete unused starter SVGs only if nothing references them after the page rewrite.

## Requirements
1. **Buttons:** Primary, Secondary, Tertiary, Text, each with default, hover and disabled states. Height 44px, radius 12px, Inter Medium. Primary is filled orange and darkens on hover. Secondary is an orange outline. Tertiary is a neutral outline with a trailing icon. Text is orange text with an icon. Disabled is faded.
2. **Inputs:** search input with a leading icon and a `⌘ K` hint, and a select with a chevron. Both follow the field specs above.
3. **Badges:** Video (orange), Lesson (indigo), Popular (orange). Small uppercase label on a tinted background.
4. **Status indicators:** In Progress (orange ring), Completed (green check), Now Playing (orange play), Locked (lock).
5. **Progress bar:** orange fill on a light track with a "% complete" label.
6. **Cards:** course card, video lesson card, text lesson card, resource card, with the content and footer metadata shown on the sheet.
7. **Navigation:** top nav with logo and Courses / My Learning tabs (active tab orange), breadcrumbs, numbered pagination with prev and next.
8. **Principles row:** four items with icon, title and one-line description.
9. **Responsive:** desktop matches the sheet. Below roughly 768px the showcase grid stacks to one column, the card rows stack, and the nav collapses to logo plus tabs without overflow. No horizontal scroll at 375px.
10. **Accessibility:** real `button` and `a` elements, visible focus ring using the focus color, `aria-label` on icon-only controls, `aria-current` on the active tab and page, and text contrast kept at or above the sheet's.

## Security considerations
None of substance. No user input is stored or sent, no env vars, no network calls, no secrets. The only external request is Google Fonts through `next/font`, which self-hosts the files at build time.

## Acceptance criteria
- `/design-system` visually matches the reference sheet section by section on desktop.
- Tokens are usable as Tailwind utilities, and no component hardcodes a hex value that has a token.
- Fonts load with no layout shift. Geist is gone.
- Type check, lint and production build all pass.
- 375px width shows no horizontal overflow.

## Checks to run (from the repo root)
```bash
npx tsc --noEmit
npm run lint
npm run build
npm run dev
```
Then compare `/design-system` against `design/vertex-designsystem.png` at desktop width and again at 375px.

## Manual test steps
1. Run `npm run dev` and open `http://localhost:3000/design-system` (or the port it prints).
2. Compare each numbered section with the image: colors, type, spacing, radius and shadows, icons, buttons, inputs, badges, status, progress, cards, navigation, principles.
3. Hover and Tab through the buttons, tabs, pagination and inputs. Confirm hover and focus states.
4. Narrow the window to about 375px. Confirm everything stacks and nothing scrolls sideways.
5. Open `/` and confirm the placeholder renders in the new fonts.
