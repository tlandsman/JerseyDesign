# Feature Research

**Domain:** Image-based voting app for design selection (ranked choice voting)
**Researched:** 2026-03-22
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Image upload with preview | Submitters need to see what they're uploading before committing | LOW | Standard file input with preview, max file size validation |
| Gallery view of all submissions | Voters need to see all options to make informed choices | LOW | Grid layout, consistent image sizing/cropping |
| Clear voting instructions | RCV is unfamiliar to most; confusion causes dropout | LOW | Brief explanation of "rank your top 3" with visual cues |
| Drag-and-drop ranking | Industry standard for RCV (RankedVote, OpaVote, Slido) | MEDIUM | Touch-friendly for mobile, clear visual feedback |
| Vote confirmation feedback | Users need assurance their vote was recorded | LOW | Success message, visual state change |
| Results display after round ends | Core value proposition; users want to see outcomes | MEDIUM | Show winner, vote distribution, elimination rounds |
| Mobile-responsive design | 60%+ of casual users are on mobile | MEDIUM | Touch-friendly controls, readable on small screens |
| Shareable link access | Project requirement; frictionless team participation | LOW | URL-based access without authentication |
| Phase indicators | Users need to know current state (Submit/Vote/Results) | LOW | Visual banner or status indicator |
| Image zoom/fullscreen | Designs have details; small thumbnails insufficient | LOW | Click to enlarge, modal or lightbox pattern |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Anonymous submissions | Reduces bias, designs judged on merit (per PROJECT.md) | LOW | Hide submitter identity until results |
| Two-round elimination | More thorough than single-round; builds suspense | MEDIUM | Round 1 narrows field, Round 2 decides winner |
| RCV result visualization | Show elimination rounds, vote redistribution (like RankedVote) | HIGH | Animated or step-by-step breakdown |
| Admin phase control | Manual pacing fits team schedules (per PROJECT.md) | LOW | Simple admin panel with phase advance buttons |
| "My ballot" review | Let voters see/edit their rankings before round closes | MEDIUM | Persistent ballot state, edit capability |
| Submission count per person limit | Prevents one person flooding with options (max 2 per PROJECT.md) | LOW | Track by browser/device identifier |
| Round 1 finalist reveal | Suspense builder before final vote | LOW | Announce which 3 advance to final round |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Real-time voting results | "See who's winning" excitement | Creates bandwagon/strategic voting, undermines honest preferences | Show results only after round closes |
| Comments on designs | "Discuss the options" | Devolves into criticism, creates drama, biases voting | Keep it voting-only; discussions happen elsewhere (Slack, in-person) |
| User accounts/login | "Track who voted" | Friction kills participation for casual one-time use | Link-based access; optional name entry for attribution |
| Live vote counts | "How many people voted?" | Pressures late voters, reveals partial results | Show participation count only after round closes |
| Revision/re-upload of submissions | "I want to improve my design" | Complicates voting if designs change mid-round | Submissions are final; submitter can withdraw and resubmit during submit phase only |
| Mandatory ranking of all options | "Force full engagement" | User fatigue with 10+ options; increases abandonment | Rank top 3 only (or top N configurable) |
| Complex voting algorithms (Condorcet, Borda) | "More mathematically fair" | Most users don't understand; explanation overhead | Stick with standard IRV (Instant Runoff Voting) which is intuitive |
| Email notifications | "Remind people to vote" | Requires email collection, spam concerns, complexity | Admin announces via team's existing channels (Slack, group text) |
| Design upload from external URLs | "Link to my Figma/Google Drive" | Broken links, permission issues, inconsistent display | Require actual image file upload |

## Feature Dependencies

```
[Gallery View]
    └──requires──> [Image Upload]
                       └──requires──> [File Storage]

[Vote Submission]
    └──requires──> [Gallery View]
    └──requires──> [Drag-and-Drop Ranking UI]

[Results Display]
    └──requires──> [RCV Calculation Engine]
                       └──requires──> [Vote Submission]

[Two-Round System]
    └──requires──> [RCV Calculation Engine]
    └──requires──> [Admin Phase Control]
    └──requires──> [Finalist Selection Logic]

[Admin Phase Control]
    └──requires──> [Phase State Management]

[Anonymous Submissions] ──conflicts──> [Submitter Attribution During Voting]

[My Ballot Review] ──enhances──> [Vote Submission]
```

### Dependency Notes

