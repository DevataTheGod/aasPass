# API Specification

> MVP API endpoints using Supabase. The app primarily uses the Supabase client SDK directly (DB queries, real-time subscriptions, auth, storage). Edge Functions are used where server-side logic is needed.

---

## Auth Endpoints

| Endpoint | Method | Description | Supabase SDK |
|----------|--------|-------------|--------------|
| `/auth/sign-up` | — | Create account with phone OTP | `supabase.auth.signUp()` |
| `/auth/verify-otp` | — | Verify OTP code | `supabase.auth.verifyOtp()` |
| `/auth/session` | — | Get current session | `supabase.auth.getSession()` |
| `/auth/sign-out` | — | Sign out | `supabase.auth.signOut()` |

---

## Database Queries (Direct via Client)

### Posts

| Operation | Description | Query Approach |
|-----------|-------------|----------------|
| List feed posts | Get posts for locality, sorted by urgency + freshness | `supabase.from('posts').select(...).eq('locality_id', id).order('reply_velocity', { ascending: false })` |
| Get post detail | Single post with author | `supabase.from('posts').select('*, author:users(*)').eq('id', id).single()` |
| Create post | Insert new intent post | `supabase.from('posts').insert({...})` |
| Delete post | Soft delete own post | `supabase.from('posts').update({ deleted_at: now() }).eq('id', id).eq('author_id', userId)` |
| Update coordination status | Spots filled, status change | `supabase.from('posts').update({ spots_filled, coordination_status }).eq('id', id)` |

### Intent Responses

| Operation | Description | Query Approach |
|-----------|-------------|----------------|
| Respond to post | Create intent response | `supabase.from('intent_responses').insert({...})` |
| List responses on post | Get all responses | `supabase.from('intent_responses').select('*, user:users(*)').eq('post_id', id)` |
| Cancel response | Remove response | `supabase.from('intent_responses').delete().eq('id', id).eq('user_id', userId)` |

### Comments

| Operation | Description |
|-----------|-------------|
| List comments | `supabase.from('comments').select('*, author:users(*)').eq('post_id', id).order('created_at')` |
| Create comment | `supabase.from('comments').insert({...})` |
| Delete comment | Soft delete own comment |

### Chat / Coordination Threads

| Operation | Description |
|-----------|-------------|
| List user's threads | `supabase.from('chat_participants').select('thread:chat_threads(*)').eq('user_id', userId).order('last_message_at', { ascending: false })` |
| Get thread messages | `supabase.from('messages').select('*, sender:users(*)').eq('thread_id', id).order('created_at')` |
| Send message | `supabase.from('messages').insert({...})` |
| Mark thread read | `supabase.from('chat_participants').update({ last_read_at: now() }).eq('thread_id', id).eq('user_id', userId)` |

### Users

| Operation | Description |
|-----------|-------------|
| Get profile | `supabase.from('users').select('*').eq('id', userId).single()` |
| Update profile | `supabase.from('users').update({...}).eq('id', userId)` |
| Get user's posts | `supabase.from('posts').select('*').eq('author_id', userId).order('created_at', { ascending: false })` |

### Safety

| Operation | Description |
|-----------|-------------|
| Report content | `supabase.from('reports').insert({...})` |
| Block user | `supabase.from('blocked_users').insert({ blocker_id, blocked_id })` |
| Check if blocked | Query block relationship |

---

## Real-Time Subscriptions

| Channel | Description | Filter |
|---------|-------------|--------|
| Feed updates | New posts in locality | `postgres_changes:posts:locality_id=eq.{id}` |
| Post responses | New responses on a post | `postgres_changes:intent_responses:post_id=eq.{id}` |
| Chat messages | New messages in thread | `postgres_changes:messages:thread_id=eq.{id}` |
| Chat thread updates | Thread metadata changes | `postgres_changes:chat_threads:id=eq.{id}` |

---

## Edge Functions (MVP)

| Function | Trigger | Purpose |
|----------|---------|---------|
| `on-intent-response` | After INSERT on intent_responses | Update spots_filled, coordination_status, notify post author |
| `on-new-message` | After INSERT on messages | Mark thread as unread for recipients, send push notification |
| `on-post-created` | After INSERT on posts | Trigger notifications to relevant users |
| `send-push-notification` | Called by other functions | Send push via Expo Push API |

---

## File Storage

| Operation | Description |
|-----------|-------------|
| Upload avatar | `supabase.storage.from('avatars').upload(userId, file)` |
| Upload post image | `supabase.storage.from('post-images').upload(id, file)` |
| Get public URL | `supabase.storage.from('bucket').getPublicUrl(path)` |

---

## Push Notification Payloads (MVP)

### Response to Your Post
```json
{
  "title": "Riya is interested!",
  "body": "Riya wants to join your badminton plan at 6 PM",
  "data": {
    "type": "intent_response",
    "post_id": "uuid",
    "user_id": "uuid"
  }
}
```

### New Message
```json
{
  "title": "Riya",
  "body": "Where exactly should we meet?",
  "data": {
    "type": "new_message",
    "thread_id": "uuid",
    "sender_id": "uuid"
  }
}
```

### Area Pulse
```json
{
  "title": "Plans brewing near you!",
  "body": "3 people want to play badminton in Bandra tonight",
  "data": {
    "type": "area_pulse",
    "locality_id": "uuid"
  }
}
```

---

## Rate Limits (MVP)

| Action | Limit | Period |
|--------|-------|--------|
| Create post (new account) | 3 | First 24 hours |
| Create post (standard) | 10 | Per day |
| Send DM (new account) | 5 | First 24 hours |
| Send DM (standard) | 15 | Per day |
| Create account | 1 | Per phone number |
| Report content | 10 | Per day |
