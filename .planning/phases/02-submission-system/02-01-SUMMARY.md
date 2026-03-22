---
phase: 02-submission-system
plan: 01
subsystem: database, api
tags: [uploadthing, drizzle, sharp, exif-stripping, file-upload, server-actions]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: database setup with drizzle-orm, Server Actions pattern
provides:
  - designs table schema for storing submission metadata
  - UploadThing file upload endpoint with EXIF stripping
  - Design CRUD operations (create, read, delete)
  - Server Actions for design mutations with cache revalidation
affects: [02-submission-system, upload-ui, gallery, admin-panel]

# Tech tracking
tech-stack:
  added: [uploadthing, @uploadthing/react, sharp, react-photo-view]
  patterns: [EXIF stripping via Sharp in onUploadComplete callback, UTApi for server-side file operations]

key-files:
  created:
    - src/app/api/uploadthing/core.ts
    - src/app/api/uploadthing/route.ts
    - src/lib/uploadthing.ts
    - src/lib/designs.ts
    - src/actions/design-actions.ts
  modified:
    - src/db/schema.ts
    - next.config.ts
    - package.json

key-decisions:
  - "Sharp for EXIF stripping with .rotate() for auto-orientation before metadata removal"
  - "Re-upload processed image to UploadThing and delete original for clean storage"
  - "Design table uses submitterToken for anonymous identification"

patterns-established:
  - "UploadThing onUploadComplete: fetch -> Sharp process -> re-upload -> delete original"
  - "Design CRUD in lib/designs.ts, Server Actions in actions/design-actions.ts"

requirements-completed: [SUB-01, SUB-03]

# Metrics
duration: 2min
completed: 2026-03-22
---

# Phase 02 Plan 01: UploadThing & Schema Setup Summary

**UploadThing file upload with Sharp EXIF stripping for anonymous submissions, designs table in SQLite, and CRUD operations with Server Actions**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-22T18:00:42Z
- **Completed:** 2026-03-22T18:02:37Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments
- Installed UploadThing, Sharp, and react-photo-view packages
- Created designs table with imageUrl, submitterName, submitterToken, submittedAt columns
- Built UploadThing file router with EXIF metadata stripping via Sharp (SUB-03 compliance)
- Implemented Design CRUD operations and Server Actions with cache revalidation

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and add designs table** - `30e5207` (feat)
2. **Task 2: Create UploadThing file router with EXIF stripping** - `5d3bf22` (feat)
3. **Task 3: Create design CRUD operations and Server Actions** - `f7aae57` (feat)

## Files Created/Modified
- `src/db/schema.ts` - Added designs table schema
- `src/app/api/uploadthing/core.ts` - File router with designUploader endpoint and EXIF stripping
- `src/app/api/uploadthing/route.ts` - GET/POST route handlers
- `src/lib/uploadthing.ts` - Typed UploadDropzone and UploadButton exports
- `src/lib/designs.ts` - Design CRUD operations (createDesign, getDesigns, deleteDesign, etc.)
- `src/actions/design-actions.ts` - Server Actions for design mutations
- `next.config.ts` - Added UploadThing image domains (utfs.io, *.ufs.sh)
- `package.json` - Added uploadthing, @uploadthing/react, sharp, react-photo-view

## Decisions Made
- Used Sharp's `.rotate()` before `.toBuffer()` to auto-orient images based on EXIF orientation tag before stripping all metadata
- Re-upload processed image to UploadThing and delete original file to save storage and ensure only clean images persist
- Design table uses submitterToken field for anonymous identification without user accounts

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- drizzle-kit push required DATABASE_URL environment variable explicitly set (fixed by running with `DATABASE_URL=file:local.db`)

## User Setup Required

**External services require manual configuration.** UploadThing requires API keys:
- `UPLOADTHING_TOKEN` - Get from https://uploadthing.com/dashboard after creating an app
- Add to `.env.local` for local development

## Next Phase Readiness
- UploadThing endpoint ready for upload UI integration
- Design CRUD operations ready for gallery and admin features
- Typed components (UploadDropzone, UploadButton) exported for use in UI

---
*Phase: 02-submission-system*
*Completed: 2026-03-22*

## Self-Check: PASSED

All files created and commits verified:
- src/db/schema.ts - FOUND
- src/app/api/uploadthing/core.ts - FOUND
- src/app/api/uploadthing/route.ts - FOUND
- src/lib/uploadthing.ts - FOUND
- src/lib/designs.ts - FOUND
- src/actions/design-actions.ts - FOUND
- Commit 30e5207 - FOUND
- Commit 5d3bf22 - FOUND
- Commit f7aae57 - FOUND
