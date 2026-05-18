# Architecture

> **Updated after behavioral refinement.** Architecture now reflects behavior-driven system design — not just technical layers, but psychological and operational systems.

---

## High-Level Architecture

```
┌────────────────────────────────────────────────────┐
│                  Mobile App (Expo)                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────────┐   │
│  │ Expo Router│ │ TanStack  │ │   Zustand     │   │
│  │ Navigation │ │ Query     │ │ (local state)  │   │
│  │ (file-based)│ │ (server   │ │               │   │
│  │            │ │  state)   │ │               │   │
│  └───────────┘ └───────────┘ └───────────────┘   │
│           │              │                         │
│           ▼              ▼                         │
│  ┌──────────────────────────────────────────┐    │
│  │           Supabase Client SDK            │    │
│  │  (Auth, Realtime, Storage, DB Query)     │    │
│  └──────────────────────────────────────────┘    │
│           │              │                         │
│           ▼              ▼                         │
│  ┌──────────────────────────────────────────┐    │
│  │       Behavior-Specific Services         │    │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │ Ranking │ │ Safety   │ │ Notif    │   │    │
│  │  │ Engine  │ │ Gate     │ │ Router   │   │    │
│  │  └─────────┘ └──────────┘ └──────────┘   │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│           Supabase Backend                   │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │  Auth     │ │ Postgres │ │  Storage   │  │
│  │  (GoTrue) │ │ +PostGIS │ │  (S3)      │  │
│  └──────────┘ └──────────┘ └────────────┘  │
│  ┌──────────┐ ┌──────────┐                 │
│  │ Realtime │ │ Edge     │                 │
│  │ (WS)     │ │ Functions│                 │
│  └──────────┘ └──────────┘                 │
└─────────────────────────────────────────────┘
```

---

## Behavior-Driven System Design

### 1. Intent System (Core Product Logic)
```
Live Intent Post
  ├─ Post type: Now (primary), Ask (secondary)
  ├─ Expiry/Time: Immediate, Today, This week
  ├─ Spots: Total / Filled / Available
  ├─ Urgency: High, Medium, Low
  ├─ Venue hint: Public place suggestion
  └─ Coordination status: open → almost_full → closed → expired

Intent Response
  ├─ Response type: I'm in, Interested, Can join later, Need details
  ├─ Auto-creates coordination thread between responder and creator
  └─ Spots tracking: "I'm in" decrements available spots
```

### 2. Feed Ranking Service
```
Input: User context (locality, interests) + Post pool
Ranking factors (weighted):
  ├─ HIGHEST: Freshness, Urgency, Reply velocity, Post type = Now
  ├─ MEDIUM: Social proximity, Same community, Same interests
  └─ LOWER: Generic popularity, Creator trust score
Output: Ranked post list optimized for actionability
```

### 3. Safety & Trust Service
```
Identity Layer
  ├─ Phone OTP verification
  ├─ Account age tracker
  └─ Trust level calculator

Gating Layer
  ├─ Post limits by account age
  ├─ DM limits by account age
  └─ Feature unlock by trust tier

Visibility Layer
  ├─ Locality-only content scope
  ├─ No exact location exposure
  └─ Privacy control management

Moderation Layer
  ├─ Report intake and classification
  ├─ Moderation queue with SLAs
  └─ Action execution (hide, warn, block, suspend)
```

### 4. Notification Router
```
Notification Types
  ├─ Immediate Action: Responses to your post, interest in your plan
  ├─ Social Response: Direct replies, DMs
  ├─ Area Pulse: "3 active plans near you"
  ├─ Urgency/FOMO: "Starting in 20 min", "1 spot left"
  └─ Trust: Report outcome, verification updates

Routing Logic
  ├─ Priority: Immediate > Social > Urgency > Pulse > Trust
  ├─ Frequency cap: Max 5 push/day for MVP
  ├─ First-week: Personalized cadence
  └─ Dormant reactivation: After 3 days of inactivity
```

### 5. Content Seeding System
```
Seeding Sources
  ├─ Ambassador posts (real people, real content)
  ├─ Official AasPaas locality accounts
  ├─ Daily prompt templates
  └─ Scheduled recurring posts

Density Monitoring
  ├─ Track seeded vs organic ratio
  ├─ Target: 80% seeded → 50% → 20% as locality matures
  └─ Trigger ambassador actions when organic drops
```

---

## Folder Structure

