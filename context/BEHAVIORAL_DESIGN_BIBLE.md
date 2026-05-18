# Behavioral Design Bible

> This is the **primary behavioral document** for AasPaas. It defines how users should think, feel, and act when using the product. Every feature decision should trace back to a principle in this document.

---

## A. Behavioral North Star

### Core Human Problem
> "I want plans / people / local energy nearby, **now**."

Loneliness, boredom, and social friction keep people from connecting with the world around them, even when opportunity is steps away.

### Core Product Promise
AasPaas helps you **act on nearby social possibility instantly**.

### Core Success Moment
A user opens the app and **joins or creates a live local plan within minutes**.

### One-Line Behavioral Thesis
> **Find your people nearby, right now.**

---

## B. Primary User Loop (The Wedge)

The entire MVP is designed around ONE loop:

### The Live Local Intent Loop

```
TRIGGER → ACTION → REWARD → REINVESTMENT
```

#### 1. Trigger (Need State)
- Boredom — "Nothing to do, no one to do it with"
- Social need — "Want to play badminton / grab coffee / study together"
- Practical need — "Need a recommendation / help / a ride / a partner"
- Curiosity — "What's happening around me right now?"
- FOMO — "Others nearby are doing something"

#### 2. Action (Low Friction Post)
User creates a **live intent card**:
- What they want to do (category)
- When (now, soon, later)
- Who they need (number of people)
- Where (meetup hint)
- Urgency level

**OR** responds to someone else's intent card with a lightweight action:
- "I'm in" / "Interested" / "Can join later"

#### 3. Reward (Fast Relevance)
- Instant visibility to relevant nearby users
- Quick responses (minutes, not hours)
- Connection leads to a real or meaningful interaction
- Social momentum — "People are nearby and active"

#### 4. Reinvestment (Building Local Identity)
- User sees name, profile, and past interactions
- Builds trust and recognition in their locality
- Receives notifications keeping them in the loop
- Returns because the area feels **alive**

---

## C. Content Philosophy

Not all posts are equal. AasPaas has **content classes** with different behavioral goals:

### Class 1: Now Posts 🟢 (Highest Priority)
**Behavioral goal:** Real-time coordination
- Time-sensitive, participation-seeking
- Expires quickly (hours, not days)
- Dominates the feed
- Examples: "Anyone for badminton at 6?", "Café hopping in Bandra rn?", "Need 1 more for football"

### Class 2: Ask Posts 🟡
**Behavioral goal:** Local problem-solving
- Help / recommendation / request
- Builds local utility habit
- Examples: "Best dosa near college?", "Need a tutor for physics", "Anyone selling a bike?"

### Class 3: Pulse Posts 🔵
**Behavioral goal:** Social proof and atmosphere
- Local chatter, ongoing activity
- Makes the area feel alive
- Examples: "Great vibe at this café", "Study group in library right now"

### Class 4: Planned Posts 🟣 (Post-MVP)
**Behavioral goal:** Scheduled coordination
- Lower urgency, planned ahead
- Bridges to events feature later
- Examples: "Turf booked Saturday 5pm, 2 more needed"

### Feed Priority
```
Now Posts > Ask Posts with recent replies > Pulse Posts > Planned Posts
```

---

## D. UX Philosophy

### How the App Should Feel
- **Alive** — Something is happening nearby right now
- **Immediate** — Fast, no friction, instant relevance
- **Local** — Distinctly your area, your college, your people
- **Safe** — Trust is designed into every interaction
- **Simple** — Open → See → Act, in seconds

### How the App Should NOT Feel
- Corporate or generic
- Content-heavy or influencer-driven
- Passive-scroll-first (Instagram-style)
- Transactional or marketplace-like
- Overwhelming or noisy

### Design Tone
- Warm, human, conversational
- Encouraging — "Join in!", "See who's nearby", "Make the plan"
- Protective — Safety prompts, "Meet in public", moderation visibility

---

## E. Behavioral Metrics (MVP Success)

| Metric | Why It Matters | Target |
|--------|---------------|--------|
| Time-to-first-response on Now posts | Core loop speed | <10 min |
| % of Now posts getting >=1 response | Feed relevance | >60% |
| % of responders who send a coordination DM | Real interaction | >30% |
| Next-day return after first post/response | Retention proof | >40% |
| DAU/MAU ratio | Habit formation | >30% |
| # of "I'm in" or interest actions per day | Active participation | >30/day |
| Time from open to action (post/create) | UX friction | <30 sec |

---

## F. Anti-Patterns (What to Avoid)

- ❌ **Passive scrolling as primary behavior** — AasPaas is not Instagram for local content
- ❌ **Influencer/creator dynamics** — Amplifies passive consumption, not participation
- ❌ **Broad national content** — Destroys locality advantage
- ❌ **Generic notifications** — "New activity near you" without specificity is noise
- ❌ **Over-moderation that kills spontaneity** — Balance speed with safety
- ❌ **Feature-creeping beyond the core loop** — Communities, events, businesses are wrappers, not the product
