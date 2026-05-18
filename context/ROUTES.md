# Routes

> **Updated after behavioral refinement.** MVP tab structure simplified to Feed, Inbox, Profile (Explore removed). Communities, Events, Businesses pushed to later phases.

---

## Expo Router Route Tree

```
Root Stack (_layout.tsx)
│
├── (auth)/                     # Auth flow (unauthenticated users)
│   ├── _layout.tsx
│   ├── welcome.tsx             # Welcome / landing screen
│   ├── sign-in.tsx             # Sign in with phone OTP
│   └── verify-otp.tsx          # OTP verification screen
│
├── (onboarding)/               # Onboarding flow (first-time users)
│   ├── _layout.tsx
│   ├── profile-setup.tsx       # Name, username, avatar
│   ├── choose-locality.tsx     # Locality/college selection
│   └── permissions.tsx         # Notification + location permission prompts
│
├── (tabs)/                     # Main app (authenticated + onboarded users)
│   ├── _layout.tsx             # Tab bar layout (3 tabs for MVP)
│   │
│   ├── feed/                   # TAB 1: Live Intent Feed (PRIMARY)
│   │   └── index.tsx           # Feed of Now/Ask posts, category filters, FAB
│   │
│   ├── inbox/                  # TAB 2: Coordination Threads
│   │   └── index.tsx           # List of active DM threads
│   │
│   └── profile/                # TAB 3: User Profile
│       └── index.tsx           # User profile, posts, settings
│
├── post/                       # Post detail (deep link)
│   └── [id].tsx                # Post detail with responses, comments
│
├── chat/                       # Chat thread (deep link)
│   └── [threadId].tsx          # 1:1 coordination thread
│
├── community/                  # Phase 5+ (not in MVP)
│   └── [id].tsx                # Community detail
│
├── event/                      # Phase 5+ (not in MVP)
│   └── [id].tsx                # Event detail
│
├── business/                   # Phase 7+ (not in MVP)
│   └── [id].tsx                # Business detail
│
└── (modals)/                   # Modal screens
    ├── create-post.tsx         # Create Now Post (triggered by FAB)
    └── report.tsx              # Report content flow
```

---

## Screen Inventory (MVP)

### Auth Flow (3 screens)

| Screen | Route | Purpose |
|--------|-------|---------|
| Welcome | `/(auth)/welcome` | App intro, value prop, "Get Started" CTA |
| Sign In | `/(auth)/sign-in` | Phone number/email input for OTP |
| Verify OTP | `/(auth)/verify-otp` | OTP code entry, auto-submit |

### Onboarding Flow (3 screens)

| Screen | Route | Purpose |
|--------|-------|---------|
| Profile Setup | `/(onboarding)/profile-setup` | Name, username, avatar upload |
| Choose Locality | `/(onboarding)/choose-locality` | Select locality/college from list |
| Permissions | `/(onboarding)/permissions` | Notification + (optional) location permission |

### Main Tabs (3 tabs)

| Tab | Route | Purpose |
|-----|-------|---------|
| Feed | `/(tabs)/feed` | Live intent posts, category filters, FAB |
| Inbox | `/(tabs)/inbox` | Coordination DM threads |
| Profile | `/(tabs)/profile` | User profile + settings |

### Detail Screens (MVP)

| Screen | Route | Purpose |
|--------|-------|---------|
| Post Detail | `/post/[id]` | Post with responses, comments, intent actions |
| Chat Thread | `/chat/[threadId]` | 1:1 coordination DM |
| Create Post | `/(modals)/create-post` | Create Now Post modal |
| Report | `/(modals)/report` | Report content/user flow |

### Future Screens (Not in MVP)

| Screen | Route | Phase |
|--------|-------|-------|
| Community Detail | `/community/[id]` | Phase 5 |
| Event Detail | `/event/[id]` | Phase 5 |
| Business Detail | `/business/[id]` | Phase 7 |
| Explore/Discover | `/(tabs)/explore` | Phase 5 |

---

## Navigation Flow (MVP)

```
App Launch
    │
    ▼
┌─────────────────────────────────────────────┐
│            Auth Check                        │
│  ┌──────────┐    ┌──────────────────────┐  │
│  │ Auth'd?  │───→│ Onboarding Check     │  │
│  │          │    │ ┌────────┐ ┌──────┐ │  │
│  │          │    │ │ Done?  │─→ Tabs │ │  │
│  │          │    │ │        │ │      │ │  │
│  │          │    │ └───┬────┘ └──────┘ │  │
│  └────┬─────┘    └────┼──────────────────┘  │
│       │               │                      │
│       ▼               ▼                      │
│  ┌──────────┐  ┌─────────────┐              │
│  │ Auth     │  │ Onboarding  │              │
│  │ Flow     │  │ Flow        │              │
│  └──────────┘  └─────────────┘              │
└─────────────────────────────────────────────┘
```

### Feed Tab Navigation
```
Feed (index)
  ├─ Tap post → /post/[id] (Post Detail)
  ├─ Tap FAB → /(modals)/create-post (Modal)
  ├─ Tap "I'm in" → modal/inline response
  └─ Tap DM → /chat/[threadId] (after interaction)
```

### Inbox Tab Navigation
```
Inbox (index)
  └─ Tap thread → /chat/[threadId] (Chat Thread)
```

### Profile Tab Navigation
```
Profile (index)
  ├─ Tap own post → /post/[id]
  └─ Tap settings → in-line settings panel
```
