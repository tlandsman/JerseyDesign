# Stack Research

**Domain:** Voting web app with image uploads and ranked choice voting
**Researched:** 2026-03-22
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.x | Full-stack React framework | Industry standard for React apps in 2025. Zero-config deployment on Vercel, built-in API routes, App Router with Server Components, image optimization. Maintained by Vercel team. |
| React | 19.2.x | UI library | Latest stable with Server Components support. Required by Next.js 16. |
| TypeScript | 5.9.x | Type safety | De facto standard for any production JavaScript app. Catches errors at compile time, better DX with autocomplete. |
| Tailwind CSS | 4.2.x | Styling | Utility-first CSS with zero runtime overhead. Fast iteration, consistent design, excellent Next.js integration via `@tailwindcss/vite`. |
| SQLite (Turso) | 3.51.x | Database | Perfect for small team apps (10-15 users). Turso provides hosted SQLite with free tier, edge replication, and Drizzle integration. Zero connection management. |
| Drizzle ORM | 1.0.x | Database access | Type-safe, lightweight (31KB), SQL-like API. Better DX than Prisma for simple apps, zero dependencies, faster cold starts. |
| UploadThing | Latest | Image uploads | Purpose-built for TypeScript full-stack apps. First-party Next.js adapter (App Router), handles storage, returns URLs. No AWS setup needed. |
| Vercel | N/A | Hosting | Native Next.js platform with zero-config deployment. Free tier handles this use case. Global CDN, automatic image optimization. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 4.x | Schema validation | Validate form inputs (vote submissions, design uploads). Type-safe, 2KB gzipped, integrates with React Hook Form. |
| shadcn/ui | N/A | UI components | Pre-built accessible components (Dialog, Buttons, Cards, Tabs). Not a dependency - copies code into project. Uses Radix primitives underneath. |
| Radix UI | 1.2.x | Accessible primitives | Underlying components for shadcn/ui. Provides Dialog, DropdownMenu, Tabs with full keyboard/screen reader support. |
| React Hook Form | 7.x | Form handling | Efficient form state management for vote submission forms. Minimal re-renders, Zod integration. |
| clsx + tailwind-merge | Latest | Class utilities | Conditional Tailwind classes. Small but essential for component variants. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint + Prettier | Code quality | `eslint-config-next` provides Next.js-specific rules. Prettier for formatting consistency. |
| Drizzle Kit | Database migrations | Generate and run migrations from TypeScript schema. `drizzle-kit push` for development, `drizzle-kit migrate` for production. |
| pnpm | Package manager | Faster installs, better monorepo support, disk efficient. Use over npm/yarn. |

## Installation

