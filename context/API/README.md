# API Documentation

## Contents

This directory documents the API surface of AasPaas.

Since we use Supabase as the backend, most API interactions go through:

1. **Supabase Client SDK** — Direct database queries with RLS
2. **Supabase Realtime** — WebSocket subscriptions for live data
3. **Supabase Storage** — File upload/download
4. **Supabase Auth** — Authentication endpoints

### Planned Files

- `endpoints.md` — API endpoints and query patterns
- `realtime-events.md` — Realtime subscription channels and events
- `notification-events.md` — Push notification payloads and triggers
- `rls-summary.md` — Summary of Row-Level Security policies

### Reference

See `context/DATA_MODELS.md` for the underlying data schema.
