# Technical Debt

This document tracks technical debt items that should be addressed to improve code quality, maintainability, and reliability.

## High Priority

### 1. Add Assertion Framework
**Issue**: No systematic validation of assumptions throughout the codebase
**Impact**: Silent failures, harder debugging, assumptions not documented
**Effort**: Medium (2-3 days)

**Tasks**:
- [ ] Create `src/lib/assert.ts` utility with development/production modes
- [ ] Add assertions to date calculation functions
- [ ] Add assertions to Bazi calculation functions
- [ ] Add assertions to component prop validations
- [ ] Add assertions to array access operations

**Example locations**:
```typescript
// src/components/DailyView.tsx
- getDayStemBranch(): Validate date is valid
- handleViewHourly(): Assert day is in valid range
- openNote(): Assert date calculations are correct

// src/lib/chinese-calendar.ts
- getLunarDate(): Validate input date
- getSolarTerm(): Assert month/day in valid range
- getCurrentShichen(): Assert hour is 0-23

// src/lib/bazi-calculator.ts
- calculateRiskLevel(): Assert branches are valid
- All calculation functions: Validate inputs
```

**Benefits**:
- Catch bugs during development
- Document assumptions in code
- Easier debugging with clear error messages
- Prevent impossible states

---

## Medium Priority

### 2. Improve Error Boundaries
**Issue**: No React error boundaries to catch component errors
**Impact**: Entire app crashes on component errors
**Effort**: Small (1 day)

**Tasks**:
- [ ] Add error boundary component
- [ ] Wrap main views in error boundaries
- [ ] Add error logging/reporting
- [ ] Create fallback UI for errors

---

### 3. Type Safety Improvements
**Issue**: Some functions use `any` or loose typing
**Impact**: Type errors not caught at compile time
**Effort**: Medium (2 days)

**Tasks**:
- [ ] Audit codebase for `any` types
- [ ] Add strict null checks
- [ ] Create proper type definitions for Bazi data structures
- [ ] Add discriminated unions for view types

---

### 4. Input Validation
**Issue**: User inputs not consistently validated
**Impact**: Invalid data can cause crashes or incorrect calculations
**Effort**: Medium (2-3 days)

**Tasks**:
- [ ] Add Zod schemas for user profile data
- [ ] Validate date inputs before calculations
- [ ] Add form validation for all user inputs
- [ ] Sanitize localStorage data on load

---

## Low Priority

### 5. Test Coverage
**Issue**: Limited test coverage for critical calculations
**Impact**: Regressions not caught automatically
**Effort**: Large (1 week)

**Tasks**:
- [ ] Add unit tests for date calculations
- [ ] Add unit tests for Bazi calculations
- [ ] Add integration tests for key user flows
- [ ] Set up CI/CD test automation

---

### 6. Performance Optimization
**Issue**: Some calculations run on every render
**Impact**: Unnecessary re-renders, slower UI
**Effort**: Medium (2 days)

**Tasks**:
- [ ] Memoize expensive calculations
- [ ] Use React.memo for pure components
- [ ] Optimize calendar grid rendering
- [ ] Profile and optimize hot paths

---

### 7. Code Documentation
**Issue**: Limited inline documentation for complex logic
**Impact**: Harder for new developers to understand
**Effort**: Medium (2-3 days)

**Tasks**:
- [ ] Add JSDoc comments to public functions
- [ ] Document Bazi calculation algorithms
- [ ] Add README for each major module
- [ ] Create architecture decision records (ADRs)

---

## Completed Items

_None yet_

---

## Notes

### Assertion Implementation Example

```typescript
// src/lib/assert.ts
export function assert(condition: boolean, message: string): asserts condition {
  if (process.env.NODE_ENV === 'production') {
    // In production, log but don't crash
    if (!condition) {
      console.error(`Assertion failed: ${message}`);
    }
    return;
  }
  
  // In development, crash loudly
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function assertNever(value: never, message?: string): never {
  throw new Error(message || `Unexpected value: ${value}`);
}

export function assertDefined<T>(value: T | null | undefined, message: string): asserts value is T {
  assert(value !== null && value !== undefined, message);
}
```

### Usage Example

```typescript
import { assert, assertDefined } from '@/lib/assert';

function getDayStemBranch(date: Date) {
  assert(date instanceof Date, "date must be a Date object");
  assert(!isNaN(date.getTime()), "date must be valid");
  
  const ref = new Date(2000, 0, 1);
  const diff = Math.floor((date.getTime() - ref.getTime()) / 86400000);
  
  assert(diff >= 0, "date cannot be before year 2000");
  
  const cycle = (((diff % 60) + 60) % 60 + 54) % 60;
  const stemIdx = cycle % 10;
  const branchIdx = cycle % 12;
  
  assert(stemIdx >= 0 && stemIdx < 10, "stem index out of range");
  assert(branchIdx >= 0 && branchIdx < 12, "branch index out of range");
  
  return `${HEAVENLY_STEMS[stemIdx]}${EARTHLY_BRANCHES[branchIdx]}`;
}
```

---

## Review Schedule

- Review this document monthly
- Update priorities based on user feedback and bug reports
- Move completed items to "Completed Items" section
- Add new items as they're identified
