import { db } from "@/db";
import { expertProfiles, userXp, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getLevelFromXP } from "@/lib/xp";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    const [profile] = await db
      .select()
      .from(expertProfiles)
      .where(eq(expertProfiles.userId, ctx.user.id))
      .limit(1);

    return { user: user ?? null, profile: profile ?? null };
  }),

  getMyXP: protectedProcedure.query(async ({ ctx }) => {
    const [xp] = await db
      .select()
      .from(userXp)
      .where(eq(userXp.userId, ctx.user.id))
      .limit(1);

    if (!xp) {
      return { totalXp: 0, level: 1, streak: 0, levelInfo: getLevelFromXP(0) };
    }

    return {
      ...xp,
      levelInfo: getLevelFromXP(xp.totalXp),
    };
  }),

  upsertProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(100).optional(),
        role: z.string().max(100).optional(),
        team: z.string().max(100).optional(),
        skills: z.array(z.string()).max(20).optional(),
        bio: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(expertProfiles)
        .where(eq(expertProfiles.userId, ctx.user.id))
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(expertProfiles)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(expertProfiles.userId, ctx.user.id))
          .returning();
        return updated;
      }

      const [created] = await db
        .insert(expertProfiles)
        .values({
          userId: ctx.user.id,
          displayName: input.displayName || ctx.user.name,
          ...input,
        })
        .returning();
      return created;
    }),
});
