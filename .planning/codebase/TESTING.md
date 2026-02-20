# Testing Patterns

**Analysis Date:** 2026-02-20

## Test Framework

**Runner:**
- Vitest 4.0.18
- Config: `vitest.config.ts`
- Merges with `vite.config.ts` for consistent setup

**Assertion Library:**
- Vitest's built-in matchers (chai/expect syntax)
- Global `describe`, `it`, `expect` via `globals: true` configuration

**Run Commands:**
```bash
npm run test              # Run all tests once (vitest run)
npm run test:watch       # Watch mode (vitest)
npx vitest run src/lib/formatters.test.ts  # Run single file
```

## Test File Organization

**Location:**
- Colocated with source: test files live in same directory as code
- Example: `src/lib/formatters.ts` → `src/lib/formatters.test.ts`
- Example: `src/lib/company-matching.ts` → `src/lib/company-matching.test.ts`

**Naming:**
- Pattern: `{name}.test.ts` for utility/library tests
- Files tested: Currently only `src/lib/formatters.test.ts` and `src/lib/company-matching.test.ts` exist
- No component tests yet; testing focus is on pure utility functions

**Structure:**
```
src/lib/
├── formatters.ts
├── formatters.test.ts         ← Test file
├── company-matching.ts
└── company-matching.test.ts   ← Test file
```

## Test Structure

**Suite Organization:**

```typescript
describe("formatINRCr", () => {
  it("formats 1500 Cr with Indian grouping", () => {
    expect(formatINRCr(1500)).toBe("INR 1,500 Cr");
  });

  it("formats fractional crore values", () => {
    expect(formatINRCr(0.5)).toBe("INR 0.5 Cr");
  });
});
```

**Patterns:**
- One `describe()` block per function being tested
- Multiple `it()` blocks for different test cases/scenarios
- Clear, readable test names: `"formats 1500 Cr with Indian grouping"` (not `"test1"`)
- Setup: None observed (no `beforeEach`/`afterEach` needed for pure functions)
- Teardown: None needed; all tests are isolated and stateless

**Horizontal Divider Comments:**
- Section headers between test suites:

```typescript
// ---------------------------------------------------------------------------
// formatINRCr
// ---------------------------------------------------------------------------

describe("formatINRCr", () => {
  // ...
});

// ---------------------------------------------------------------------------
// formatINRLakh
// ---------------------------------------------------------------------------
```

## Mocking

**Framework:**
- No mocking library imported (no Vitest `vi`, Jest mocks, or Sinon)
- Mocking is NOT used in current test files

**Patterns Observed:**
- Tests use actual implementations: `formatters.test.ts` calls real `formatINRCr()`, `formatPercent()`, etc.
- No stubs or mocks for external APIs
- No mock data fixtures in test files (test data is inline)

