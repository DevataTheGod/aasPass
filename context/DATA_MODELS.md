# Data Models

> **Updated after behavioral refinement.** Added intent-specific fields, response system, and trust tables. The data model is now optimized for the core behavioral loop: real-time local coordination.

---

## Conventions

- Tables use `snake_case` naming
- Primary keys are `uuid` type with `gen_random_uuid()` default
- Timestamps are `timestamptz` with `now()` default
- Soft deletes use `deleted_at` column

---

## users

Core user profile. Linked to Supabase Auth via `id = auth.users.id`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | References `auth.users.id` |
| `full_name` | `text` | Display name |
| `username` | `text UNIQUE` | Unique username for mentions |
| `avatar_url` | `text` | Profile image URL |
| `bio` | `text` | Short bio |
| `primary_locality_id` | `uuid FK → localities` | Main locality |
| `college_name` | `text` | College name (if student) |
| `interests` | `text[]` | Array of interest categories |
| `is_business` | `boolean` | Whether this is a business account |
| `is_verified` | `boolean` | Account verification status |
| `onboarding_completed` | `boolean` | Whether onboarding is done |
| `trust_level` | `text` | `limited`, `standard`, `trusted` (see SAFETY_TRUST.md) |
| `account_created_at` | `timestamptz` | When auth account was created |
| `last_seen_at` | `timestamptz` | Last activity timestamp |
| `created_at` | `timestamptz` | Row creation time |

### Indexes
- `idx_users_username` on `username`
- `idx_users_locality` on `primary_locality_id`
- `idx_users_interests` on `interests` (GIN)
- `idx_users_trust_level` on `trust_level`

---

## localities

Geographic areas that content is scoped to.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `name` | `text` | Locality name (e.g., "Bandra West") |
| `city` | `text` | City name |
| `state` | `text` | State name |
| `type` | `text` | Type: `college`, `neighborhood`, `society`, `area` |
| `college_name` | `text` | If type=college, the institution name |
| `center_lat` | `float8` | Center latitude |
| `center_lng` | `float8` | Center longitude |
| `radius_meters` | `float8` | Approximate radius in meters |
| `boundary_geojson` | `jsonb` | Polygon boundary (later use) |
| `is_active` | `boolean` | Whether locality is active |
| `population_estimate` | `int` | Approximate number of residents |
| `ambassador_count` | `int` | Denormalized ambassador count |
| `organic_post_ratio` | `float` | % of posts from non-ambassador users |
| `created_at` | `timestamptz` | |

### Indexes
- `idx_localities_city` on `city`
- `idx_localities_type` on `type`
- `idx_localities_location` on `center_lat, center_lng`

---

## user_localities

Maps users to localities they belong to (many-to-many).

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `user_id` | `uuid FK → users` | |
| `locality_id` | `uuid FK → localities` | |
| `role` | `text` | Role: `member`, `ambassador`, `admin` |
| `is_primary` | `boolean` | Whether this is the primary locality |
| `joined_at` | `timestamptz` | |

### Indexes
- `idx_user_localities_user` on `user_id`
- `idx_user_localities_locality` on `locality_id`
- Unique on `(user_id, locality_id)`

---

## posts (Behavioral: Intent Posts)

Core content unit — an intent post. **Now optimized for the live coordination loop.**

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `author_id` | `uuid FK → users` | Post author |
| `locality_id` | `uuid FK → localities` | Which locality this belongs to |
| `community_id` | `uuid FK → communities` | Optional — if posted in a community (Phase 5+) |
| `post_type` | `text` | **NEW** — `now`, `ask`, `pulse`, `planned` |
| `category` | `text` | Category: `general`, `sports`, `food`, `events`, `study`, `gaming`, `music`, `help`, `jobs`, `recommendations`, `community` |
| `content` | `text` | Post body text |
| `media_urls` | `text[]` | Array of image URLs |
| `urgency_level` | `text` | **NEW** — `high` (now), `medium` (today), `low` (this week) |
| `start_time` | `timestamptz` | **NEW** — When the plan starts |
| `respond_by` | `timestamptz` | **NEW** — Deadline to respond |
| `spots_total` | `int` | **NEW** — Total spots available (0 = unlimited) |
| `spots_filled` | `int` | **NEW** — Spots currently filled (auto-incremented) |
| `venue_hint` | `text` | **NEW** — Meetup suggestion (e.g., "Near main gate", "Cafe Coffee Day") |
| `safety_meetup_type` | `text` | **NEW** — `public_place`, `tbd` |
| `coordination_status` | `text` | **NEW** — `open`, `almost_full`, `closed`, `completed`, `expired` |
| `audience_type` | `text` | `everyone`, `same_college`, `community_only` |
| `visibility` | `text` | `public`, `locality`, `community` |
| `expires_at` | `timestamptz` | Auto-hide after this time |
| `is_pinned` | `boolean` | Pinned by admin |
| `comment_count` | `int` | Denormalized count |
| `response_count` | `int` | **NEW** — Denormalized intent response count |
| `reply_velocity` | `float` | **NEW** — Responses per hour (for ranking) |
| `is_flagged` | `boolean` | Flagged for moderation |
| `is_hidden` | `boolean` | Hidden by moderation |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |
| `deleted_at` | `timestamptz` | Soft delete |

