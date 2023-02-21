import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../../server/db/client";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findFirst({ where: { email: ctx.session.user.email }});
    const activeTest = await prisma.test.findFirst({where: {
      AND: [
        { started: true },
        { class: user?.classYear },
      ],
    }});
    
    return {
      user: user!,
      activeTest,
    };
  }),
});
