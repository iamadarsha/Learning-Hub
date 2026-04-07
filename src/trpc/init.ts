import { db } from "@/db";
import { users } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";

import { ratelimit } from "@/lib/ratelimit";

export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  return {
    clerkUserId: userId,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not authorized" });
  }

  // Look up user in DB
  let [user] = await db.select().from(users).where(eq(users.clerkId, ctx.clerkUserId)).limit(1);

  // Auto-create user if they don't exist yet (first request after Clerk sign-up)
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Could not fetch user profile" });
    }

    const [created] = await db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
        imageUrl: clerkUser.imageUrl,
      })
      .onConflictDoNothing()
      .returning();

    if (created) {
      user = created;
    } else {
      // Race condition: another request created the user — fetch it
      [user] = await db.select().from(users).where(eq(users.clerkId, ctx.clerkUserId)).limit(1);
    }

    if (!user) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create user" });
    }
  }

  // Rate limiting
  const { success } = await ratelimit.limit(user.id);
  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
