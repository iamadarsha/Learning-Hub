import { db } from "@/db";
import { resources } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { z } from "zod";

export const studioRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    const { id } = input;
    const { id: userId } = ctx.user;

    const [resource] = await db
      .select()
      .from(resources)
      .where(and(eq(resources.id, id), eq(resources.userId, userId)))
      .limit(1);
    if (!resource) throw new TRPCError({ code: "NOT_FOUND" });

    return resource;
  }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;
      const data = await db
        .select()
        .from(resources)
        .where(
          and(
            eq(resources.userId, userId),
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
      const nextCursor = hasMore ? { id: lastItem.id, updatedAt: lastItem.updatedAt } : null;

      return { items, nextCursor };
    }),
});