### Indexes
- `idx_posts_locality` on `locality_id`
- `idx_posts_author` on `author_id`
- `idx_posts_category` on `category`
- `idx_posts_created` on `created_at` DESC
- `idx_posts_type_expiry` on `(post_type, expires_at)` — **For feed ranking**
- `idx_posts_coordination_status` on `coordination_status`

---

## intent_responses (NEW — replaces generic reactions for core loop)

> **NEW table.** Not just "likes" — these are active responses that drive coordination.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `post_id` | `uuid FK → posts` | |
| `user_id` | `uuid FK → users` | |
| `response_type` | `text` | `im_in`, `interested`, `can_join_later`, `need_details` |
| `message` | `text` | Optional note with response |
| `status` | `text` | `active`, `cancelled`, `fulfilled` |
| `created_at` | `timestamptz` | |

### Indexes
- Unique on `(post_id, user_id)` — one response per user per post
- `idx_intent_responses_post` on `post_id`
- `idx_intent_responses_user` on `user_id`

### Behavior
- `im_in` → auto-increments `spots_filled` on the post
- `im_in` + spots_filled >= spots_total → `coordination_status` = `almost_full`
- `im_in` + spots_filled = spots_total → `coordination_status` = `closed`
- Creates a coordination thread between responder and post author

---

## comments

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `post_id` | `uuid FK → posts` | |
| `author_id` | `uuid FK → users` | |
| `parent_id` | `uuid FK → comments` | Optional — for nested replies |
| `content` | `text` | Comment text |
| `is_flagged` | `boolean` | |
| `created_at` | `timestamptz` | |
| `deleted_at` | `timestamptz` | Soft delete |

### Indexes
- `idx_comments_post` on `post_id`
- `idx_comments_author` on `author_id`

---

## reactions

For posts — kept simple. Likely `like` only for MVP. Intent coordination uses `intent_responses`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `post_id` | `uuid FK → posts` | |
| `user_id` | `uuid FK → users` | |
| `type` | `text` | Reaction type: `like` |
| `created_at` | `timestamptz` | |

### Indexes
- Unique on `(post_id, user_id)`
- `idx_reactions_post` on `post_id`

---

## chat_threads (Coordination Threads)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `type` | `text` | `coordination` (auto-created from response), `direct` (manual) |
| `source_post_id` | `uuid FK → posts` | **NEW** — Which post triggered this thread |
| `last_message_at` | `timestamptz` | For sorting inbox |
| `created_at` | `timestamptz` | |

---

## chat_participants

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `thread_id` | `uuid FK → chat_threads` | |
| `user_id` | `uuid FK → users` | |
| `joined_at` | `timestamptz` | |
| `last_read_at` | `timestamptz` | For unread counts |

### Indexes
- Unique on `(thread_id, user_id)`
- `idx_chat_participants_user` on `user_id`

---

## messages

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `thread_id` | `uuid FK → chat_threads` | |
| `sender_id` | `uuid FK → users` | |
| `text` | `text` | Message body |
| `media_url` | `text` | Optional media attachment |
| `created_at` | `timestamptz` | |

### Indexes
- `idx_messages_thread` on `thread_id`
- `idx_messages_created` on `created_at`

---

## communities (Phase 5+)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `name` | `text` | Community name |
| `slug` | `text UNIQUE` | URL-friendly name |
| `description` | `text` | Community description |
| `cover_image` | `text` | Cover image URL |
| `locality_id` | `uuid FK → localities` | |
| `privacy` | `text` | `public` or `private` |
| `member_count` | `int` | Denormalized count |
| `is_verified` | `boolean` | Official community |
| `created_by` | `uuid FK → users` | |
| `created_at` | `timestamptz` | |
| `deleted_at` | `timestamptz` | |

### Indexes
- `idx_communities_locality` on `locality_id`
- `idx_communities_slug` on `slug`

---

## community_members (Phase 5+)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `community_id` | `uuid FK → communities` | |
| `user_id` | `uuid FK → users` | |
| `role` | `text` | `member`, `moderator`, `admin` |
| `joined_at` | `timestamptz` | |

### Indexes
- Unique on `(community_id, user_id)`

---

