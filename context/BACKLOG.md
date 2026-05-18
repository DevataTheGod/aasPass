# Backlog

> Reorganized after behavioral refinement. Items are prioritized by their contribution to the core behavioral loop. High = supports the loop. Medium = adds depth. Low = expansion.

---

## Behavior-Critical (Post-MVP, High Priority)

These improve the core live-intent loop but weren't essential for MVP proof:

- [ ] **User mentions** (@username) — Makes coordination easier
- [ ] **Post sharing** (share to WhatsApp, Instagram) — Organic growth loop
- [ ] **Read receipts in chat** — Reduces coordination uncertainty
- [ ] **Typing indicators** — Chat feels more alive
- [ ] **Post with polls** — "Where should we go? A, B, or C?"
- [ ] **Post with location check-in** — "I'm at X right now, anyone nearby?"
- [ ] **Trending posts in locality** — Surfaces what's hot
- [ ] **Search across posts, communities, events, users** — Discovery utility
- [ ] **Quick actions from notifications** — "I'm in" from notification without opening app
- [ ] **Deep linking** — Share post links that open directly in app
- [ ] **Recurring "same time tomorrow" posts** — For regular activities

---

## Retention Enhancers (Post-MVP, Medium Priority)

These improve daily habit but aren't needed for MVP proof:

- [ ] **Activity pulse widget** (home screen widget) — "3 active plans near you"
- [ ] **"People you might know" suggestions** — Social graph expansion
- [ ] **Recommended communities** — Discovery within locality
- [ ] **People discovery** (similar interests, same locality)
- [ ] **Familiar face recognition** — "You've interacted with X 3 times"
- [ ] **Event check-in** (QR code) — Confirms real-world attendance
- [ ] **Event reminders** — "Event starts in 1 hour"
- [ ] **Recurring events** — Weekly badminton, monthly meetups
- [ ] **Event categories and filters**
- [ ] **User streaks and gamification** (use with caution — behavioral risk)
- [ ] **Stories / ephemeral posts** (use with caution — could fragment attention)

---

## Trust & Safety (Post-MVP, Medium Priority)

Enhancements to the safety system:

- [ ] **Automated spam detection** — Reduce manual moderation load
- [ ] **Content moderation AI** — Flag potentially harmful content
- [ ] **User trust scores** (computed, not shown publicly) — Internal risk metric
- [ ] **Verified badges for localities/colleges** — Official community markers
- [ ] **Emergency contact / safety features** — Share plan with friend, check-in timer
- [ ] **Women-only communities or settings** (if demand exists)
- [ ] **Block sync across feed/chat** — Block in one place = blocked everywhere

---

## Social Depth (Post-MVP, Medium Priority)

- [ ] **Follow/friend system** (use with caution — may encourage passive following over active posting)
- [ ] **Group chats** — Multi-person coordination
- [ ] **Voice notes in chat** — Richer communication
- [ ] **Video uploads** — Richer posts
- [ ] **Image galleries in posts** (multiple images)
- [ ] **Live streaming** (Phase 8+)

---

## Platform Expansion (Post-MVP, Low Priority)

- [ ] **Map view for nearby content** — Visual discovery
- [ ] **Radius-based geo queries** (PostGIS) — Beyond locality scope
- [ ] **Social sign-in** (Google, Apple)
- [ ] **Phone auth** (alternative to email OTP)
- [ ] **Web version** (responsive)
- [ ] **Multi-language support**
- [ ] **Accessibility improvements**
- [ ] **Widgets** (iOS / Android)
- [ ] **Desktop notifications** (for web version)
- [ ] **Multi-city expansion playbook**

---

## Business Layer (Post-MVP, Low Priority)

- [ ] **Business verification**
- [ ] **Business dashboard** (analytics, post insights)
- [ ] **Paid promotional posts for businesses**
- [ ] **Local deals and offers**
- [ ] **Business directory with categories**
- [ ] **Contact business via DM**

---

## Technical Debt

- [ ] Write unit tests for core services (safety gate, feed ranking, notification router)
- [ ] Write integration tests for critical flows (auth → post → respond → DM)
- [ ] End-to-end testing setup (Detox / Maestro)
- [ ] Performance profiling and optimization
- [ ] Accessibility audit
- [ ] Error boundary improvements
- [ ] Analytics events coverage (PostHog)
- [ ] CI/CD pipeline setup
- [ ] Storybook for component library
