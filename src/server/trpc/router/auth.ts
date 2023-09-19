import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../../server/db/client";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});
