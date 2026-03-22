# Architecture Research

**Domain:** Voting web app with image uploads
**Researched:** 2026-03-22
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
+------------------------------------------------------------------+
|                         Client Layer                              |
|  +-------------+  +-------------+  +-------------+  +-----------+ |
|  | Submit View |  | Gallery     |  | Voting View |  | Results   | |
|  | (upload)    |  | View        |  | (rank/vote) |  | View      | |
|  +------+------+  +------+------+  +------+------+  +-----+-----+ |
|         |                |                |               |       |
+---------+----------------+----------------+---------------+-------+
          |                |                |               |
+---------v----------------v----------------v---------------v-------+
|                         API Layer                                 |
|  +------------------+  +------------------+  +------------------+  |
|  | /api/designs     |  | /api/votes       |  | /api/admin       |  |
|  | (upload, list)   |  | (submit, tally)  |  | (phase control)  |  |
|  +--------+---------+  +--------+---------+  +--------+---------+  |
|           |                     |                     |           |
+-----------+---------------------+---------------------+-----------+
            |                     |                     |
+-----------v---------------------v---------------------v-----------+
|                       Service Layer                               |
|  +----------------+  +----------------+  +----------------------+  |
|  | Design Service |  | Vote Service   |  | Phase State Machine  |  |
|  | - upload       |  | - submit vote  |  | - current phase      |  |
|  | - list designs |  | - RCV tally    |  | - transitions        |  |
|  +-------+--------+  +-------+--------+  +-----------+----------+  |
|          |                   |                       |            |
+----------+-------------------+-----------------------+------------+
           |                   |                       |
+----------v-------------------v-----------------------v------------+
|                       Data Layer                                  |
|  +------------------+  +------------------+  +------------------+  |
|  | Image Storage    |  | Database         |  | Session Store    |  |
|  | (Blob/S3)        |  | (designs, votes) |  | (voter identity) |  |
|  +------------------+  +------------------+  +------------------+  |
+------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Submit View | Upload form, image preview, submission limit | React client component with drag-drop |
| Gallery View | Display all designs anonymously | Server component, image grid |
| Voting View | Drag-to-rank interface, ballot submission | Client component with state |
| Results View | Show winners, vote breakdowns | Server component, conditional on phase |
| Design Service | Validate uploads, store images, enforce limits | Server action or API route |
| Vote Service | Validate ballots, store votes, run RCV algorithm | API route with transaction |
| Phase State Machine | Track current phase, validate transitions | Database enum + transition logic |
| Image Storage | Store and serve design images | Vercel Blob, Supabase Storage, or S3 |
| Database | Persist designs, votes, phase state | SQLite (simple) or Postgres (hosted) |

## Recommended Project Structure

```
src/
app/
  page.tsx              # Landing/redirect based on phase
  layout.tsx            # Root layout with phase context
  submit/
    page.tsx            # Design submission view
  gallery/
    page.tsx            # Browse all designs
  vote/
    page.tsx            # Voting interface (round 1 or 2)
  results/
    page.tsx            # Results view (after voting ends)
  admin/
    page.tsx            # Phase control panel
  api/
    designs/
      route.ts          # GET: list designs, POST: upload
      [id]/
        route.ts        # GET: single design
    votes/
      route.ts          # POST: submit ballot
      tally/
        route.ts        # GET: run RCV and return results
    admin/
      phase/
        route.ts        # POST: advance phase
components/
  design-card.tsx       # Single design display
  design-grid.tsx       # Grid of designs
  upload-form.tsx       # Image upload component
  ranking-ballot.tsx    # Drag-to-rank voting UI
  phase-indicator.tsx   # Shows current phase
  admin-controls.tsx    # Phase transition buttons
lib/
  db/
    schema.ts           # Database schema (Prisma or Drizzle)
    index.ts            # Database client
  storage/
    index.ts            # Image upload/retrieval helpers
  voting/
    rcv.ts              # Ranked choice voting algorithm
    types.ts            # Vote/ballot type definitions
  phase/
    machine.ts          # Phase state machine logic
    types.ts            # Phase enum and transitions
  auth/
    session.ts          # Browser session/fingerprint for identity
```

### Structure Rationale

- **app/:** Next.js App Router with file-based routing. Each phase gets its own route for clear separation.
- **api/:** Colocated API routes for designs, votes, and admin. Keeps related endpoints together.
- **components/:** Shared UI components. Design-related, voting-related, and admin components.
- **lib/:** Business logic separated from routes. Database, storage, voting algorithm, and phase management all isolated for testing.

## Architectural Patterns

### Pattern 1: Phase-Gated UI

**What:** The entire app behavior changes based on current phase. Each view checks phase and renders accordingly.

**When to use:** Apps with distinct operational phases (submission, voting rounds, results).