```
aaspaas/
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx         # Root layout with providers
│   ├── (auth)/             # Auth flow screens
│   ├── (onboarding)/       # Onboarding flow screens
│   ├── (tabs)/             # Main tab screens
│   │   ├── feed/           # Live intent feed (PRIMARY SCREEN)
│   │   ├── inbox/          # Coordination threads
│   │   └── profile/        # User profile
│   ├── post/[id].tsx       # Post detail (deep link)
│   ├── chat/[threadId].tsx # Chat thread
│   ├── community/[id].tsx  # Community detail (Phase 5+)
│   ├── event/[id].tsx      # Event detail (Phase 5+)
│   └── (modals)/           # Modal screens
│       ├── create-post.tsx # Create Now Post (FAB trigger)
│       └── report.tsx      # Report content
│
├── src/
│   ├── components/
│   │   ├── ui/             # Reusable primitives (Button, Input, etc.)
│   │   ├── layout/         # Layout components
│   │   ├── cards/          # Domain cards (IntentCard, etc.)
│   │   ├── lists/          # List components (FeedList, ThreadList)
│   │   ├── intent/         # Intent-specific components (ResponseButtons, SpotCounter)
│   │   └── feedback/       # Empty, loading, error states
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── feed/           # Core intent feed
│   │   ├── intent/         # Now Post creation + response system
│   │   ├── chat/           # Coordination threads
│   │   ├── profile/
│   │   ├── communities/    # Phase 5+
│   │   ├── events/         # Phase 5+
│   │   ├── notifications/
│   │   ├── safety/         # Safety gate, report, block
│   │   ├── moderation/     # Admin moderation queue
│   │   └── ambassadors/    # Ambassador tooling (Phase 4+)
│   │
│   ├── services/
│   │   ├── api/            # API client and endpoints
│   │   ├── auth/           # Auth service
│   │   ├── ranking/        # Feed ranking logic
│   │   ├── safety/         # Safety gate + trust calculator
│   │   ├── notifications/  # Notification router
│   │   ├── storage/        # File storage service
│   │   └── analytics/      # Analytics service
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── query-client.ts
│   │   └── env.ts
│   │
│   ├── store/
│   │   ├── auth-store.ts
│   │   ├── app-store.ts        # Locality, filters
│   │   ├── draft-store.ts      # Post drafts
│   │   └── notification-store.ts
│   │
│   ├── hooks/
│   │   ├── use-intent-feed.ts      # Feed data + ranking
│   │   ├── use-intent-response.ts  # Response actions
│   │   ├── use-safety-gate.ts      # Account age checks
│   │   └── use-notifications.ts    # Notification state
│   │
│   ├── constants/
│   ├── types/
│   └── utils/
│
├── components/             # Existing starter components
├── constants/              # Theme constants
├── hooks/                  # Existing hooks
└── context/                # Project context
```

---

## Provider Tree (Root)

```tsx
<ErrorBoundary>
  <GestureHandlerRootView>
    <ThemeProvider>
      <QueryClientProvider>
        <AuthProvider>
          <SafetyGateProvider>    {/* Account age, trust level */}
            <NotificationProvider>
              <Router />
            </NotificationProvider>
          </SafetyGateProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </GestureHandlerRootView>
</ErrorBoundary>
```

---

## State Management Strategy

| State Type | Tool | Examples |
|-----------|------|---------|
| Server state | TanStack Query | Feed posts, responses, comments, messages |
| Local app state | Zustand | Selected locality, feed filters, draft post, safety mode |
| Form state | React Hook Form + Zod | Create post, edit profile, report |
| App-wide context | React Context (minimal) | Auth session, theme |

---

## Key Architecture Decisions

1. **Intent-first data model** — Posts have type, urgency, expiry, spots. Feed ranks for actionability.
2. **Safety as a system, not a feature** — Safety gate wraps auth and gating logic as a provider.
3. **Locality-first, not GPS-first** — Content scoped by locality/college ID. Simpler, more private, better moderation.
4. **Supabase for backend** — Auth, database, real-time, storage in one SDK.
5. **TanStack Query for server state** — Caching, pagination, optimistic updates.
6. **Zustand for local state** — Lightweight, no boilerplate.
7. **Feature-based organization** — Each feature encapsulates its components, hooks, services.

---

## Backend Services

| Service | Purpose | Provider | MVP? |
|---------|---------|----------|------|
| Auth | Authentication, session management | Supabase Auth | ✅ |
| Database | Primary data storage | Supabase Postgres | ✅ |
| File Storage | Images, avatars | Supabase Storage (S3) | ✅ |
| Realtime | Live chat, feed updates | Supabase Realtime (WS) | ✅ |
| Push Notifications | Mobile notifications | Expo Notifications | ✅ |
| Analytics | User behavior tracking | PostHog | ⏸️ Phase 6 |
| Error Monitoring | Crash reporting | Sentry | ⏸️ Phase 6 |
| Geocoding | Places, address lookup | Google Places API | ❌ Post-MVP |
