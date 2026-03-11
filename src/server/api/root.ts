import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { recipeRouter } from "./routers/recipe";
import { categoryRouter } from "./routers/category";
import { tagRouter } from "./routers/tag";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  category: categoryRouter,
  tag: tagRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);