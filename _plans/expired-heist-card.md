# Plan: ExpiredHeistCard component and skeleton

Spec: `_specs/expired-heist-card.md` · Branch: `claude/feature/expired-heist-card`

## Context

The "All Expired Heists" section on `/heists` currently renders a bare `<ul>` of titles (`HeistTitles` in `app/(dashboard)/heists/page.tsx`). The spec replaces those rows with a proper ExpiredHeistCard (status circle, bold title, "To: codename", timestamp, SUCCESS/FAILED badge) stacked as a vertical list, plus a matching skeleton for the loading state. `HeistTitles` is only used by this section, so it can be removed once replaced.

## Decisions (taken from the spec's proposed Open Question answers)

- Badge text: "SUCCESS" (`finalStatus === "success"`), "FAILED" (`"failure"`). Type is `"success" | "failure" | null` in `types/firestore/heist.ts`.
- Timestamp: `heist.deadline`, formatted like `HeistCard` (`"en-US"`, short month, day, 2-digit hour/minute).
- Title links to `/heists/[id]` (title only), as in `HeistCard`.
- 3 skeleton rows while loading.
- Row wraps on narrow screens (timestamp/badge drop below title/assignee).

## Files

New, in `components/ExpiredHeistCard/`:
- `ExpiredHeistCard.tsx`
- `ExpiredHeistCard.module.css`
- `ExpiredHeistCardSkeleton.tsx`
- `ExpiredHeistCardSkeleton.module.css`
- `index.ts` (default export card, named `ExpiredHeistCardSkeleton`, same shape as `components/HeistCard/index.ts`)

Modified:
- `app/(dashboard)/heists/page.tsx`: replace `HeistTitles` with an `ExpiredHeistCards` list component mirroring the existing `HeistCards` (loading, error, empty branches), then delete `HeistTitles`.
- `app/(dashboard)/heists/page.module.css`: add a `.list` class (vertical flex column with gap) next to `.grid`. Reuse existing `.emptyState` and `.errorMessage`.

New tests: `tests/components/ExpiredHeistCard/ExpiredHeistCard.test.tsx`.

## Implementation notes

- **Reuse:** follow `components/HeistCard/HeistCard.tsx` for structure. Copy its `formatTimestamp` (consider exporting it from HeistCard or a small shared util only if it avoids duplication without widening scope; otherwise duplicate the 6-line function and keep the diff small). Reuse the `Heist` type from `@/types/firestore`.
- **Card:** `<article>` row, flex with space-between. Left group: status circle (`X` or `Check` from lucide-react, `aria-hidden`), then a block with `<h3>` containing the title `Link` (bold) and a `To:` line using the `User` icon with the codename in `text-primary`. Right group: `Calendar` icon plus timestamp, then the badge. Badge text conveys status so color is not the only signal.
- **Styling:** CSS Module with `@reference "../../app/globals.css"` and `@apply`, using tokens `bg-light`, `border-lighter`, `text-primary`, `text-success`, `text-error`, `text-heading`, `text-body`. Circle and badge variants as `.statusSuccess` / `.statusFailed` modifier classes. At most one Tailwind class inline in JSX, per `CLAUDE.md`.
- **Skeleton:** `role="status" aria-label="Loading"` with an `sr-only` text, as in `HeistCardSkeleton`. Row layout with a circle placeholder, two lines on the left, and a timestamp bar and badge pill on the right, using `animate-pulse` and `bg-lighter`.
- **Docs check:** `CLAUDE.md` requires checking library docs via Context7 before writing library-specific code. Before implementing, confirm the lucide-react icon names (`X`, `Check`, `User`, `Calendar` all exist in the installed package) and the Next.js `Link` usage. Use semicolons throughout.
- **Edge cases:** long titles use `break-words`, and the row wraps below 640px. A null or unexpected `finalStatus` falls back to the failed styling guard-free but must not throw. A missing `deadline` should not crash the formatter (guard for an invalid date).

## Build order (TDD, per project convention)

1. Write `ExpiredHeistCard.test.tsx` first (failing).
2. Implement card, skeleton, CSS modules, barrel export.
3. Wire into `page.tsx` and `page.module.css`, remove `HeistTitles`.
4. Lint and test.

## Tests (keep light, mirror `tests/components/HeistCard/HeistCard.test.tsx`)

- Failed heist shows "FAILED" and the title.
- Successful heist shows "SUCCESS" and the title.
- Codename renders with the "To:" label and the primary-color class.
- Title links to `/heists/<id>`; it is the only link.
- Skeleton renders a loading status and no link.

## Verification

- `npm test -- tests/components/ExpiredHeistCard` passes; `npm test` and `npm run lint` clean.
- `npm run dev`, open `/heists` signed in: confirm the expired section shows stacked rows with the right icon, color, and badge for a success and a failure heist (set `finalStatus` and a past `deadline` in Firestore as in `_plans/use-heists-hook.md`).
- Throttle the network to see 3 skeleton rows; check the empty and error messages still appear; resize below 640px to confirm wrapping.
