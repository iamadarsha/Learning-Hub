import { db } from "@/db";
import { categories, resources, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { z } from "zod";

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
            eq(resources.visibility, "public")
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
            or(ilike(resources.title, `%${query}%`), ilike(resources.description, `%${query}%`))
          )
        )
        .orderBy(desc(resources.viewCount))
        .limit(limit);

      return data;
    }),
});
