import { db } from "@/db";
import { userXp, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const leaderboardRouter = createTRPCRouter({
  getTop: baseProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const data = await db
        .select({
          xp: userXp,
          user: users,
        })
        .from(userXp)
        .leftJoin(users, eq(userXp.userId, users.id))
        .orderBy(desc(userXp.totalXp))
        .limit(input.limit);

      return data.map((row, index) => ({
        rank: index + 1,
        ...row,
      }));
    }),

  getMyRank: protectedProcedure.query(async ({ ctx }) => {
    const [myXp] = await db
      .select()
      .from(userXp)
      .where(eq(userXp.userId, ctx.user.id))
      .limit(1);

    if (!myXp) return { rank: null, xp: null };

    const [rankResult] = await db
      .select({
        rank: sql<number>`count(*) + 1`,
      })
      .from(userXp)
      .where(sql`${userXp.totalXp} > ${myXp.totalXp}`);

    return { rank: rankResult?.rank || 1, xp: myXp };
  }),
});
