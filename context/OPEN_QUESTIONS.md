# Open Questions

> Refocused after behavioral refinement. Many previous questions are now resolved by the behavioral design docs.

---

## MVP Behavioral Questions

- [ ] What exact intent categories drive highest repeat use? (sports, food, study, etc.)
- [ ] Should the app open on "Now" feed by default, or on a "What are you up to?" prompt?
- [ ] Do users need DM before trust unlock? Or can first-time coordinators DM freely?
- [ ] What trust signals should be visible publicly on profiles? (account age, response rate, ambassador badge?)
- [ ] What is the minimum density threshold per locality before the app feels alive?
- [ ] What is the exact first-week notification cadence per persona?
- [ ] Which seeding tactics feel most authentic to college users?
- [ ] Should Now posts auto-expire or require manual close?
- [ ] What happens when someone claims "I'm in" but doesn't show up? (flake handling)
- [ ] Should we badge user response rates (e.g., "90% show-up rate")?
- [ ] How do we handle sports/activities requiring skill levels? (beginner vs advanced)
- [ ] Should there be a "public plan" option vs "just looking for a few people" distinction?

## Design Questions

- [ ] What is the app's primary color palette and branding identity?
- [ ] What does the "create now post" FAB look like?
- [ ] Should the create post flow be a bottom sheet or full modal?
- [ ] How should locality switching work in the UI? (dropdown, swipe, etc.)
- [ ] Feed card design: minimalist timeline vs. rich cards?
- [ ] How do response buttons ("I'm in", "Interested") render on feed cards?
- [ ] Expiring post visual treatment — countdown timer? fading opacity?
- [ ] Safety prompt design — friendly vs. authoritative tone?

## Technical Questions

- [ ] Best approach for push notifications in Expo? (Expo Notifications + Supabase Realtime?)
- [ ] Image upload optimization strategy (compression, sizing, caching)?
- [ ] Offline support strategy — do we need it for MVP?
- [ ] Cache invalidation strategy for TanStack Query with live intent posts
- [ ] Real-time feed updates vs. pull-to-refresh? (hybrid approach?)
- [ ] Supabase pricing tiers and limits for MVP launch

## Product Questions

- [ ] What is the exact first launch locality / college?
- [ ] How do we recruit the first 5 ambassadors?
- [ ] Should we have college email verification (@college.edu) or open sign-up?
- [ ] Content moderation — automated or manual-first for MVP?
- [ ] Post character limit?
- [ ] Media uploads: images only, or also videos?
- [ ] Privacy options for posts: public vs locality-only vs college-only?
- [ ] How do we handle user reporting of real-world dangerous situations?

## Business Questions (Post-MVP)

- [ ] Monetization strategy?
- [ ] Data retention and privacy policy?
- [ ] Terms of service for hyperlocal platform?
- [ ] Community guidelines document?

## Legal & Compliance

- [ ] Age restrictions? (13+? 16+? 18+?)
- [ ] GDPR / data protection compliance?
- [ ] Content liability for user-generated content?
- [ ] What happens in case of offline incidents between users who met on the app?
