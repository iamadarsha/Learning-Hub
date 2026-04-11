# Hyvmind

**Pattern's internal AI learning and knowledge platform.**

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript) ![tRPC](https://img.shields.io/badge/tRPC-11.7-2596BE) ![Drizzle](https://img.shields.io/badge/Drizzle_ORM-0.44-green) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss) ![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF)

---

## What It Does

Hyvmind is a resource discovery, expert networking, and gamified learning platform built for Pattern's internal teams. Team members share video tutorials, documents, tools, and templates, while an AI transcription pipeline automatically extracts step-by-step guides from video content. An XP and leveling system rewards contributions and engagement.

## Who It's For

Pattern's internal teams: Conversion, Creative, Engineering, Data, and Product.

## Key Features

- **Resource Feed** — Browse, search, and filter resources by category and type (Video/Tutorial/Doc/Tool/Template). Cards show type badge, like count, author avatar, and views
- **4-Step Contribute Flow** — Submit resources through a guided stepper with AI transcription, thumbnail picker (4 colour presets or custom upload), and full review preview
- **Edit & Republish** — Unpublish resources from the dashboard, edit them through the same contribute stepper (pre-filled), and republish when ready
- **AI Transcription** — External API extracts summaries, step-by-step guides, and topic tags from Google Drive videos
- **XP & Gamification** — Earn XP for viewing (+5), completing (+10), and submitting (+25) resources. Level up from Learner to PAIoneer
- **Expert Directory** — Browse team experts filtered by team, skills, and role
- **Fix the Itch** — Static kanban board for posting team problems AI could solve (Open / Claimed / Solved columns)
- **Progress Tracking** — Track in-progress and completed resources with view history
- **Google Drive Embed** — Drive links auto-embed as video players
- **Studio Dashboard** — Manage resources with search, unpublish/republish actions, and confirmation modals
- **Preset Thumbnails** — 4 branded colour palettes rendered as title cards; stored as `preset:N` in the database

## Quick Start

```bash
git clone <repo-url>
cd hyvmind
npm install
cp .env.example .env.local   # Fill in credentials (see HANDOVER.md)
npx drizzle-kit push          # Apply schema to NeonDB
npm run dev                   # http://localhost:3000
```

## Seed Data (Optional)

```bash
npx tsx --env-file=.env.local src/scripts/seed-categories.ts
npx tsx --env-file=.env.local src/scripts/seed-users.ts
npx tsx --env-file=.env.local src/scripts/seed-hyvmind.ts
```

## Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System diagram, data flow, integrations |
| [TECH_STACK.md](./TECH_STACK.md) | Every technology, its version, and why it's used |
| [PROJECT_FLOW.md](./PROJECT_FLOW.md) | End-to-end user journeys with flowcharts |
| [WHAT_IS_DONE.md](./WHAT_IS_DONE.md) | Exhaustive checklist of working features |
| [HANDOVER.md](./HANDOVER.md) | First-10-minutes guide for new developers |
| [CLAUDE.md](./CLAUDE.md) | AI agent context file for Claude Code sessions |

## Navigation Structure

### Home Sidebar
Home > Explore > Find Experts > Fix the itch (Soon) | Contribute > My Progress | Recently Viewed > My Favourites | Settings

### Studio Sidebar
Dashboard > Contribute > XP History

### Studio Navbar
Logo left, "Exit Studio" button + avatar right

## License

Internal use only. Not licensed for external distribution.
