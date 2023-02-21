import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../../server/db/client";

export const adminRouter = router({
  getAllQuestions: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findFirst({ where: { email: ctx.session.user.email }});
    if (!user?.isTeacher) return null;

    const questions = await prisma.question.findMany();

    return {
      questions: questions!,
    };
  }),
});
