# Phase 3: Voting and Results - Research

**Researched:** 2026-03-22
**Domain:** Ranked Choice Voting UI + Algorithm, React State Management, SQLite Data Modeling
**Confidence:** HIGH

## Summary

Phase 3 implements ranked choice voting with a simple tap-to-rank interaction, RCV tallying algorithm, and results display. The existing codebase provides solid foundations: localStorage-based user tracking (reusable for vote prevention), Server Actions for mutations, Drizzle ORM for SQLite, and component patterns including DesignCard and AdminControls.

The RCV algorithm is straightforward for this use case: users rank top 3 choices, the algorithm counts first-choice votes, eliminates the candidate with fewest votes, redistributes those ballots to their next choice, and repeats until a majority winner or target count is reached. Round 1 narrows to 3 finalists; Round 2 picks 1 winner from those 3.

**Primary recommendation:** Implement RCV algorithm in a pure TypeScript function (`src/lib/rcv.ts`), add a `votes` table to the schema, extend existing components (DesignCard for rank overlay, AdminControls for phase advancement and reset), and add new components for vote confirmation and results display.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Tap to rank in sequence - first tap = 1st choice, second tap = 2nd choice, third tap = 3rd choice. Mobile-friendly.
- **D-02:** Large overlay badge shows rank number (1, 2, 3) on selected designs. Impossible to miss which are ranked.
- **D-03:** Tap ranked design to unrank it. Remaining ranks shift up (removing #2 makes #3 become #2).
- **D-04:** Brief inline instruction above gallery: "Tap designs to rank your top 3 choices". Updates as user makes selections.
- **D-05:** Inline summary card below gallery shows ranked selections: "Your vote: #1 Design 5, #2 Design 3, #3 Design 8" with Submit button. No modal.
- **D-06:** No reorder in summary - to change, user taps designs in gallery to unrank/re-rank.
- **D-07:** After submit: success toast "Vote submitted!" Gallery stays visible but voting UI disabled. Summary shows "You voted for: ..." as read-only.
- **D-08:** Vote is final - no changes after submit. Clear messaging: "Once submitted, your vote cannot be changed."
- **D-09:** Round 1 results: 3 finalists shown prominently with big cards. Eliminated designs shown smaller below or collapsed.
- **D-10:** Simple RCV summary: "These 3 designs received the most support through ranked choice voting." No round-by-round details.
- **D-11:** Final winner: Hero winner card with "Our New Jersey Design!" header. Winner image large. 2nd and 3rd shown smaller below.
- **D-12:** Show vote counts: "Winner received support from 8 voters." Gives sense of participation without revealing who voted for what.
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

### Deferred Ideas (OUT OF SCOPE)
None - discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VOTE-01 | User can rank designs by tapping to select 1st, 2nd, 3rd choice in sequence | VotingGallery component with React state tracking ranked selections; onClick handler on DesignCard |
| VOTE-02 | Selected designs show their rank number (1, 2, 3) after being tapped | Overlay badge on DesignCard using Badge component with absolute positioning |
| VOTE-03 | User sees confirmation screen before submitting vote | Inline VoteSummary component below gallery showing selections with Submit button |
| VOTE-04 | System prevents double voting via browser-based tracking | Reuse SubmitterProvider token pattern; check hasVoted flag in votes table before insert |
| VOTE-05 | Round 1 uses RCV to narrow all submissions to top 3 finalists | RCV algorithm implementation in `src/lib/rcv.ts`; called when admin advances to Round 2 |
| VOTE-06 | Round 2 uses RCV to select single winner from 3 finalists | Same RCV function with target=1 finalist |
| RES-01 | Admin can manually advance phases (Submit -> Round 1 -> Round 2 -> Results) | Extend existing AdminControls with phase advance button; already exists in codebase |
| RES-02 | Results are shown to users after each round ends | ResultsDisplay component shown when phase is round2 (showing round1 results) or results |
| RES-03 | Final winner is clearly displayed with winning design | WinnerDisplay component with hero styling per D-11 |
| RES-04 | RCV elimination breakdown shows how winner was determined | Store RCV rounds in results; display simple summary per D-10/D-12 |
| RES-05 | Admin can delete submitted designs | Already implemented in DesignCard with isAdmin prop |
| RES-06 | Admin can reset voting rounds (clear all votes) | ResetVotesControls component following AdminDesignControls pattern; separate "Reset Round" and "Reset All" buttons per D-16 |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| drizzle-orm | 0.45.1 | Database ORM | Already in project, type-safe queries |
| @libsql/client | 0.17.2 | SQLite driver | Already in project, Turso-compatible |
| sonner | 2.0.7 | Toast notifications | Best-in-class React toast; shadcn recommended |
| lucide-react | 0.577.0 | Icons | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | 4.3.6 | Runtime validation | Already in project; use for vote action validation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom RCV | npm rcv package | Package too specialized; custom is simpler for 3-choice voting |
| Custom toast | react-hot-toast | Sonner has better API and styling; shadcn ecosystem fit |

**Installation:**
```bash
npm install sonner
```

**Version verification:** Verified 2026-03-22
- drizzle-orm: 0.45.1 (matches package.json)
- drizzle-kit: 0.31.10 (matches package.json)
- sonner: 2.0.7 (current on npm)

## Architecture Patterns

### Recommended Project Structure
```
src/
├── actions/
│   ├── vote-actions.ts      # submitVote, resetVotes, resetAllVotes
│   └── phase-actions.ts     # existing + tallyAndAdvance
├── components/
│   ├── voting-gallery.tsx   # Gallery with vote state management
│   ├── vote-summary.tsx     # Inline summary card with submit
│   ├── rank-badge.tsx       # Overlay badge showing 1, 2, 3
│   ├── results-display.tsx  # Round results (finalists or winner)
│   ├── winner-display.tsx   # Hero winner card
│   └── reset-votes-controls.tsx  # Admin reset buttons
├── lib/
│   ├── rcv.ts               # RCV algorithm (pure function)
│   ├── votes.ts             # Vote CRUD operations
│   └── results.ts           # Results queries and storage
└── db/
    └── schema.ts            # Add votes table, results table
```

### Pattern 1: Tap-to-Rank State Management
**What:** Client-side React state tracks ranked selections as array of design IDs
**When to use:** VotingGallery component during round1/round2 phases
**Example:**
```typescript
// Source: React useState pattern
const [rankedDesigns, setRankedDesigns] = useState<number[]>([]);

const handleDesignClick = (designId: number) => {
  setRankedDesigns(prev => {
    const existingIndex = prev.indexOf(designId);
    if (existingIndex !== -1) {
      // Already ranked - remove and shift others up (D-03)
      return prev.filter(id => id !== designId);
    }
    if (prev.length >= 3) {
      // Already have 3 - ignore tap
      return prev;
    }
    // Add as next rank
    return [...prev, designId];
  });
};

// Derive rank for display
const getRank = (designId: number): number | null => {
  const index = rankedDesigns.indexOf(designId);
  return index === -1 ? null : index + 1;
};
```

### Pattern 2: RCV Algorithm
**What:** Instant-runoff voting to select N finalists from ranked ballots
**When to use:** When advancing from round1 to round2 (N=3) or round2 to results (N=1)
**Example:**
```typescript
// Source: Ballotpedia RCV algorithm description
interface Ballot {
  firstChoice: number;
  secondChoice: number;
  thirdChoice: number;
}

interface RCVResult {
  finalists: number[];      // Winning design IDs
  rounds: RCVRound[];       // Round-by-round elimination data
  totalVoters: number;
}

interface RCVRound {
  roundNumber: number;
  voteCounts: Map<number, number>;
  eliminated: number | null;
}

function runRCV(ballots: Ballot[], targetFinalists: number): RCVResult {
  const rounds: RCVRound[] = [];
  let remainingCandidates = new Set<number>();

  // Get all unique candidates from ballots
  for (const ballot of ballots) {
    remainingCandidates.add(ballot.firstChoice);
    remainingCandidates.add(ballot.secondChoice);
    remainingCandidates.add(ballot.thirdChoice);
  }

  while (remainingCandidates.size > targetFinalists) {
    // Count first-choice votes for remaining candidates
    const voteCounts = new Map<number, number>();
    for (const candidate of remainingCandidates) {
      voteCounts.set(candidate, 0);
    }

    for (const ballot of ballots) {
      // Find highest-ranked remaining candidate
      const choices = [ballot.firstChoice, ballot.secondChoice, ballot.thirdChoice];
      const validChoice = choices.find(c => remainingCandidates.has(c));
      if (validChoice !== undefined) {
        voteCounts.set(validChoice, (voteCounts.get(validChoice) || 0) + 1);
      }
    }

    // Find candidate with fewest votes
    let minVotes = Infinity;
    let eliminated: number | null = null;
    for (const [candidate, votes] of voteCounts) {
      if (votes < minVotes) {
        minVotes = votes;
        eliminated = candidate;
      }
    }

    rounds.push({
      roundNumber: rounds.length + 1,
      voteCounts: new Map(voteCounts),
      eliminated,
    });

    if (eliminated !== null) {
      remainingCandidates.delete(eliminated);
    }
  }

  return {
    finalists: Array.from(remainingCandidates),
    rounds,
    totalVoters: ballots.length,
  };
}
```

### Pattern 3: Vote Prevention via Token
**What:** Check if voter token already has a vote for current round before allowing submission
**When to use:** submitVote server action
**Example:**
```typescript
// Source: Existing submitter-provider.tsx pattern
export async function submitVote(
  voterToken: string,
  round: "round1" | "round2",
  firstChoice: number,
  secondChoice: number,
  thirdChoice: number
) {
  // Check for existing vote
  const existingVote = await db
    .select()
    .from(votes)
    .where(and(eq(votes.voterToken, voterToken), eq(votes.round, round)))
    .limit(1);

  if (existingVote.length > 0) {
    throw new Error("You have already voted in this round");
  }

  // Insert vote
  await db.insert(votes).values({
    voterToken,
    round,
    firstChoice,
    secondChoice,
    thirdChoice,
    submittedAt: new Date(),
  });
}
```

### Anti-Patterns to Avoid
- **Storing results in memory:** Always persist RCV results to database; server restarts lose memory state
- **Recalculating results on every page load:** Compute once when advancing phase, store in results table
- **Exposing voter token to other users:** Token should only be in localStorage and sent to server; never shown in UI
- **Blocking UI during vote submission:** Use optimistic updates or at minimum show loading state

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toast notifications | Custom alert system | sonner | Handles stacking, animations, accessibility |
| Form validation | Manual checks | zod schemas | Type-safe, composable, good error messages |
| Unique constraint violations | Try-catch on insert | Database unique constraint + check query | Race conditions possible with check-only approach |

**Key insight:** The RCV algorithm is actually simple enough to implement (30-40 lines) for this use case. Don't pull in a library that requires restructuring data to match its bespoke format.

## Common Pitfalls

### Pitfall 1: Race Conditions on Double-Vote Prevention
**What goes wrong:** Two browser tabs submit votes simultaneously; both pass the "no existing vote" check; both insert successfully
**Why it happens:** Read-check-write pattern without database-level constraint
**How to avoid:** Add unique constraint on (voterToken, round) in schema; catch constraint violation error
**Warning signs:** Occasional duplicate votes from same token

### Pitfall 2: Stale Phase State After Admin Advance
**What goes wrong:** User sees voting UI after admin advanced to results; submits vote that fails
**Why it happens:** Client has cached/stale phase state
**How to avoid:** Use `revalidatePath("/")` in phase advance action; use Server Components for phase-aware UI
**Warning signs:** "Phase has ended" errors after phase transitions

### Pitfall 3: Empty Ballots in RCV
**What goes wrong:** RCV algorithm fails when a ballot's all 3 choices have been eliminated
**Why it happens:** Exhausted ballots not handled
**How to avoid:** Skip ballot in counting if no remaining valid choice (exhausted ballot)
**Warning signs:** NaN or undefined in vote counts

### Pitfall 4: Badge Z-Index Conflicts
**What goes wrong:** Rank badge appears behind image or other elements
**Why it happens:** Stacking context issues with positioned elements
**How to avoid:** Use explicit z-index on badge; ensure parent has `position: relative`
**Warning signs:** Badges invisible or partially hidden

### Pitfall 5: Vote Summary Showing Stale Selections
**What goes wrong:** Summary shows wrong designs after user modifies selections
**Why it happens:** Summary component not reactive to state changes
**How to avoid:** Derive summary from rankedDesigns state directly, not from separate state
**Warning signs:** Summary mismatches actual selections

## Code Examples

### Database Schema for Votes
```typescript
// Source: Drizzle ORM SQLite schema patterns
import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

export const votes = sqliteTable("votes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  voterToken: text("voter_token").notNull(),
  round: text("round").$type<"round1" | "round2">().notNull(),
  firstChoice: integer("first_choice").notNull(), // design ID
  secondChoice: integer("second_choice").notNull(),
  thirdChoice: integer("third_choice").notNull(),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
}, (t) => [
  unique().on(t.voterToken, t.round),
]);

export const results = sqliteTable("results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  round: text("round").$type<"round1" | "round2">().notNull().unique(),
  finalistIds: text("finalist_ids").notNull(), // JSON array of design IDs
  totalVoters: integer("total_voters").notNull(),
  eliminationData: text("elimination_data"), // JSON for optional breakdown
  computedAt: integer("computed_at", { mode: "timestamp" }).notNull(),
});
```

### Sonner Toast Setup
```typescript
// Source: Sonner documentation
// In layout.tsx
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}

// In vote submission handler
import { toast } from "sonner";

const handleSubmit = async () => {
  try {
    await submitVoteAction(token, round, ...rankedDesigns);
    toast.success("Vote submitted!");
    setHasVoted(true);
  } catch (error) {
    toast.error("Failed to submit vote");
  }
};
```

### Server Action with Validation
```typescript
// Source: Next.js 16 Server Functions docs
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const voteSchema = z.object({
  voterToken: z.string().uuid(),
  round: z.enum(["round1", "round2"]),
  firstChoice: z.number().int().positive(),
  secondChoice: z.number().int().positive(),
  thirdChoice: z.number().int().positive(),
});

export async function submitVoteAction(
  voterToken: string,
  round: "round1" | "round2",
  firstChoice: number,
  secondChoice: number,
  thirdChoice: number
) {
  // Validate input
  const parsed = voteSchema.safeParse({
    voterToken,
    round,
    firstChoice,
    secondChoice,
    thirdChoice,
  });

  if (!parsed.success) {
    throw new Error("Invalid vote data");
  }

  // Check current phase matches round
  const currentPhase = await getPhase();
  if (currentPhase !== round) {
    throw new Error("Voting has ended for this round");
  }

  // Submit vote (will throw on duplicate)
  await submitVote(
    parsed.data.voterToken,
    parsed.data.round,
    parsed.data.firstChoice,
    parsed.data.secondChoice,
    parsed.data.thirdChoice
  );

  revalidatePath("/");
}
```

### Rank Badge Component
```typescript
// Source: Component pattern from existing DesignCard
import { Badge } from "@/components/ui/badge";

interface RankBadgeProps {
  rank: number; // 1, 2, or 3
}

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <Badge
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                 h-16 w-16 rounded-full text-3xl font-bold
                 bg-primary text-primary-foreground
                 flex items-center justify-center
                 shadow-lg"
    >
      {rank}
    </Badge>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| useActionState | Direct async onClick | Next.js 16 | Simpler patterns available |
| revalidateTag | revalidatePath | Stable | Use revalidatePath for page-level revalidation |

**Deprecated/outdated:**
- `getServerSideProps`: Use Server Components and Server Actions in App Router
- `router.push` for mutations: Use Server Actions with revalidatePath

## Open Questions

1. **Tie-Breaking in RCV**
   - What we know: Standard RCV eliminates candidate with fewest votes
   - What's unclear: What if two candidates tie for fewest? (Edge case for small team)
   - Recommendation: Eliminate lower-ID candidate in tie (deterministic, simple)

2. **Results Persistence Format**
   - What we know: Need to store finalist IDs and voter count
   - What's unclear: How much elimination detail to store for potential future display
   - Recommendation: Store full elimination data as JSON; display only summary per D-10

## Sources

### Primary (HIGH confidence)
- Next.js 16 local docs (`node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`) - Server Actions patterns
- Drizzle ORM package (0.45.1) - Schema and query patterns
- Existing codebase (`src/`) - Established patterns

### Secondary (MEDIUM confidence)
- Ballotpedia RCV article - Algorithm description verified against multiple sources
- Sonner npm readme - Toast API usage

### Tertiary (LOW confidence)
- None - all critical findings verified with primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project or well-documented
- Architecture: HIGH - Extends established patterns from existing codebase
- Pitfalls: HIGH - Based on common React/Next.js patterns and RCV algorithm characteristics

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (30 days - stable stack, no fast-moving dependencies)
