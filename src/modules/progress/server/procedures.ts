import { db } from "@/db";
import { resourceViews, resources, userXp, xpEvents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { XP_VALUES, getLevelFromXP } from "@/lib/xp";
import { and, desc, eq, isNull, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";

async function addXP(userId: string, amount: number, eventType: string, resourceId?: string) {
  // Log event
  await db.insert(xpEvents).values({
    userId,
    eventType,
    xpAwarded: amount,
    resourceId,
  });

  // Get current XP
  const [current] = await db.select().from(userXp).where(eq(userXp.userId, userId)).limit(1);

  if (!current) return amount; // no userXp row — will be created by xp router

  const newTotal = current.totalXp + amount;
  const { level } = getLevelFromXP(newTotal);

  await db
    .update(userXp)
    .set({ totalXp: newTotal, level, updatedAt: new Date() })
    .where(eq(userXp.userId, userId));

  return newTotal;
}

export const progressRouter = createTRPCRouter({
  recordView: protectedProcedure
    .input(z.object({ resourceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check if already viewed
      const [existing] = await db
        .select()
        .from(resourceViews)
        .where(
          and(
            eq(resourceViews.userId, ctx.user.id),
            eq(resourceViews.resourceId, input.resourceId)
          )
        )
        .limit(1);

      if (existing) return { xpAwarded: 0, alreadyViewed: true };

      // Record view
      await db.insert(resourceViews).values({
        userId: ctx.user.id,
        resourceId: input.resourceId,
      });

      // Increment view count on resource
      await db
        .update(resources)
        .set({ viewCount: sql`${resources.viewCount} + 1` })
        .where(eq(resources.id, input.resourceId));

      // Award XP
      const newTotal = await addXP(
        ctx.user.id.toString(),
        XP_VALUES.VIEW_RESOURCE,
        "view",
        input.resourceId
      );

      return { xpAwarded: XP_VALUES.VIEW_RESOURCE, alreadyViewed: false, newTotal };
    }),

  markComplete: protectedProcedure
    .input(z.object({ resourceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Update the view record with completedAt
      const [updated] = await db
        .update(resourceViews)
        .set({ completedAt: new Date() })
        .where(
          and(
            eq(resourceViews.userId, ctx.user.id),
            eq(resourceViews.resourceId, input.resourceId),
            isNull(resourceViews.completedAt)
          )
        )
        .returning();

      if (!updated) return { xpAwarded: 0, alreadyCompleted: true };

      const newTotal = await addXP(
        ctx.user.id.toString(),
        XP_VALUES.COMPLETE_RESOURCE,
        "complete",
        input.resourceId
      );

      return { xpAwarded: XP_VALUES.COMPLETE_RESOURCE, alreadyCompleted: false, newTotal };
    }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const history = await db
      .select({
        view: resourceViews,
        resource: resources,
      })
      .from(resourceViews)
      .leftJoin(resources, eq(resourceViews.resourceId, resources.id))
      .where(eq(resourceViews.userId, ctx.user.id))
      .orderBy(desc(resourceViews.viewedAt))
      .limit(50);

    return history;
  }),

  getInProgress: protectedProcedure.query(async ({ ctx }) => {
    const inProgress = await db
      .select({
        view: resourceViews,
        resource: resources,
      })
      .from(resourceViews)
      .leftJoin(resources, eq(resourceViews.resourceId, resources.id))
      .where(
        and(
          eq(resourceViews.userId, ctx.user.id),
          isNull(resourceViews.completedAt)
        )
      )
      .orderBy(desc(resourceViews.viewedAt))
      .limit(10);

    return inProgress;
  }),

  getCompleted: protectedProcedure.query(async ({ ctx }) => {
    const completed = await db
      .select({
        view: resourceViews,
        resource: resources,
      })
      .from(resourceViews)
      .leftJoin(resources, eq(resourceViews.resourceId, resources.id))
      .where(
        and(
          eq(resourceViews.userId, ctx.user.id),
          isNotNull(resourceViews.completedAt)
        )
      )
      .orderBy(desc(resourceViews.completedAt))
      .limit(10);

    return completed;
  }),
});
