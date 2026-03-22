# Phase 1: Foundation and Access - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-22
**Phase:** 01-foundation-and-access
**Areas discussed:** Landing experience, Admin access method

---

## Landing Experience

| Option | Description | Selected |
|--------|-------------|----------|
| Jump straight in | Show the current phase content immediately (gallery, voting, or results) | |
| Welcome screen | Brief intro with team name and "Get Started" button | |
| Phase-aware landing | Different landing based on phase — e.g., "Submissions open!" or "Voting time!" | ✓ |

**User's choice:** Phase-aware landing
**Notes:** User wants the landing to reflect the current phase state

---

| Option | Description | Selected |
|--------|-------------|----------|
| Hero banner | Big, bold message at top — "Submit Your Designs!" with action below | ✓ |
| Subtle indicator | Small badge/pill showing phase, content is the focus | |
| Full splash | Phase message takes the whole screen with a "Continue" button | |

**User's choice:** Hero banner
**Notes:** Prominent but not blocking — message at top with action below

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, prominent | Team name in header, maybe team colors if you have them | ✓ |
| Minimal mention | Small team name somewhere, but app is generic | |
| No branding | Keep it generic — just "Jersey Vote" or similar | |

**User's choice:** Yes, prominent — Team name "Primed"
**Notes:** User provided team name: "Primed"

---

## Admin Access Method

| Option | Description | Selected |
|--------|-------------|----------|
| Separate admin URL | Different link like /admin that only you know | ✓ |
| Password on main app | Everyone sees same app, admin enters password to unlock controls | |
| Secret gesture/code | Hidden access — tap logo 5 times or enter a code | |

**User's choice:** Separate admin URL
**Notes:** Simpler approach — admin just keeps the URL private

---

| Option | Description | Selected |
|--------|-------------|----------|
| No auth needed | Anyone with the admin URL can access controls (simpler, you just don't share it) | ✓ |
| Simple password | Admin URL prompts for a password you set | |
| You decide | Claude picks the simplest secure approach | |

**User's choice:** No auth needed
**Notes:** Simplicity over security — small trusted team

---

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated admin page | Separate page with all controls — phase buttons, delete, reset | |
| Overlay on main app | Same view as users, but with admin controls visible at top/bottom | |
| You decide | Claude picks based on what works best | ✓ |

**User's choice:** You decide
**Notes:** Claude has discretion on admin control placement

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, show both | Admin sees user view + admin controls together | ✓ |
| Toggle between views | Button to switch between admin and user perspective | |
| Admin-only view | Just show admin controls, open regular URL separately to preview | |

**User's choice:** Yes, show both
**Notes:** Admin can see exactly what users see while also having controls available

---

## Claude's Discretion

- Admin control placement (dedicated panel, floating controls, sidebar)
- Phase indicator styling details
- Error state handling
- Loading states

## Deferred Ideas

None — discussion stayed within phase scope
