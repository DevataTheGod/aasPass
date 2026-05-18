# Feed Philosophy

> The feed is AasPaas's **core product surface**. It decides success. Unlike Instagram or Twitter, AasPaas's feed should rank for **actionability**, not passive engagement.

---

## Feed Goal

**Not:** "Show all local content."

**But:** "Maximize the chance that a user quickly sees a relevant, actionable, safe local opportunity."

Every post in the feed is competing for attention. The feed's job is to surface the post most likely to lead to **real-world coordination**.

---

## Ranking Dimensions

### Highest Weight (Primary Signals)

| Signal | Why | Example |
|--------|-----|---------|
| **Same locality / Same college** | Direct relevance | Bandra posts → Bandra users first |
| **Freshness** | Time-sensitive matters | Now posts < 1 hour get priority |
| **Urgency** | Expiring soon | "Starting in 30 min" → top |
| **Reply velocity** | Active conversation | Post with 3 replies in 10 min |
| **Post type = Now** | Intent to coordinate | "Now" class > "Ask" > "Pulse" |
| **Available spots** | Room for participation | "3 spots open" > "Filled" |
| **Creator trust score** | Safe, known users | Verified/trusted users rank higher |

### Medium Weight (Secondary Signals)

| Signal | Why |
|--------|-----|
| **Social proximity** | Mutual locality members or same communities |
| **Repeated interactions** | User has engaged with this creator before |
| **Same interests** | Category matches user's selected interests |
| **Same community membership** | Both in same study group / society |

### Lower Weight (Tertiary Signals)

| Signal | Why It's Lower |
|--------|----------------|
| **Generic popularity** | Likes = passive, not actionable |
| **High comment count** | Can mean controversy, not relevance |
| **Old content** | Loses value over time in hyperlocal context |

---

## Anti-Ranking Patterns (What NOT to Do)

- ❌ **Prioritize viral/controversial content** — Kills trust and locality feel
- ❌ **Filler content when area is quiet** — Shows emptiness; better to show "No one's posted yet — be the first!"
- ❌ **Personalized echo chamber** — Should still show variety of categories
- ❌ **Over-ranking popular users** — Can make the feed feel like it's dominated by few people

---

## Feed States

### State 1: Active Locality (Good)
```
User opens feed → sees 10+ fresh posts → scrolls → finds something → acts
```
**Ranking:** Normal ranking applied.

### State 2: Quiet Locality (Low Density)
```
User opens feed → 0–3 posts from last 24h
```
**Strategy:**
- Show posts from wider area (city-level, if opted)
- Show posts with recent activity (any replies)
- Show ambassador/official prompts
- Show "Be the first to post today!" CTA
- Show trending categories in nearby areas

### State 3: New User (Cold Start)
```
User just signed up → 0 posts in feed
```
**Strategy:**
- Onboarding: "Here's what's happening in [locality]"
- Show 3–5 ambassador seed posts
- Encourage: "Ask your first question" with a prompt
- Category quick-pick: "What are you into?"

### State 4: Returning User (Reactivation)
```
User hasn't opened in 3+ days
```
**Strategy:**
- Highlight: "You missed [N] plans in your area"
- Show posts similar to their past activity
- Personal notifications before feed open

---

## Feed Composition (MVP)

| Content Type | % of Feed |
|-------------|-----------|
| Now Posts (live intent) | 50–60% |
| Ask Posts | 15–25% |
| Pulse Posts | 10–15% |
| Ambassador/System prompts | 5–10% |

---

## Implementation Notes

### MVP Feed Query (Simplified)
```sql
SELECT posts.*
FROM posts
WHERE locality_id = :user_locality
  AND created_at > (NOW() - INTERVAL '24 hours')
  AND is_hidden = false
  AND deleted_at IS NULL
ORDER BY
  CASE WHEN post_type = 'now' AND expires_at > NOW() THEN 0 ELSE 1 END,
  reply_velocity DESC,
  created_at DESC
```

### Post-MVP Feed (PostGIS + Full Ranking)
- Include radius-based queries
- Include trust score weighting
- Include social proximity factor
- Include collaborative filtering for categories
