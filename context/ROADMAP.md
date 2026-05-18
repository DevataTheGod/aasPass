# Roadmap

> Stripped down to one phase: **College Beta**.

---

## College Beta — The Only Phase That Matters

**Goal:** Get the app into 100 college students' hands with the absolute minimum features. Observe real behavior. Then decide what to build next.

### What to Build

Only these 4 features. Nothing else.

```
Beta v0.1 — "Can people in my college use this at all?"
```

1. **Auth + Locality**
   - Phone OTP sign-up
   - Pick your college
   - Basic profile (name, avatar)
   - ✅ Exit: user can sign up and see their college

2. **Feed**
   - List of posts from people in same college
   - Sorted by most recent
   - Pull to refresh
   - ✅ Exit: user can see what others are posting

3. **Create Post**
   - Text post + optional image
   - Category picker (sports, food, study, help, events, general)
   - ✅ Exit: user can create a post and see it in feed

4. **Comments**
   - Comment on any post
   - See comments on a post
   - ✅ Exit: user can comment and see replies

### What NOT to Build (Beta)

| Feature | Reason Cut |
|---------|-----------|
| DM/Chat | Don't need it to test if people post |
| Now/Urgency system | Over-engineering for 100 users |
| Response buttons | Comments are enough to test engagement |
| Push notifications | Too complex for beta. Manual share works |
| Account age gating | 100 college users = trust through proximity |
| Feed ranking algo | Recent-first is fine for beta |
| Post expiration | Manual deletion is fine |
| Communities | Post-MVP |
| Events | Post-MVP |
| Category filters | Nice-to-have. MVP can skip |

### Beta Success Criteria

Not metrics. Just 3 questions:

1. ✅ Do at least 30 of the 100 users **create at least one post** in the first week?
2. ✅ Do posts get **at least 1 comment** on average?
3. ✅ Do any users **come back** after their first visit?

If yes → the concept has signal. Enhance and scale.
If no → observe WHY. Change the approach.

---

## Post-Beta (If Beta Works)

Only after observing real behavior:

1. Fix everything users ignored or found confusing
2. Add the features users actually asked for
3. Add DMs (most requested gap probably)
4. Add notifications (need retention)
5. Expand to next college

---
