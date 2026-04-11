# Handover

Everything a new developer needs in the first 10 minutes.

---

## What This Is

Hyvmind is Pattern's internal knowledge platform. Team members share learning resources (videos, docs, tutorials, tools, templates), an AI pipeline extracts summaries from video content, and a gamification layer (XP, levels, streaks) drives engagement. Built on a forked YouTube clone, stripped of Mux/UploadThing, and rebuilt for internal knowledge management.

## Current State (April 2026 — v1.1)

**Working:** Home feed with like counts, Explore, Resource detail with Drive embed, Expert directory, 4-step Contribute flow with AI transcription + thumbnail picker, Edit/Republish from dashboard, Studio dashboard with search + unpublish/republish actions, Fix the Itch kanban page, XP system, Progress tracking, Settings (profile editor, notifications, privacy), Auth (Clerk with GitHub + Google).

**Removed in v1.1:** Leaderboard page and router (fully removed from codebase and nav). Dark Mode toggle (always dark). "Show on Leaderboard" privacy toggle.

**Not working:** The pre-existing `/studio/submit` page fails during `next build` static generation (SSR prefetch without auth context), but it's superseded by `/studio/contribute`.

**Not built yet:** Saved/Favourites (placeholder pages exist), notifications backend, comments, file uploads, admin dashboard, analytics, production deployment, tests, Fix the Itch backend (currently static demo).

---

## Folder Structure

```
hyvmind/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Clerk sign-in/sign-up pages
│   │   ├── (home)/                 # Public pages
│   │   │   ├── page.tsx            # Home feed
│   │   │   ├── explore/            # Browse all resources
│   │   │   ├── experts/            # Expert directory
│   │   │   ├── fix-the-itch/       # Static kanban board (v1.1)
│   │   │   ├── resources/[id]/     # Resource detail
│   │   │   ├── progress/           # My Progress
│   │   │   ├── history/            # Recently Viewed
│   │   │   ├── favorites/          # My Favourites (placeholder)
│   │   │   ├── saved/              # Saved (placeholder)
│   │   │   └── settings/           # Profile, notifications, privacy
│   │   ├── (studio)/               # Protected pages
│   │   │   └── studio/
│   │   │       ├── page.tsx        # Dashboard (resources table)
│   │   │       ├── contribute/     # 4-step contribute flow
│   │   │       ├── submit/         # Legacy submit form (superseded)
│   │   │       ├── resources/      # My Resources (removed from nav)
│   │   │       └── xp/             # XP History
│   │   ├── api/
│   │   │   ├── trpc/[trpc]/        # tRPC API handler
│   │   │   └── users/webhook/      # Clerk webhook endpoint
│   │   ├── globals.css             # Tailwind v4 + Pattern brand + animations
│   │   └── layout.tsx              # Root layout (Clerk, tRPC, Toaster, font)
│   │
│   ├── modules/                    # Domain-driven feature modules
│   │   ├── resources/              # Resource CRUD, transcription, contribute UI
│   │   │   ├── server/procedures.ts   # 11 procedures incl. createDraft, publish, unpublish, republish
│   │   │   └── ui/components/
│   │   │       ├── resource-card.tsx          # Feed card (thumbnail + likes + author)
│   │   │       ├── contribute-stepper.tsx     # 4-step indicator
│   │   │       ├── contribute-step1.tsx       # Title + URL + type (accepts initialValues)
│   │   │       ├── contribute-step2.tsx       # Processing + thumbnail + details
│   │   │       ├── contribute-step3.tsx       # Review + publish
│   │   │       ├── contribute-step4.tsx       # Confirmation + XP toast
│   │   │       └── thumbnail-picker.tsx       # 4 palette presets + upload (v1.1)
│   │   ├── categories/             # Category listing (note: procedores.ts typo)
│   │   ├── studio/                 # Studio dashboard layout + views + resources table
│   │   ├── experts/                # Expert profiles
│   │   ├── xp/                     # XP tracking + recording
│   │   ├── progress/               # View history + completion
│   │   ├── search/                 # Full-text search (filters isPublished)
│   │   ├── users/                  # Profile management
│   │   ├── auth/                   # Auth button component
│   │   └── home/                   # Home layout + sidebar (grouped nav with dividers)
│   │
│   ├── components/                 # Shared components
│   │   ├── ui/                     # 30+ ShadcnUI primitives
│   │   ├── infinite-scroll.tsx     # Intersection observer wrapper
│   │   ├── responsive-dialog.tsx   # Responsive dialog/drawer
│   │   └── user-avatar.tsx         # Avatar display
│   │
│   ├── db/
│   │   ├── schema.ts              # 7 tables (resources has likeCount + transcription fields)
│   │   └── index.ts               # Neon/Drizzle connection
│   │
│   ├── trpc/
│   │   ├── init.ts                # Context, baseProcedure, protectedProcedure
│   │   ├── client.tsx             # TRPCReactProvider setup
│   │   ├── server.tsx             # prefetch() + HydrateClient for SSR
│   │   ├── query-client.ts        # React Query configuration
│   │   └── routers/_app.ts        # 8 routers (leaderboard removed in v1.1)
│   │
│   ├── lib/
│   │   ├── drive.ts               # Google Drive URL → embed/thumbnail
│   │   ├── thumbnail.ts           # Preset palette colours + getThumbnailPalette() (v1.1)
│   │   ├── xp.ts                  # XP values + level thresholds
│   │   ├── ratelimit.ts           # Upstash sliding window configs
│   │   ├── redis.ts               # Upstash Redis client
│   │   └── utils.ts               # cn(), formatDuration(), snakeCaseToTitleCase()
│   │
│   ├── hooks/                     # useIntersectionObserver, useMobile
│   ├── providers/                 # TRPCProviderClient wrapper
│   ├── middleware.ts              # Clerk route protection (public: /, /explore, /experts, /fix-the-itch, /resources/*)
│   └── constants.ts              # DEFAULT_LIMIT = 5
│
├── scripts/start-ngrok.mjs        # Webhook tunnel for local dev
├── drizzle.config.ts              # Drizzle ORM config (reads .env.local)
├── next.config.ts                 # Image domains, build error ignoring
├── system_prompts.ts              # AI prompts (unused in current flows)
└── docs/WEBHOOK_TROUBLESHOOTING.md # Legacy Mux webhook guide (historical)
```

