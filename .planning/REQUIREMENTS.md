# Requirements: Jersey Design Voter

**Defined:** 2026-03-22
**Core Value:** Fair, democratic jersey selection — every team member's voice counts equally through ranked choice voting

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Access

- [x] **ACC-01**: User can access the app via shared link without creating an account
- [x] **ACC-02**: Admin has separate access to phase controls

### Submission

- [x] **SUB-01**: User can upload design images (max 2 per person)
- [x] **SUB-02**: User can view gallery of all submitted designs
- [x] **SUB-03**: Uploaded images have EXIF metadata stripped for anonymity
- [x] **SUB-04**: Submissions are anonymous during voting (no names shown to regular users)
- [x] **SUB-05**: Admin can see submitter name for each design

### Voting

- [ ] **VOTE-01**: User can rank designs by tapping to select 1st, 2nd, 3rd choice in sequence
- [ ] **VOTE-02**: Selected designs show their rank number (1, 2, 3) after being tapped
- [ ] **VOTE-03**: User sees confirmation screen before submitting vote
- [x] **VOTE-04**: System prevents double voting via browser-based tracking
- [x] **VOTE-05**: Round 1 uses RCV to narrow all submissions to top 3 finalists
- [x] **VOTE-06**: Round 2 uses RCV to select single winner from 3 finalists

### Results & Admin

- [x] **RES-01**: Admin can manually advance phases (Submit -> Round 1 -> Round 2 -> Results)
- [ ] **RES-02**: Results are shown to users after each round ends
- [ ] **RES-03**: Final winner is clearly displayed with winning design
- [ ] **RES-04**: RCV elimination breakdown shows how winner was determined
- [ ] **RES-05**: Admin can delete submitted designs
- [x] **RES-06**: Admin can reset voting rounds (clear all votes)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Submission

- **SUB-06**: User can upload multiple image variants per design (front/back views)
- **SUB-07**: User can add description text to their design

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
| ACC-01 | Phase 1 | Complete |
| ACC-02 | Phase 1 | Complete |
| SUB-01 | Phase 2 | Complete |
| SUB-02 | Phase 2 | Complete |
| SUB-03 | Phase 2 | Complete |
| SUB-04 | Phase 2 | Complete |
| SUB-05 | Phase 2 | Complete |
| VOTE-01 | Phase 3 | Pending |
| VOTE-02 | Phase 3 | Pending |
| VOTE-03 | Phase 3 | Pending |
| VOTE-04 | Phase 3 | Complete |
| VOTE-05 | Phase 3 | Complete |
| VOTE-06 | Phase 3 | Complete |
| RES-01 | Phase 3 | Complete |
| RES-02 | Phase 3 | Pending |
| RES-03 | Phase 3 | Pending |
| RES-04 | Phase 3 | Pending |
| RES-05 | Phase 3 | Pending |
| RES-06 | Phase 3 | Complete |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after roadmap creation*
