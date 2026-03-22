# Phase 2: Submission System - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Team members can upload jersey designs (max 2 per person) that are displayed anonymously in a gallery. Images have EXIF metadata stripped. Admin can see submitter names and delete designs.

</domain>

<decisions>
## Implementation Decisions

### Upload Experience
- **D-01:** Drag-and-drop zone with "click to browse" fallback — modern feel, works on desktop and mobile
- **D-02:** Preview with confirm before upload — show thumbnail after selecting, user clicks 'Submit' to finalize
- **D-03:** Counter display for limit — "You have submitted 1 of 2 designs", upload area visual change when full
- **D-04:** Progress bar during upload + success toast on completion

### Gallery Layout
- **D-05:** Uniform grid layout — same-size cards, images cropped/fitted to consistent aspect ratio
- **D-06:** 3 designs per row on desktop (responsive, fewer on mobile)
- **D-07:** Lightbox/modal on click — opens full-size image in overlay for detailed viewing

### Submitter Tracking
- **D-08:** Name entry on upload — user types their name when uploading, stored with design
- **D-09:** Remember name in browser — pre-fill from localStorage on return visits
- **D-10:** Honor system for 2-design limit — show count but don't hard block, admin can delete extras
- **D-11:** Subtle indicator for own designs — small badge or border visible only to the submitter ("Your design")

### Anonymous Display
- **D-12:** Image + submission number shown to regular users — "Design #5" helps reference in conversation
- **D-13:** Submitter name visible on card for admin — easy to scan who submitted what
- **D-14:** Individual delete button on each card for admin
- **D-15:** "Delete All" button for admin with confirmation dialog — for clearing test data quickly

### Claude's Discretion
- Empty state design (when no designs submitted yet)
- Exact styling of "Your design" indicator
- Mobile responsive breakpoints
- Error state handling

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and in REQUIREMENTS.md (SUB-01 through SUB-05).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/card.tsx` — Card component for gallery items
- `src/components/ui/button.tsx` — Button component for actions
- `src/components/ui/badge.tsx` — Badge for "Your design" indicator
- `src/components/phase-hero.tsx` — Phase-aware hero messaging (reuse pattern for submission phase message)

### Established Patterns
- Phase state machine in `src/lib/phase.ts` — check `getPhase()` to show/hide upload UI based on current phase
- Admin overlay pattern from Phase 1 — admin sees user view + controls

### Integration Points
- Database schema needs `designs` table (id, image_url, submitter_name, submitted_at)
- Landing page (`src/app/page.tsx`) needs gallery + upload components during "submit" phase
- Admin page (`src/app/admin/page.tsx`) needs delete controls overlaid on gallery

</code_context>

<specifics>
## Specific Ideas

- Submission numbers should be assigned in order of upload (Design #1, #2, etc.)
- "Delete All" is primarily for testing — confirmation should clearly state count ("Delete all 12 designs?")
- Name field should be simple text input, no validation beyond non-empty

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-submission-system*
*Context gathered: 2026-03-22*
