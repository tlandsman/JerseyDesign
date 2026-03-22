# Phase 2: Submission System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-22
**Phase:** 02-submission-system
**Areas discussed:** Upload experience, Gallery layout, Submitter tracking, Anonymous display

---

## Upload Experience

| Option | Description | Selected |
|--------|-------------|----------|
| Drag-and-drop zone | Large drop area with 'click to browse' fallback. Modern feel, works on desktop and mobile. | Y |
| Simple file button | Traditional 'Choose File' button. Simpler but less visual feedback. | |
| Camera-first on mobile | Prompt to take photo on mobile, file picker on desktop. | |

**User's choice:** Drag-and-drop zone (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, preview with confirm | Show thumbnail after selecting, user clicks 'Submit' to finalize. | Y |
| Immediate upload | Upload starts as soon as file is selected. | |
| Preview with crop/rotate | Allow basic editing before submit. | |

**User's choice:** Yes, preview with confirm (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Counter display | 'You have submitted 1 of 2 designs' — clear status, upload area disabled when full. | Y |
| Slots visualization | Two empty slots that fill up. | |
| Only show when approaching limit | No indication until they hit the limit. | |

**User's choice:** Counter display (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Progress bar + success toast | Shows upload progress, then brief success message. | Y |
| Inline success state | The drop zone transforms to show the uploaded image. | |
| You decide | Claude picks appropriate feedback pattern. | |

**User's choice:** Progress bar + success toast

---

## Gallery Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Uniform grid | Same-size cards in a grid. Images cropped/fitted to squares or fixed aspect ratio. | Y |
| Masonry layout | Pinterest-style varying heights based on image aspect ratio. | |
| Large carousel | One design at a time, swipe through. | |

**User's choice:** Uniform grid (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| 3 per row | Good balance of size and overview. Images large enough to see details. | Y |
| 4 per row | More compact, see more at once. | |
| 2 per row | Larger cards, fewer per screen. | |

**User's choice:** 3 per row (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Lightbox/modal | Opens full-size image in an overlay. Standard pattern for image galleries. | Y |
| Expand in place | Card expands to show larger image without leaving the page context. | |
| Nothing during submission phase | Clicking only matters during voting. | |

**User's choice:** Lightbox/modal (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Encouraging message + upload prompt | 'No designs yet — be the first to submit!' with prominent upload button. | |
| Simple placeholder | Just text like 'Designs will appear here'. | |
| You decide | Claude picks appropriate empty state. | Y |

**User's choice:** You decide

---

## Submitter Tracking

| Option | Description | Selected |
|--------|-------------|----------|
| Browser fingerprint + localStorage | Generate unique ID stored in browser. | |
| Name entry on upload | User types their name when uploading. Stored with design, shown to admin only. | Y |
| Cookie-based tracking | Similar to localStorage but may be cleared more easily. | |

**User's choice:** Name entry on upload

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, remember in browser | Pre-fill name from localStorage on return visits. | Y |
| No, always ask | User enters name each time. | |
| You decide | Claude picks appropriate behavior. | |

**User's choice:** Yes, remember in browser (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Honor system | Show count but don't block. Trust the team. Admin can delete extras if needed. | Y |
| Soft block by name | If same name has 2 uploads, show warning but allow override. | |
| Hard block by name | Strictly prevent 3rd upload from same name. | |

**User's choice:** Honor system (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, subtle indicator | Small badge or border on their own submissions. 'Your design' visible only to them. | Y |
| No distinction | All designs look the same. | |
| You decide | Claude picks appropriate approach. | |

**User's choice:** Yes, subtle indicator (Recommended)

---

## Anonymous Display

| Option | Description | Selected |
|--------|-------------|----------|
| Just the image | Clean, anonymous. No metadata, timestamps, or numbers. | |
| Image + submission number | 'Design #5' — helps reference designs in conversation. | Y |
| Image + submission date | Shows when uploaded. | |

**User's choice:** Image + submission number

| Option | Description | Selected |
|--------|-------------|----------|
| Name visible on card | Submitter name shown directly on each design card in admin view. | Y |
| Name on hover/click | Name hidden until admin hovers or clicks. | |
| Separate admin list | Admin has a table view with names + thumbnail links. | |

**User's choice:** Name visible on card (Recommended)

**Delete functionality:** User clarified they want both individual delete on each card AND a "Delete All" button for clearing test data quickly.

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, confirmation dialog | 'Delete all 12 designs? This cannot be undone.' | Y |
| Yes, type to confirm | Type 'DELETE' to confirm. | |
| No confirmation needed | Immediate delete. | |

**User's choice:** Yes, confirmation dialog (Recommended) for Delete All

---

## Claude's Discretion

- Empty state design (when no designs submitted yet)
- Exact styling of "Your design" indicator
- Mobile responsive breakpoints
- Error state handling

## Deferred Ideas

None — discussion stayed within phase scope
