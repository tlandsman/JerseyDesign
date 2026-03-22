---
phase: 03
plan: 01
subsystem: voting-infrastructure
tags:
  - database
  - rcv-algorithm
  - server-actions
  - admin-controls
dependency-graph:
  requires: []
  provides:
    - votes-table
    - results-table
    - rcv-algorithm
    - vote-crud
    - admin-reset-controls
  affects:
    - admin-controls
tech-stack:
  added: []
  patterns:
    - RCV instant-runoff voting algorithm
    - Database unique constraints for duplicate prevention
    - Confirmation dialogs for destructive actions
key-files:
  created:
    - src/lib/rcv.ts
    - src/lib/votes.ts
    - src/actions/vote-actions.ts
    - src/components/reset-votes-controls.tsx
  modified:
    - src/db/schema.ts
    - src/components/admin-controls.tsx
decisions:
  - Tie-breaker eliminates lower design ID when vote counts tied (deterministic)
  - Form actions use void-returning wrapper for TypeScript compatibility
  - Reset controls show vote count across both rounds
metrics:
  duration: 4min
  completed: 2026-03-22
---

# Phase 3 Plan 1: Voting Infrastructure Summary

RCV algorithm with exhausted ballot handling, votes/results schema with unique constraints, and admin reset controls with confirmation dialogs.

## What Was Built

### Database Schema (Task 1)
- Added `votes` table with voterToken, round, firstChoice, secondChoice, thirdChoice
- Added unique constraint on (voterToken, round) preventing duplicate votes per VOTE-04
- Added `results` table storing finalistIds (JSON), totalVoters, eliminationData (JSON)
- Schema applied via `drizzle-kit push`

### RCV Algorithm & Vote CRUD (Task 2)
- `src/lib/rcv.ts`: Pure function implementing instant-runoff voting
  - Handles exhausted ballots (skips if no remaining valid choice)
  - Tie-breaker: eliminates lower design ID (deterministic, simple)
  - Returns finalists, round-by-round elimination data, total voters
- `src/lib/votes.ts`: Database operations
  - submitVote, hasVoted, getVotesForRound, resetRoundVotes, resetAllVotes
  - saveResults, getResults with JSON serialization for arrays

### Server Actions & Admin Controls (Task 3)
- `src/actions/vote-actions.ts`:
  - submitVoteAction with zod validation, phase check, duplicate prevention
  - advancePhaseWithRCVAction computes RCV before phase transition (round1->3 finalists, round2->1 winner)
  - resetRoundAction, resetAllAction for admin vote management
- `src/components/reset-votes-controls.tsx`:
  - "Reset Round" button (current round only, shown during voting phases)
  - "Reset All" button (all voting data, destructive)
  - Confirmation dialogs per D-16
- `src/components/admin-controls.tsx`:
  - Now uses RCV-aware phase advance
  - Shows reset controls with vote counts during voting phases

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 482a8bd | Add votes and results tables to database schema |
| 2 | 2b6d4cc | Implement RCV algorithm and vote CRUD operations |
| 3 | c59f660 | Create vote Server Actions and admin reset controls |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript form action type mismatch**
- **Found during:** Task 3
- **Issue:** advancePhaseWithRCVAction returns `{ success, error }` but HTML form actions require `void | Promise<void>`
- **Fix:** Added advancePhaseFormAction wrapper that calls the main action without returning its result
- **Files modified:** src/actions/vote-actions.ts, src/components/admin-controls.tsx
- **Commit:** c59f660

## Out of Scope Issues Noted

Pre-existing TypeScript error in `src/app/api/uploadthing/core.ts` (Buffer type mismatch) was not addressed as it's unrelated to this plan's changes.

## Verification Results

- votes table exists with unique constraint on (voterToken, round)
- results table exists with unique constraint on round
- runRCV imported and used in vote-actions.ts (lines 87, 96)
- Reset Round and Reset All buttons in reset-votes-controls.tsx
- Admin controls integrated with ResetVotesControls component

## Self-Check: PASSED

- [x] src/db/schema.ts exists with votes and results tables
- [x] src/lib/rcv.ts exists with runRCV export
- [x] src/lib/votes.ts exists with all CRUD exports
- [x] src/actions/vote-actions.ts exists with all action exports
- [x] src/components/reset-votes-controls.tsx exists
- [x] Commits 482a8bd, 2b6d4cc, c59f660 verified in git log
