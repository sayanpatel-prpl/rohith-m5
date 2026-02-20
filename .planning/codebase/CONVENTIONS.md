# Coding Conventions

**Analysis Date:** 2026-02-20

## Naming Patterns

**Files:**
- TypeScript source: lowercase with hyphens for multi-word (e.g., `company-matching.ts`, `filter-store.ts`)
- React components: PascalCase (e.g., `StatCard.tsx`, `ExecutiveSnapshot.tsx`)
- Test files: same as source with `.test.ts` suffix (e.g., `formatters.test.ts`, `company-matching.test.ts`)
- Utility/hook files: lowercase with leading `use` for hooks (e.g., `use-filtered-data.ts`, `useBrand.ts`)
- Type definition files: `*.ts` with `types/` prefix for shared types (e.g., `src/types/sections.ts`, `src/types/filters.ts`)

**Functions:**
- camelCase for regular functions and constants: `fetchSectionData()`, `formatINRCr()`, `matchesCompany()`
- PascalCase for React components: `ExecutiveSnapshot()`, `StatCard()`, `SectionErrorFallback()`
- Hook functions: `useFilteredData()`, `useFilterUrlSync()`, `useFilterStore()`
- Factory functions: `sectionQueries.financial()`, `sectionQueries.executive()` (object pattern with lowercase keys)
- Accessor functions: `getCompanyById()`, `getCompanyName()` (prefix with `get`)
- Predicate functions: `matchesCompany()`, `matchesCompanyId()` (prefix with `matches`)
- Filter functions: `filterByCompany()`, `filterByCompanyId()` (prefix with `filter`)

**Variables:**
- camelCase for all local variables and module-level constants
- SCREAMING_SNAKE_CASE for configuration constants: `API_BASE_URL`, `USE_REAL_API`, `PARAM_MAP`
- Type aliases are PascalCase: `MetricKey`, `SectionId`
- Component props interfaces: `StatCardProps`, `DataRecencyTagProps`, `ComparisonViewProps` (suffix with `Props`)

**Types & Interfaces:**
- PascalCase for all types and interfaces: `SectionData`, `ExecutiveSnapshotData`, `FilterState`
- Discriminant field pattern for union types: `section: "executive-snapshot"` in data types
- Action interface suffix: `FilterActions`, `FilterState` for Zustand store types
- Generic type parameters: `T` (generic data), `SectionId` (branded string)

## Code Style

**Formatting:**
- No explicit ESLint/Prettier config found in project root. Inferred from TypeScript settings:
  - Target: ES2020 (app), ES2022 (build tools)
  - JSX: `react-jsx` (automatic JSX transform)
  - Strict mode enabled: `strict: true`
- Line length: observed ~80-120 characters in readable sections
- Indentation: 2 spaces (inferred from source files)

**Linting:**
- `eslint .` runs linting but no `.eslintrc` config file present in root
- ESLint is listed in `npm run lint` command
- No strict linting rule overrides observed in comments

**Strict TypeScript Settings:**
- `strict: true` enforced: all types are explicit
- `noUnusedLocals: true` — dead code not tolerated
- `noUnusedParameters: true` — all parameters must be used or explicitly prefixed with `_`
- `noFallthroughCasesInSwitch: true` — switch statements must break/return every case
- `noUncheckedSideEffectImports: true` — side-effect imports must be explicit

## Import Organization

**Order:**
1. React and external framework imports (React, react-router, zustand, TanStack Query, Radix UI)
2. Internal utility/API imports (`src/api/`, `src/lib/`, `src/stores/`)
3. Type imports (`import type { ... } from "..."`)
4. Relative imports from parent/same directory (`../ and ./`)
5. CSS/style imports (Tailwind handled via build pipeline, not explicit imports)

**Path Aliases:**
- No path aliases configured in `tsconfig.app.json` — all imports use relative paths
- Module imports from `src/` use relative `../../` paths based on nesting
- Three-level paths are common: `import { useFilteredData } from "../../hooks/use-filtered-data"`

**Type Imports:**
- Always use `import type { ... }` for type-only imports to reduce runtime overhead
- Example: `import type { SectionData } from "../types/sections"`
- Explicitly distinguish `import` (runtime) from `import type` (compile-time only)

## Error Handling