---

## How to Run Locally

```bash
git clone <repo-url>
cd hyvmind
npm install
cp .env.example .env.local        # Fill in all values below
npx drizzle-kit push              # Sync schema to NeonDB
npm run dev                       # http://localhost:3000
```

### Seed data (optional but recommended):
```bash
npx tsx --env-file=.env.local src/scripts/seed-categories.ts
npx tsx --env-file=.env.local src/scripts/seed-users.ts
npx tsx --env-file=.env.local src/scripts/seed-hyvmind.ts
```

### For webhook development:
```bash
npm run dev:all    # Runs next dev + ngrok tunnel concurrently
```

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |
| `CLERK_SIGNING_SECRET` | Clerk webhook signature verification | `whsec_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page path | `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Post sign-in redirect | `/` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Post sign-up redirect | `/` |
| `DATABASE_URL` | NeonDB PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint | `https://...upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis auth token | `AX...` |
| `TRANSCRIPTION_API_URL` | External transcription service base URL | `https://your-api.com` |
| `TRANSCRIPTION_API_KEY` | Transcription API bearer token | `sk-...` |
| `GEMINI_API_KEY` | Google Gemini API key (reserved for future) | `AI...` |

---

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Turbopack, port 3000) |
| `npm run dev:all` | Dev + ngrok webhook tunnel |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx drizzle-kit push` | Push schema to NeonDB |
| `npx drizzle-kit studio` | Open Drizzle Studio (DB browser) |

---

## Navigation Map

### Home Sidebar (4 groups with dividers)
| Group | Items |
|-------|-------|
| Discovery | Home, Explore, Find Experts, Fix the itch (disabled, "Soon" badge) |
| Personal | Contribute, My Progress |
| Library | Recently Viewed, My Favourites |
| System | Settings |

### Studio Sidebar
Dashboard > Contribute > XP History

### Studio Navbar
`// hyvmind studio` logo left, "Exit Studio" outlined button + avatar right. No submit button in navbar.

---

## Gotchas & Known Issues

1. **Categories router typo** — File is `procedores.ts` (not `procedures.ts`). Don't rename it — all imports reference this path.

2. **Build fails on `/studio/submit`** — The old submit page's server component tries to prefetch during static generation without auth context. Superseded by `/studio/contribute` (which is `"use client"`). Safe to delete.

3. **`ignoreBuildErrors: true`** — TypeScript and ESLint errors are ignored during build (`next.config.ts`). Be careful not to introduce silent type errors.

