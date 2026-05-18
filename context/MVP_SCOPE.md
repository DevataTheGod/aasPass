# MVP Scope — College Beta

> Stripped to the absolute minimum: **4 features for 100 college users.**

---

## The Core Question

> **Can college students use this to post nearby plans and get comments from other students?**

Nothing else matters for the beta.

---

## The 4 Features

### 1. Auth + Locality
- Phone OTP sign-up
- College selection from a predefined list
- Basic profile (name, avatar photo)
- No email verification, no password

### 2. Feed
- Posts from your college only
- Sorted most-recent-first
- Pull to refresh
- Show author name + avatar + time
- "Be the first to post" empty state

### 3. Create Post
- FAB button on feed
- Text content (what are you up to?)
- Category: sports, food, study, help, event, general
- Optional: image upload
- Post appears at top of feed immediately

### 4. Comments
- Tap post → see comments
- Write a comment
- See comment author + time
- No nested replies

---

## What We're NOT Building (Beta)

| Feature | Why Not |
|---------|---------|
| DMs | Overhead. Comments are enough to prove engagement |
| Push notifications | Too complex. Users can check manually |
| Now/Urgency system | Analysis paralysis. Just posts + comments first |
| Post expiration | Manual delete is fine |
| Feed ranking algo | Recent-first works for 100 users |
| Account gating | Trust through college proximity |
| Communities | Post-MVP |
| Events | Post-MVP |
| Categories filter | Can add later |
| Like/reactions | Comments are richer signal |

---

## Beta Success (Not Metrics — Just Questions)

1. Do 30% of invited users create a post?
2. Do posts get comments?
3. Do any users come back?

If yes → build more. If no → change approach.

---

## Build Order

```
Week 1:  Auth + College select → Feed → Create post → Comments
Week 2:  Bug fixes + polish
Week 3:  Invite 100 college friends
Week 4:  Observe → Decide next
```
