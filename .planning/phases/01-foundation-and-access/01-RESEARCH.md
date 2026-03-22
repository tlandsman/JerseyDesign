# Phase 1: Foundation and Access - Research

**Researched:** 2026-03-22
**Domain:** Next.js App Router foundation, database setup, phase state management
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundation for a Jersey Design Voter app using Next.js 16 App Router with Turso/SQLite for persistence. The core challenge is implementing a phase state machine (Submit -> Round 1 -> Round 2 -> Results) that drives the UI and provides separate admin access via a distinct URL path.

The stack is well-documented and the patterns are straightforward. Next.js App Router provides folder-based routing which naturally supports the admin URL separation (user views at `/`, admin at `/admin`). Drizzle ORM with Turso offers type-safe database access with minimal setup. The admin "sees user view + controls" requirement can be achieved through a shared layout with conditional rendering.

**Primary recommendation:** Create a Next.js App Router project with a single `app_state` table tracking the current phase. Use route groups to share layouts between user and admin views, with the admin layout adding control components. No authentication needed per requirements - admin URL is kept private.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Phase-aware landing - different hero message based on current phase (e.g., "Submit Your Designs!" during submission, "Vote for Your Favorite!" during voting)
- **D-02:** Hero banner style - big, bold phase message at top with the relevant action below
- **D-03:** Prominent team branding - team name "Primed" in header, visible on all pages
- **D-04:** Separate admin URL - admin accesses controls via a different path (e.g., /admin) that regular users don't know
- **D-05:** No authentication - anyone with the admin URL can access controls (admin just keeps URL private)
- **D-06:** Admin sees user view + controls - admin URL shows the same content users see, plus admin controls overlaid

### Claude's Discretion
- Admin control placement (dedicated panel, floating controls, sidebar - whatever works best)
- Phase indicator styling details
- Error state handling
- Loading states

### Deferred Ideas (OUT OF SCOPE)
None - discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ACC-01 | User can access the app via shared link without creating an account | Next.js App Router serves pages at `/` without authentication. No login required - anyone with URL can access. |
| ACC-02 | Admin has separate access to phase controls | Route at `/admin` provides controls. No auth per D-05 - URL privacy is the only access control. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | Full-stack React framework | Industry standard, App Router with Server Components, zero-config Vercel deployment |
| React | 19.2.4 | UI library | Required by Next.js 16, Server Components support |
| TypeScript | 5.9.3 | Type safety | De facto standard, catches errors at compile time |
| Tailwind CSS | 4.2.2 | Styling | Utility-first CSS, zero runtime overhead, excellent Next.js integration |
| Drizzle ORM | 0.45.1 | Database access | Type-safe, lightweight (31KB), SQL-like API, faster cold starts than Prisma |
| @libsql/client | 0.17.2 | Turso SQLite client | Official Turso SDK, works with Drizzle |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | N/A | UI components | Pre-built accessible components. Not a dependency - copies code into project |
| Zod | 4.3.6 | Schema validation | Validate admin actions, type-safe form handling |
| drizzle-kit | 0.31.10 | Database migrations | Generate and push schema changes |
| clsx + tailwind-merge | Latest | Class utilities | Conditional Tailwind classes for component variants |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Turso (SQLite) | Vercel Postgres | Vercel Postgres if expecting >100 concurrent users. SQLite is simpler for small teams. |
| Drizzle | Prisma | Prisma has more mature tooling but heavier. Drizzle is lighter for this use case. |
| Tailwind | CSS Modules | CSS Modules if team dislikes utility classes. Tailwind faster for iteration. |

**Installation:**
```bash
# Create Next.js app
pnpm create next-app@latest jersey-voter --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Core dependencies
pnpm add drizzle-orm @libsql/client zod

# Dev dependencies
pnpm add -D drizzle-kit

# shadcn/ui init
pnpm dlx shadcn@latest init

# Add initial components
pnpm dlx shadcn@latest add button card
```

**Version verification:** Versions confirmed against npm registry on 2026-03-22.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── layout.tsx           # Root layout (html/body, shared header with "Primed" branding)
│   ├── page.tsx             # User landing page (phase-aware hero)
│   ├── admin/
│   │   ├── layout.tsx       # Admin layout (adds control panel)
│   │   └── page.tsx         # Admin view (user content + controls)
│   └── api/
│       └── phase/
│           └── route.ts     # API for phase state (GET current, POST advance)
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── phase-hero.tsx       # Phase-aware hero banner
│   ├── phase-indicator.tsx  # Current phase display
│   └── admin-controls.tsx   # Phase advancement controls
├── db/
│   ├── index.ts             # Database connection
│   └── schema.ts            # Drizzle schema
├── lib/
│   ├── phase.ts             # Phase state machine logic
│   └── utils.ts             # Utility functions (cn, etc.)
└── actions/
    └── phase-actions.ts     # Server Actions for phase management
