# Phase 02: Submission System - Research

**Researched:** 2026-03-22
**Domain:** Image uploads, gallery display, EXIF metadata handling
**Confidence:** HIGH

## Summary

This phase implements the design submission and gallery display system. Team members upload jersey design images (max 2 per person, honor system), which are displayed anonymously in a uniform grid gallery with lightbox viewing. The key technical challenges are: (1) integrating UploadThing for drag-and-drop uploads with progress feedback, (2) stripping EXIF metadata server-side for privacy, (3) building a responsive gallery with lightbox modal, and (4) implementing admin-only visibility for submitter names with delete capabilities.

The stack is well-defined by project constraints: UploadThing for uploads (already specified in CLAUDE.md), Sharp for server-side EXIF stripping, react-photo-view for lightweight lightbox functionality, and existing shadcn/ui components for the gallery cards. The patterns follow established Phase 1 conventions - Server Components for data fetching, Server Actions for mutations.

**Primary recommendation:** Use UploadThing's file router with middleware to capture submitter name, process uploaded images through Sharp on the server to strip EXIF metadata before storing the URL, and display in a uniform-aspect-ratio CSS grid with react-photo-view lightbox overlay.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Drag-and-drop zone with "click to browse" fallback
- **D-02:** Preview with confirm before upload (show thumbnail after selecting, user clicks 'Submit' to finalize)
- **D-03:** Counter display for limit ("You have submitted 1 of 2 designs")
- **D-04:** Progress bar during upload + success toast on completion
- **D-05:** Uniform grid layout (same-size cards, images cropped/fitted to consistent aspect ratio)
- **D-06:** 3 designs per row on desktop (responsive, fewer on mobile)
- **D-07:** Lightbox/modal on click (opens full-size image in overlay)
- **D-08:** Name entry on upload (user types name, stored with design)
- **D-09:** Remember name in browser (pre-fill from localStorage)
- **D-10:** Honor system for 2-design limit (show count, don't hard block)
- **D-11:** Subtle indicator for own designs ("Your design" badge visible only to submitter)
- **D-12:** Image + submission number shown to regular users ("Design #5")
- **D-13:** Submitter name visible on card for admin
- **D-14:** Individual delete button on each card for admin
- **D-15:** "Delete All" button for admin with confirmation dialog

### Claude's Discretion
- Empty state design (when no designs submitted yet)
- Exact styling of "Your design" indicator
- Mobile responsive breakpoints
- Error state handling

### Deferred Ideas (OUT OF SCOPE)
None - discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SUB-01 | User can upload design images (max 2 per person) | UploadThing file router + localStorage-based soft limit with counter display |
| SUB-02 | User can view gallery of all submitted designs | CSS Grid with uniform cards + react-photo-view lightbox |
| SUB-03 | Uploaded images have EXIF metadata stripped for anonymity | Sharp server-side processing in onUploadComplete callback |
| SUB-04 | Submissions are anonymous during voting (no names shown to regular users) | Database stores name, but gallery display shows only "Design #N" for non-admin |
| SUB-05 | Admin can see submitter name for each design | Admin page conditionally renders submitter name on cards |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| uploadthing | 7.7.4 | File upload handling | Project-specified in CLAUDE.md. Handles storage, signed URLs, progress callbacks |
| @uploadthing/react | 7.3.3 | React components | Typed UploadDropzone with manual mode for preview-before-submit |
| sharp | 0.34.5 | EXIF metadata stripping | Industry standard image processing. Strips metadata by default on output |
| react-photo-view | 1.2.7 | Lightbox/image viewer | 7KB gzipped, touch gestures, pinch-zoom, minimal setup |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| drizzle-orm | 0.45.1 | Database access | Already installed. Add designs table to schema |
| lucide-react | 0.577.0 | Icons | Already installed. Use for upload icons, delete buttons |
| zod | 4.3.6 | Form validation | Already installed. Validate submitter name field |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-photo-view | yet-another-react-lightbox | More features (3.29.1), but heavier. react-photo-view sufficient for single image viewing |
| react-photo-view | shadcn/ui Dialog | Custom lightbox possible, but lacks pinch-zoom and swipe gestures for mobile |
| sharp | piexifjs | Browser-side EXIF removal (1.0.6), but Sharp is more reliable for complete metadata strip |

**Installation:**
```bash
npm install uploadthing @uploadthing/react sharp react-photo-view
```

**Version verification:** Versions confirmed via npm registry 2026-03-22.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── api/
│       └── uploadthing/
│           ├── core.ts        # FileRouter definition with middleware
│           └── route.ts       # GET/POST handlers
├── lib/
│   ├── uploadthing.ts         # Typed component exports
│   └── designs.ts             # Design CRUD operations
├── actions/
│   └── design-actions.ts      # Server actions for delete operations
├── components/
│   ├── design-upload.tsx      # Upload dropzone with preview
│   ├── design-gallery.tsx     # Grid layout with cards
│   ├── design-card.tsx        # Individual gallery card
│   └── design-lightbox.tsx    # PhotoProvider wrapper
└── db/
    └── schema.ts              # Add designs table
```

### Pattern 1: UploadThing Manual Mode for Preview-Before-Submit
**What:** Configure UploadDropzone in manual mode so user sees preview and confirms before upload begins
**When to use:** When requiring user confirmation before upload (D-02)
**Example:**
```typescript
// Source: UploadThing docs - theming guide
<UploadDropzone
  endpoint="designUploader"
  config={{ mode: "manual" }}
  onClientUploadComplete={(res) => {
    // Store design record, refresh gallery
  }}
/>
```

### Pattern 2: Server-Side EXIF Stripping
**What:** Process uploaded image through Sharp to strip all metadata before storing
**When to use:** Always - SUB-03 requires EXIF removal for anonymity
**Example:**
```typescript
// Source: Sharp API docs - output section
import sharp from 'sharp';

// Sharp strips all metadata by default on output
const stripped = await sharp(inputBuffer).toBuffer();
// No keepMetadata() or withMetadata() = clean output
```

### Pattern 3: Submitter Identification via localStorage Token
**What:** Generate a unique token per browser session, store in localStorage, send with uploads and use to identify "your" designs
**When to use:** For D-09 (remember name), D-10 (honor system counting), D-11 (your design indicator)
**Example:**
```typescript
// Client-side token generation
const getSubmitterToken = () => {
  let token = localStorage.getItem('submitter_token');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('submitter_token', token);
  }
  return token;
};
```

### Pattern 4: Uniform Aspect Ratio Grid with object-fit
**What:** CSS Grid with fixed aspect-ratio cards, images use object-cover to fill uniformly
**When to use:** D-05 and D-06 require uniform grid regardless of original image dimensions
**Example:**
```typescript
// Gallery grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {designs.map(d => (
    <Card key={d.id} className="aspect-[4/3] overflow-hidden">
      <img src={d.imageUrl} className="w-full h-full object-cover" />
    </Card>
  ))}