**Trade-offs:**
- Pro: Clear user experience, impossible to vote during submission
- Pro: Single source of truth for app state
- Con: Need to handle phase transitions carefully

**Example:**
```typescript
// lib/phase/machine.ts
export type Phase = 'SUBMIT' | 'VOTE_ROUND_1' | 'VOTE_ROUND_2' | 'RESULTS';

export const PHASE_TRANSITIONS: Record<Phase, Phase | null> = {
  SUBMIT: 'VOTE_ROUND_1',
  VOTE_ROUND_1: 'VOTE_ROUND_2',
  VOTE_ROUND_2: 'RESULTS',
  RESULTS: null, // terminal
};

export function canTransition(current: Phase): boolean {
  return PHASE_TRANSITIONS[current] !== null;
}

// app/vote/page.tsx
export default async function VotePage() {
  const phase = await getCurrentPhase();

  if (phase === 'SUBMIT') {
    redirect('/submit'); // Not time to vote yet
  }
  if (phase === 'RESULTS') {
    redirect('/results'); // Voting is over
  }

  const designs = phase === 'VOTE_ROUND_1'
    ? await getAllDesigns()
    : await getFinalists();

  return <RankingBallot designs={designs} round={phase} />;
}
```

### Pattern 2: Presigned URL Uploads

**What:** Client uploads images directly to storage (Blob/S3) rather than through your server.

**When to use:** Image/file uploads of any size. Reduces server load and timeout risk.

**Trade-offs:**
- Pro: Fast uploads, no server bottleneck
- Pro: Works with serverless (no streaming through function)
- Con: Slightly more complex flow (get URL, then upload)

**Example:**
```typescript
// app/api/designs/upload-url/route.ts
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const { filename, contentType } = await request.json();

  // Generate presigned upload URL
  const blob = await put(filename, { access: 'public', contentType });

  return Response.json({ uploadUrl: blob.url });
}

// components/upload-form.tsx (client)
async function handleUpload(file: File) {
  // 1. Get presigned URL
  const { uploadUrl } = await fetch('/api/designs/upload-url', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  }).then(r => r.json());

  // 2. Upload directly to storage
  await fetch(uploadUrl, { method: 'PUT', body: file });

  // 3. Save design record to database
  await fetch('/api/designs', {
    method: 'POST',
    body: JSON.stringify({ imageUrl: uploadUrl }),
  });
}
```

### Pattern 3: Instant Runoff Voting (RCV) Algorithm

**What:** Iterative elimination voting where lowest-ranked candidates are removed and their votes redistributed.

**When to use:** Ranked choice voting to find consensus winner.

**Trade-offs:**
- Pro: Finds majority consensus, not just plurality
- Pro: Voters express preference depth
- Con: More complex to explain to users
- Con: Requires storing full ranked ballots, not just single choice

**Example:**
```typescript
// lib/voting/rcv.ts
export interface Ballot {
  rankings: string[]; // design IDs in preference order
}

export function runRCV(ballots: Ballot[], candidateIds: string[]): string {
  let remaining = new Set(candidateIds);

  while (remaining.size > 1) {
    // Count first-choice votes for remaining candidates
    const counts = new Map<string, number>();
    remaining.forEach(id => counts.set(id, 0));

    for (const ballot of ballots) {
      const firstChoice = ballot.rankings.find(id => remaining.has(id));
      if (firstChoice) {
        counts.set(firstChoice, (counts.get(firstChoice) || 0) + 1);
      }
    }

    const totalVotes = Array.from(counts.values()).reduce((a, b) => a + b, 0);

    // Check for majority
    for (const [id, votes] of counts) {
      if (votes > totalVotes / 2) {
        return id; // Winner!
      }
    }

    // Eliminate candidate with fewest votes
    let minVotes = Infinity;
    let toEliminate = '';
    for (const [id, votes] of counts) {
      if (votes < minVotes) {
        minVotes = votes;
        toEliminate = id;
      }
    }
    remaining.delete(toEliminate);
  }

  return Array.from(remaining)[0]; // Last one standing
}
```

## Data Flow

### Request Flow

```
[User Action]
    |
    v
[Client Component] --> [API Route] --> [Service] --> [Database/Storage]
    |                       |              |              |
    v                       v              v              v
[UI Update] <-------- [Response] <-- [Processed] <-- [Persisted]
```

### Phase State Flow

```
                    [Admin clicks "Start Voting"]
                              |
                              v
[SUBMIT] ----transition----> [VOTE_ROUND_1]
                              |
                    [Admin clicks "Advance to Round 2"]
                              |
                              v
                        [VOTE_ROUND_2]
                              |
                    [Admin clicks "Show Results"]
                              |
                              v
                          [RESULTS]
```

### Key Data Flows

1. **Design Submission:**
   - User selects image -> Client requests presigned URL -> Client uploads to blob storage -> Client saves design record with image URL to database -> Gallery updates

