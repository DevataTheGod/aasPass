# Decisions Log

> Architecture Decision Records (ADRs). Each entry documents a significant decision, its context, and the rationale.

---

## 2025-06-08 (Initial Decisions)

### Decision: Use Supabase for MVP Backend

**Context:** We need a backend for auth, database, file storage, and real-time features.

**Decision:** Use Supabase for the MVP.

**Rationale:**
- Faster to ship than building a custom backend
- Includes auth (GoTrue), Postgres database, real-time WebSocket subscriptions, and S3-compatible storage in one SDK
- PostGIS support for future geospatial queries
- Row-Level Security (RLS) for data protection
- Generous free tier
- TypeScript SDK with good DX

**Consequences:**
- Tied to Supabase-specific APIs (easy to migrate later if needed)
- Need to learn RLS policies and real-time channel patterns

---

### Decision: Start Locality-First, Not Live GPS-First

**Context:** AasPaas is location-based. Need to decide content scope for MVP.

**Decision:** Use locality/college ID as the primary content scope, NOT live GPS coordinates.

**Rationale:**
- Simpler MVP — No complex geo-queries
- Better privacy — Users see "Bandra West" not "52m from your location"
- Better moderation — Clear locality boundaries
- Better content density — All users in a college see the same feed

**Consequences:**
- Need to seed locality data
- PostGIS radius queries added in Phase 8

---

### Decision: Tabs = Feed, Inbox, Profile (Revised)

**Context:** Original decision was Feed, Explore, Inbox, Profile. Revised after behavioral refinement.

**Decision:** Three tabs for MVP: **Feed** (primary), **Inbox** (coordination threads), **Profile** (user identity).

**Rationale:**
- **Feed** is the core loop — live intent posts
- **Inbox** is for coordination — DMs triggered by intent responses
- **Profile** is for user identity and settings
- No "Explore" tab for MVP — communities/events are Phase 5+
- No "Create" tab — FAB button on feed for creating posts

**Consequences:**
- Clean, focused tab bar for MVP
- Explore tab added in Phase 5+ when communities/events exist
- FAB component needed on feed screen

---

### Decision: Create Post is a Modal, Not a Screen or Tab

**Context:** How should users create new posts?

**Decision:** Modal presentation triggered by floating action button (FAB) on feed tab.

**Rationale:**
- Modal feels like a temporary action (write → post → back to feed)
- No dedicated tab needed
- FAB is consistent with social app patterns

**Consequences:**
- Need to build CreatePost modal
- FAB component on feed screen

---

### Decision: Minimal DMs in MVP (REVISED — Was Phase 5)

**Context:** Original decision pushed chat to Phase 5. Behavioral refinement revealed that the core loop (post → respond → coordinate) requires DMs to complete.

**Decision:** Include **minimal 1:1 coordination threads** in MVP (Phase 3B).

**Rationale:**
- Core loop: "I'm in" → "Where exactly?" → Coordinate
- Without DMs, the loop breaks at the coordination step
- DMs don't need to be full-featured chat — just text + basic read state
- Auto-create thread when someone responds to a post

**Consequences:**
- Chat moves from Phase 5 to Phase 3B
- Still NO group chats, voice, video, read receipts in MVP
- Need real-time subscriptions earlier

---

### Decision: Use TanStack Query for Server State

**Context:** Need data fetching and caching solution.

**Decision:** Use TanStack Query (React Query).

**Rationale:**
- Automatic caching and background refetching
- Pagination support for feed
- Optimistic updates for responses, comments
- Well-documented, TypeScript-first

---

### Decision: Use Zustand for Local State

**Context:** Need lightweight local state management.

**Decision:** Use Zustand.

**Rationale:**
- Minimal boilerplate vs Redux
- No provider wrapper needed (unlike Context)
- TypeScript-first, small bundle size

---

### Decision: Feature-Based Organization in src/

**Context:** How to organize code within the app.

**Decision:** Feature-based organization under `src/features/`, with shared code in `src/components/ui/`, `src/services/`, etc.

---

### Decision: Phone OTP for MVP Auth

**Context:** What auth method for the MVP? Hyperlocal trust requires identity verification.

**Decision:** Use phone OTP as the primary auth method. Email OTP as fallback.

**Rationale:**
- Phone OTP provides stronger identity verification for hyperlocal trust
- Phone numbers are harder to fake than emails — reduces spam accounts
- College students universally have phones
- Phone verification enables account age gating (trust layer)
- Supabase supports phone auth with Twilio/Vonage
- Email OTP as fallback for users without phone access

**Consequences:**
- Need Twilio/Vonage account for SMS delivery
- Slight friction in onboarding (enter phone → receive code → enter code)
- SMS costs per verification (manageable at MVP scale)

---

### Decision: New Architecture Enabled

**Context:** Expo 54 defaults to the New Architecture.

**Decision:** Keep New Architecture enabled as configured.

---

