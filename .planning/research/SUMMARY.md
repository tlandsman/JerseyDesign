# Project Research Summary

**Project:** Jersey Design Voter
**Domain:** Image-based voting application with ranked choice voting
**Researched:** 2026-03-22
**Confidence:** HIGH

## Executive Summary

This is a small-team voting application for selecting jersey designs through a two-round ranked choice voting process. The domain is well-understood: image upload with gallery display, RCV ballot collection, and phased voting rounds controlled by an admin. The recommended approach is a standard Next.js full-stack application with SQLite (Turso) for data persistence and UploadThing for image storage. This stack is appropriate for the 10-15 person team size and avoids over-engineering.

The key architectural insight is that the entire application behavior is gated by phase state (SUBMIT, VOTE_ROUND_1, VOTE_ROUND_2, RESULTS). Every route and API endpoint must check current phase before allowing actions. The RCV algorithm itself is simple (~20 lines of code) and should be implemented directly rather than pulling in a library. Anonymous submissions require stripping EXIF metadata at upload time, not just hiding database associations.

The primary risks are: (1) vote integrity without authentication - mitigated through layered browser/session tracking and accepting social accountability within a trusted team, (2) file upload security - mitigated through magic byte validation, file size limits, and metadata stripping, and (3) confusing RCV UI leading to ballot exhaustion - mitigated through drag-and-drop ranking with clear instructions. All three must be addressed in the initial implementation phases, not as afterthoughts.

## Key Findings

### Recommended Stack

The stack prioritizes simplicity and zero-config deployment. Next.js 16.2.x with App Router provides the full-stack framework with server components and API routes. Turso (hosted SQLite) is ideal for this scale - no connection pooling needed, generous free tier, and Drizzle ORM provides type-safe queries. UploadThing handles image uploads with a purpose-built Next.js adapter, avoiding AWS complexity.

**Core technologies:**
- **Next.js 16.2.x + React 19.2.x:** Full-stack framework with App Router, server components, built-in image optimization
- **TypeScript 5.9.x:** Type safety across the entire codebase, catches errors at compile time
- **Turso (SQLite) + Drizzle ORM:** Zero-connection-management database with type-safe queries, perfect for small team apps
- **UploadThing:** Handles image uploads without AWS/S3 complexity, returns CDN URLs
- **Tailwind CSS 4.2.x + shadcn/ui:** Utility-first styling with accessible component primitives
- **Vercel:** Zero-config deployment with global CDN

**Avoid:** Create React App (deprecated), Express backend (unnecessary), MongoDB (overkill), Firebase (vendor lock-in), Redux (massive overkill for app state).

### Expected Features

**Must have (table stakes):**
- Image upload with preview and validation
- Gallery view with zoom/fullscreen capability
- Phase indicators showing current state
- Drag-and-drop ranking interface (top 3)
- Vote confirmation with ballot summary
- Mobile-responsive layout (60%+ users on mobile)
- RCV calculation with results display
- Admin phase advance controls
- Anonymous submissions (reveal after results)

**Should have (differentiators):**
- Two-round elimination system (narrows field, builds suspense)
- "My ballot" review and edit capability
- Finalist announcement page between rounds

**Defer (v2+):**
- RCV visualization with elimination animation (HIGH complexity)
- Reusability for multiple seasons
- Multiple concurrent polls
- Export results to PDF/image

**Anti-features to avoid:** Live vote counts (creates bandwagon effect), comments on designs (creates drama), user accounts (friction kills participation), email notifications (complexity without value).

### Architecture Approach

The application follows a phase-gated UI pattern where all views check current phase before rendering. Four distinct phases flow linearly: SUBMIT -> VOTE_ROUND_1 -> VOTE_ROUND_2 -> RESULTS. Admin manually advances phases through a simple control panel. Image uploads use presigned URLs (client uploads directly to storage, server only records metadata). Votes are stored as complete ranked ballots, not aggregated counts, enabling proper RCV recounts.

**Major components:**
1. **Phase State Machine** - Single source of truth for app state, enforced server-side
2. **Design Service** - Upload validation, EXIF stripping, image storage integration
3. **Vote Service** - Ballot validation, duplicate vote prevention, RCV algorithm execution
4. **Admin Controls** - Phase transitions with proper data locking

**Build order:** Database schema and phase machine first (everything depends on it), then image storage, then design submission, then voting UI, then RCV/results, finally admin controls and polish.

### Critical Pitfalls

1. **Double voting without authentication** - Use layered tracking (browser fingerprint + session token + IP rate limiting). Accept that a trusted 15-person team has social accountability. Monitor vote counts vs team size.

2. **File upload security vulnerabilities** - Validate magic bytes (not just extensions), allowlist PNG/JPG/WEBP only, 10MB limit, rename to UUIDs, strip EXIF metadata, store on separate CDN.

3. **Anonymous submissions accidentally exposed** - EXIF data contains photographer name, GPS, camera info. Must strip ALL metadata at upload time. Randomize display order (not upload order).

4. **Confusing RCV UI causing ballot exhaustion** - Use drag-and-drop (not dropdowns), show clear "1 = favorite" instructions, validate minimum rankings, display exhausted ballot count in results.

5. **Phase transition data corruption** - Reject late submissions/votes with clear error, use database transactions for transitions, lock voting data before RCV calculation.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation and Data Model
**Rationale:** Everything depends on phase state and database schema. The phase machine is the backbone of the entire application.
**Delivers:** Database schema (designs, votes, app_state tables), Drizzle ORM setup, phase state machine with transition logic, basic Next.js app structure.
**Addresses:** Phase indicators, core infrastructure for all subsequent features.
**Avoids:** Phase transition corruption pitfall - designed correctly from the start.

