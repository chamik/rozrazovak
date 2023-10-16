import { protectedProcedure, router } from "../trpc";
import { prisma } from "../../../server/db/client";
import { Prisma, Question, TestStatus } from "@prisma/client";
import { z } from "zod";

const shuffleAndTake = (ids: number[], n: number): number[] => {
  const shuffled = ids.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const shuffle = <T>(a: T[]): T[] => {
  const shuffled = a.sort(() => 0.5 - Math.random());
  return shuffled;
}

const timeDifferenceSeconds = (start: Date, end: Date) => {
  const diff = end.getTime() - start.getTime();
  const seconds = Math.floor(diff / 1000);
  return seconds;
}

export const userRouter = router({
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findFirst({ where: { email: ctx.session.user.email } });
    const test = await prisma.test.findFirst({
      where: {
        AND: [
          {
            OR: [
              { status: TestStatus.ACTIVE },
              { status: TestStatus.PENDING },
            ]
          },
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
          { status: TestStatus.ACTIVE },
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

    const start = new Date();
    const end = new Date();
    end.setSeconds(start.getSeconds() + (test.timeLimit * 60));

    const session = await prisma.testSession.create({
      data: {
        startTime: start,
        endTime: end,
        grammarQuestionsIds: questions,
        userId: user.id,
        testId: test.id,
        successRate: 0,
      }
    });
  }),

  getTestData: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findFirst({ 
      where: { email: ctx.session.user.email },
    });

    if (!user)
      return;

    const sesh = await prisma.testSession.findFirst({
      where: { userId: user.id },
    })

    if (!sesh)
      return;

    const questionsIds = sesh.grammarQuestionsIds;
    const questions = await prisma.question.findMany({
        where: {
          id: { in: questionsIds }
        },
        select: {
          id: true,
          questionText: true,
          rightAnswer: true,
          wrongAnswers: true,
        },
      });

    const shuffled = shuffle(questions.map(x => ({
      id: x.id,
      questionText: x.questionText,
      answers: shuffle([x.rightAnswer, ...x.wrongAnswers]),
    })));

    const answers = await prisma.answer.findMany({
      where: {
        testSessionId: sesh.id,
      },
      select: {
        questionId: true,
        answer: true,
      },
    });

    return ({
      questions: shuffled,
      testSession: sesh,
      submittedAnswers: answers,
    });
  }),

  submitAnswer: protectedProcedure.input(z.object({
    questionId: z.number(),
    testSessionId: z.number(),
    answer: z.string(),
  })).mutation(async ({ ctx, input }) => {
    // rename GrammarAnswer to Answer??
    // add an entry to the GrammarAnswer table (change if already present)
    const user = await prisma.user.findFirst({ 
      where: { email: ctx.session.user.email },
    });

    if (!user)
      return;

    // TODO: check if answering in correct timeframe

    const oldAnswer = await prisma.answer.findFirst({
      where: {
        questionId: input.questionId,
        userId: user.id,
      },
      select: {
        id: true,
        answer: true
      },
    })

    if (!oldAnswer) {
      await prisma.answer.create({
        data: {
          questionId: input.questionId,
          userId: user.id,
          testSessionId: input.testSessionId,
          answer: input.answer,
          answerTime: new Date(),
        }
      })
    }
    else {
      if (oldAnswer.answer == input.answer) { return; }

      await prisma.answer.update({
        where: { id: oldAnswer.id },
        data: {
          answer: input.answer,
          answerTime: new Date(),
        }
      })
    }

    // on client a function that takes and ID and answer, passed to each child element on the test page
  }),

  // TODO: finish calculations
  submitTest: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await prisma.user.findFirst({ 
      where: { email: ctx.session.user.email },
    });

    if (!user)
      return;

    const sesh = await prisma.testSession.findFirst({
        where: {
          AND: [
            { userId: user.id },
            { status: TestStatus.ACTIVE }
          ],
        },
    });

    if (!sesh)
      return;

    const questions = await prisma.question.findMany({
      where: {
        id: { in: sesh.grammarQuestionsIds }
      },
      select: {
        id: true,
        rightAnswer: true,
      }
    });

    if (!questions)
      return;

    const answers = await prisma.answer.findMany({
      where: {
        AND: [
          {userId: user.id},
          {testSessionId: sesh.id},
        ]
      },
    });

    if (!answers)
      return;

    const correct: number[] = [];
    const wrong: number[] = [];
    // TODO: ew, quadratic
    answers.forEach(ans => {
      const c = questions.filter(x => x.id == ans.questionId)[0]!;
      if (ans.answer == c.rightAnswer) {
        correct.push(c.id);
      }
      else {
        wrong.push(c.id);
      }
    });

    await prisma.testSession.update({
      where: {
        id: sesh.id,
      },
      data: {
        correctAnswers: correct,
        wrongAnswers: wrong,
        status: TestStatus.PENDING,
        successRate: correct.length / questions.length,
      },
    });
  }),
});