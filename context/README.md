# AasPaas Project Context

> This folder is the **project brain** — a living documentation hub for AasPaas. Updated for behavioral refinement.

---

## Purpose

This directory maintains the full context of the AasPaas project, including:
- **Behavioral design** — Psychology, engagement loops, retention mechanics
- **Product vision and strategy** — Emotional positioning, wedge vs. long-term
- **Architecture decisions and rationale** — Why we build what we build
- **Current state and progress tracking** — What exists, what's next
- **Data models and API specifications** — Schema and infrastructure
- **Safety and trust systems** — How we keep users safe
- **Launch and growth playbook** — How we ship and expand

---

## How to Use This Folder

### For AI Assistants (Codebuff, Claude, etc.)
When starting a session, **read these files first** in this order:

1. **`CURRENT_STATE.md`** — What exists right now
2. **`BEHAVIORAL_DESIGN_BIBLE.md`** — The core behavioral thesis (read this before anything else)
3. **`MVP_SCOPE.md`** — What we're building and why
4. **`ARCHITECTURE.md`** — How the app is structured
5. **`DATA_MODELS.md`** — Database schema
6. **`DECISIONS.md`** — Why certain choices were made

### For Developers
- **Update** `CURRENT_STATE.md` and `SESSION_LOG.md` after every work session
- **Log decisions** in `DECISIONS.md` whenever you make an architectural choice
- **Keep** `ROADMAP.md` updated as priorities shift
- **Add** unresolved questions to `OPEN_QUESTIONS.md`
- **Reference** behavioral docs when making product decisions

---

## File Overview

### Behavioral Core (Read First)
| File | What It Contains |
|------|-----------------|
| `BEHAVIORAL_DESIGN_BIBLE.md` | **Core behavioral thesis** — user loop, content philosophy, UX principles, behavioral metrics |
| `PERSONAS.md` | 7 behavioral user personas with emotional needs, triggers, and retention hooks |
| `POSITIONING.md` | Emotional positioning, brand voice, app store copy, messaging hierarchy |
| `FEED_PHILOSOPHY.md` | Feed ranking for actionability, feed states, anti-patterns |
| `RETENTION_AND_NOTIFICATIONS.md` | Retention systems, notification psychology, first-week cadence |
| `SAFETY_TRUST.md` | 5-layer trust architecture, graduated account gating, moderation SLAs |
| `SEEDING_AND_GROWTH.md` | Ethical seeding, ambassador program, density thresholds, locality growth loops |

### Product & Strategy
| File | What It Contains |
|------|-----------------|
| `PRODUCT_VISION.md` | Full product vision, emotional promise, initial wedge vs. long-term, competitive moat |
| `MVP_SCOPE.md` | **Revised MVP** — live-intent coordination loop, behavioral success metrics |
| `ROADMAP.md` | **Restructured roadmap** — behavioral proof milestones, behavioral foundation phase |
| `BACKLOG.md` | Behavior-prioritized feature backlog |
| `LAUNCH_PLAYBOOK.md` | **Enhanced playbook** — ambassador ops, seeding calendar, density thresholds |
| `OPEN_QUESTIONS.md` | Refocused open questions |

### Technical Architecture
| File | What It Contains |
|------|-----------------|
| `ARCHITECTURE.md` | **Updated architecture** — behavior-driven systems (ranking, safety, notification router) |
| `ROUTES.md` | Full Expo Router route tree and screen list |
| `DATA_MODELS.md` | **Updated schema** — intent-specific fields, response system, trust tables |
| `DECISIONS.md` | **Updated ADRs** — 4 new decisions, 1 revised (chat moved earlier) |
| `TESTING_STRATEGY.md` | Testing approach and coverage plans |
| `API_SPEC.md` | API endpoints, realtime events, notification specs |

### Session & Progress
| File | What It Contains |
|------|-----------------|
| `CURRENT_STATE.md` | Current project status — update frequently |
| `SESSION_LOG.md` | Per-session change log |

---

## Subdirectories

| Directory | Contents |
|-----------|----------|
| `SCREEN_SPECS/` | Detailed specs for each screen |
| `FLOWS/` | User flow documentation |
| `DB/` | SQL schemas, migrations, RLS policies |
| `API/` | API endpoint docs, realtime events |
| `DESIGN/` | Design tokens, tone guidelines, component inventory |
| `RESEARCH/` | Launch locality research, competitor analysis |
