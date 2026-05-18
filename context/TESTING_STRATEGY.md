# Testing Strategy

> **Updated after behavioral refinement.** Testing is aligned with the behavioral MVP — the core loop (post → respond → coordinate) is the highest testing priority.

---

## Testing Philosophy

1. **Test behaviors, not just functions** — The most important tests validate that the core loop works
2. **Safety first** — Test that safety gating, reporting, and blocking work correctly
3. **Speed matters** — Feed loading time and real-time updates must be fast
4. **Real devices matter** — Push notifications, location, and auth need device testing

---

## Test Priority Matrix

| Priority | Area | Why |
|----------|------|-----|
| 🔴 CRITICAL | Core Loop: Post → Respond → Coordinate DM | If this breaks, the product is broken |
| 🔴 CRITICAL | Safety: Report, Block, Account Gating | Trust is existential |
| 🟡 HIGH | Auth: Sign-up, Login, Session | User can't enter |
| 🟡 HIGH | Feed: Load, Filter, Pagination | Primary surface |
| 🟡 HIGH | Notifications: Push delivery, Deep links | Retention driver |
| 🟢 MEDIUM | Profile: Edit, Display | Important but not core loop |
| 🟢 MEDIUM | Search: Users, Posts | Discovery layer |
| 🔵 LOW | Communities, Events | Phase 5+ |

---

## Unit Tests (Critical Path)

### Auth Service
- [ ] Phone OTP flow: request → verify → session created
- [ ] Session persistence across app restarts
- [ ] Session expiry → redirect to auth
- [ ] Sign-out clears local state

### Intent Feed Service
- [ ] Feed query filters by locality
- [ ] Feed sorts posts by urgency + freshness + reply velocity
- [ ] Expired posts excluded from feed
- [ ] Hidden posts excluded from feed
- [ ] Category filter works correctly

### Intent Response Service
- [ ] "I'm in" increments spots_filled
- [ ] spots_filled = spots_total → coordination_status = 'closed'
- [ ] Duplicate response from same user prevented
- [ ] Auto-creates coordination thread on response
- [ ] Response from blocked user is rejected

### Safety Gate Service
- [ ] New account (<24h) limited to 3 posts/day
- [ ] New account limited to 5 DMs/day
- [ ] After 7 days + N posts → standard mode
- [ ] Report content creates pending report
- [ ] Blocked user cannot interact with blocker's content

### Chat Service
- [ ] Message sent appears in thread
- [ ] Unread count increments for recipient
- [ ] Read receipt (last_read_at) updates correctly
- [ ] Message from blocked user is rejected

---

## Integration Tests (Critical Flows)

### Flow 1: Full Core Loop
```
Sign up → Choose locality → Create Now post → 
Other user sees post in feed → Responds "I'm in" → 
Post author gets notification → Opens DM → Coordinates meetup
```

### Flow 2: Safety Flow
```
Post inappropriate content → User reports → 
Report enters queue → Moderator hides post → 
Reporting user notified
```

### Flow 3: Account Gating Flow
```
New user signs up → Tries to post 4 times in 1 hour → 
4th post blocked → Shows safety limit message
```

### Flow 4: Notification Flow
```
User creates post → Other user responds → 
Author receives push notification → 
Taps notification → Opens post detail
```

---

## Manual Testing (Before Launch)

### Device Testing
- [ ] Auth flow on iOS and Android
- [ ] Feed loads with real content (<2s)
- [ ] Create post flow works
- [ ] Camera roll integration for images
- [ ] Push notifications received and tappable
- [ ] Deep links open correct screens
- [ ] Offline state handling (graceful degradation)
- [ ] App works with poor network (timeouts, retry)

### Pilot Testing (With Ambassadors)
- [ ] 5 ambassadors create 10+ posts each
- [ ] Test: cross-user coordination works
- [ ] Test: report + block flow
- [ ] Test: notification delivery on real devices
- [ ] Collect feedback on feed relevance
- [ ] Collect feedback on onboarding flow

---

## Pre-Launch Testing Checklist

### Phase 2 (Identity + Locality)
- [ ] Auth: Sign-up with phone OTP works end-to-end
- [ ] Onboarding: Locality selection works
- [ ] Auth guard: Redirects unauthenticated users
- [ ] Session persistence: Close app → reopen → still logged in

### Phase 3 (Live Intent MVP)
- [ ] Feed: Shows posts from correct locality
- [ ] Feed: Sort is correct (urgency + freshness)
- [ ] Feed: Pull-to-refresh works
- [ ] Post creation: All fields work (text, category, timing, spots)
- [ ] Post creation: Post appears in feed immediately
- [ ] Post expiration: Post disappears after time window
- [ ] Response: "I'm in" button works and updates spots
- [ ] Response: Coordination thread created automatically

### Phase 3B (Coordination Threads)
- [ ] Inbox: Shows active threads
- [ ] Chat: Messages send and receive in real-time
- [ ] Chat: Unread indicators work
- [ ] Push: Notification received on new message

### Phase 4 (Retention Engine)
- [ ] Push notifications: All categories tested
- [ ] Notification tap → correct screen
- [ ] Notification frequency within limits
- [ ] Dormant user reactivation flows

---

## Test Data Strategy

For MVP testing, use a seeded locality called "Test Campus" with:
- 10 test user accounts
- 50 seed posts across categories
- 5 ambassador accounts with verified badges
- 1 moderation admin account

All test data must be in a separate Supabase project or isolated by locality ID.
