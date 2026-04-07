import { db } from "@/db";
import { resources, categories } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

export const searchRouter = createTRPCRouter({
  query: baseProcedure
    .input(
      z.object({
        q: z.string().min(1).max(100),
        type: z.enum(["video", "tutorial", "doc", "tool", "template"]).optional(),
        categoryId: z.string().uuid().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const { q, type, categoryId, limit } = input;
      const pattern = `%${q}%`;

      const conditions = [
        eq(resources.isPublished, true),
        or(ilike(resources.title, pattern), ilike(resources.description, pattern))!,
      ];

      if (type) conditions.push(eq(resources.type, type));
      if (categoryId) conditions.push(eq(resources.categoryId, categoryId));

      const results = await db
        .select({
          resource: resources,
          category: categories,
        })
        .from(resources)
        .leftJoin(categories, eq(resources.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(desc(resources.viewCount))
        .limit(limit);

      return results;
    }),
});