4. **`z` alias in shell** — If using zoxide, `cd` may be aliased to `z`. Use `builtin cd` or full paths in scripts.

5. **Transcription API not configured** — Without `TRANSCRIPTION_API_URL` and `TRANSCRIPTION_API_KEY` in `.env.local`, the transcription will gracefully fail. The contribute flow still works — Step 2 shows "Processing failed" and lets the user continue.

6. **XP awarded in multiple places** — `xp.recordView` and `progress.recordView` both award view XP independently. Submit XP is awarded in `resources.publishResource`. XP is never deducted on unpublish.

7. **Webhook not needed for dev** — User creation happens automatically in `protectedProcedure`. The Clerk webhook is a secondary sync mechanism for user updates/deletions.

8. **No production deployment** — The app runs only locally. No Vercel/Netlify deployment is configured.

9. **Thumbnail upload is local only** — The thumbnail picker's "upload" option creates a blob URL. This works in the same browser session but won't persist across page reloads or for other users. Preset thumbnails (`preset:0` through `preset:3`) are fully persistent. Real image hosting is a Phase 2 task.

10. **isPublished filter** — All public-facing queries (`getMany`, `search`, `getRelated`) filter by `isPublished: true`. The studio `getMany` does NOT filter, so unpublished resources appear in the dashboard for their owner.

11. **Leaderboard fully removed** — The leaderboard module, router, page, and all nav links were removed in v1.1. The `userXp` table still exists and powers XP History / My Progress.

---

## Do Not Touch

- `src/modules/categories/server/procedores.ts` — Typo in filename is intentional. All imports depend on it.
- `src/components/ui/*` — Auto-generated ShadcnUI components. Modify via `npx shadcn-ui@latest add` if needed.
- `src/trpc/init.ts` — Core auth + rate limit middleware. Changes here affect every protected endpoint.
- `src/lib/thumbnail.ts` palette order — Resource cards render thumbnails based on `preset:N` index. Changing the palette array order would break existing thumbnails.

---

## Immediate Next Steps (Priority Order)

1. **Deploy to Vercel/Netlify** — Add production environment variables, delete the old `/studio/submit` page
2. **Wire submit rate limit** — Apply `submitRatelimit` (5/hour) to `createDraft` or `publishResource`
3. **First-submit bonus** — Award +50 XP on user's first-ever resource submission
4. **Favourites backend** — Wire up `/favorites` with a `saved_resources` table + like toggle on cards
5. **Fix the Itch backend** — Add `problems` table, CRUD procedures, claim/solve mutations
6. **Image upload hosting** — Replace blob URLs with UploadThing or S3 for thumbnail uploads
7. **Add testing** — Set up Vitest for unit tests, Playwright for E2E
8. **Configure CI/CD** — Complete the GitHub Actions workflow (lint, type-check, build, deploy)
9. **Resource comments** — Add a `comments` table and comment thread UI on resource detail page
10. **Admin dashboard** — CRUD for managing all resources, users, and categories

---

## v1.1 Changelog (vs v1.0)

| Change | Details |
|--------|---------|
| Leaderboard removed | Page, router, nav link, middleware route, settings toggle — all deleted |
| Home sidebar regrouped | 4 groups with dividers: Discovery / Personal / Library / System |
| "Fix the itch" page added | Static 3-column kanban at `/fix-the-itch` with demo cards |
| Studio navbar | Replaced "+ Submit Resource" with "← Exit Studio" outlined button |
| Studio sidebar | Removed "My Resources" and "Exit Studio" links |
| Dashboard table | Added search bar, removed Visibility column, removed "No description", added Unpublish/Republish/Edit actions with confirmation modal |
| Resource card redesign | New layout: preset thumbnail → type + likes → title → avatar + views. Removed XP badge |
| Thumbnail picker | New component in Step 2: 4 colour palettes + custom upload |
| Thumbnail preview in Step 3 | Shows selected thumbnail with "Change" link |
| `publishResource` stores thumbnail | Saves `preset:N` or upload URL to `thumbnailUrl` column |
| Edit pre-fill | `/studio/contribute?resourceId=X` loads existing resource into all steps |
| `unpublish` / `republish` procedures | New tRPC mutations. Unpublish clears resourceViews, preserves XP |
| `likeCount` column | Added to resources table (display-only, no toggle UI yet) |
| `isPublished` filter | Added to `getMany`, `search`, `getRelated` queries |
| Settings cleanup | Removed Appearance section (Dark Mode toggle) and "Show on Leaderboard" privacy toggle |