```bash
# Create Next.js app with TypeScript and Tailwind
pnpm create next-app@latest jersey-voter --typescript --tailwind --eslint --app --src-dir

# Core dependencies
pnpm add drizzle-orm @libsql/client zod react-hook-form @hookform/resolvers

# UploadThing for image uploads
pnpm add uploadthing @uploadthing/react

# UI components (shadcn/ui - run init, then add components as needed)
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card dialog input tabs

# Dev dependencies
pnpm add -D drizzle-kit @types/node prettier eslint-config-prettier
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js | Remix / SvelteKit | Remix if heavy form handling without JS needed. SvelteKit if team knows Svelte. Next.js wins for React ecosystem and Vercel deployment. |
| Turso (SQLite) | Vercel Postgres / Supabase | If expecting >100 concurrent users or complex queries with joins. SQLite is simpler and cheaper for small teams. |
| Drizzle | Prisma | If team already knows Prisma. Drizzle is lighter (faster cold starts), but Prisma has more mature tooling. |
| UploadThing | Vercel Blob / Cloudinary | Vercel Blob if already deep in Vercel ecosystem. Cloudinary if need image transformations (resize, crop). UploadThing is simpler for basic uploads. |
| Tailwind | CSS Modules / Styled Components | CSS Modules if team dislikes utility classes. Avoid styled-components (runtime CSS, larger bundles). |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Create React App (CRA) | Deprecated by React team. No server rendering, no API routes, requires separate backend. | Next.js |
| Express.js backend | Unnecessary complexity. Next.js API routes handle server logic. Adding Express means managing two servers. | Next.js API Routes |
| MongoDB | Overkill for structured voting data. Loses SQL benefits (transactions, constraints). No real advantages for this use case. | SQLite via Turso |
| Firebase | Vendor lock-in, complex pricing, overkill for simple voting app. Better for real-time features not needed here. | Turso + Vercel |
| AWS S3 direct | Complex setup (IAM, CORS, signed URLs). Requires managing credentials. | UploadThing (uses S3 underneath, handles complexity) |
| Chakra UI / Material UI | Heavy runtime, design opinions, harder to customize. shadcn/ui gives you the code. | shadcn/ui + Radix |
| Redux | Massive overkill for app state. React's built-in useState/useContext sufficient. Server state handled by Server Components. | React state + Server Components |
| Jest | Slower than modern alternatives. Vitest has better DX, faster execution, native ESM support. | Vitest (if testing needed) |

## Stack Patterns by Variant

**If deploying to non-Vercel platform:**
- Use Remix instead of Next.js (better self-hosting story)
- Use PostgreSQL instead of Turso (more hosting options)
- Use Cloudinary instead of UploadThing (more deployment flexibility)

**If team size grows beyond 50 users:**
- Migrate from Turso to Vercel Postgres or PlanetScale
- Consider adding user authentication (Clerk or Auth.js)
- Add rate limiting on vote submission

**If real-time results needed (not this project):**
- Add Pusher or Ably for WebSocket updates
- Consider Supabase for real-time subscriptions
- Still wouldn't need Firebase

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.2.x | React 19.2.x | Next.js 16 requires React 19. Don't mix with React 18. |
| Drizzle ORM 1.0.x | @libsql/client 0.14+ | For Turso/SQLite. Use matching versions from drizzle-orm/libsql. |
| Tailwind 4.2.x | @tailwindcss/vite | New setup in v4. Don't use old PostCSS config from Tailwind v3 tutorials. |
| shadcn/ui | Tailwind 4.x | shadcn/ui v3+ supports Tailwind v4. Run `shadcn@latest init` for correct config. |
| UploadThing | Next.js 13.4+ | Supports both Pages and App Router. Use App Router adapter for this project. |
| Zod 4.x | react-hook-form 7.x | Use `@hookform/resolvers` for integration. Zod 4 API differs from v3. |

## Ranked Choice Voting Implementation

**No library needed.** RCV is a simple algorithm:

```typescript
// Instant Runoff Voting (IRV) - standard RCV
function runRCV(ballots: string[][], candidates: string[]): string {
  let remaining = [...candidates];

  while (remaining.length > 1) {
    // Count first-choice votes
    const counts = new Map<string, number>();
    remaining.forEach(c => counts.set(c, 0));

    for (const ballot of ballots) {
      const firstChoice = ballot.find(c => remaining.includes(c));
      if (firstChoice) counts.set(firstChoice, counts.get(firstChoice)! + 1);
    }

    // Check for majority
    const total = ballots.length;
    for (const [candidate, count] of counts) {
      if (count > total / 2) return candidate;
    }

    // Eliminate lowest
    const minVotes = Math.min(...counts.values());
    remaining = remaining.filter(c => counts.get(c)! > minVotes);
  }

  return remaining[0];
}
```

This is ~20 lines. Installing a library adds dependency risk for no benefit. Implement directly in the codebase.

## Architecture Notes for Roadmap

**Database schema preview:**
- `designs` table: id, image_url, uploaded_at, submitter_token
- `votes` table: id, round (1 or 2), voter_token, rankings (JSON array)
- `app_state` table: current_phase, round1_finalists, winner

**Phase flow in code:**
1. SUBMISSION phase: POST /api/designs (upload image)
2. ROUND1 phase: POST /api/votes (rank top 3)
3. ROUND2 phase: POST /api/votes (rank 3 finalists)
4. RESULTS phase: GET /api/results

**No auth needed:** Use random tokens in URL for admin access. Voter anonymity via session tokens (not tied to identity).

## Sources

- Next.js docs (https://nextjs.org/docs) - Version 16.2.1 confirmed
- Tailwind CSS docs (https://tailwindcss.com/docs) - Version 4.2 confirmed
- Drizzle ORM docs (https://orm.drizzle.team/docs/overview) - v1.0 RC confirmed
- UploadThing docs (https://docs.uploadthing.com) - Framework support verified
- Vercel Storage docs (https://vercel.com/docs/storage) - Blob features confirmed
- shadcn/ui docs (https://ui.shadcn.com/docs) - Copy-code approach verified
- Turso docs (https://turso.tech/) - SQLite compatibility confirmed
- React releases (https://github.com/facebook/react/releases) - v19.2.4 confirmed
- TypeScript releases (https://github.com/microsoft/TypeScript/releases) - v5.9.3 confirmed
- Zod docs (https://zod.dev/) - v4 stable confirmed
- better-sqlite3 (https://github.com/WiseLibs/better-sqlite3) - v12.8.0, not needed with Turso

---
*Stack research for: Jersey Design Voter*
*Researched: 2026-03-22*
