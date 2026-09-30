# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pocket Heist** is a Next.js web application themed around "tiny missions" and office mischief. This is a starter project for the Claude Code Masterclass with a frontend skeleton but no backend, database, or authentication implemented yet.

## Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Run production server
```

### Testing
```bash
npm test             # Run all tests with Vitest
npm test -- <path>   # Run specific test file
npm test -- --watch  # Run tests in watch mode
```

### Linting
```bash
npm run lint         # Run ESLint
```

### Git Workflow
```bash
git switch -c <branch-name>  # Create and switch to new branch (preferred over git checkout)
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router
- **React 19** with TypeScript 5
- **Tailwind CSS 4** for styling with CSS Modules for components
- **Vitest** + React Testing Library for testing
- **lucide-react** for icons

### Route Organization

The app uses Next.js **route groups** to separate authenticated and public routes without affecting URLs:

**Public routes** (`app/(public)/`):
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/preview` - Component preview page

**Dashboard routes** (`app/(dashboard)/`):
- `/heists` - Heist list
- `/heists/create` - Create new heist
- `/heists/[id]` - View specific heist

The `(dashboard)` layout wraps all heist-related pages with the Navbar component.

### Import Aliases

TypeScript path alias `@/*` maps to project root:
```typescript
import Navbar from "@/components/Navbar"  // Instead of ../../../components/Navbar
```

### Styling Architecture

Multi-layered styling approach combining global theme, CSS Modules, and Tailwind utilities:

**1. Global Theme** (`app/globals.css`)
- Tailwind CSS v4 using `@theme` directive
- Custom color palette:
  - `--color-primary`: #C27AFF (purple)
  - `--color-secondary`: #FB64B6 (pink)
  - `--color-dark`: #030712 (background)
  - `--color-light`: #0A101D
  - `--color-lighter`: #101828
  - `--color-success`: #05DF72
  - `--color-error`: #FF6467
- Typography base styles (h1-h4, body)
- Global utility classes (`.page-content`, `.center-content`, `.form-title`, `.btn`)

**2. Component Styles** (CSS Modules)
- Each component has its own `.module.css` file for scoped styles
- Use `@reference "../../app/globals.css"` to access global theme variables
- Combine custom classes with `@apply` directive for Tailwind utilities
- Prevents style conflicts between components

**3. Tailwind Utilities**
- Use inline for simple one-off styling (single class maximum)
- For multiple utility classes, combine into custom class using `@apply` in CSS Modules

**Example**: `components/Button/Button.tsx` uses both global `.btn` class and module-scoped styles.

### Component Structure

Components follow the barrel export pattern:
```
components/
└── ComponentName/
    ├── ComponentName.tsx          # Component implementation
    ├── ComponentName.module.css   # Scoped styles
    └── index.ts                   # Re-exports for clean imports
```

Existing components:
- **Avatar** - User avatar with skeleton loading state
- **Button** - Primary action button
- **Input** - Text input field
- **LoginForm** - Login form with email/password
- **Navbar** - Site navigation with logo and user avatar
- **PasswordInput** - Password input with show/hide toggle
- **SignupForm** - Signup form with email/password
- **Skeleton** - Loading skeleton placeholder

### Testing Setup

- Tests located in `tests/` directory, mirroring `components/` structure
- Vitest configured with jsdom environment and React Testing Library
- Globals enabled (no need to import `describe`, `it`, `expect`)
- Setup file: `vitest.setup.ts` imports `@testing-library/jest-dom`
- Test files follow naming pattern: `ComponentName.test.tsx`

### Feature Development Workflow

This project uses a **spec-driven development process**:

**1. Feature Specs** (`_specs/` directory)
- Template: `_specs/template.md` defines the spec structure
- Each feature starts with a spec file defining requirements, acceptance criteria, and testing guidelines
- Specs include branch naming convention: `claude/feature/<feature-name>`

**2. Implementation Plans** (`_plans/` directory)
- Implementation plans are stored here for reference
- Plans detail step-by-step approach for building features

**Example**: See `_specs/authentication-forms.md` and `_plans/authentication-forms.md` for the authentication forms feature implementation.

## Code Style Preferences

- **Use semicolons** for JavaScript or TypeScript code
- **Minimal Tailwind in templates**: Apply at most 1 Tailwind class directly in component templates. For multiple utilities, combine them into a custom class using `@apply` in CSS Modules
- **Minimal dependencies**: Prefer built-in solutions where possible
- **Git branching**: Use `git switch -c` for new branches, not `git checkout`

## Checking Documentation

- **important:** When implementing any lib/framework-specific features, ALWAYS check the approrpiate lib/framework documentation using the Context7 MCP server bifore writing any code.