## 2025-06-08 (Behavioral Refinement Decisions — NEW)

### Decision: MVP is Behavior-First, Not Feature-First

**Context:** The original MVP scope was too broad — trying to be feed, events, communities, business platform, discovery, messaging, and recommendations all at once.

**Decision:** The MVP is defined by ONE core behavior: **live local intent coordination**. Everything else is secondary.

**Rationale:**
- Apps succeed from habits, not features
- The strongest behavioral wedge: "Nearby people looking to do something NOW"
- Communities, events, and business features can layer on later
- A focused loop proves product-market fit faster

**Consequences:**
- MVP_SCOPE.md, ROADMAP.md, and DATA_MODELS.md all revised
- Success metrics now behavioral (time-to-response, response rate, next-day return)
- Communities and events pushed to Phase 5+

---

### Decision: Core Wedge = Live Local Intent

**Context:** Need to define the single most important user action the MVP enables.

**Decision:** The MVP's core is a "Now Post" — a lightweight, time-sensitive, participation-seeking post about a nearby activity.

**Post types (priority order):**
1. **Now** — "Anyone for badminton at 6?" (highest priority)
2. **Ask** — "Best dosa near college?" (utility)
3. **Pulse** — "Great vibe at this café" (social proof)
4. **Planned** — "Turf booked Saturday" (Phase 5+)

**Rationale:**
- Time-sensitive content creates urgency and returns
- Intent-based posts are more actionable than general content
- Clear content hierarchy makes feed ranking simpler

**Consequences:**
- Posts table has new fields: post_type, urgency_level, spots, venue_hint, coordination_status
- Feed ranks Now posts highest, then Ask, then Pulse
- Post expiration is a core feature, not an edge case

---

### Decision: Feed Ranks for Actionability, Not Engagement

**Context:** How should the feed sort content?

**Decision:** Feed ranking prioritizes posts most likely to lead to real-world coordination, not passive engagement.

**Ranking factors (weighted):**
- **HIGHEST:** Freshness, Urgency, Reply velocity, Post type = Now
- **MEDIUM:** Same locality, Same college, Same interests
- **LOWER:** Generic popularity, Creator trust score

**Rationale:**
- Passive engagement (likes, views) doesn't indicate real-world value
- A post with 2 "I'm in" responses is more valuable than a post with 50 likes
- Prevents the feed from becoming Instagram-style passive consumption

**Consequences:**
- Need reply_velocity tracking on posts
- intent_responses table instead of (just) generic reactions
- Feed_service with ranking logic

---

### Decision: Safety Architecture is a First-Class Product System

**Context:** The original safety planning was basic — just reporting and blocking. Hyperlocal apps have higher safety risks.

**Decision:** Safety is a **multi-layer trust system**, not a feature checklist.

**Layers:**
1. Identity confidence (phone OTP, account age)
2. Visibility controls (locality-only, no precise location)
3. Interaction gating (graduated trust levels for new accounts)
4. Meetup safety (public place defaults, safety prompts)
5. Moderation operations (SLAs, ambassador system)

**Rationale:**
- Hyperlocal apps connect strangers nearby — safety is existential
- Women and vulnerable users need strong defaults
- Graduated trust prevents abuse without damaging UX for legitimate users

**Consequences:**
- New tables: user_verifications, user_trust_signals
- New provider: SafetyGateProvider in provider tree
- Account age gating on post and DM limits
- New document: SAFETY_TRUST.md

---

### Decision: No Deceptive Fake-User Seeding

**Context:** Many hyperlocal apps use fake accounts to seed content during cold start.

**Decision:** Never use fake identities or AI pretending to be local users.

**Acceptable seeding:**
- Ambassador-created real posts from real people
- Official "AasPaas" or "AasPaas Campus" accounts
- Daily prompt templates posted transparently
- Community organizers posting on behalf of groups

**Rationale:**
- Trust is the product's foundation in a hyperlocal context
- Deceptive seeding destroys trust if discovered
- Real ambassador content is harder to scale but more authentic

**Consequences:**
- Need ambassador program early (Phase 4)
- Content seeding playbook is explicit about ethical boundaries
- Seeded content ratio decreases as locality matures

---

### Decision: Notifications are a Product System, Not an Ops Detail

**Context:** Notifications were previously treated as a basic implementation concern.

**Decision:** Notifications have defined categories, personalization rules, frequency caps, and first-week cadence as a designed product system.

**Categories:** Immediate Action, Direct Social Response, Area Pulse, Scarcity/FOMO, Trust-Building Updates

**Rationale:**
- Bad notifications are the #1 reason users uninstall social apps
- Good notifications create habit — specific, actionable, local
- Generic "New activity near you" is noise, not value

**Consequences:**
- New document: RETENTION_AND_NOTIFICATIONS.md
- Notification templates designed before implementation
- First-week notification cadence defined per user persona
- Max 5 push notifications/day for MVP
