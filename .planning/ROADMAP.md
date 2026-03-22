# Roadmap: Jersey Design Voter

## Overview

This roadmap delivers a web app for an ultimate frisbee team to select their jersey design through two rounds of ranked choice voting. Starting with foundation and access, we build the submission system for design uploads, then complete the voting and results experience. Three phases deliver all 16 v1 requirements with coarse granularity appropriate for this focused, one-time-use application.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation and Access** - Database schema, phase state machine, and shared link access
- [ ] **Phase 2: Submission System** - Image upload with anonymity, gallery view, and submission limits
- [ ] **Phase 3: Voting and Results** - Drag-and-drop voting, RCV algorithm, results display, and admin controls

## Phase Details

### Phase 1: Foundation and Access
**Goal**: Users can access the app via shared link and the app tracks which phase (Submit/Vote/Results) it's in
**Depends on**: Nothing (first phase)
**Requirements**: ACC-01, ACC-02
**Success Criteria** (what must be TRUE):
  1. User can open the shared link and see the app without logging in
  2. App displays current phase indicator (Submit, Round 1, Round 2, or Results)
  3. Admin can access admin controls via separate admin URL
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Project setup with Next.js, database schema, and phase state machine
- [ ] 01-02-PLAN.md — User landing page and admin interface with phase controls

### Phase 2: Submission System
**Goal**: Team members can upload jersey designs that are displayed anonymously in a gallery
**Depends on**: Phase 1
**Requirements**: SUB-01, SUB-02, SUB-03, SUB-04, SUB-05
**Success Criteria** (what must be TRUE):
  1. User can upload up to 2 design images during submission phase
  2. Uploaded images have EXIF metadata stripped (no photographer names, GPS, or camera info visible)
  3. User can browse all submitted designs in a gallery grid
  4. Designs display without any identifying information about who submitted them (for regular users)
  5. Admin can see submitter name for each design
**Plans**: TBD

Plans:
- [ ] 02-01: TBD

### Phase 3: Voting and Results
**Goal**: Users can vote via ranked choice and see results after each round, controlled by admin
**Depends on**: Phase 2
**Requirements**: VOTE-01, VOTE-02, VOTE-03, VOTE-04, VOTE-05, VOTE-06, RES-01, RES-02, RES-03, RES-04, RES-05, RES-06
**Success Criteria** (what must be TRUE):
  1. User can tap designs to select 1st, 2nd, 3rd choice in sequence
  2. Selected designs display their rank number (1, 2, 3) visually
  3. User sees confirmation screen showing their ranked selections before submitting vote
  4. User cannot vote twice (browser-based tracking prevents duplicate votes)
  5. Admin can advance phases: Submit -> Round 1 -> Round 2 -> Results
  6. After Round 1 ends, users see the 3 finalists selected by RCV
  7. After Round 2 ends, users see the winning design with RCV elimination breakdown
  8. Admin can delete any submitted design
  9. Admin can reset voting rounds (clear all votes for a fresh start)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Access | 0/2 | Planned | - |
| 2. Submission System | 0/? | Not started | - |
| 3. Voting and Results | 0/? | Not started | - |

---
*Roadmap created: 2026-03-22*
*Granularity: Coarse (3-5 phases)*
*Coverage: 19/19 v1 requirements mapped*
