import { categoriesRouter } from "@/modules/categories/server/procedores";
import { expertsRouter } from "@/modules/experts/server/procedures";

import { progressRouter } from "@/modules/progress/server/procedures";
import { resourcesRouter } from "@/modules/resources/server/procedures";
import { searchRouter } from "@/modules/search/server/procedures";
import { studioRouter } from "@/modules/studio/server/procedures";
import { usersRouter } from "@/modules/users/server/procedures";
import { xpRouter } from "@/modules/xp/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  resources: resourcesRouter,
  studio: studioRouter,
  experts: expertsRouter,
  xp: xpRouter,

  progress: progressRouter,
  search: searchRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