### Phase 2: Image Upload System
**Rationale:** Designs must exist before anyone can view or vote on them. Upload security is critical and must be right from the start.
**Delivers:** UploadThing integration, file validation (magic bytes, size limits), EXIF stripping, image preview UI, design record creation.
**Addresses:** Image upload with preview, anonymous submissions (metadata stripped).
**Avoids:** File upload security vulnerabilities, anonymous leak through EXIF data, display inconsistency across devices.

### Phase 3: Gallery and Submission Flow
**Rationale:** Once uploads work, need to display them and create the submission experience.
**Delivers:** Gallery grid view, image zoom/fullscreen modal, responsive layout, phase-aware submission page (disabled when not in SUBMIT phase).
**Addresses:** Gallery view, image zoom, mobile-responsive design, shareable link access.
**Avoids:** Image display inconsistencies - responsive sizing implemented here.

### Phase 4: Voting Interface
**Rationale:** Core user interaction. Requires designs to exist. RCV UI clarity is critical for vote validity.
**Delivers:** Drag-and-drop ranking component, ballot state management, vote submission API, duplicate vote prevention, ballot confirmation UI.
**Addresses:** Drag-and-drop ranking, vote confirmation, clear voting instructions.
**Avoids:** Confusing RCV UI (clarity prioritized), double voting (tracking implemented).

### Phase 5: RCV Calculation and Results
**Rationale:** Cannot show results until votes exist. Algorithm is straightforward but must handle edge cases.
**Delivers:** IRV algorithm implementation, round 1 finalist selection, round 2 winner determination, results display with vote breakdown, exhausted ballot count.
**Addresses:** RCV calculation, results display, two-round system.
**Avoids:** Ballot exhaustion confusion - display exhausted count in results.

### Phase 6: Admin Controls and Polish
**Rationale:** Phase advancement is admin-triggered. Polish comes last after core flow works.
**Delivers:** Admin page with phase advance buttons, token-based admin access, loading states, error handling, final mobile testing.
**Addresses:** Admin phase control, phase transitions.
**Avoids:** Phase transition corruption - proper locking and validation.

### Phase Ordering Rationale

- **Foundation first:** Phase state machine is architectural foundation - all routes check phase before acting
- **Upload before gallery:** Cannot display what doesn't exist
- **Gallery before voting:** Voters must see designs to rank them
- **Voting before results:** RCV algorithm requires ballots to process
- **Admin last:** Phase transitions matter only after the phases themselves work
- **Security throughout:** Each phase implements its own security (upload validation in Phase 2, vote integrity in Phase 4)

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Image Upload):** UploadThing integration specifics, EXIF stripping library choice - may need brief API research
- **Phase 4 (Voting Interface):** Drag-and-drop library selection for touch-friendly ranking - dnd-kit vs alternatives

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Drizzle schema, Next.js App Router - extremely well documented
- **Phase 3 (Gallery):** Image grid, modal - standard React patterns
- **Phase 5 (RCV):** Algorithm is documented in STACK.md research - implement directly
- **Phase 6 (Admin):** Simple CRUD patterns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official docs verified for Next.js 16.2, React 19.2, Drizzle 1.0, Tailwind 4.2. Version compatibility confirmed. |
| Features | HIGH | Competitive analysis of RankedVote, PollTab, OpaVote provides clear feature landscape. Gap in market validated. |
| Architecture | HIGH | Phase-gated UI and presigned upload patterns well-documented. Build order derived from clear dependencies. |
| Pitfalls | MEDIUM-HIGH | OWASP file upload guidance is authoritative. RCV ballot exhaustion documented in Ballotpedia. Vote integrity without auth is a known tradeoff. |

**Overall confidence:** HIGH

### Gaps to Address

- **Browser fingerprinting library choice:** Research indicates fingerprinting is needed but doesn't specify library. FingerprintJS has free tier. Address during Phase 1 planning.
- **EXIF stripping implementation:** Sharp library recommended but integration with UploadThing pipeline needs verification. Address during Phase 2 planning.
- **Tie-breaker logic for RCV:** Research notes this is often missing. Need to define behavior for exact ties (random? first uploaded?). Address during Phase 5 planning.

## Sources

### Primary (HIGH confidence)
- Next.js 16.2 documentation (nextjs.org/docs) - App Router, API routes, Image component
- Drizzle ORM documentation (orm.drizzle.team) - Schema definition, query patterns
- UploadThing documentation (docs.uploadthing.com) - Next.js App Router adapter
- OWASP File Upload Cheat Sheet (cheatsheetseries.owasp.org) - Security validation patterns
- Vercel deployment documentation (vercel.com/docs) - Hosting, Blob storage

### Secondary (MEDIUM confidence)
- RankedVote (rankedvote.co) - RCV UX patterns, ballot interface design
- Turso documentation (turso.tech) - SQLite hosting, Drizzle integration
- Tailwind CSS v4 documentation - Setup differences from v3
- Sharp library documentation - Image processing, EXIF stripping

### Tertiary (LOW confidence)
- Ballotpedia RCV analysis - Ballot exhaustion statistics (general, not app-specific)
- Community discussions on fingerprinting approaches (tradeoffs between accuracy and privacy)

---
*Research completed: 2026-03-22*
*Ready for roadmap: yes*
