# Phase 3: Voting and Results - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-22
**Phase:** 03-voting-and-results
**Areas discussed:** Voting interaction, Vote confirmation UX, Results display, Round state messaging

---

## Voting Interaction

### Selection Method

| Option | Description | Selected |
|--------|-------------|----------|
| Tap to rank in sequence (Recommended) | First tap = 1st choice, second tap = 2nd choice, third tap = 3rd choice. Simple, mobile-friendly. | ✓ |
| Number buttons on each card | Each design card has 1/2/3 buttons. User clicks the number to assign that rank. | |
| Drag-and-drop to reorder | User drags designs into a ranking zone. Desktop-friendly but harder on mobile. | |

**User's choice:** Tap to rank in sequence
**Notes:** Mobile-friendly approach aligns with team context (teammates accessing via phone links)

### Rank Badge Display

| Option | Description | Selected |
|--------|-------------|----------|
| Large overlay badge (Recommended) | Big circled number (1, 2, 3) overlaid on the image. | ✓ |
| Corner badge like 'Your design' | Small badge in corner, similar to existing indicator. | |
| Border color + small number | Colored border with small rank number. | |

**User's choice:** Large overlay badge
**Notes:** Prominent visibility prioritized over subtle styling

### Unranking Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Remove that rank, shift others up (Recommended) | Tapping #2 removes it, #3 becomes #2. | ✓ |
| Just remove, don't shift | Tapping #2 removes it, #3 stays as #3. | |
| Show small 'X' button to remove | Explicit remove button on ranked cards. | |

**User's choice:** Remove and shift up
**Notes:** Clean and intuitive behavior

### Instructions

| Option | Description | Selected |
|--------|-------------|----------|
| Brief inline instruction (Recommended) | Small text above gallery that updates as user selects. | ✓ |
| Progress indicator only | Just show '0/3 selected'. | |
| Detailed step-by-step | More hand-holding. | |

**User's choice:** Brief inline instruction
**Notes:** Balance between guidance and not being patronizing

---

## Vote Confirmation UX

### Confirmation Format

| Option | Description | Selected |
|--------|-------------|----------|
| Inline summary + submit button (Recommended) | Summary card below gallery with Submit button. No modal. | ✓ |
| Modal confirmation | Modal pops up after selecting 3. | |
| Full-page review | Navigate to dedicated review page. | |

**User's choice:** Inline summary + submit button
**Notes:** Keeps flow simple without extra navigation

### Reordering in Summary

| Option | Description | Selected |
|--------|-------------|----------|
| No reorder, just tap to change (Recommended) | To change, user taps designs in gallery. | ✓ |
| Drag to reorder in summary | Summary has drag handles. | |
| Swap buttons in summary | Up/down arrows to swap positions. | |

**User's choice:** No reorder in summary
**Notes:** Keeps logic simple, gallery is the source of truth

### Post-Submit Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Success message + show 'Voted' state (Recommended) | Toast + gallery stays visible but voting UI disabled. | ✓ |
| Redirect to waiting page | Navigate to 'Thanks for voting!' page. | |
| Confetti celebration | Success toast plus confetti animation. | |

**User's choice:** Success message + voted state
**Notes:** User can still see designs but can't change vote

### Vote Finality

| Option | Description | Selected |
|--------|-------------|----------|
| No changes after submit (Recommended) | Vote is final. Clear messaging about finality. | ✓ |
| Allow changes until round ends | User can re-vote anytime during voting phase. | |

**User's choice:** No changes after submit
**Notes:** Simplest to implement, prevents gaming

---

## Results Display

### Round 1 Results

| Option | Description | Selected |
|--------|-------------|----------|
| Show 3 finalists prominently (Recommended) | Big cards for advancing designs, eliminated shown smaller. | ✓ |
| Full ranking with elimination details | All designs ranked with RCV explanation. | |
| Just the 3 finalists, hide eliminated | Only show advancing designs. | |

**User's choice:** Show 3 finalists prominently
**Notes:** Focus on what's next while keeping context

### RCV Breakdown Detail

| Option | Description | Selected |
|--------|-------------|----------|
| Simple summary (Recommended) | 'These 3 designs received the most support...' | ✓ |
| Expandable breakdown | Simple summary with 'How was this calculated?' link. | |
| Full step-by-step | Show each elimination round. | |

**User's choice:** Simple summary
**Notes:** Keep it accessible, not an election education platform

### Winner Display

| Option | Description | Selected |
|--------|-------------|----------|
| Hero winner card (Recommended) | Big card with 'Our New Jersey Design!' header. | ✓ |
| Podium layout | 1st/2nd/3rd as visual podium. | |
| Winner only, no runners-up | Just show winning design. | |

**User's choice:** Hero winner card
**Notes:** Celebratory but not over-the-top

### Vote Counts

| Option | Description | Selected |
|--------|-------------|----------|
| Show vote counts (Recommended) | 'Winner received support from 8 voters.' | ✓ |
| Keep it abstract | No numbers, just 'selected through RCV.' | |
| Show detailed vote breakdown | First-choice votes, second-choice votes, etc. | |

**User's choice:** Show vote counts
**Notes:** Gives sense of participation without revealing individual votes

---

## Round State Messaging

### Between Rounds

| Option | Description | Selected |
|--------|-------------|----------|
| Results shown immediately (Recommended) | When admin advances, users see results right away. | ✓ |
| 'Votes being tallied' state | Brief loading/processing message. | |
| Admin manually reveals | Results hidden until admin clicks reveal. | |

**User's choice:** Results shown immediately
**Notes:** Admin controls timing, no artificial drama

### Missed Vote Handling

| Option | Description | Selected |
|--------|-------------|----------|
| See results like everyone else (Recommended) | No special messaging or penalties. | ✓ |
| Show 'You didn't vote' notice | Subtle reminder message. | |
| Hide results until next round | Non-voters can't see results. | |

**User's choice:** See results like everyone else
**Notes:** Non-judgmental, inclusive approach

### Hero Messages

| Option | Description | Selected |
|--------|-------------|----------|
| Action-oriented messages (Recommended) | 'Vote for Your Favorites!', 'Pick the Winner!', etc. | ✓ |
| Neutral phase labels | 'Round 1 Voting', 'Final Round', etc. | |
| Question format | 'Which designs should advance?', etc. | |

**User's choice:** Action-oriented messages
**Notes:** Matches friendly, encouraging team tone

### Admin Reset

| Option | Description | Selected |
|--------|-------------|----------|
| Reset current round only (Recommended) | Clears votes for current round. | |
| Reset all voting data | Clears all votes from all rounds. | |
| Both options available | Separate 'Reset Round' and 'Reset All' buttons. | ✓ |

**User's choice:** Both options available
**Notes:** Maximum flexibility for admin

---

## Claude's Discretion

- Exact styling of rank overlay badges
- Loading states during vote submission
- Animation/transition details
- Mobile responsive breakpoints
- Error state handling

## Deferred Ideas

None — discussion stayed within phase scope
