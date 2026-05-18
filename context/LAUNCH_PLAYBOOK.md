# Launch Playbook

> Hyperlocal platforms only work when enough nearby users are active. **Do not launch nationwide.** Focus on ONE density area first.

---

## Core Principle

> Density first. Virality second.

---

## Pilot Launch Strategy

### Phase 1: Select Pilot Locality

**Criteria for pilot locality:**
- High population density (college campus ideal)
- Existing social infrastructure (clubs, societies, hostels)
- Technologically engaged audience
- Manageable size for moderation

**Top candidates (to be decided):**
- College campus (e.g., Bandra college cluster, Mumbai)
- Dense urban neighborhood (e.g., Bandra West, Mumbai)
- Student housing area

### Phase 2: Ambassador Recruitment (Pre-Launch, Week -3 to -1)

**Goal:** 3–5 ambassadors recruited and trained before launch

**Ambassador profile:**
- Currently enrolled student in target college
- Socially active and connected
- Understands the product vision
- Willing to create 10+ posts/week during seeding

**Ambassador onboarding:**
1. Product walkthrough + Behavioral Design Bible overview
2. Daily posting templates and schedule
3. Moderation basics (how to flag content)
4. Safety guidelines for posting
5. Launch week calendar walkthrough

### Phase 3: Build Density (Pre-Launch, Week -2 to -1)

**Goal:** 200+ active users before "public launch"

**Tactics:**
1. **College Ambassadors** — Recruit 3–5 students from pilot locality
2. **Exclusive Pre-launch** — Invite-only for first 100 users
3. **Seed Content** — Ambassadors create 10+ posts each before wider launch
4. **Incentives** — Early adopter badges, featured profiles, "Founding Member" status

**Daily ambassador content calendar:**
| Day | Content Focus | Posts per Ambassador |
|-----|--------------|---------------------|
| Monday | Welcome + Sports | 2–3 posts |
| Tuesday | Study + Food | 2–3 posts |
| Wednesday | Social + Help | 2–3 posts |
| Thursday | Events + Weekend planning | 2–3 posts |
| Friday | Weekend push | 3–4 posts |
| Saturday | Event posts | 2–3 posts |
| Sunday | Chill/wind-down | 1–2 posts |

### Phase 4: Soft Launch (Week 0)

**Goal:** 500+ users, 30+ Now posts/day

**Tactics:**
1. **College Events** — Promote during freshers, fests, sports events
2. **Offline Promotion** — Posters, flyers, word-of-mouth in campus
3. **Social Media** — Instagram/Twitter presence focused on the locality
4. **Referral Program** — Simple invite system (manual invite for MVP)

**Launch week notification activation:**
- Day 1: Welcome + "Here's what's happening in [locality]"
- Day 2–3: Response alerts as ambassadors create posts
- Day 4: "X plans brewing near you today"
- Day 5: "This weekend in [locality]"
- Day 7: Week recap + "You've been here a week!"

### Phase 5: Monitor + Iterate

**Focus on retention metrics:**
| Metric | Target (Week 2) |
|--------|-----------------|
| DAU | >100 |
| Posts per day | >30 |
| % Now posts with ≥1 response | >60% |
| Next-day return rate | >40% |
| Reports per 100 posts | <5 |

**Common issues and fixes:**
| Issue | Fix |
|-------|-----|
| Empty feed | Ambassador posts, notification prompts |
| Low response rate | Improve feed ranking, notify responders |
| Safety concerns | Fast moderation, clear safety prompts |
| Low retention | Push notifications, area pulse, FOMO triggers |
| Spam | Account age gating, report flow |
| Low ambassador activity | Check in with ambassadors, refresh playbook |

### Phase 6: Expand (Post-MVP)

- Only expand when pilot locality shows consistent engagement (seeded < 50% of posts)
- Next locality should be adjacent (same city, neighboring college)
- Repeat the density playbook for each new locality
- Transfer learnings from pilot to next locality

---

## Locality Density Thresholds

| Phase | Users | Posts/Day | Ambassadors | Seeded vs Organic |
|-------|-------|-----------|-------------|-------------------|
| Cold start | 0–100 | 5–10 | 3–5 | 80% seeded / 20% organic |
| Pre-density | 100–300 | 15–30 | 5–8 | 60% seeded / 40% organic |
| Critical mass | 300–500 | 30–50 | 8–10 | 40% seeded / 60% organic |
| Self-sustaining | 500+ | 50+ | 10+ | 20% seeded / 80% organic |
| Expansion ready | 1000+ | 100+ | 15–20 | 10% seeded / 90% organic |

When organic content exceeds 60%, the locality is self-sustaining and can operate with reduced ambassador activity.

---

## Pre-Launch Checklist

### App Readiness
- [ ] Feed shows content (no empty states for active locality)
- [ ] Now post creation works reliably
- [ ] Quick response buttons work ("I'm in", "Interested")
- [ ] Coordination DMs work
- [ ] Push notifications are functional
- [ ] Report flow works
- [ ] Account age gating functional
- [ ] Safety prompts shown on first post
- [ ] All critical bugs fixed

### Content Readiness
- [ ] Pilot locality seeded in database
- [ ] 50+ seed posts from ambassadors
- [ ] Daily prompt templates prepared
- [ ] Ambassador accounts set up with "Ambassador" badges

### Operational Readiness
- [ ] Moderation team (at least 2 people including founder)
- [ ] Report queue monitoring in place
- [ ] Community guidelines published in-app
- [ ] Safety prompt texts finalized
- [ ] Ambassador program active with daily check-ins

### Analytics (Phase 6+)
- [ ] Event tracking implemented (PostHog)
- [ ] Crash reporting active (Sentry)
- [ ] Performance monitoring set up

---

## Post-Launch Monitoring (First 2 Weeks)

| Metric | Check Frequency | Target |
|--------|----------------|--------|
| New user sign-ups | Daily | 30+/day |
| Now posts created | Daily | 30+/day |
| % posts with ≥1 response | Daily | >60% |
| Median time-to-first-response | Daily | <10 min |
| DAU | Daily | >100 |
| Crash-free rate | Daily | >99.5% |
| Reports filed | Daily | <5 |
| Ambassador post count | Daily | 5+/ambassador |
| Seeded vs organic ratio | Weekly | 40% seeded target by W2 |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Empty feed | Ambassador daily posting, prompt templates |
| Low response rate | Notifications to nearby users, improved feed ranking |
| Toxic users | Fast moderation, blocking, reporting, account age gating |
| Low retention | Push notifications (specific, actionable), FOMO triggers |
| Privacy concerns | Locality-only visibility, no exact location, safety prompts |
| Spam | Account age limits, rate limiting, report flow |
| Ambassador churn | Weekly check-ins, fresh prompts, recognition badges |
| Technical issues | Sentry monitoring, quick hotfix capability |