**What to Mock:**
- API calls (not yet tested, but would mock `fetch()` via Vitest's `vi.mock()` if needed)
- Zustand store mutations in component tests (not yet implemented)
- External services like TanStack Query (not yet tested)

**What NOT to Mock:**
- Pure utility functions: test them directly
- Format/transform functions: test actual implementations
- TypeScript type definitions: no mocking needed

## Fixtures and Factories

**Test Data:**
- Inline objects in test files, not centralized fixtures

Example from `company-matching.test.ts`:

```typescript
describe("filterByCompany", () => {
  const items = [
    { company: "Amber Enterprises" },
    { company: "Voltas" },
    { company: "Dixon Technologies" },
  ];

  it("filters to matching items", () => {
    // Uses `items` directly
  });
});
```

**Location:**
- Test data declared at top of `describe()` block
- Reused across multiple `it()` blocks within same suite
- No separate `fixtures/` or `test-data/` directories

## Coverage

**Requirements:**
- No coverage enforcement in `vitest.config.ts`
- No `coverage` threshold or reporter configured
- Coverage not tracked or reported in current setup

**View Coverage:**
- Not configured (would require `@vitest/coverage-*` package and CLI flag `vitest run --coverage`)
- Command would be: `npx vitest run --coverage` (if enabled)

## Test Types

**Unit Tests:**
- Scope: Individual pure functions in `src/lib/`
- Approach: Input → output assertions with multiple scenarios per function
- Examples:
  - `formatters.test.ts`: 17 test cases covering all formatting functions (INR, percentages, basis points, dates, etc.)
  - `company-matching.test.ts`: 14 test cases covering fuzzy/exact matching and filtering logic

**Integration Tests:**
- Not implemented yet
- Would test: API client fallback behavior, filter store sync with URL, section component data fetching

**E2E Tests:**
- Framework: Not used
- Would require Playwright, Cypress, or Puppeteer (not in dependencies)

## Common Patterns

**Async Testing:**
- Currently no async tests (all tested functions are synchronous)
- Pattern (when needed): Use `async/await` or return Promise:

```typescript
it("fetches data", async () => {
  const result = await fetchSectionData("executive");
  expect(result).toBeDefined();
});
```

**Error Testing:**
- Pattern: Test error conditions with specific matchers

```typescript
it("throws on invalid section ID", () => {
  expect(() => mockModules["invalid"]).toThrow("Unknown section");
});
```

- Currently observed: `matchesCompany()` tests for non-matching fields return `false`, no exception testing

**Assertion Patterns:**
- `expect(value).toBe(expected)` — exact equality (strings, numbers)
- `expect(value).toHaveLength(N)` — array/string length
- `expect(value).toContain(item)` — array/string contains item
- `expect(result).toMatch(/pattern/)` — regex matching
- `expect(result).toContainEqual(obj)` — array contains object with shape

Examples:

```typescript
// Exact match
expect(formatINRCr(1500)).toBe("INR 1,500 Cr");

// Length assertions
expect(result).toHaveLength(1);
expect(result).toHaveLength(0);

// String containment
expect(result).toContain("L");  // "INR 50 L"
expect(result).toContain("Cr"); // "INR 1,500 Cr"

// Regex matching
expect(result).toMatch(/^-/);   // Starts with minus sign

// Array filtering tests
const result = filterByCompanyId(items, (i) => i.company, "amber");
expect(result).toHaveLength(1);
expect(result[0].company).toBe("amber");
```

## Test Data Patterns

**INR Formatting Tests:**
- Small values with fractional parts: `0.5 Cr`, `45.2 L`
- Large values with Indian grouping: `1500 Cr` → `"1,500 Cr"`, `150000` → `"1,50,000"`
- Boundary values: exactly `100 Cr`, `1 Cr` (triggers integer vs. fractional formatting)

**Company Matching Tests:**
- Fuzzy match on first word: "Crompton Greaves Consumer" matches "Crompton Greaves Consumer Electricals"
- Exact ID match: "amber" === "amber" (case-insensitive)
- Non-matching returns false/empty array
- Case-insensitive throughout

**Growth Rate Tests:**
- Decimal fractions: `0.125` (12.5%), `-0.032` (-3.2%)
- Period specification: `formatGrowthRate(0.125, "QoQ")` → `"+12.5% QoQ"`
- Default period: `formatGrowthRate(0.125)` → `"+12.5% YoY"`

## Notable Testing Gaps

**Not Yet Tested:**
- React components (no enzyme, RTL, or Vitest component testing)
- API client (`src/api/client.ts`) — `fetchSectionData()` and fallback logic untested
- Zustand store mutations (`src/stores/filter-store.ts`)
- TanStack Query setup (`src/api/queries.ts`)
- Hook logic (`src/hooks/use-filtered-data.ts`) — complex filter logic untested
- Async behaviors (mock data fetch timing)
- Error boundaries and error handling in components

**Testing Strategy:**
- Phase 1 (current): Pure utility function testing
- Phase 2 (recommended): Add component tests with `@testing-library/react`
- Phase 3 (recommended): Integration tests for data flow (API → filtering → components)

---

*Testing analysis: 2026-02-20*