```

### Pattern 1: Phase State Machine
**What:** Single source of truth for app phase stored in database
**When to use:** Any time the app needs to know/change current phase
**Example:**
```typescript
// Source: Project-specific pattern based on Drizzle docs
// db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export type Phase = "submit" | "round1" | "round2" | "results";

export const appState = sqliteTable("app_state", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  currentPhase: text("current_phase").$type<Phase>().notNull().default("submit"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
```

### Pattern 2: Phase-Aware Components
**What:** Components that render differently based on current phase
**When to use:** Hero banner, call-to-action buttons, navigation
**Example:**
```typescript
// Source: Next.js Server Components pattern
// components/phase-hero.tsx
import { getPhase } from "@/lib/phase";

const phaseMessages: Record<Phase, { title: string; subtitle: string }> = {
  submit: { title: "Submit Your Designs!", subtitle: "Share your jersey ideas with the team" },
  round1: { title: "Vote for Your Favorites!", subtitle: "Pick your top 3 designs" },
  round2: { title: "Final Vote!", subtitle: "Choose the winner from the top 3" },
  results: { title: "And the Winner Is...", subtitle: "See the winning design" },
};

export async function PhaseHero() {
  const phase = await getPhase();
  const message = phaseMessages[phase];

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold">{message.title}</h1>
      <p className="text-xl text-muted-foreground mt-2">{message.subtitle}</p>
    </div>
  );
}
```

### Pattern 3: Admin Layout Composition
**What:** Admin inherits user view and adds controls
**When to use:** Admin routes need user view + admin capabilities
**Example:**
```typescript
// Source: Next.js nested layouts docs
// app/admin/layout.tsx
import { AdminControls } from "@/components/admin-controls";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <AdminControls className="fixed bottom-4 right-4" />
    </div>
  );
}
```

### Pattern 4: Server Actions for State Mutations
**What:** Server-side functions for changing phase state
**When to use:** Admin advancing phases
**Example:**
```typescript
// Source: Next.js Server Actions docs
// actions/phase-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { appState } from "@/db/schema";
import { eq } from "drizzle-orm";

const phaseOrder: Phase[] = ["submit", "round1", "round2", "results"];

export async function advancePhase() {
  const [current] = await db.select().from(appState).limit(1);
  const currentIndex = phaseOrder.indexOf(current.currentPhase);

  if (currentIndex < phaseOrder.length - 1) {
    const nextPhase = phaseOrder[currentIndex + 1];
    await db.update(appState)
      .set({ currentPhase: nextPhase, updatedAt: new Date() })
      .where(eq(appState.id, current.id));

    revalidatePath("/");
    revalidatePath("/admin");
  }
}
```

### Anti-Patterns to Avoid
- **Client-side phase state:** Don't store phase in React state or localStorage. Database is single source of truth.
- **Multiple state rows:** Don't create a new row per phase change. Update the single row.
- **Hardcoded phase checks:** Don't scatter `if (phase === "submit")` everywhere. Use lookup tables or mapping objects.
- **Admin route protection via middleware:** Per D-05, no auth needed. Don't add complexity.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UI components | Custom buttons/cards | shadcn/ui | Accessibility, consistency, rapid development |
| Database ORM | Raw SQL queries | Drizzle ORM | Type safety, migration management, query building |
| CSS utilities | Custom utility classes | Tailwind CSS | Standardized, well-documented, tree-shaken |
| Form validation | Manual if/else | Zod schemas | Type inference, comprehensive error messages |

**Key insight:** This phase is foundation-setting. Using the standard tools correctly now prevents refactoring later when complexity increases in Phases 2 and 3.

## Common Pitfalls

### Pitfall 1: Forgetting to Initialize App State
**What goes wrong:** App crashes on first load because `app_state` table is empty
**Why it happens:** Schema creates table but doesn't insert initial row
**How to avoid:** Add a seed script or check/create initial state in `getPhase()` function
**Warning signs:** "Cannot read property 'currentPhase' of undefined" errors

### Pitfall 2: Caching Phase State Too Aggressively
**What goes wrong:** Phase changes don't reflect immediately for users
**Why it happens:** Next.js caches Server Component data by default
**How to avoid:** Use `revalidatePath()` after phase changes, consider `export const dynamic = 'force-dynamic'` for phase-dependent pages
**Warning signs:** Users see stale phase after admin advances

### Pitfall 3: Route Groups Affecting URL Structure
**What goes wrong:** Admin URL becomes `/admin/admin` or similar
**Why it happens:** Misunderstanding route groups vs. regular folders
**How to avoid:** Route groups use `(groupName)` parentheses and don't add to URL. Regular folders like `admin/` do add to URL. For this project, use regular `admin/` folder.
**Warning signs:** Unexpected 404s, wrong URL paths

### Pitfall 4: Turso Connection in Development
**What goes wrong:** Database connection fails locally
**Why it happens:** Turso needs both URL and auth token, which differ for local vs. production
**How to avoid:** Use local SQLite file for development (`file:local.db`), Turso for production. Configure via environment variables.
**Warning signs:** "TURSO_AUTH_TOKEN is undefined" errors

### Pitfall 5: Missing Revalidation After Server Actions
**What goes wrong:** UI doesn't update after admin action
**Why it happens:** Server Action mutates DB but doesn't trigger re-render
**How to avoid:** Always call `revalidatePath()` at end of mutation actions
**Warning signs:** Need to refresh page to see changes

## Code Examples

Verified patterns from official sources:

### Database Connection Setup
```typescript
// Source: Drizzle + Turso docs
// db/index.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
```

### Environment Variables
```bash
# .env.local (development)
DATABASE_URL=file:local.db

