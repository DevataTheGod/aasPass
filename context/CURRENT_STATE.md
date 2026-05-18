# Current State

> Last updated: 2025-06-08

## Project Summary

AasPaas — **College Beta** ready for 100 test users in a single college. Built as a real-time hyperlocal social feed for finding people nearby for spontaneous plans.

## What's Built

### Screens
- **Welcome / Auth** — Phone OTP sign-in via Supabase Auth
- **Onboarding** — College selection (Mumbai colleges), profile setup
- **Feed** — Post list with pull-to-refresh, category filtering (Sports, Food, Study, Help, Event, General)
- **Create Post** — Modal with text + category picker
- **Post Detail + Comments** — View post, write comments
- **Inbox** — Placeholder for future messages/notifications
- **Profile** — User info, stats placeholders, logout

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 54 |
| Navigation | Expo Router 6 (file-based) |
| Language | TypeScript 5.9 |
| Auth | Supabase Auth (phone OTP) |
| Backend | Supabase (not yet configured) |
| State | Zustand (app state), TanStack Query (server) |
| UI | React Native 0.81.5, Reanimated 4 |

### File Structure
```
app/
  _layout.tsx          ← Root layout + auth guard
  (auth)/              ← Welcome, Sign-in, Verify OTP
  (onboarding)/        ← College select, Profile setup
  (tabs)/              ← Feed, Inbox, Profile
  (modals)/            ← Create Post
  post/[id].tsx        ← Post Detail + Comments
src/
  lib/supabase.ts      ← Supabase client
  providers/           ← Auth context provider
  store/               ← Zustand store
  types/               ← TypeScript types
```

### Dependencies Installed
`@supabase/supabase-js`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`, `expo-image-picker`, `@react-native-async-storage/async-storage`

## Next Steps to Launch

1. **Set up Supabase project** — Create tables (profiles, posts, comments), views (posts_with_authors, comments_with_authors), enable phone auth
2. **Update `.env`** — Add real Supabase URL + anon key
3. **Run locally** — `npx expo start` on a device/simulator
4. **Invite 100 test users** — From your college, via the app
5. **Observe behavior** — What posts get created, what gets ignored, what creates replies

## What's NOT Built (for post-beta)

- Real-time subscriptions (feed currently uses manual refresh)
- Push notifications
- Direct messages / chat
- Image uploads (code is ready, needs Supabase Storage setup)
- Communities / groups
- Events
- Business profiles
- Trust & safety systems (account age gates, report flows)