2. **Vote Submission:**
   - User ranks designs -> Client submits ballot array -> Server validates (phase check, already voted check) -> Server stores ballot -> Confirmation shown

3. **RCV Tallying:**
   - Admin triggers tally (or automatic on phase transition) -> Server loads all ballots for round -> Runs RCV algorithm -> Stores results -> If Round 1: identifies finalists, If Round 2: identifies winner

4. **Phase Transitions:**
   - Admin clicks advance -> Server validates current phase allows transition -> Updates phase in database -> All clients see new phase on next load

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 10-20 users (this app) | SQLite file database is fine. Single serverless function handles everything. No caching needed. |
| 100-1000 users | Move to hosted Postgres (Supabase, Neon). Add basic rate limiting. Consider caching design list. |
| 10000+ users | Add CDN for images. Database connection pooling. Consider separate read replicas. Queue heavy operations. |

### Scaling Priorities

1. **First bottleneck:** Image loading. Solved by using blob storage with CDN (Vercel Blob, Cloudinary, or S3+CloudFront).
2. **Second bottleneck:** Database connections in serverless. Solved by connection pooling (Prisma Accelerate, PgBouncer) or edge-compatible databases.

For a 10-15 person ultimate frisbee team, none of these will matter. Keep it simple.

## Anti-Patterns

### Anti-Pattern 1: Uploading Images Through API Routes

**What people do:** Accept file uploads in API route, process on server, then forward to storage.

**Why it's wrong:** Serverless functions have size limits (4.5MB on Vercel), timeout limits, and you pay for compute while bytes stream through.

**Do this instead:** Use presigned URLs for direct client-to-storage uploads. Server only generates the URL and records metadata.

### Anti-Pattern 2: Storing Votes Without Ballot Preservation

**What people do:** Only store final vote counts, not individual ballots.

**Why it's wrong:** RCV requires the full ranked preference list to redistribute votes during elimination rounds. Can't recount or audit.

**Do this instead:** Store complete ballot (array of ranked candidate IDs) for each voter. Calculate results from raw ballots.

### Anti-Pattern 3: Client-Side Phase Enforcement Only

**What people do:** Hide vote button on client when phase is SUBMIT, but don't check phase on server.

**Why it's wrong:** Users can hit the API directly. Phase rules must be enforced server-side.

**Do this instead:** Every API route checks current phase before processing. Client UI is just convenience.

### Anti-Pattern 4: No Voter Identity Tracking

**What people do:** Allow unlimited votes because "there are no accounts."

**Why it's wrong:** One person can vote many times, defeating the purpose of voting.

**Do this instead:** Track voter identity via browser fingerprint, session cookie, or simple name entry stored in localStorage. Not perfect, but sufficient for a trusted small team.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel Blob / Supabase Storage | Presigned URL upload | Best for serverless. Built-in CDN. |
| Database (SQLite/Postgres) | Direct queries via ORM | Prisma or Drizzle. SQLite for simplicity, Postgres for hosted. |
| Browser Storage | localStorage for voter ID | Simple client-side identity tracking |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Client <-> API | HTTP/JSON | Standard fetch calls |
| API <-> Services | Direct function calls | Same process, no network |
| Services <-> Database | ORM queries | Type-safe with Prisma/Drizzle |
| Services <-> Storage | SDK/HTTP | Blob client or presigned URLs |

## Build Order (Dependencies)

Based on component dependencies, build in this order:

1. **Database schema + Phase machine** - Everything depends on knowing the phase
2. **Image storage integration** - Designs need somewhere to live
3. **Design submission (upload + list)** - Core content creation
4. **Voting UI + vote storage** - Depends on designs existing
5. **RCV algorithm + results** - Depends on votes existing
6. **Admin controls** - Phase transitions after everything works
7. **Polish (loading states, error handling)** - After core flow works

## Sources

- Next.js App Router documentation (https://nextjs.org/docs/app) - HIGH confidence
- Vercel Functions documentation (https://vercel.com/docs/functions) - HIGH confidence
- Vercel file upload guide (https://vercel.com/guides/how-to-upload-and-store-files-with-vercel) - HIGH confidence
- Supabase Storage documentation (https://supabase.com/docs/guides/storage/uploads) - HIGH confidence
- Prisma ORM documentation (https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma) - HIGH confidence
- XState concepts documentation (https://xstate.js.org/docs/about/concepts.html) - MEDIUM confidence (for state machine patterns)
- Ranked Vote guide (https://www.rankedvote.co/guides/understanding-ranked-choice-voting) - HIGH confidence (RCV algorithm)
- MDN Client-Server overview - HIGH confidence (foundational patterns)

---
*Architecture research for: Jersey Design Voter*
*Researched: 2026-03-22*
