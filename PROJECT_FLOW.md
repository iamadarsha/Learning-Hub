# Project Flow

## Primary Flow: Resource Discovery & Learning

```mermaid
flowchart TD
    A[User visits Hyvmind] --> B{Signed in?}
    B -->|No| C[Browse public pages: Home, Explore, Experts, Leaderboard]
    B -->|Yes| D[Full access: + Studio, Progress, Settings]

    C --> E[Click resource card]
    D --> E

    E --> F[Resource detail page]
    F --> G[Google Drive video embed loads]
    F --> H[recordView mutation fires]
    H --> I{First view?}
    I -->|Yes| J[+5 XP awarded, streak updated]
    I -->|No| K[No XP, already viewed]

    F --> L[Click 'Mark Complete']
    L --> M[markComplete mutation]
    M --> N[+10 XP awarded]

    D --> O[Click 'Contribute' in sidebar]
    O --> P[4-Step Contribute Flow]
```

## Contribute Flow (4-Step Stepper)

```mermaid
flowchart TD
    subgraph Step1["Step 1: Resource Basics"]
        S1A[Enter title] --> S1B[Enter Google Drive URL]
        S1B --> S1C[Select resource type]
        S1C --> S1D["Click 'Next →'"]
        S1D --> S1E["createDraft mutation"]
        S1E --> S1F["Resource created (isPublished: false)"]
        S1E --> S1G["triggerTranscription() fire-and-forget"]
    end

    subgraph Step2["Step 2: Processing + Details"]
        S2A["Processing banner (polls every 3s)"]
        S2B["Select category (required)"]
        S2C["Add description (optional)"]
        S2D["Add attachment URLs (optional, max 3)"]
        S2A --> S2E{Transcription status?}
        S2E -->|completed| S2F["✓ Processing complete!"]
        S2E -->|failed| S2G["✗ Continue anyway →"]
        S2E -->|processing| S2A
        S2F --> S2H["Click 'Next →'"]
        S2G --> S2H
    end

    subgraph Step3["Step 3: Review & Submit"]
        S3A["Left: Video embed + metadata"]
        S3B["Right: AI transcription cards"]
        S3C["Mission Control (summary + tags)"]
        S3D["Execution Protocol (step-by-step)"]
        S3E["Click 'Submit Resource'"]
        S3E --> S3F["publishResource mutation"]
        S3F --> S3G["isPublished → true"]
        S3F --> S3H["+25 XP awarded"]
    end

    subgraph Step4["Step 4: Confirmation"]
        S4A["✓ Animated checkmark"]
        S4B["+25 XP toast (auto-dismiss 4s)"]
        S4C["'View in feed' or 'Submit another'"]
    end

    Step1 --> Step2 --> Step3 --> Step4
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Clerk
    participant Middleware
    participant tRPC
    participant DB

    User->>Clerk: Sign in (GitHub/Google)
    Clerk-->>User: Session cookie

    User->>Middleware: Request /studio/*
    Middleware->>Clerk: Verify session
    Clerk-->>Middleware: userId

    User->>tRPC: First tRPC call
    tRPC->>DB: SELECT user WHERE clerkId = ?
    alt User not in DB
        tRPC->>Clerk: currentUser() API call
        Clerk-->>tRPC: Profile data
        tRPC->>DB: INSERT user
    end
    tRPC->>DB: Rate limit check (Upstash)
    tRPC-->>User: Response with enriched context
```

## XP & Leveling Flow

| Action | XP | Trigger |
|--------|-----|---------|
| View a resource (first time) | +5 | `xp.recordView` / `progress.recordView` |
| Complete a resource | +10 | `progress.markComplete` |
| Submit a resource | +25 | `resources.publishResource` |
| First-ever submission | +50 | Not yet wired |
| Daily streak | +15 | Calculated on view recording |

**Levels:** Learner (0) → Explorer (100) → Builder (300) → Expert (600) → PAIoneer (1000)

## Data Fetching Pattern

```
Server Component (page.tsx)
  └─ prefetch(trpc.*.queryOptions(...))
  └─ return <HydrateClient><ClientView /></HydrateClient>

Client Component (client.tsx)
  └─ const trpc = useTRPC()
  └─ useSuspenseQuery(trpc.*.queryOptions(...))  // reads from hydrated cache
  └─ useSuspenseInfiniteQuery(...)               // for paginated lists
```

## Error States

| Scenario | Behavior |
|----------|----------|
| Unauthenticated user hits protected route | Clerk redirects to `/sign-in` |
| Rate limit exceeded (20 req/10s) | tRPC returns `TOO_MANY_REQUESTS` |
| Transcription API fails | Status set to "failed", user can continue without AI summary |
| Transcription API not configured | Same graceful degradation — "failed" status |
| Resource not found | tRPC returns `NOT_FOUND` error |
| Draft creation fails | Step 1 shows error message, user can retry |
| Publish fails | Step 3 shows error message, user can retry |

## Search Flow

```
User types in search bar
  → search.query procedure
  → ILIKE on resources.title + resources.description
  → Optional filters: type (enum), categoryId (UUID)
  → Ordered by viewCount DESC
  → Results rendered as resource cards
```

## Infinite Scroll (Home Feed / Explore)

```
Initial load: getMany({ limit: 12, categoryId: null })
  → Returns { items: Resource[], nextCursor: { id, updatedAt } | null }

User scrolls to bottom (IntersectionObserver triggers):
  → getMany({ limit: 12, cursor: lastCursor, categoryId: selectedCategory })
  → Appends items to list
  → Repeats until nextCursor is null
```