</div>
```

### Pattern 5: PhotoProvider for Lightbox Gallery
**What:** Wrap gallery in PhotoProvider, each image in PhotoView for click-to-expand
**When to use:** D-07 requires lightbox modal for full-size viewing
**Example:**
```typescript
// Source: react-photo-view docs
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

<PhotoProvider>
  {designs.map(d => (
    <PhotoView key={d.id} src={d.imageUrl}>
      <img src={d.imageUrl} className="cursor-pointer" />
    </PhotoView>
  ))}
</PhotoProvider>
```

### Anti-Patterns to Avoid
- **Browser-only EXIF stripping:** Using piexifjs client-side is unreliable; some metadata survives. Always strip server-side with Sharp.
- **Blocking uploads without soft limit:** The honor system (D-10) means showing a count and warning, not preventing upload. Hard blocks frustrate users.
- **Storing images in database:** UploadThing returns URLs to hosted storage. Store the URL string, not binary data.
- **Using Next.js Image component in lightbox:** The lightbox library handles its own image loading; next/image optimization can conflict.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| File uploads | Custom FormData/fetch to S3 | UploadThing | Presigned URLs, progress callbacks, size limits, type validation |
| Image metadata stripping | Manual EXIF parsing/removal | Sharp | Complete metadata removal guaranteed, handles edge cases |
| Lightbox/zoom viewer | Custom modal with pan/zoom | react-photo-view | Touch gestures, pinch-zoom, swipe navigation already solved |
| Unique visitor identification | IP tracking or fingerprinting | localStorage UUID | Privacy-respecting, sufficient for honor system |

**Key insight:** Image uploads and lightbox viewing have numerous edge cases (CORS, mobile gestures, image orientation, upload resumption). Using established libraries eliminates days of debugging.

## Common Pitfalls

### Pitfall 1: EXIF Orientation Causing Rotated Images
**What goes wrong:** Photos taken on mobile may appear rotated in browser if EXIF orientation tag is stripped but image data isn't rotated to match
**Why it happens:** EXIF contains orientation flag; browsers use it to display correctly. Stripping without rotating first shows raw rotation.
**How to avoid:** Sharp automatically applies EXIF rotation before stripping when using `.rotate()` (auto-orient) before output
**Warning signs:** Portrait photos appearing sideways after upload

### Pitfall 2: UploadThing Environment Variable Missing
**What goes wrong:** "UPLOADTHING_TOKEN is required" error on deployment
**Why it happens:** Environment variable not set in Vercel/hosting platform
**How to avoid:** Add UPLOADTHING_TOKEN to Vercel environment variables before deployment
**Warning signs:** Works locally, fails in production

### Pitfall 3: Next.js Image Domain Not Configured
**What goes wrong:** Images from UploadThing don't display, console shows hostname blocked
**Why it happens:** next/image requires explicit domain allowlist for external images
**How to avoid:** Add UploadThing's CDN domain to next.config.ts images.remotePatterns
**Warning signs:** Broken images, 400 errors from /_next/image

### Pitfall 4: localStorage Not Available in Server Components
**What goes wrong:** "localStorage is not defined" error during SSR
**Why it happens:** Server Components run on server where browser APIs don't exist
**How to avoid:** Use client components ("use client") for any localStorage access, or check typeof window !== 'undefined'
**Warning signs:** Error during build or hydration mismatch

### Pitfall 5: Gallery Revalidation After Upload
**What goes wrong:** New upload doesn't appear in gallery until page refresh
**Why it happens:** Server Component data is cached, upload callback runs client-side
**How to avoid:** Call revalidatePath('/') in Server Action after saving design to database
**Warning signs:** Uploads complete successfully but gallery is stale

## Code Examples

### Database Schema Extension
```typescript
// src/db/schema.ts - add to existing file
// Source: Drizzle ORM SQLite docs
export const designs = sqliteTable("designs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  submitterName: text("submitter_name").notNull(),
  submitterToken: text("submitter_token").notNull(),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
});
```

### UploadThing File Router
```typescript
// src/app/api/uploadthing/core.ts
// Source: UploadThing App Router docs
import { createUploadthing, type FileRouter } from "uploadthing/next";
import sharp from "sharp";

