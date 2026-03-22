# Jersey Design Voter

## What This Is

A web app for an ultimate frisbee team to collaboratively choose their jersey design. Team members submit design photos, then vote in two rounds of ranked choice voting to select the winner.

## Core Value

Fair, democratic jersey selection — every team member's voice counts equally through ranked choice voting.

## Requirements

### Validated

- [x] Team members access the app via shared link (no accounts) — *Phase 1*
- [x] Users can upload design photos (max 2 per person) — *Phase 2*
- [x] Submissions are anonymous during voting — *Phase 2*
- [x] Admin can manually advance phases (Submit → Round 1 → Round 2 → Results) — *Phase 1*

### Active
- [ ] Round 1: Voters rank their top 3 designs, RCV narrows to 3 finalists
- [ ] Round 2: Voters rank the 3 finalists, RCV picks the winner
- [ ] Results shown after each round ends (not live)
- [ ] Final winner is clearly displayed

### Out of Scope

- Individual user accounts/login — shared link is enough for a small team
- Automatic deadlines — admin controls pacing manually
- Live voting results — reveals only after round ends
- Comments/discussion on designs — keep it simple, voting only

## Context

- Ultimate frisbee team with 10-15 members
- One-time use case (this season's jerseys)
- Needs to be simple enough that teammates just click a link and participate
- Captain (you) acts as admin to control phase transitions

## Constraints

- **Access**: No authentication — anyone with the link can participate
- **Simplicity**: Minimal friction, teammates shouldn't need instructions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Ranked choice voting for both rounds | Fairer than simple plurality, captures preference depth | — Pending |
| Anonymous submissions during voting | Reduces bias, designs judged on merit | — Pending |
| Manual phase control | Admin flexibility, team schedules vary | — Pending |
| Max 2 submissions per person | Enough variety without overwhelming voters | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 after Phase 2 completion*
