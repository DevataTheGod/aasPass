# Safety & Trust Architecture

> Safety is not a feature section in AasPaas. It is a **behavioral constraint system** built into the product's foundation. Hyperlocal apps live or die on trust.

---

## Core Principles

1. **Never expose precise location publicly** — Show locality/area only, not exact distance or coordinates.
2. **Default to locality visibility** — Content is visible to "Bandra West" not "52m from your home."
3. **Encourage public-place meetups** — Default guidance for coordination.
4. **Trust before reach** — New accounts have graduated capabilities.
5. **Women's safety defaults matter** — Default privacy protections should account for the most vulnerable users.
6. **Moderation speed > moderation complexity** — A fast, human-reviewed report system beats an over-engineered AI system early on.
7. **Safety features must ship BEFORE growth features** — Do not let density outrun trust.

---

## Layer 1: Identity Confidence

### Verification Signals
| Signal | Implementation | MVP? |
|--------|---------------|------|
| Phone number verified | OTP on sign-up | ✅ Yes |
| College email domain | @college.edu verification | ⏸️ Phase 2 |
| Account age indicator | Badge or join date shown | ✅ Yes |
| Ambassador/Admin badge | Manual verification | ✅ Yes |
| Social login | Google/Apple ID linking | ❌ Phase 8 |

### Account Age Gating (MVP)
| Account Age | DM Limit | Post Limit | Invite Limit |
|-------------|----------|------------|--------------|
| < 24 hours | 5 DMs/day | 3 posts/day | 0 invites |
| 1–7 days | 15 DMs/day | 10 posts/day | 5 invites |
| 7+ days | No limit | No limit | 10 invites |

### Suspicious Behavior Detection (Post-MVP automation)
- Rapid mass posting
- Same content posted in multiple localities
- Multiple reports against same user
- Account creation from suspicious patterns

---

## Layer 2: Visibility Controls

### What AasPaas Shows Publicly

| Data Point | Visibility |
|-----------|-----------|
| Locality name (e.g., "Bandra West") | ✅ Public |
| College name | ✅ Public (if verified) |
| Exact GPS coordinates | ❌ Never |
| Home address | ❌ Unknown to the platform |
| Current live location | ❌ Not tracked |
| Distance to another user | ❌ Not shown |
| "2 km away" approximate | ⏸️ Post-MVP, opt-in |

### Default Privacy Settings

| Setting | Default | User Can Change? |
|---------|---------|------------------|
| Profile visible to | Locality only | ✅ Yes (expand to city) |
| Posts visible to | Locality only | ✅ Yes (per post control) |
| DM from anyone | Off (mutual interaction only) | ✅ Yes |
| Online status shown | No | ✅ Yes |
| Last seen visible | To confirmed interactions only | ✅ Yes |

---

## Layer 3: Interaction Gating

### MVP Graduated Trust Model

```
New Signup
    │
    ▼
[Limited Mode] — First 24 hours
  • 3 posts max
  • 5 DMs max
  • Cannot create communities
  • Cannot send invite links
  • Safety prompt on first post
    │
    ▼ (after 24h + N posts)
[Standard Mode]
  • 10 posts/day
  • 15 DMs/day
  • Can join communities
  • Can create events
    │
    ▼ (after 7 days + verified locality)
[Trusted Mode]
  • Unlimited posts
  • Unlimited DMs
  • Can create communities
  • Can become ambassador
```

### Meetup Safety Features

**Before first meetup via AasPaas:**
- Safety prompt: "Meet in a public place. Tell a friend where you're going."
- Option to share meetup details with a trusted contact (post-MVP)
- Quick block report button accessible during chat

**During coordination:**
- Venue hint field encourages public places
- "Public place" tag on posts
- In-chat safety reminder for first-time interactions

---

## Layer 4: Reporting & Moderation

### Report Categories

| Category | Target Type | Escalation |
|----------|------------|------------|
| Harassment | User, post, comment | Immediate review |
| Fake identity | User | Verify identity |
| Inappropriate content | Post, comment | Remove + warn |
| Spam | Post, comment | Auto-remove (repeated) |
| Dangerous behavior | User, post | Immediate review + possible block |
| Underage user (<13) | User | Account suspension |

### Moderation Flow

```
User Reports Content
        │
        ▼
Report enters queue
  • Status: pending
  • Timestamp + context recorded
        │
        ▼
Moderator/Admin Reviews
  • Locality ambassador (first line)
  • App admin (escalation)
        │
        ▼
Actions Available
  • Dismiss report
  • Warn user
  • Hide content
  • Remove content
  • Block user
  • Suspend account (admin only)
        │
        ▼
User Notified of Outcome
```

### Moderation SLAs (MVP)
| Report Type | Response Time Target |
|------------|---------------------|
| Harassment / Dangerous | < 2 hours |
| Fake identity | < 12 hours |
| Inappropriate content | < 4 hours |
| Spam | < 1 hour (auto-preferred) |

---

## Layer 5: Operational Safety

### Local Ambassador System
- Trusted users per locality who can:
  - Review reports from their area
  - Flag content for admin review
  - Verify new members of known institutions
- Ambassadors are NOT anonymous moderators — they are known community figures

### Safety Content in App
- Onboarding: Community guidelines shown before first post
- First post: Safety tip shown
- First DM received: Optional safety prompt
- First meetup coordination: Public place suggestion shown
- Report confirmation: "We'll review this. You won't see this content in the meantime."

---

## MVP Safety Checklist

- [ ] Phone OTP on sign-up
- [ ] Account age gating (limited mode for <24h)
- [ ] Locality-only visibility by default
- [ ] No exact location sharing
- [ ] Report flow (post, user, comment)
- [ ] Block user flow
- [ ] Safety prompt on first post creation
- [ ] Safety prompt on first meetup coordination
- [ ] At least 1 ambassador in pilot locality
- [ ] Moderation queue accessible via admin
- [ ] Community guidelines published in-app
