# CLAUDE.md

## Project

**Hyvmind MVP1** — Pattern's internal AI learning and knowledge platform. Resource discovery + expert networking + gamified XP system. Built on forked YouTube clone, stripped of Mux/UploadThing.

## Commands

```bash
npm run dev              # Dev server (Turbopack, port 3000)
npm run build            # Production build
npm run lint             # ESLint
npx drizzle-kit push    # Push schema changes to NeonDB
npx drizzle-kit studio  # DB browser

# Seeding (requires .env.local)
npx tsx --env-file=.env.local src/scripts/seed-categories.ts
npx tsx --env-file=.env.local src/scripts/seed-users.ts
npx tsx --env-file=.env.local src/scripts/seed-hyvmind.ts
```

## Stack

Next.js 15 App Router, tRPC 11, Drizzle ORM, NeonDB (Postgres), Clerk auth, Upstash Redis, ShadcnUI + Tailwind v4, React 19, Zod 4

## Architecture

- **Domain modules:** `src/modules/{name}/server/procedures.ts` + `ui/components/`
- **9 tRPC routers** in `src/trpc/routers/_app.ts`: resources, categories, search, studio, experts, users, xp, leaderboard, progress
- **Auth:** `protectedProcedure` in `src/trpc/init.ts` — Clerk auth + auto user creation + Upstash rate limit
- **Data fetching:** Server components use `prefetch()` + `<HydrateClient>`, clients use `useSuspenseQuery()`
- **Pagination:** Cursor-based `{id, updatedAt}` on resources and studio routers

## Database

7 tables in `src/db/schema.ts`: users, categories, resources, userXp, resourceViews, expertProfiles, xpEvents

Key resource fields: `type` (enum: video/doc/tutorial/tool/template), `visibility`, `isPublished`, `transcriptionStatus/Title/Summary/Detailed/Steps/Tags`

## Key Paths

```
src/db/schema.ts                              # All table definitions
src/trpc/init.ts                              # baseProcedure, protectedProcedure
src/trpc/routers/_app.ts                      # Router composition
src/modules/resources/server/procedures.ts    # Resource CRUD + contribute flow
src/modules/resources/ui/components/          # Contribute stepper + steps 1-4
src/app/(studio)/studio/contribute/page.tsx   # Contribute flow page
src/app/(home)/page.tsx                       # Home feed
src/app/globals.css                           # Brand colors + animations
src/lib/drive.ts                              # getDriveEmbedUrl(), getDriveThumbnailUrl()
src/lib/xp.ts                                # XP_VALUES, LEVELS, getLevelFromXP()
src/lib/ratelimit.ts                          # Rate limit configs
src/middleware.ts                             # Route protection
```

## Brand

- Dark-first: `#090A0F` bg, `#FCFCFC` text
- Primary: `#009BFF` (Pattern Blue)
- Accent: `#770BFF` (Violet)
- Tertiary: `#4CC3AE` (Teal)
- Navy: `#00084D` (card backgrounds)
- Font: DM Sans (400, 500, 600, 700)
- All CSS vars in `globals.css` under `:root`

## XP System

VIEW=5, COMPLETE=10, SUBMIT=25, FIRST_SUBMIT=50 (not wired), STREAK=15. Levels: Learner(0) → Explorer(100) → Builder(300) → Expert(600) → PAIoneer(1000)

## Contribute Flow (4 steps)

1. Step 1: Title + URL + type → `createDraft` mutation (isPublished: false) → triggers background transcription
2. Step 2: Processing banner (polls every 3s) + category/description/attachments form
3. Step 3: Review (video embed + transcription cards) → `publishResource` → +25 XP
4. Step 4: Confirmation + XP toast

## Route Groups

- `(auth)` — `/sign-in`, `/sign-up` — No auth required
- `(home)` — `/`, `/explore`, `/experts`, `/leaderboard`, `/resources/*` — Public
- `(studio)` — `/studio/*` — Requires Clerk auth

## Code Conventions

- Path alias: `@/*` → `src/*`
- Module routers: `export const {name}Router = createTRPCRouter({...})`
- `baseProcedure` for public reads, `protectedProcedure` for auth writes
- Resources default to `visibility: "public"` on submission
- Cursor pagination: `{ cursor: { id, updatedAt }, limit }` → `{ items, nextCursor }`

## Do Not Modify

- `src/modules/categories/server/procedores.ts` — Filename typo is intentional, all imports depend on it
- `src/components/ui/*` — Auto-generated ShadcnUI. Use `npx shadcn-ui@latest add` to modify
- `src/trpc/init.ts` — Core auth middleware, changes affect all protected endpoints

## Known Issues

- `/studio/submit` page fails during `next build` (SSR prefetch without auth context). Superseded by `/studio/contribute`
- `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` are `true` in `next.config.ts`
- `submitRatelimit` (5/hour) defined but not applied to contribute flow
- `FIRST_SUBMIT_BONUS` (+50 XP) defined but not awarded
- No test framework configured
- No production deployment configured

## Environment

Requires `.env.local` with: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL` (Neon), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `TRANSCRIPTION_API_URL`, `TRANSCRIPTION_API_KEY`. Template in `.env.example`.

## External Integrations

- **Clerk** — Auth (GitHub + Google OAuth)
- **NeonDB** — Postgres via `@neondatabase/serverless` HTTP driver
- **Upstash Redis** — Rate limiting
- **External Transcription API** — `POST {URL}/analyze` with Drive URL → returns summary + steps
- **Google Drive** — URL pattern matching for iframe embed