**Patterns:**
- React Error Boundary for component tree errors: `SectionErrorFallback` catches section rendering failures
- `try/catch` with fallback for API calls: `fetchSectionData()` tries real API, falls back to mock data on failure
- Null/undefined checks before rendering: `if (isPending) return <SectionSkeleton />; if (error) throw error; if (!data) return null;`
- Console warnings for non-fatal issues: `console.warn()` used in API client for API failures and fallback behavior
- Type guards for optional fields: `typeof entry.id === "string"` to safely extract company ID from union types
- Explicit error throwing for programmer errors: `throw new Error("Unknown section: ${sectionId}")` in `fetchMockData()`

**Error Message Standards:**
- Descriptive: Include what failed and context (e.g., "API returned 500 for executive, falling back to mock data")
- Lowercase start, no period: `"Failed to fetch ${sectionId} from API, falling back to mock data"`
- Include error object in console output: `console.warn("message:", error)` for debugging

## Logging

**Framework:** `console` native (no Pino, Winston, or custom logger)

**Patterns:**
- `console.warn()` for recoverable errors and fallback events
- No `console.log()` in production code; debug info logged only during development
- Conditional logging on `import.meta.env.DEV` for verbose output during development (e.g., simulated network latency)
- Short, descriptive messages: `"Failed to fetch ${sectionId} from API, falling back to mock data"`

## Comments

**When to Comment:**
- JSDoc comments for exported functions and public APIs (required for all public functions)
- Section separator comments: horizontal dashes with descriptive headers (`// -----------\n// Purpose\n// -----------`)
- Inline comments for non-obvious logic: algorithm notes, data transformations, edge cases
- Comments for compiler directives: `// eslint-disable-next-line` with explanation

**JSDoc/TSDoc:**
- Parameters documented: `@param name description`
- Return values documented: implicitly from type signature, but explain complex returns
- Examples provided for tricky functions: `@example formatINRCr(1500) => "INR 1,500 Cr"`
- One-liner description for simple utilities: `/**\n * Fuzzy company match...\n */`

**Example from codebase:**

```typescript
/**
 * Format amount in INR Crore.
 * @example formatINRCr(1500) => "INR 1,500 Cr"
 * @example formatINRCr(0.5)  => "INR 0.5 Cr"
 */
export function formatINRCr(amountInCr: number): string {
  // For values >= 100, drop fractional part for cleaner display
  if (Math.abs(amountInCr) >= 100) {
    return `INR ${indianIntegerFormatter.format(Math.round(amountInCr))} Cr`;
  }
  return `INR ${indianNumberFormatter.format(amountInCr)} Cr`;
}
```

## Function Design

**Size:**
- Most functions 10-30 lines (observed average in utils and hooks)
- Complex functions document logic with inline comments
- Functional composition preferred over large monolithic functions

**Parameters:**
- Destructured props for React components: `function StatCard({ label, value, trend, subtitle, className }: StatCardProps)`
- Explicit type for each parameter (no implicit `any`)
- Optional parameters marked with `?`: `className?: string`
- Generics used for reusable data-processing functions: `filterByCompany<T>(items: T[], accessor: (item: T) => string, ...)`

**Return Values:**
- Explicit return type annotation on all functions: `export async function fetchSectionData<T extends SectionData>(sectionId: SectionId): Promise<T>`
- JSX components return `ReactNode` or `null` implicitly
- Async functions return `Promise<T>` with specific type parameter
- Utility functions return specific types, not `any` or `unknown`

## Module Design

**Exports:**
- Named exports for utilities: `export function formatINRCr(...)`, `export function matchesCompany(...)`
- Default exports for React section components (enables lazy loading): `export default function ExecutiveSnapshot()`
- Named exports for smaller UI components: `export function StatCard(...)`, `export function DataRecencyTag(...)`
- Type exports: `export interface SectionData`, `export type SectionId`

**Barrel Files:**
- Used sparingly: `src/components/sections/index.ts` exports lazy-loaded section components
- Example: `export const lazySections = { executive: lazy(() => import("./sections/executive/ExecutiveSnapshot"))... }`

**Module Organization:**
- `src/api/` — API clients and TanStack Query setup
- `src/lib/` — Utility functions and formatters
- `src/stores/` — Zustand stores
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript interfaces and type definitions
- `src/components/` — UI components, organized by feature/purpose
- `src/sections/` — 10 section-specific components
- `src/data/mock/` — Mock data for development/fallback
- `src/brands/` — Multi-tenant branding configurations
- `src/theme/` — Dark mode and design token configuration

---

*Convention analysis: 2026-02-20*
