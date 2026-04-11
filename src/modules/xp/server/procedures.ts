import { db } from "@/db";
import { resourceViews, resources, userXp } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const XP_EVENTS = {
  VIEW_RESOURCE: 5,
  COMPLETE_RESOURCE: 10,
  SUBMIT_RESOURCE: 25,
  FIRST_SUBMIT: 50,
  DAILY_STREAK: 15,
  EXPERT_ANSWER: 30,
} as const;

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, name: "Learner" },
  { level: 2, minXp: 100, name: "Explorer" },
  { level: 3, minXp: 300, name: "Builder" },
  { level: 4, minXp: 600, name: "Expert" },
  { level: 5, minXp: 1000, name: "PAIoneer" },
] as const;

function calculateLevel(totalXp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i].minXp) return LEVEL_THRESHOLDS[i].level;
  }
  return 1;
}

function getLevelName(level: number): string {
  return LEVEL_THRESHOLDS.find((t) => t.level === level)?.name || "Learner";
}

export const xpRouter = createTRPCRouter({
  getMyXP: protectedProcedure.query(async ({ ctx }) => {
    const [xp] = await db
      .select()
      .from(userXp)
      .where(eq(userXp.userId, ctx.user.id))
      .limit(1);

    if (!xp) {
      const [created] = await db
        .insert(userXp)
        .values({ userId: ctx.user.id })
        .returning();
      return { ...created, levelName: "Learner" };
    }

    return { ...xp, levelName: getLevelName(xp.level) };
  }),

  recordView: protectedProcedure
    .input(z.object({ resourceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check if already viewed
      const [existingView] = await db
        .select()
        .from(resourceViews)
        .where(
          and(
            eq(resourceViews.userId, ctx.user.id),
            eq(resourceViews.resourceId, input.resourceId)
          )
        )
        .limit(1);

      if (existingView) {
        // Update viewedAt so Continue Watching reorders to most recently watched
        await db
          .update(resourceViews)
          .set({ viewedAt: new Date() })
          .where(eq(resourceViews.id, existingView.id));
        return { xpAwarded: 0, alreadyViewed: true };
      }

      // Record the view
      await db.insert(resourceViews).values({
        userId: ctx.user.id,
        resourceId: input.resourceId,
      });

      // Increment resource view count
      await db
        .update(resources)
        .set({ viewCount: sql`${resources.viewCount} + 1` })
        .where(eq(resources.id, input.resourceId));

      // Award XP
      const xpAmount = XP_EVENTS.VIEW_RESOURCE;
      const [existing] = await db
        .select()
        .from(userXp)
        .where(eq(userXp.userId, ctx.user.id))
        .limit(1);

      if (existing) {
        const newTotal = existing.totalXp + xpAmount;
        const newLevel = calculateLevel(newTotal);
        const today = new Date().toISOString().split("T")[0];
        const lastActive = existing.lastActiveDate;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const newStreak = lastActive === yesterday ? existing.streak + 1 : lastActive === today ? existing.streak : 1;

        await db
          .update(userXp)
          .set({
            totalXp: newTotal,
            level: newLevel,
            streak: newStreak,
            lastActiveDate: today,
            updatedAt: new Date(),
          })
          .where(eq(userXp.userId, ctx.user.id));

        return { xpAwarded: xpAmount, alreadyViewed: false, totalXp: newTotal, level: newLevel };
      }

      // First time — create XP record
      const [created] = await db
        .insert(userXp)
        .values({
          userId: ctx.user.id,
          totalXp: xpAmount,
          streak: 1,
          lastActiveDate: new Date().toISOString().split("T")[0],
          level: 1,
        })
        .returning();

      return { xpAwarded: xpAmount, alreadyViewed: false, totalXp: created.totalXp, level: 1 };
    }),
});
