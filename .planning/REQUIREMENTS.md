# Requirements: Jersey Design Voter

**Defined:** 2026-03-22
**Core Value:** Fair, democratic jersey selection — every team member's voice counts equally through ranked choice voting

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Access

- [ ] **ACC-01**: User can access the app via shared link without creating an account
- [ ] **ACC-02**: Admin has separate access to phase controls

### Submission

- [ ] **SUB-01**: User can upload design images (max 2 per person)
- [ ] **SUB-02**: User can view gallery of all submitted designs
- [ ] **SUB-03**: Uploaded images have EXIF metadata stripped for anonymity
- [ ] **SUB-04**: Submissions are anonymous during voting (no names shown)

### Voting

- [ ] **VOTE-01**: User can rank designs using drag-and-drop interface
- [ ] **VOTE-02**: User selects and ranks their top 3 designs per round
- [ ] **VOTE-03**: User sees confirmation screen before submitting vote
- [ ] **VOTE-04**: System prevents double voting via browser-based tracking
- [ ] **VOTE-05**: Round 1 uses RCV to narrow all submissions to top 3 finalists
- [ ] **VOTE-06**: Round 2 uses RCV to select single winner from 3 finalists

### Results & Admin

- [ ] **RES-01**: Admin can manually advance phases (Submit → Round 1 → Round 2 → Results)
- [ ] **RES-02**: Results are shown to users after each round ends
- [ ] **RES-03**: Final winner is clearly displayed with winning design
- [ ] **RES-04**: RCV elimination breakdown shows how winner was determined

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Submission

- **SUB-05**: User can upload multiple image variants per design (front/back views)
- **SUB-06**: User can add description text to their design

### Enhanced Voting

- **VOTE-07**: User can change their vote before round closes
- **VOTE-08**: User can rank all designs (not just top 3)

### Notifications

- **NOTF-01**: Users receive notification when phase changes
- **NOTF-02**: Admin sees live vote count (not standings) during voting

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts/login | Shared link sufficient for small trusted team |
| Live voting results | Reveals standings during voting, creates bandwagon effect |
| Comments on designs | Keep focus on voting, not discussion |
| Automatic phase deadlines | Admin controls pacing manually for team flexibility |
| Email notifications | Team can coordinate via existing channels |
| Mobile app | Web app is sufficient and accessible on mobile browsers |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ACC-01 | — | Pending |
| ACC-02 | — | Pending |
| SUB-01 | — | Pending |
| SUB-02 | — | Pending |
| SUB-03 | — | Pending |
| SUB-04 | — | Pending |
| VOTE-01 | — | Pending |
| VOTE-02 | — | Pending |
| VOTE-03 | — | Pending |
| VOTE-04 | — | Pending |
| VOTE-05 | — | Pending |
| VOTE-06 | — | Pending |
| RES-01 | — | Pending |
| RES-02 | — | Pending |
| RES-03 | — | Pending |
| RES-04 | — | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 0
- Unmapped: 16 ⚠️

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after initial definition*