- **Vote Submission requires Gallery View:** Voters must see designs to rank them
- **Results Display requires RCV Calculation:** Can't show results without computing them
- **Two-Round System requires Admin Phase Control:** Manual advancement between rounds
- **Anonymous Submissions conflicts with Submitter Attribution:** Can only reveal identity after voting ends
- **My Ballot Review enhances Vote Submission:** Optional but improves voter confidence

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] Image upload with preview — core submission flow
- [ ] Gallery view with image zoom — voters must see options
- [ ] Phase state (Submit/Round1/Round2/Results) — tracks progress
- [ ] Admin phase advance controls — manual pacing
- [ ] Drag-and-drop ranking (top 3) — RCV ballot interface
- [ ] Vote submission with confirmation — captures votes
- [ ] RCV calculation (IRV algorithm) — determines winner
- [ ] Results display (winner + vote breakdown) — shows outcome
- [ ] Mobile-responsive layout — most users on phones
- [ ] Anonymous submissions (reveal after final results) — reduces bias

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] RCV visualization (elimination rounds animation) — if users want to understand the math
- [ ] "My ballot" review/edit — if users request ability to change votes before deadline
- [ ] Submission count enforcement (2 per device) — if people abuse unlimited submissions
- [ ] Round 1 finalist announcement page — if two-round suspense is valued

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Reusable for multiple seasons — if team wants to use again
- [ ] Multiple concurrent polls — if other teams want to use
- [ ] Optional user identification — if team wants accountability
- [ ] Export results (PDF/image) — if team wants records

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Image upload with preview | HIGH | LOW | P1 |
| Gallery view | HIGH | LOW | P1 |
| Phase indicators | HIGH | LOW | P1 |
| Drag-and-drop ranking | HIGH | MEDIUM | P1 |
| Vote confirmation | HIGH | LOW | P1 |
| RCV calculation | HIGH | MEDIUM | P1 |
| Results display | HIGH | MEDIUM | P1 |
| Mobile-responsive | HIGH | MEDIUM | P1 |
| Admin phase control | HIGH | LOW | P1 |
| Anonymous submissions | MEDIUM | LOW | P1 |
| Image zoom/fullscreen | MEDIUM | LOW | P1 |
| Two-round system | MEDIUM | MEDIUM | P1 |
| My ballot review | MEDIUM | MEDIUM | P2 |
| RCV visualization | LOW | HIGH | P3 |
| Submission limits | LOW | MEDIUM | P2 |
| Finalist announcement | LOW | LOW | P2 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | RankedVote | PollTab | OpaVote | Slido | Our Approach |
|---------|------------|---------|---------|-------|--------------|
| Image support | No (text-based) | Yes | No | No | Yes (core requirement) |
| RCV/Ranked voting | Yes (core) | No | Yes (core) | Yes (ranking polls) | Yes (IRV two-round) |
| Anonymous voting | Yes | Optional | Yes | Yes | Yes (default) |
| No registration | Yes | Yes | Partial | Partial | Yes (link access only) |
| Mobile-friendly | Yes | Yes | Yes | Yes | Yes (required) |
| Visual results | Yes (animated) | Basic | Yes (detailed) | Basic | Basic (v1), animated (v2) |
| Phase control | N/A | Manual | Manual | Manual | Manual admin control |
| Design contest focus | No | Partial | No | No | Yes (our niche) |

**Gap in market:** No existing tool combines image-based submissions with ranked choice voting in a no-registration, team-friendly package. RankedVote has great RCV but no images. PollTab has images but no RCV. This app fills that gap.

## Sources

- RankedVote (rankedvote.co) — RCV interface patterns, ballot types, result visualization
- PollTab (polltab.com) — Image poll features, vote security, result timing
- OpaVote (opavote.com) — RCV methods, transparent counting, drag-and-drop UX
- ElectionBuddy (electionbuddy.com) — Voting methods catalog, security features
- Slido (slido.com) — Poll types, ranking features, real-time engagement
- Challonge (challonge.com) — Tournament/bracket patterns, multi-round systems
- Tricider (tricider.com) — Group decision-making, idea collection with voting
- 99designs — Design contest patterns, blind judging, submission management
- Crowdsignal — Survey features, conditional logic, multimedia support
- SurveyPlanet — Image-choice questions, branching logic

---
*Feature research for: Jersey Design Voter*
*Researched: 2026-03-22*
