# Phase 3: Voting and Results - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Enable team members to vote via ranked choice (tap to select top 3), tally votes using RCV algorithm for two rounds, display results after each round, and provide admin controls for phase advancement and vote reset.

</domain>

<decisions>
## Implementation Decisions

### Voting Interaction
- **D-01:** Tap to rank in sequence — first tap = 1st choice, second tap = 2nd choice, third tap = 3rd choice. Mobile-friendly.
- **D-02:** Large overlay badge shows rank number (1, 2, 3) on selected designs. Impossible to miss which are ranked.
- **D-03:** Tap ranked design to unrank it. Remaining ranks shift up (removing #2 makes #3 become #2).
- **D-04:** Brief inline instruction above gallery: "Tap designs to rank your top 3 choices". Updates as user makes selections.

### Vote Confirmation
- **D-05:** Inline summary card below gallery shows ranked selections: "Your vote: #1 Design 5, #2 Design 3, #3 Design 8" with Submit button. No modal.
- **D-06:** No reorder in summary — to change, user taps designs in gallery to unrank/re-rank.
- **D-07:** After submit: success toast "Vote submitted!" Gallery stays visible but voting UI disabled. Summary shows "You voted for: ..." as read-only.
- **D-08:** Vote is final — no changes after submit. Clear messaging: "Once submitted, your vote cannot be changed."

### Results Display
- **D-09:** Round 1 results: 3 finalists shown prominently with big cards. Eliminated designs shown smaller below or collapsed.
- **D-10:** Simple RCV summary: "These 3 designs received the most support through ranked choice voting." No round-by-round details.
- **D-11:** Final winner: Hero winner card with "Our New Jersey Design!" header. Winner image large. 2nd and 3rd shown smaller below.
- **D-12:** Show vote counts: "Winner received support from 8 voters." Gives sense of participation without revealing who voted for what.

### Round State Messaging
- **D-13:** Results shown immediately when admin advances phase. No "tallying" animation or manual reveal.
- **D-14:** Users who didn't vote see results like everyone else. No special messaging or penalties.
- **D-15:** Action-oriented hero messages: Round 1: "Vote for Your Favorites!" Round 2: "Pick the Winner!" Results: "We Have a Winner!"
- **D-16:** Admin reset options: "Reset Round" (current round only) and "Reset All" (all voting data) as separate buttons with confirmation dialogs.

### Claude's Discretion
- Exact styling of rank overlay badges
- Loading states during vote submission
- Animation/transition details
- Mobile responsive breakpoints for results display
- Error state handling

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and in REQUIREMENTS.md (VOTE-01 through VOTE-06, RES-01 through RES-04, RES-06).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/design-card.tsx` — Card component with isAdmin/isOwnDesign props. Extend for voting state.
- `src/components/design-gallery.tsx` — Gallery grid, already sorts by ID for consistent numbering.
- `src/components/design-lightbox.tsx` — PhotoProvider wrapper for image viewing.
- `src/components/phase-hero.tsx` — Phase-aware hero messaging. Add Round 1/Round 2/Results messages.
- `src/components/admin-controls.tsx` — Admin controls pattern. Add phase advance and reset buttons.
- `src/components/submitter-provider.tsx` — Browser token tracking. Reuse for vote tracking.

### Established Patterns
- Phase state machine in `src/lib/phase.ts` — extend for Round1, Round2, Results phases
- Server Actions for mutations (`src/actions/`) — use for vote submission
- Token-based user tracking via localStorage — reuse for duplicate vote prevention
- Admin overlay pattern — admin sees user view + controls

### Integration Points
- Database needs `votes` table (voter_token, round, first_choice, second_choice, third_choice)
- Landing page needs voting UI during Round 1/Round 2 phases
- Landing page needs results display during Results phase
- Admin page needs phase advance buttons and reset controls

</code_context>

<specifics>
## Specific Ideas

- Rank badges should be large and prominent — users shouldn't have to squint to see what they've selected
- "Vote for Your Favorites!" messaging matches the friendly, team-oriented tone
- Keep RCV explanation simple — this is a small team tool, not an election education platform

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-voting-and-results*
*Context gathered: 2026-03-22*
