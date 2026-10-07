# Spec for Expired Heist Card Component

branch: claude/feature/expired-heist-card
figma_component (if used): none

## Summary

Create an ExpiredHeistCard component to replace the plain list rows currently shown in the "All Expired Heists" section of the `/heists` page. Each card is a single horizontal row: a status icon in a colored circle on the left, then the heist title and assignee, with the timestamp and a status badge on the right. The cards stack vertically as a list (not a grid). An ExpiredHeistCardSkeleton component is shown in the same row layout while expired heists are loading. Both components live in `components/ExpiredHeistCard`, alongside `HeistCard`.

## Functional Requirements

- Replace the current plain title list in the "All Expired Heists" section on `/heists` with ExpiredHeistCard rows
- Cards stack vertically as a list with consistent spacing between rows, matching the existing expired heists section layout
- Each card is a single horizontal row, with title and assignee on the left and timestamp and badge on the right
- Left side of each card:
  - Status icon in a circle: an X icon in a red circle for failed heists, a check icon in a green circle for successful heists
  - Heist title in bold
  - A "To:" label followed by the assignee's codename in purple (primary color) with a user icon
- Right side of each card:
  - Calendar icon with the completion/deadline timestamp
  - Status badge on the far right: a red "FAILED" badge when `finalStatus` is `failure`, a green "SUCCESS" badge when `finalStatus` is `success`
- Status colors use the global theme: `--color-error` for failed, `--color-success` for successful
- Icons come from lucide-react
- ExpiredHeistCardSkeleton mirrors the same row layout (circle, title and assignee lines, timestamp, badge) and shows while expired heists load
- Components follow the project structure: CSS Module per component, barrel export via `index.ts`, and the skeleton exported from the same barrel (matching how `HeistCardSkeleton` is exported)

## Figma Design Reference (only if referenced)

- File: none provided
- Component name: n/a
- Key visual constraints: n/a. Reuse the existing theme tokens (`--color-light` background, `--color-primary` for the assignee codename, `--color-success` and `--color-error` for status) and keep styling consistent with `HeistCard`.

## Possible Edge Cases

- No expired heists (existing empty state message "No expired heists" still shown)
- Loading state while the expired heists are being fetched
- Error state when fetching fails (existing error message still shown)
- Very long heist titles or codenames (truncate or wrap without breaking the row layout)
- Missing or unresolved assignee information
- `finalStatus` is null or an unexpected value (expired query excludes null, but the card should not crash)
- Missing or invalid timestamp
- Narrow screens where title/assignee and timestamp/badge no longer fit on one row (wrap or stack gracefully)
- Many expired heists producing a long list

## Acceptance Criteria

- The "All Expired Heists" section on `/heists` renders ExpiredHeistCard rows instead of plain list items
- Failed heists show an X icon in a red circle and a red "FAILED" badge
- Successful heists show a check icon in a green circle and a green "SUCCESS" badge
- Title is bold; the assignee line shows "To:" and the codename in purple with a user icon
- Timestamp is shown with a calendar icon on the right, with the badge on the far right
- Cards stack vertically in a list, not a grid
- ExpiredHeistCardSkeleton matches the card's row layout and displays while loading
- Existing empty and error states in the section keep working
- Icons are decorative or have accessible text so status is not conveyed by color alone (badge text covers this)
- Components follow the styling architecture (CSS Modules plus global theme) with a barrel export

## Open Questions

- Should the badge say "SUCCESS" or "COMPLETED" for successful heists? Proposed: "SUCCESS", matching the `success` value of `finalStatus`
- Should the timestamp show the completion time or the deadline? Proposed: the deadline, since the heist data has no separate completion field
- How should the timestamp be formatted (absolute date, relative, or both)? Proposed: match the format used on `HeistCard`
- Should the title link to `/heists/[id]` like `HeistCard`? Proposed: yes, title only
- How many skeleton rows should show while loading? Proposed: three, as in the existing card sections
- Should the row stack on mobile? Proposed: yes, timestamp and badge move below the title and assignee

## Testing Guidelines

Create a test file(s) in the ./tests/components/ExpiredHeistCard folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Failed heist renders the "FAILED" badge and the title
- Successful heist renders the "SUCCESS" badge and the title
- Assignee codename renders with the "To:" label
- Title links to the correct `/heists/[id]` URL (if the link behavior is kept)
- ExpiredHeistCardSkeleton renders without crashing
