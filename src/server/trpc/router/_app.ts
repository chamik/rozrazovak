// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
