# NeoKizFest — Claude Code Project

This is the NeoKizomba Festival refund system — a Rails 8 app with Inertia.js + React frontend that handles the public-facing refund process, a live progress dashboard, community features (Flowers gallery, community messages), and admin tooling.

## Key Context

- Full architecture, design decisions, and component patterns are in the auto-memory file
- The memory system is at `.claude/projects/.../memory/MEMORY.md` (loaded automatically)
- PRD: `neo-kizomba-refund-system-prd.md`

## Agent Automations

See [`agents-ideas.md`](./agents-ideas.md) for a full list of Claude agent ideas — what's been implemented, and what's planned.

**Currently running:**
- **Daily Post Draft Agent** — fires at 8am via n8n → `POST /api/post-draft/generate` → drafts a Facebook caption using live Notion stats + post history, emails to charles@neokizomba.com

## Tech Stack

- Rails 8 + Inertia.js + React 19 + Mantine 8.1 + TypeScript + Tailwind
- Notion as the primary database (no SQL DB)
- Action Mailer via Brevo SMTP
- Hosted on DigitalOcean, deployed via Kamal
- n8n for scheduled triggers and Lemon Squeezy webhooks

## Important Rules

- Never include chargeback counts in social posts or public-facing data
- Progress % = (completed + waived) / total_ticket_holders only
- PII is sanitized server-side — full names, emails, and amounts never reach the frontend on public pages
- No t-shirt or shipping fields — those were removed from the codebase
