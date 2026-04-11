# What Is Done

Exhaustive checklist of everything that is fully built and working in Hyvmind MVP1.

---

## Authentication & User Management

- [x] Clerk sign-in with GitHub and Google OAuth providers
- [x] Clerk sign-up flow
- [x] Auto user creation in DB on first authenticated tRPC request
- [x] Clerk webhook handler for user.created / user.updated / user.deleted events
- [x] Middleware route protection for `/studio/*`, `/settings/*`, `/progress/*`
- [x] Public access to `/`, `/explore`, `/experts`, `/leaderboard`, `/resources/*`
- [x] Rate limiting via Upstash Redis (20 req/10s per user)

## Home Feed

- [x] Resource discovery grid with category filter pills
- [x] Infinite scroll with cursor-based pagination
- [x] Category filtering (click pill to filter, click again to clear)
- [x] Resource cards with title, type badge, author info, view count
- [x] Server-side prefetching with React Query hydration

## Explore Page

- [x] Full resource browser with search input
- [x] Category filter dropdown/pills
- [x] Type filters (Video / Tutorial / Doc / Tool / Template)
- [x] Results ordered by view count

## Resource Detail Page

- [x] Google Drive video embed (auto-extracts file ID from URL)
- [x] Resource metadata display (type, category, views, XP value)
- [x] Author info card
- [x] Related resources section (same category, max 3)
- [x] XP toast on first view (+5 XP)

## 4-Step Contribute Flow (NEW)

- [x] Stepper indicator with completed/active/upcoming states
- [x] **Step 1**: Title, URL, and resource type selector with visual tiles
- [x] **Step 1**: `createDraft` mutation creates unpublished resource
- [x] **Step 1**: Transcription triggered as fire-and-forget background process
- [x] **Step 2**: Processing banner with shimmer animation (indeterminate progress)
- [x] **Step 2**: Polls transcription status every 3 seconds, stops on complete/failed
- [x] **Step 2**: Processing complete/failed state transitions
- [x] **Step 2**: Category dropdown (required), description textarea, attachment URL pills (max 3)
- [x] **Step 2**: "Continue anyway" on transcription failure (graceful degradation)
- [x] **Step 3**: Two-column review layout (video embed + transcription cards)
- [x] **Step 3**: Mission Control card (summary + tags)
- [x] **Step 3**: Execution Protocol card (numbered steps with KEY STEP badges + action tags)
- [x] **Step 3**: Topic Matrix tags
- [x] **Step 3**: `publishResource` mutation sets `isPublished: true` + awards +25 XP
- [x] **Step 4**: Animated checkmark + XP toast (auto-dismiss 4s)
- [x] **Step 4**: "View in feed" and "Submit another" CTAs

## Legacy Submit Form

- [x] Single-page form at `/studio/submit` (still exists, superseded by Contribute flow)

## Expert Directory

- [x] Expert profile cards with avatar, role, team, skills, bio
- [x] Team filter (Conversion / Creative / Engineering / Data / Product)
- [x] "Connect" buttons on profile cards
- [x] 5 seeded demo expert profiles

## Leaderboard

- [x] Top 3 users with gradient highlight cards
- [x] Full rank table below top 3
- [x] Displays XP, level, streak for each user

## Studio Dashboard

- [x] Resource management table for authenticated user
- [x] Cursor-based pagination of user's resources
- [x] Studio sidebar navigation (Dashboard, My Resources, Contribute, XP History)
- [x] Studio navbar with "Submit Resource" button → `/studio/contribute`

## My Resources

- [x] Table of user's submitted resources
- [x] Resource count and metadata display

## XP History

- [x] Stats cards (total XP, level, streak)
- [x] "How to Earn XP" guide
- [x] Level milestones tracker

## My Progress

- [x] XP hero card with progress bar to next level
- [x] In-progress resource list (viewed but not completed)
- [x] Completed resource list

## Settings

- [x] Profile editor (saves to `expert_profiles` table)
- [x] Appearance toggle (dark/light via next-themes)
- [x] Notification toggles (UI only, no backend)
- [x] Privacy toggles (UI only, no backend)

## View History

- [x] Chronological view history with completion badges
- [x] Ordered by most recent view

## Navigation

- [x] Home sidebar with all main links (Home, Explore, Experts, Leaderboard, Contribute, Progress, Settings)
- [x] Auth-gated sidebar items redirect to Clerk sign-in
- [x] Studio sidebar with Dashboard, My Resources, Contribute, XP History
- [x] Mobile-responsive sidebar (collapsible)

## Backend Infrastructure

- [x] 9 tRPC routers with full type safety
- [x] 7 database tables with relations and cascading deletes
- [x] Drizzle-Zod auto-generated insert/update/select schemas
- [x] Cursor-based pagination pattern
- [x] Server-side prefetch + HydrateClient SSR hydration
- [x] Rate limiting middleware in protectedProcedure

## Database & Seed Data

- [x] 7 categories seeded (AI & Automation, n8n Workflows, Figma & Design, Amazon & eComm, Pi & KMS, Data & Analytics, Prompt Engineering)
- [x] 8 seed resources across categories
- [x] 5 demo users with XP, streaks, and expert profiles

## Brand & Design System

- [x] Pattern brand colors as CSS variables in globals.css
- [x] Dark-first theme (`#090A0F` background)
- [x] Light mode override (`.light` class)
- [x] DM Sans font (400, 500, 600, 700 weights)
- [x] Consistent card styles (`#00084D` bg, `rgba(255,255,255,0.08)` borders)

---

## Partially Done / Not Wired

- [ ] ⚠️ `submitRatelimit` (5/hour) defined in `src/lib/ratelimit.ts` but not applied to contribute flow
- [ ] ⚠️ `FIRST_SUBMIT_BONUS` (+50 XP) defined but not awarded on first submission
- [ ] ⚠️ `DAILY_STREAK` XP (+15) calculated in `xp.recordView` but not as a standalone award
- [ ] ⚠️ Notification toggles in Settings are UI-only (no backend)
- [ ] ⚠️ Privacy toggles in Settings are UI-only (no backend)
- [ ] ⚠️ GitHub Actions workflow exists but only does checkout (no build/test/deploy)
- [ ] ⚠️ `system_prompts.ts` has AI prompts for title/description generation but they're not used in any flow

## Not Built Yet (MVP2 Candidates)

- [ ] Saved/Favorites functionality (pages exist as placeholders)
- [ ] Real-time notifications
- [ ] Resource comments/discussions
- [ ] File upload (currently URL-only)
- [ ] Admin dashboard
- [ ] Analytics/reporting
- [ ] Watch duration tracking (schema field exists, not wired)
- [ ] Email digests
- [ ] Production deployment to Netlify/Vercel
- [ ] Testing framework (Vitest/Cypress)
