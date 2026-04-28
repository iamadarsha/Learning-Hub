<div align="center">

# Hyvmind

### Internal AI learning and knowledge platform for teams

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000?style=for-the-badge&logo=next.js)](#tech-stack)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=fff)](#tech-stack)
[![tRPC](https://img.shields.io/badge/tRPC-11.7-2596be?style=for-the-badge)](#tech-stack)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6c47ff?style=for-the-badge)](#tech-stack)

</div>

---

## Recruiter Quick Scan

| Signal | Details |
|---|---|
| Product | Internal learning hub for discovering resources, experts, tutorials, and AI-assisted knowledge assets |
| What it demonstrates | B2B SaaS workflows, contribution pipelines, gamification, auth, data modeling, and internal tool UX |
| Differentiator | Combines resource discovery, expert directory, XP, studio workflows, and AI transcription into one workspace |
| Stack | Next.js, TypeScript, tRPC, Drizzle ORM, Clerk, Tailwind CSS, NeonDB |

## What It Does

Hyvmind is a resource discovery, expert networking, and gamified learning platform built for internal teams. Team members can share video tutorials, documents, tools, and templates while an AI transcription pipeline extracts summaries, guides, and tags from video content.

## Product Surface

- Resource feed with categories, resource types, likes, views, and author metadata
- Guided contribute flow with AI transcription, thumbnail selection, review, and publish controls
- Studio dashboard for managing resources, republishing, and reviewing content health
- Expert directory filtered by team, skills, and role
- "Fix the Itch" board for surfacing internal problems that AI could solve
- XP, levels, progress tracking, favourites, and recently viewed history
- Google Drive video embedding and branded thumbnail presets

## Quick Start

```bash
git clone https://github.com/iamadarsha/Learning-Hub.git
cd Learning-Hub
npm install
cp .env.example .env.local
npx drizzle-kit push
npm run dev
```

Optional seed data:

```bash
npx tsx --env-file=.env.local src/scripts/seed-categories.ts
npx tsx --env-file=.env.local src/scripts/seed-users.ts
npx tsx --env-file=.env.local src/scripts/seed-hyvmind.ts
```

## Tech Stack

| Layer | Tooling |
|---|---|
| App | Next.js 15, React, TypeScript |
| API | tRPC |
| Data | Drizzle ORM, NeonDB |
| Auth | Clerk |
| UI | Tailwind CSS, shadcn-style primitives |
| AI | External transcription and resource-analysis flow |

## Documentation

| Document | Purpose |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System diagram, data flow, integrations |
| [TECH_STACK.md](./TECH_STACK.md) | Technology decisions |
| [PROJECT_FLOW.md](./PROJECT_FLOW.md) | User journeys and flowcharts |
| [WHAT_IS_DONE.md](./WHAT_IS_DONE.md) | Working feature checklist |
| [HANDOVER.md](./HANDOVER.md) | First-10-minutes guide for new developers |

## License

Internal use only. Not licensed for external distribution.
