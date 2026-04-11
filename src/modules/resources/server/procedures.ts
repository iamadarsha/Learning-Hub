import { db } from "@/db";
import { categories, resources, resourceViews, users, userXp, xpEvents } from "@/db/schema";
import { XP_VALUES } from "@/lib/xp";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { z } from "zod";

// ── Transcription types ──

type TranscriptionResponse = {
  missionControl: {
    title: string;
    summary: string;
    tags: string[];
  };
  detailedSummary: string;
  steps: {
    number: number;
    title: string;
    description: string;
    isKeyStep: boolean;
    actionTags?: string[];
  }[];
};

// ── XP award helper ──

async function awardSubmitXP(userId: string, clerkId: string, resourceId: string) {
  const [existing] = await db
    .select()
    .from(userXp)
    .where(eq(userXp.userId, userId))
    .limit(1);

  const xpAmount = XP_VALUES.SUBMIT_RESOURCE;

  if (existing) {
    const newTotal = existing.totalXp + xpAmount;
    const newLevel = [...[
      { level: 1, minXP: 0 },
      { level: 2, minXP: 100 },
      { level: 3, minXP: 300 },
      { level: 4, minXP: 600 },
      { level: 5, minXP: 1000 },
    ]].reverse().find((l) => newTotal >= l.minXP)?.level ?? 1;

    await db
      .update(userXp)
      .set({ totalXp: newTotal, level: newLevel, updatedAt: new Date() })
      .where(eq(userXp.userId, userId));
  } else {
    await db.insert(userXp).values({
      userId,
      totalXp: xpAmount,
      streak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      level: 1,
    });
  }

  await db.insert(xpEvents).values({
    userId: clerkId,
    eventType: "submit",
    xpAwarded: xpAmount,
    resourceId,
  });
}

// ── Background transcription ──

