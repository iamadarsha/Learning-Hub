# Tech Stack

## Frontend

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Next.js** | 15.5.6 | App Router, SSR, API routes, middleware | Turbopack for dev. `ignoreBuildErrors: true` in config |
| **React** | 19.2 | UI rendering | Server components for data prefetching |
| **TypeScript** | 5.x | Type safety | Strict mode. Path alias `@/*` → `src/*` |
| **Tailwind CSS** | 4.1.16 | Utility-first styling | v4 with `@theme` directive, PostCSS plugin, `tailwindcss-animate` |
| **ShadcnUI** | Latest | Component library | 30+ Radix-based primitives. Config in `components.json` |
| **Radix UI** | Various | Accessible primitives | Dialog, dropdown, sidebar, tooltip, etc. |
| **Lucide React** | 0.511 | Icons | Used throughout UI |
| **React Hook Form** | 7.66 | Form management | Used in submit/contribute flows |
| **Zod** | 4.1.12 | Schema validation | Input validation for all tRPC procedures |
| **Embla Carousel** | 8.6.0 | Category pill scrolling | Horizontal scrollable category filters |
| **next-themes** | 0.4.6 | Dark/light mode | Settings page toggle. Dark-first design |
| **date-fns** | 4.1.0 | Date formatting | View history timestamps |
| **clsx + tailwind-merge** | Latest | Class composition | `cn()` utility in `src/lib/utils.ts` |
| **class-variance-authority** | 0.7.1 | Component variants | ShadcnUI variant definitions |

## Backend & API

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **tRPC** | 11.7.x | Type-safe API | 9 domain routers. `httpBatchLink` with `superjson` transformer |
| **Drizzle ORM** | 0.44.7 | Database ORM | Schema-first. `drizzle-zod` for auto-generated Zod schemas |
| **drizzle-kit** | 0.31.1 | DB migrations | `push` for schema sync, `studio` for DB browser |
| **SuperJSON** | 2.2.5 | Serialization | Handles Date, BigInt, etc. in tRPC payloads |
| **Svix** | 1.81.0 | Webhook verification | Clerk webhook signature validation |

## Database

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **NeonDB** | (hosted) | PostgreSQL database | Serverless, HTTP driver via `@neondatabase/serverless` |
| **PostgreSQL** | 15+ | Relational DB | 7 tables, UUID primary keys, array columns, cascading deletes |

## Authentication

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Clerk** | 6.34.1 | Auth provider | GitHub + Google OAuth. Auto user creation on first tRPC call |
| **@clerk/nextjs** | 6.12.12 | Next.js integration | Middleware route protection. `currentUser()` for API access |

## Caching & Rate Limiting

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Upstash Redis** | 1.35.6 | Redis client | REST-based, serverless-compatible |
| **@upstash/ratelimit** | 2.0.7 | Rate limiting | Sliding window: 20 req/10s general, 5 submits/hour |

## AI / Transcription

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **External Transcription API** | N/A | Video analysis | Accepts Google Drive URL, returns structured summary + steps |
| **Gemini API** | N/A | AI features | API key stored but not yet actively used in codebase |

## DevOps & Tooling

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Turbopack** | (bundled) | Dev server bundler | Fast refresh in development |
| **ESLint** | 9.x | Linting | `next/core-web-vitals` + `next/typescript`. Ignored during builds |
| **PostCSS** | Latest | CSS processing | `@tailwindcss/postcss` plugin |
| **ngrok** | CLI | Webhook tunneling | Domain: `musical-stag-luckily.ngrok-free.app`. Used for local Clerk webhooks |
| **concurrently** | 9.1.2 | Process management | Runs `next dev` + ngrok tunnel together via `dev:all` |
| **GitHub Actions** | N/A | CI | Minimal workflow (checkout only, not building/testing yet) |

## Google Drive Integration

| Feature | Implementation | Notes |
|---------|---------------|-------|
| **Video embed** | `getDriveEmbedUrl()` in `src/lib/drive.ts` | Extracts file ID, returns `/preview` iframe URL |
| **Thumbnails** | `getDriveThumbnailUrl()` | Returns `sz=w400` thumbnail |
| **Image hosting** | `next.config.ts` remotePatterns | `drive.google.com` whitelisted |

## Known Gotchas

1. **Tailwind v4** — Uses `@theme` directive instead of `tailwind.config.js`. Theme tokens defined in `globals.css`
2. **Zod v4** — Some API differences from v3. `drizzle-zod` generates v4 schemas
3. **Categories typo** — Router file is `procedores.ts` (not `procedures.ts`). Preserved for import stability
4. **Build errors ignored** — `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` are both `true` in `next.config.ts`
5. **No test framework** — No Vitest, Jest, or Cypress configured yet
6. **Pre-existing SSG error** — `/studio/submit` page fails during `next build` static generation (server component prefetches without auth context)
