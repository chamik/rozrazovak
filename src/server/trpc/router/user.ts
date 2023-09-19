import { protectedProcedure, router } from "../trpc";
import { prisma } from "../../../server/db/client";
import { Question } from "@prisma/client";

const shuffleAndTake = (ids: number[], n: number): number[] => {
  const shuffled = ids.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export const userRouter = router({
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findFirst({ where: { email: ctx.session.user.email } });
    const test = await prisma.test.findFirst({
      where: {
        AND: [
          { started: true },
          { class: user?.classYear },
        ],
      }
    });

    const testSession = await prisma.testSession.findFirst({
      where: {
        user: {
          id: user?.id,
        }
      }
    });

    return {
      user: user!,
      test,
      testSession,
    };
  }),

  beginTest: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await prisma.user.findFirst({ where: { email: ctx.session.user.email } });
    const test = await prisma.test.findFirst({
      where: {
        AND: [
          { started: true },
          { class: user?.classYear },
        ],
      }
    });

    const testSession = await prisma.testSession.findFirst({
      where: {
        user: {
          id: user?.id,
        }
      }
    });

    if (testSession || !test || !user) return;

    const A1questions = shuffleAndTake((await prisma.question.findMany({ where: { languageLevel: 0 }, select: { id: true } })).map(x => x.id), test?.grammarA1Amount);
    const A2questions = shuffleAndTake((await prisma.question.findMany({ where: { languageLevel: 1 }, select: { id: true } })).map(x => x.id), test?.grammarA2Amount);
    const B1questions = shuffleAndTake((await prisma.question.findMany({ where: { languageLevel: 2 }, select: { id: true } })).map(x => x.id), test?.grammarB1Amount);
    const B2questions = shuffleAndTake((await prisma.question.findMany({ where: { languageLevel: 3 }, select: { id: true } })).map(x => x.id), test?.grammarB2Amount);
    const C1questions = shuffleAndTake((await prisma.question.findMany({ where: { languageLevel: 4 }, select: { id: true } })).map(x => x.id), test?.grammarC1Amount);
    const C2questions = shuffleAndTake((await prisma.question.findMany({ where: { languageLevel: 5 }, select: { id: true } })).map(x => x.id), test?.grammarC2Amount);

    const questions = A1questions.concat(A2questions, B1questions, B2questions, C1questions, C2questions)

    const session = await prisma.testSession.create({
      data: {
        startTime: new Date(),
        grammarQuestionsIds: questions,
        userId: user.id,
        testId: test.id,
      }
    })
  })
});