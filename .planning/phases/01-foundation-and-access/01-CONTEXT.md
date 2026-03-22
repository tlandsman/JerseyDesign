# Phase 1: Foundation and Access - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up the app foundation: database schema, phase state machine, and access control. Users can open a shared link and see the app. Admin has a separate URL to access controls. The app tracks which phase it's in (Submit, Round 1, Round 2, Results).

</domain>

<decisions>
## Implementation Decisions

### Landing Experience
- **D-01:** Phase-aware landing — different hero message based on current phase (e.g., "Submit Your Designs!" during submission, "Vote for Your Favorite!" during voting)
- **D-02:** Hero banner style — big, bold phase message at top with the relevant action below
- **D-03:** Prominent team branding — team name "Primed" in header, visible on all pages

### Admin Access
- **D-04:** Separate admin URL — admin accesses controls via a different path (e.g., /admin) that regular users don't know
- **D-05:** No authentication — anyone with the admin URL can access controls (admin just keeps URL private)
- **D-06:** Admin sees user view + controls — admin URL shows the same content users see, plus admin controls overlaid

### Claude's Discretion
- Admin control placement (dedicated panel, floating controls, sidebar — whatever works best)
- Phase indicator styling details
- Error state handling
- Loading states

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and in REQUIREMENTS.md (ACC-01, ACC-02).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — greenfield project

### Established Patterns
- None yet — this phase establishes the foundation

### Integration Points
- This phase creates the base that Phases 2 and 3 build on

</code_context>

<specifics>
## Specific Ideas

- Team name is "Primed" — use this in the app header
- Phase messages should be encouraging and clear (teammates shouldn't need instructions)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-and-access*
*Context gathered: 2026-03-22*
