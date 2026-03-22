# Pitfalls Research

**Domain:** Jersey Design Voting App (Image Upload + Ranked Choice Voting)
**Researched:** 2026-03-22
**Confidence:** MEDIUM-HIGH

## Critical Pitfalls

### Pitfall 1: Ballot Exhaustion in Ranked Choice Voting

**What goes wrong:**
When voters don't rank all candidates and their ranked choices are eliminated, their ballot becomes "exhausted" and no longer counts in final tallies. In a jersey design context, if someone ranks only 2 of 8 designs and both are eliminated early, their voice disappears from the final decision.

**Why it happens:**
Developers implement RCV algorithm correctly but don't consider partial ballots. Voters may not understand they should rank more candidates, or the UI doesn't encourage complete ranking.

**How to avoid:**
- Require minimum rankings (e.g., "rank at least 3 designs")
- Show clear UI messaging: "Ranking more designs ensures your voice counts"
- Display exhausted ballot count in results so team understands what happened
- Consider allowing ranking of ALL designs, not just top 3

**Warning signs:**
- High percentage of exhausted ballots (>20%) indicates UX confusion
- Winner has fewer votes than total participants (legitimacy concerns)
- Post-vote complaints: "I didn't realize my vote wouldn't count"

**Phase to address:**
Voting implementation phase - algorithm design and UI for ballot submission

---

### Pitfall 2: Double Voting / Vote Manipulation Without Authentication

**What goes wrong:**
With shared link access and no accounts, the same person can vote multiple times using different devices/browsers, or share the link externally allowing non-team members to vote.

**Why it happens:**
The project explicitly avoids authentication for simplicity, but this creates an integrity gap. Cookie/localStorage tracking is easily bypassed.

