import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { recipeRouter } from "./routers/recipe";
import { categoryRouter } from "./routers/category";
import { tagRouter } from "./routers/tag";

export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  category: categoryRouter,
  tag: tagRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);