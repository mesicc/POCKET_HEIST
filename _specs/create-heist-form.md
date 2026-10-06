# Spec for Create Heist Form

branch: claude/feature/create-heist-form

## Summary

Build the "Create a New Heist" form on the `/heists/create` page. A logged-in user fills in a title, description and an assignee, and submitting the form creates a new document in the Firestore `heists` collection. The list of assignable users (codename and user id) is fetched from the existing `users` collection. After the heist is saved, the user is redirected to the `/heists` page.

## Functional Requirements

- Replace the placeholder content of `app/(dashboard)/heists/create/page.tsx` with a create heist form, keeping the existing "Create a New Heist" title
- Form fields:
  - Title (required, text input)
  - Description (required, multi-line text)
  - Assign to (required, a select/dropdown of other users)
- Fetch users from the Firestore `users` collection (each has `id` and `codename`) to populate the assignee options, and display codenames to the user
- Exclude the currently logged-in user from the assignee options (users cannot assign a heist to themselves)
- On submit, create a document in the `heists` collection following the existing `CreateHeistInput` shape and conventions in `types/firestore/heist.ts`:
  - `title` and `description` from the form
  - `createdBy` and `createdByCodename` from the current authenticated user (uid and displayName)
  - `assignedTo` and `assignedToCodename` from the selected user
  - `createdAt` set with a Firestore server timestamp
  - `deadline` set to 48 hours after creation
  - `finalStatus` set to null
- Use the existing `COLLECTIONS.HEISTS` constant for the collection name
- Redirect the user to `/heists` after the document is successfully created
- Show a loading state on the submit button and disable the form while submitting, to prevent duplicate submissions
- Show user-friendly error messages when validation fails, when users cannot be loaded, or when saving fails
- Reuse existing components (`Input`, `Button`, `LoadingSpinner`) where possible, and follow the project's styling approach (CSS Modules, at most one Tailwind class in templates)
- Add a new `CreateHeistForm` component following the barrel export component structure

## Possible Edge Cases

- User is not logged in or auth state is still loading when the page renders or the form is submitted
- The `users` collection is empty or contains only the current user, leaving no valid assignees
- Fetching users fails (network or permissions error)
- Users list is still loading when the user tries to submit
- Title or description is empty or whitespace only
- Very long title or description
- Firestore write fails (network error, security rules rejection)
- User double-clicks submit, creating duplicate heists
- Selected assignee no longer exists by the time of submission
- Current user's displayName is missing from their auth profile
- User navigates away mid-submit

## Acceptance Criteria

- The `/heists/create` page renders the form with title, description and assignee fields
- The assignee dropdown is populated with codenames from the `users` collection, excluding the current user
- Submitting with any required field empty shows a validation error and does not write to Firestore
- Submitting a valid form creates exactly one document in the `heists` collection with all fields matching the `CreateHeistInput` shape, including a deadline 48 hours after creation and `finalStatus` of null
- The creator's uid and codename are stored in `createdBy` and `createdByCodename`, and the assignee's uid and codename in `assignedTo` and `assignedToCodename`
- After a successful save the user is redirected to `/heists`
- The submit button shows a loading state and the form cannot be submitted twice while saving
- A clear error message is shown if the users fetch or the heist save fails, and the user stays on the form with their input preserved

## Open Questions

- Should users be allowed to assign a heist to themselves? Proposed: no, exclude them from the list
- Should there be maximum lengths for title and description? Proposed: yes, reasonable limits to be decided during planning
- Should the users list be fetched on the client or via a server component/action? To be decided during planning
- Should Firestore security rules be updated as part of this feature to allow reads on `users` and creates on `heists`? To be decided
- Should the `/heists` list page show the newly created heist in this feature, or is that out of scope? Proposed: out of scope

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Form renders title, description and assignee fields and a submit button
- Assignee options are loaded from the users collection and exclude the current user
- Validation errors are shown for empty required fields and no Firestore write happens
- Valid submission calls Firestore with the correct heist data (creator, assignee, deadline 48 hours ahead, finalStatus null)
- User is redirected to `/heists` after successful submission
- Submit button shows loading state and prevents duplicate submissions
- Error message is shown when the users fetch or the heist creation fails