**How to avoid:**
- Use browser fingerprinting + localStorage together (layered approach)
- Generate unique voting tokens per participant (admin distributes specific links)
- Implement IP-based rate limiting as additional signal
- Show vote counts to admin to detect anomalies (15 person team shouldn't have 30 votes)
- Accept this tradeoff explicitly: for a trusted team, social accountability may suffice

**Warning signs:**
- Vote count exceeds expected team size
- Votes arrive in rapid succession from similar patterns
- Results seem manipulated (team members complain)

**Phase to address:**
Core infrastructure phase - participant tracking mechanism must be designed early

---

### Pitfall 3: Unrestricted File Upload Security Vulnerabilities

**What goes wrong:**
Accepting user-uploaded images without proper validation enables malicious file uploads - executable scripts disguised as images, oversized files causing DoS, or inappropriate content.

**Why it happens:**
Developers trust file extensions and MIME types provided by users without server-side verification. Validation is client-side only.

**How to avoid:**
- Validate file signatures (magic bytes), not just extensions
- Allowlist specific formats: PNG, JPG, WEBP only
- Set strict file size limits (e.g., 10MB max)
- Rename uploaded files to random UUIDs (never use user-provided names)
- Store uploads outside webroot or on separate domain/CDN
- Process images through a library that strips EXIF data and validates structure
- Scan for embedded scripts in image metadata

**Warning signs:**
- Files with mismatched extensions and content types
- Unusually large "image" files
- Server errors when processing uploaded files

**Phase to address:**
Image upload phase - must implement validation before any uploads are accepted

---

### Pitfall 4: Anonymous Submissions Accidentally Exposed

**What goes wrong:**
Design submissions are supposed to be anonymous during voting, but metadata leaks identity: EXIF data contains photographer name, file names include submitter info, or upload timestamps correlate with team member activity.

**Why it happens:**
Developers focus on hiding the database association but forget about the image file itself containing identifying information.

**How to avoid:**
- Strip ALL EXIF metadata on upload (including camera info, GPS, author)
- Rename files to random identifiers immediately
- Don't expose upload timestamps in any UI
- Process images through Sharp or similar library that sanitizes metadata
- Display designs in randomized order (not upload order)

**Warning signs:**
- Team members saying "I can tell whose design this is"
- Raw image URLs visible in browser that reveal patterns
- Designs displaying in consistent order that maps to submission time

**Phase to address:**
Image upload phase - metadata stripping must happen at upload time

---

### Pitfall 5: Image Display Inconsistencies Across Devices

**What goes wrong:**
Jersey designs look great on desktop but terrible on mobile, or images render at wildly different sizes making fair comparison impossible. Some designs appear huge while others are tiny thumbnails.

**Why it happens:**
Developers don't normalize image display. User-uploaded images vary in dimensions, aspect ratios, and file sizes. No responsive image handling implemented.

**How to avoid:**
- Generate consistent thumbnail sizes on upload (e.g., 800px max dimension)
- Create multiple sizes for responsive display
- Use CSS object-fit: contain to preserve aspect ratio in fixed containers
- Consider adding standard frame/border around all designs for visual consistency
- Test on mobile devices during development

**Warning signs:**
- Design images overflow containers or appear tiny
- Page load is slow due to serving full-resolution images
- Team members complain they can't see designs properly on phones

**Phase to address:**
Image upload phase - image processing pipeline should generate display-optimized versions

---

### Pitfall 6: Phase Transition Data Corruption

**What goes wrong:**
Admin advances from submission to voting, but late submissions still arrive. Or voting closes but results calculation includes partial data. State transitions aren't atomic.

**Why it happens:**
Manual phase control without proper locking. Race conditions between user actions and admin phase changes.

**How to avoid:**
- Implement clear phase states in database with timestamps
- Reject submissions after phase ends (return clear error message)
- Lock voting data before running RCV calculation
- Use database transactions for phase transitions
- Show clear UI messaging when phase has ended

**Warning signs:**
- Submissions appearing after deadline
- Results changing after being displayed
- Inconsistent state shown to different users

**Phase to address:**
Phase management implementation - state machine design is critical

---

### Pitfall 7: Confusing Ranked Choice UI Leading to Invalid Ballots

**What goes wrong:**
Users don't understand how to rank choices, submit incomplete ballots, try to give same rank to multiple designs, or accidentally rank in wrong order (thinking 1 is worst not best).

**Why it happens:**
RCV is unfamiliar to most people. UI doesn't guide users through the process clearly enough.

**How to avoid:**
- Provide clear instructions with example: "1 = your favorite, 2 = second favorite..."
- Use drag-and-drop ranking for intuitive reordering
- Validate on submission: "You've only ranked 2 designs. Ranking more ensures your vote counts longer."
- Show preview of ballot before final submission
- Prevent same rank assignment (enforce unique rankings)
- Consider visual feedback showing current ranking order

**Warning signs:**
- High rate of ballot validation errors
- Users asking "did my vote work?"
- Support questions about how to vote
- Lots of single-choice ballots in RCV system

**Phase to address:**
Voting UI phase - UX design must prioritize clarity over minimalism

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Storing images in database BLOBs | Simple, no external storage setup | Performance degrades, backup complexity, can't use CDN | Never for images - use object storage |
| Client-side only vote tracking (localStorage) | No backend complexity | Trivially bypassed, cleared on browser reset | Only as ONE layer of multi-layered approach |
| Manual RCV calculation (spreadsheet export) | Avoids algorithm implementation | Error-prone, not scalable, can't show live results | Only for MVP validation with <10 voters |
| Polling for phase changes | Simpler than websockets | Wasted requests, delayed UX | Acceptable for small team with long polling intervals |
| No image optimization | Faster upload implementation | Slow page loads, poor mobile experience | Never - basic optimization is table stakes |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| S3/Cloud Storage | Using bucket's public URL directly | Use signed URLs or CDN with proper caching headers |
| Image CDN (Cloudinary, etc.) | Not configuring allowed transformations | Set up strict transformation allowlists to prevent abuse |
| Vercel Image Optimization | Assuming automatic optimization | Must use Image component and configure remotePatterns |
| Supabase Storage | Setting upsert:true to overwrite | Upload to unique paths - CDN propagation causes stale content |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading all images at once | Initial page load >5s | Implement lazy loading, show thumbnails first | >10 images |
| Full-resolution image gallery | Mobile users complain, high data usage | Generate responsive image sizes on upload | Any mobile user on cellular |
| Synchronous RCV calculation | Page hangs during calculation | Fine for this project scale (15 voters, <20 designs) | >100 voters or >50 candidates |
| No image caching headers | Repeat visitors re-download all images | Set appropriate Cache-Control headers | Any return visit |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Trusting file extension for validation | Executable file uploaded as image.jpg.php | Validate magic bytes, use image processing library |
| Exposing upload/vote patterns | Anonymity broken through timing correlation | Add random delays, randomize display order |
| Predictable design/ballot URLs | Enumeration reveals all submissions | Use UUIDs, not sequential IDs |
| Storing votes with user identifiers in same table | Privacy leak if database exposed | Store votes separately from any user tracking, minimize data collection |
| No rate limiting on link access | Automated voting scripts | Basic rate limiting even without auth |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No upload progress indicator | Users think upload failed, submit multiple times | Show progress bar, disable button during upload |
| Ranking via dropdown menus | Tedious, error-prone for >5 choices | Drag-and-drop ranking is more intuitive |
| Showing live results during voting | Bandwagon effect, voters just pick leader | Results only visible after round ends |
| No confirmation after vote | Anxiety about whether vote registered | Clear success message with summary of rankings |
| Tiny image thumbnails in voting view | Can't fairly evaluate designs | Large enough to see detail, with tap-to-enlarge |
| Results page showing only winner | Team curious about full rankings | Show complete elimination rounds and vote counts |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Image Upload:** Often missing EXIF stripping - verify metadata is removed
- [ ] **Image Upload:** Often missing file type validation beyond extension - verify magic bytes checked
- [ ] **Image Upload:** Often missing responsive variants - verify multiple sizes generated
- [ ] **Voting:** Often missing ballot confirmation - verify user sees what they submitted
- [ ] **Voting:** Often missing vote-change capability - verify users can update before round ends
- [ ] **RCV Algorithm:** Often missing tie-breaker logic - verify what happens with exact ties
- [ ] **Results:** Often missing exhausted ballot count - verify this is displayed
- [ ] **Phase Transitions:** Often missing "door close" enforcement - verify late actions rejected
- [ ] **Mobile:** Often missing touch-friendly interactions - verify drag-and-drop works on mobile

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Double voting detected | MEDIUM | Admin reviews vote patterns, potentially restart round with token system |
| Anonymous submissions exposed | HIGH | Cannot un-reveal identity - must restart submission phase if fairness compromised |
| Malicious file uploaded | MEDIUM | Delete file, scan storage, review upload validation code |
| RCV algorithm bug | MEDIUM | Re-run calculation with fixed algorithm, verify against manual calculation |
| Phase transition corruption | HIGH | Restore from backup, communicate with team about timeline extension |
| Image display issues | LOW | Regenerate image variants, update CSS - no data loss |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Ballot Exhaustion | Voting Implementation | Test RCV with partial ballots, verify UI messaging |
| Double Voting | Core Infrastructure | Attempt voting twice in test, verify rejection or tracking |
| File Upload Security | Image Upload | Upload test files with wrong extensions, verify rejection |
| Anonymous Leak | Image Upload | Check uploaded images for EXIF data, inspect file URLs |
| Display Inconsistency | Image Upload | View gallery on mobile and desktop, verify consistent sizing |
| Phase Transition Corruption | Phase Management | Submit during transition, verify proper rejection |
| Confusing Ranking UI | Voting UI | User test with non-technical person, observe confusion points |

## Sources

- OWASP Cheat Sheet Series: File Upload Cheat Sheet (cheatsheetseries.owasp.org) - HIGH confidence
- OWASP: Unrestricted File Upload (owasp.org) - HIGH confidence
- MDN: File API and Form Data Handling (developer.mozilla.org) - HIGH confidence
- Ballotpedia: Ranked Choice Voting criticisms and implementation challenges - MEDIUM confidence
- AWS S3 Documentation: Upload best practices - HIGH confidence
- Supabase Storage Documentation: Upload gotchas - MEDIUM confidence
- Cloudinary Documentation: Common upload mistakes - MEDIUM confidence
- Vercel Image Optimization Documentation - HIGH confidence
- CSS-Tricks: Drag and Drop File Uploading pitfalls - MEDIUM confidence
- GitHub: Anonymized URLs security considerations - MEDIUM confidence

---
*Pitfalls research for: Jersey Design Voting App*
*Researched: 2026-03-22*
