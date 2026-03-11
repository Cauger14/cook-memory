import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  // On ajoutera le router recipe à l'étape 5
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);