# .env.production (Turso)
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

### Root Layout with Team Branding
```typescript
// Source: Next.js layouts docs
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primed Jersey Voter",
  description: "Vote for your team's jersey design",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Primed</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
```

### Phase Retrieval Helper
```typescript
// Source: Drizzle query patterns
// lib/phase.ts
import { db } from "@/db";
import { appState, Phase } from "@/db/schema";

export async function getPhase(): Promise<Phase> {
  const [state] = await db.select().from(appState).limit(1);

  // Initialize if no state exists
  if (!state) {
    await db.insert(appState).values({
      currentPhase: "submit",
      updatedAt: new Date(),
    });
    return "submit";
  }

  return state.currentPhase;
}
```

### API Route for Phase (Alternative to Server Actions)
```typescript
// Source: Next.js Route Handlers docs
// app/api/phase/route.ts
import { NextResponse } from "next/server";
import { getPhase } from "@/lib/phase";

export async function GET() {
  const phase = await getPhase();
  return NextResponse.json({ phase });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router | App Router | Next.js 13 (2022) | Server Components by default, better data fetching |
| getServerSideProps | Server Components + Actions | Next.js 13 (2022) | Simpler data fetching, collocated with components |
| API routes for mutations | Server Actions | Next.js 14 (2023) | Type-safe mutations, automatic form handling |
| useFormStatus from react-dom | useActionState from react | React 19 (2024) | Unified pending state management |

**Deprecated/outdated:**
- `getServerSideProps`: Replaced by Server Components with async data fetching
- `getStaticProps`: Replaced by default caching behavior in App Router
- `pages/` directory: Legacy, use `app/` directory

## Open Questions

1. **Local Development Database**
   - What we know: Can use local SQLite file via `file:local.db`
   - What's unclear: Whether Drizzle Kit works identically with local file vs Turso
   - Recommendation: Start with local file, test Drizzle Kit commands, document any differences

2. **Phase Indicator Styling**
   - What we know: Per CONTEXT.md, this is Claude's discretion
   - What's unclear: User preference for prominent vs subtle indicator
   - Recommendation: Start with a badge in the header showing current phase name, iterate based on feedback

## Sources

### Primary (HIGH confidence)
- Next.js 16.2.1 official docs - Layouts, routing, Server Actions, Route Handlers
- Drizzle ORM docs - SQLite schema definition, query patterns
- Turso docs - TypeScript SDK setup, connection configuration
- shadcn/ui docs - Installation, component usage

### Secondary (MEDIUM confidence)
- npm registry - Version verification for all packages (2026-03-22)
- Turso pricing page - Free tier limits (5GB storage, 500M reads, 10M writes/month)

### Tertiary (LOW confidence)
- None - all findings verified with official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified against npm, official docs consulted
- Architecture: HIGH - Patterns from official Next.js and Drizzle documentation
- Pitfalls: HIGH - Common issues documented in official guides and community resources

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (30 days - stable stack, no major releases expected)