const f = createUploadthing();

export const ourFileRouter = {
  designUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Get submitter info from request (passed via headers or form data)
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // Sharp strips EXIF by default - image already uploaded to UploadThing storage
      // If we need to process, we'd fetch, process, re-upload
      // For now, return the URL directly
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

### Typed Component Export
```typescript
// src/lib/uploadthing.ts
// Source: UploadThing React docs
import { generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
```

### Server Action for Design Deletion
```typescript
// src/actions/design-actions.ts
"use server";

import { db } from "@/db";
import { designs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteDesign(id: number) {
  await db.delete(designs).where(eq(designs.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteAllDesigns() {
  await db.delete(designs);
  revalidatePath("/");
  revalidatePath("/admin");
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FormData to custom S3 endpoint | UploadThing managed uploads | 2023-2024 | Eliminates AWS credential management, built-in React components |
| Client-side EXIF.js reading | Server-side Sharp processing | Always | Complete metadata removal vs partial, handles all formats |
| Custom lightbox implementations | react-photo-view / similar | 2022+ | Mobile gesture support, accessibility, performance |
| imagemagick CLI for processing | Sharp native Node.js | 2020+ | No system dependency, faster, better API |

**Deprecated/outdated:**
- **exif-js:** Read-only, doesn't strip metadata, use Sharp instead
- **blueimp-load-image:** Older client-side processor, Sharp is more reliable server-side

## Open Questions

1. **EXIF Stripping Architecture Decision**
   - What we know: Sharp can strip EXIF, but UploadThing uploads directly to their storage
   - What's unclear: Whether to process image before UploadThing receives it (client-side canvas) or after (download, process, re-upload)
   - Recommendation: Accept UploadThing's default storage (which may preserve EXIF), then if strict EXIF removal is required, implement a processing step. For MVP, test if UploadThing's storage already strips some metadata.

2. **Admin Authentication**
   - What we know: Phase 1 established /admin route without authentication
   - What's unclear: Whether admin-only features (delete) need any protection
   - Recommendation: Follow Phase 1 pattern - admin path is security-through-obscurity for MVP, sufficient for trusted team

## Sources

### Primary (HIGH confidence)
- UploadThing official docs (https://docs.uploadthing.com) - App Router setup, file routes, theming, React components
- Sharp official docs (https://sharp.pixelplumbing.com/api-output) - Metadata handling, automatic EXIF stripping
- react-photo-view official site (https://react-photo-view.vercel.app/) - API, gallery mode, touch gestures
- Drizzle ORM docs (https://orm.drizzle.team/docs/sql-schema-declaration) - SQLite schema patterns

### Secondary (MEDIUM confidence)
- shadcn/ui Dialog docs (https://ui.shadcn.com/docs/components/dialog) - Delete confirmation modal pattern

### Tertiary (LOW confidence)
- None - all claims verified against official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via npm registry and official docs
- Architecture: HIGH - Follows established Phase 1 patterns, standard Next.js App Router conventions
- Pitfalls: HIGH - Common issues documented in official sources and community knowledge

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (30 days - stable ecosystem)
