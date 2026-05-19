# AasPaas — Project Context

## Tech Stack
- Expo SDK 54 (React Native)
- Supabase Auth + Database
- Zustand (state management)
- TanStack React Query
- Expo Router (file-based routing)
- Sentry (error tracking)
- Firebase Analytics (Google Analytics for Firebase via @react-native-firebase/analytics)

## Analytics
- Screen views tracked automatically in `app/_layout.tsx` via `useSegments()`
- Auth events: sign up (`trackSignUp`), login (`trackLogin`), logout (`trackLogout`)
- User ID set on session change (links events to authenticated user)
- Analytics data cleared on logout (`resetAnalytics`)
- All analytics calls are wrapped in try/catch — failures never block the app
- Config file: `google-services.json` at project root (Android only for now, gitignored)
- Plugin: `@react-native-firebase/analytics` in app.json

## Auth Workflow

### Route Structure
```
app/
  _layout.tsx              # Root layout with AuthGuard + Stack
  reset-password.tsx       # Deep link handler for password reset
  (auth)/
    _layout.tsx            # Auth stack (welcome, auth, forgot-password)
    welcome.tsx            # Landing/brand screen
    auth.tsx               # Combined Sign Up / Sign In with tabs
    forgot-password.tsx    # Email input → sends reset link via Supabase
  (onboarding)/
    college-select.tsx     # Pick college (first-time setup)
    profile-setup.tsx      # Set name/username (first-time setup)
  (tabs)/
    feed.tsx               # Main feed
    profile.tsx            # User profile + logout
```

### Auth Flow
- **Sign Up**: email + password → supabase.auth.signUp()
  - Already registered → auto sign-in → direct profile check → Feed
  - New user (auto-confirm) → onboard (college-select → profile-setup) → Feed
  - Needs confirmation → Alert → confirm email → onOAuthChange → AuthGuard → onboard → Feed
- **Sign In**: email + password → supabase.auth.signInWithPassword() → direct profile check → Feed
- **Forgot Password**: email → supabase.auth.resetPasswordForEmail() with redirectTo: aaspaas://reset-password
- **Reset Password**: deep link `aaspaas://reset-password#access_token=xxx&type=recovery` → parse hash → supabase.auth.setSession() → updateUser({password}) → signOut → sign in with new password

### AuthGuard (app/_layout.tsx)
- Wraps all routes, manages session-based redirects
- On cold start: checks existing profile in DB, routes to Feed or onboarding
- Allows reset-password route without session (deep link entry point)
- Prevents redirect away from reset-password even after session is set
- Reset-password screen handles its own routing after password update

### Deep Links
- Scheme: `aaspaas` (configured in app.json)
- Password reset: `aaspaas://reset-password#access_token=xxx&type=recovery&refresh_token=yyy`
- Links handled by expo-router path-matching + Linking.getInitialURL() + Linking.addEventListener

## Key Zustand Store (src/store/app-store.ts)
- onboardingComplete: boolean
- selectedCollege: { id, name, city } | null
- setOnboardingComplete(), setSelectedCollege(), reset()
- reset() clears all state on logout

## Version
Current: 1.2.0