## events (Phase 5+)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `title` | `text` | Event title |
| `description` | `text` | Event description |
| `locality_id` | `uuid FK → localities` | |
| `community_id` | `uuid FK → communities` | Optional community event |
| `host_id` | `uuid FK → users` | Event organizer |
| `venue_name` | `text` | Location name |
| `lat` | `float8` | Venue latitude |
| `lng` | `float8` | Venue longitude |
| `start_time` | `timestamptz` | |
| `end_time` | `timestamptz` | |
| `capacity` | `int` | Max attendees (0 = unlimited) |
| `category` | `text` | Event category |
| `cover_image` | `text` | Event image |
| `attendee_count` | `int` | Denormalized |
| `created_at` | `timestamptz` | |

---

## event_attendees (Phase 5+)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `event_id` | `uuid FK → events` | |
| `user_id` | `uuid FK → users` | |
| `status` | `text` | `going`, `maybe`, `not_going` |
| `created_at` | `timestamptz` | |

### Indexes
- Unique on `(event_id, user_id)`

---

## businesses (Phase 7+)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `name` | `text` | Business name |
| `slug` | `text UNIQUE` | URL-friendly name |
| `description` | `text` | Business description |
| `category` | `text` | `cafe`, `salon`, `gym`, `store`, `restaurant`, `service`, etc. |
| `locality_id` | `uuid FK → localities` | |
| `lat` | `float8` | Location |
| `lng` | `float8` | |
| `address` | `text` | Full address |
| `contact_info` | `jsonb` | Phone, email, website, social links |
| `hours_json` | `jsonb` | Operating hours |
| `verified` | `boolean` | Verification status |
| `owner_user_id` | `uuid FK → users` | Business owner account |
| `created_at` | `timestamptz` | |

---

## reports

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `reporter_id` | `uuid FK → users` | |
| `target_type` | `text` | `post`, `comment`, `user`, `community` |
| `target_id` | `uuid` | ID of the reported entity |
| `reason` | `text` | Report reason category |
| `description` | `text` | User's description of issue |
| `status` | `text` | `pending`, `reviewed`, `dismissed`, `actioned` |
| `reviewed_by` | `uuid FK → users` | Moderator who reviewed |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

### Indexes
- `idx_reports_status` on `status`
- `idx_reports_target` on `(target_type, target_id)`

---

## blocked_users

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `blocker_id` | `uuid FK → users` | User who blocked |
| `blocked_id` | `uuid FK → users` | Blocked user |
| `created_at` | `timestamptz` | |

### Indexes
- Unique on `(blocker_id, blocked_id)`

---

## notifications

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `user_id` | `uuid FK → users` | Notification recipient |
| `type` | `text` | `intent_response`, `new_comment`, `direct_reply`, `area_pulse`, `urgency_alert`, `trust_update`, etc. |
| `title` | `text` | Notification title |
| `body` | `text` | Notification body |
| `data` | `jsonb` | Payload for navigation |
| `is_read` | `boolean` | |
| `created_at` | `timestamptz` | |

### Indexes
- `idx_notifications_user` on `(user_id, is_read)`
- `idx_notifications_created` on `created_at` DESC

---

## user_verifications (NEW — Trust layer)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `user_id` | `uuid FK → users` | |
| `method` | `text` | `phone_otp`, `email_domain`, `ambassador_verified` |
| `verified_value` | `text` | Verified identifier |
| `verified_at` | `timestamptz` | |

### Indexes
- `idx_user_verifications_user` on `user_id`
- Unique on `(user_id, method)`

---

## user_trust_signals (NEW — Trust layer)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | |
| `user_id` | `uuid FK → users` | |
| `signal_type` | `text` | `account_age`, `post_count`, `response_rate`, `report_count`, `successful_meetups` |
| `signal_value` | `float` | Numeric value |
| `updated_at` | `timestamptz` | |

### Indexes
- `idx_user_trust_signals` on `(user_id, signal_type)`

---

## Entity Relationships (Updated)

```
users 1──N posts
users 1──N intent_responses
users 1──N comments
users 1──N messages
users 1──N chat_participants
users 1──N user_verifications
users 1──N user_trust_signals
users 1──N reports (as reporter)
users M──N blocked_users (self-referential)

localities 1──N posts
localities 1──N communities (Phase 5+)
localities 1──N events (Phase 5+)
localities 1──N businesses (Phase 7+)
localities M──N users (via user_localities)

posts 1──N intent_responses (NEW — primary coordination mechanism)
posts 1──N comments
posts 1──N reactions
posts 1──N chat_threads (via source_post_id)
posts N──1 communities (optional, Phase 5+)

chat_threads 1──N chat_participants
chat_threads 1──N messages
chat_threads N──1 posts (source_post_id)

communities 1──N community_members (Phase 5+)
events 1──N event_attendees (Phase 5+)
```