async function triggerTranscription(resourceId: string, driveUrl: string) {
  try {
    const apiUrl = process.env.TRANSCRIPTION_API_URL;
    const apiKey = process.env.TRANSCRIPTION_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("Transcription API not configured");
    }

    const response = await fetch(`${apiUrl}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ url: driveUrl }),
    });

    if (!response.ok) throw new Error(`Transcription failed: ${response.status}`);

    const data: TranscriptionResponse = await response.json();

    await db
      .update(resources)
      .set({
        transcriptionStatus: "completed",
        transcriptionTitle: data.missionControl.title,
        transcriptionSummary: data.missionControl.summary,
        transcriptionDetailed: data.detailedSummary,
        transcriptionSteps: JSON.stringify(data.steps),
        transcriptionTags: data.missionControl.tags,
      })
      .where(eq(resources.id, resourceId));
  } catch (error) {
    await db
      .update(resources)
      .set({ transcriptionStatus: "failed" })
      .where(eq(resources.id, resourceId));
    console.error("Transcription error:", error);
  }
}

export const resourcesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        categoryId: z.string().uuid().nullish(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      const { categoryId, cursor, limit } = input;

      const data = await db
        .select({
          resource: resources,
          user: users,
          category: categories,
        })
        .from(resources)
        .leftJoin(users, eq(resources.userId, users.id))
        .leftJoin(categories, eq(resources.categoryId, categories.id))
        .where(
          and(
            eq(resources.visibility, "public"),
            eq(resources.isPublished, true),
            categoryId ? eq(resources.categoryId, categoryId) : undefined,
            cursor
              ? or(
                  lt(resources.updatedAt, cursor.updatedAt),
                  and(eq(resources.updatedAt, cursor.updatedAt), eq(resources.id, cursor.id))
                )
              : undefined
          )
        )
        .orderBy(desc(resources.updatedAt), desc(resources.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.resource.id, updatedAt: lastItem.resource.updatedAt }
        : null;

      return { items, nextCursor };
    }),

  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [result] = await db
        .select({
          resource: resources,
          user: users,
          category: categories,
        })
        .from(resources)
        .leftJoin(users, eq(resources.userId, users.id))
        .leftJoin(categories, eq(resources.categoryId, categories.id))
        .where(eq(resources.id, input.id))
        .limit(1);

      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(500),
        description: z.string().max(5000).optional(),
        type: z.enum(["video", "doc", "tutorial", "tool", "template"]),
        url: z.string().url().optional(),
        categoryId: z.string().uuid().optional(),
        thumbnailUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [resource] = await db
        .insert(resources)
        .values({
          ...input,
          userId: ctx.user.id,
          authorId: ctx.user.clerkId,
          authorName: ctx.user.name,
          authorImageUrl: ctx.user.imageUrl,
          visibility: "public",
          xpValue: 10,
        })
        .returning();

      return resource;
    }),

  getRelated: baseProcedure
    .input(z.object({ categoryId: z.string().uuid(), excludeId: z.string().uuid() }))
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(resources)
        .where(
          and(
            eq(resources.categoryId, input.categoryId),
            eq(resources.visibility, "public"),
            eq(resources.isPublished, true)
          )
        )
        .orderBy(desc(resources.createdAt))
        .limit(4);

      return data.filter((r) => r.id !== input.excludeId).slice(0, 3);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(500).optional(),
        description: z.string().max(5000).optional(),
        type: z.enum(["video", "doc", "tutorial", "tool", "template"]).optional(),
        url: z.string().url().optional(),
        categoryId: z.string().uuid().optional(),
        visibility: z.enum(["public", "private"]).optional(),
        thumbnailUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [existing] = await db
        .select()
        .from(resources)
        .where(and(eq(resources.id, id), eq(resources.userId, ctx.user.id)))
        .limit(1);

      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      const [updated] = await db
        .update(resources)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(resources.id, id))
        .returning();

      return updated;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(resources)
        .where(and(eq(resources.id, input.id), eq(resources.userId, ctx.user.id)))
        .limit(1);

      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      const [deleted] = await db.delete(resources).where(eq(resources.id, input.id)).returning();
      return deleted;
    }),

  deleteResource: protectedProcedure
    .input(z.object({ resourceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { resourceId } = input;

      const [existing] = await db
        .select()
        .from(resources)
        .where(and(eq(resources.id, resourceId), eq(resources.userId, ctx.user.id)))
        .limit(1);

      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      // 1. Delete resource views (Continue Watching, Recently Viewed, Last Watched)
      await db.delete(resourceViews).where(eq(resourceViews.resourceId, resourceId));

      // 2. Delete XP events associated with this resource
      await db.delete(xpEvents).where(eq(xpEvents.resourceId, resourceId));

      // 3. Delete the resource itself
      await db.delete(resources).where(eq(resources.id, resourceId));

      return { success: true };
    }),

  // ── Contribute flow procedures ──

  createDraft: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(200),
        type: z.enum(["video", "tutorial", "doc", "tool", "template"]),
        url: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [resource] = await db
        .insert(resources)
        .values({
          ...input,
          userId: ctx.user.id,
          authorId: ctx.user.clerkId,
          authorName: ctx.user.name,
          authorImageUrl: ctx.user.imageUrl,
          visibility: "public",
          xpValue: 10,
          isPublished: false,
          transcriptionStatus: "processing",
        })
        .returning();

      // Fire-and-forget transcription
      triggerTranscription(resource.id, input.url).catch(console.error);

      return resource;
    }),

  deleteDraft: protectedProcedure
    .input(z.object({ resourceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(resources)
        .where(
          and(
            eq(resources.id, input.resourceId),
            eq(resources.userId, ctx.user.id),
            eq(resources.isPublished, false) // safety: only delete unpublished drafts
          )
        );
      return { success: true };
    }),

  getTranscriptionStatus: protectedProcedure
    .input(z.object({ resourceId: z.string().uuid() }))
    .query(async ({ input }) => {
      const [resource] = await db
        .select({
          transcriptionStatus: resources.transcriptionStatus,
          transcriptionTitle: resources.transcriptionTitle,
          transcriptionSummary: resources.transcriptionSummary,
          transcriptionDetailed: resources.transcriptionDetailed,
          transcriptionSteps: resources.transcriptionSteps,
          transcriptionTags: resources.transcriptionTags,
        })
        .from(resources)
        .where(eq(resources.id, input.resourceId));

      return {
        status: resource?.transcriptionStatus ?? "pending",
        data:
          resource?.transcriptionStatus === "completed"
            ? {
                missionControl: {
                  title: resource.transcriptionTitle,
                  summary: resource.transcriptionSummary,
                  tags: resource.transcriptionTags ?? [],
                },
                detailedSummary: resource.transcriptionDetailed,
                steps: resource.transcriptionSteps
                  ? JSON.parse(resource.transcriptionSteps)
                  : [],
              }
            : null,
      };
    }),

  publishResource: protectedProcedure
    .input(
      z.object({
        resourceId: z.string().uuid(),
        categoryId: z.string().uuid(),
        description: z.string().max(500).optional(),
        attachments: z.array(z.string().url()).optional(),
        thumbnailUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [resource] = await db
        .update(resources)
        .set({
          categoryId: input.categoryId,
          description: input.description,
          thumbnailUrl: input.thumbnailUrl,
          isPublished: true,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(resources.id, input.resourceId),
            eq(resources.userId, ctx.user.id)
          )
        )
        .returning();

      if (!resource) throw new TRPCError({ code: "NOT_FOUND" });

      // Award XP
      await awardSubmitXP(ctx.user.id, ctx.user.clerkId, resource.id);

      return resource;
    }),

  unpublish: protectedProcedure
    .input(z.object({ resourceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(resources)
        .set({ isPublished: false, updatedAt: new Date() })
        .where(
          and(
            eq(resources.id, input.resourceId),
            eq(resources.userId, ctx.user.id)
          )
        );
      // Remove from continue watching / recently viewed
      await db
        .delete(resourceViews)
        .where(eq(resourceViews.resourceId, input.resourceId));
      return { success: true };
    }),

  republish: protectedProcedure
    .input(z.object({ resourceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(resources)
        .set({ isPublished: true, updatedAt: new Date() })
        .where(
          and(
            eq(resources.id, input.resourceId),
            eq(resources.userId, ctx.user.id)
          )
        );
      return { success: true };
    }),

  search: baseProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const { query, limit } = input;
      const data = await db
        .select({
          resource: resources,
          user: users,
          category: categories,
        })
        .from(resources)
        .leftJoin(users, eq(resources.userId, users.id))
        .leftJoin(categories, eq(resources.categoryId, categories.id))
        .where(
          and(
            eq(resources.visibility, "public"),
            eq(resources.isPublished, true),
            or(ilike(resources.title, `%${query}%`), ilike(resources.description, `%${query}%`))
          )
        )
        .orderBy(desc(resources.viewCount))
        .limit(limit);

      return data;
    }),
});
