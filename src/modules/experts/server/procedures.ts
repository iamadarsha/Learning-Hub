import { db } from "@/db";
import { expertProfiles, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

export const expertsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        team: z.string().optional(),
        query: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      const { team, query, limit } = input;

      const data = await db
        .select({
          profile: expertProfiles,
          user: users,
        })
        .from(expertProfiles)
        .leftJoin(users, eq(expertProfiles.userId, users.id))
        .where(
          and(
            team ? eq(expertProfiles.team, team) : undefined,
            query ? ilike(expertProfiles.displayName, `%${query}%`) : undefined
          )
        )
        .orderBy(desc(expertProfiles.resourceCount))
        .limit(limit);

      return data;
    }),

  getOne: baseProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input }) => {
      const [result] = await db
        .select({
          profile: expertProfiles,
          user: users,
        })
        .from(expertProfiles)
        .leftJoin(users, eq(expertProfiles.userId, users.id))
        .where(eq(expertProfiles.userId, input.userId))
        .limit(1);

      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(100).optional(),
        role: z.string().max(100).optional(),
        team: z.string().max(100).optional(),
        skills: z.array(z.string()).max(20).optional(),
        bio: z.string().max(2000).optional(),
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
