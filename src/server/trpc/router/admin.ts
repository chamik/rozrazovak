import { router, publicProcedure, protectedProcedure, teacherProcedure } from "../trpc";
import { prisma } from "../../../server/db/client";
import { z } from "zod";

export const adminRouter = router({
  getAllQuestions: teacherProcedure.query(async ({ ctx }) => {

    const questions = await prisma.question.findMany();

    return {
      questions: questions!,
    };
  }),

  /** This is not a mutation really, just an ugly way to trick trpc */
  getQuestionById: teacherProcedure.input(z.object({ questionId: z.number() })).mutation(async ({ ctx, input }) => {
    const question = await prisma.question.findFirst({
      where: {
        id: input.questionId
      }
    });

    return question;
  }),

  /** This is not a mutation really, just an ugly way to trick trpc */
  getTestById: teacherProcedure.input(z.object({ testId: z.number() })).mutation(async ({ ctx, input }) => {
    const test = await prisma.test.findFirst({
      where: {
        id: input.testId
      }
    });

    return test;
  }),

  saveQuestion: teacherProcedure.input(z.object({
    questionId: z.number(),
    questionText: z.string().min(1),
    languageLevel: z.number().min(0).max(5),
    pointAmount: z.number().min(0).max(10),
    rightAnswer: z.string().min(1),
    wrongAnswers: z.array(z.string()),
  })).mutation(async ({ ctx, input }) => {
    const question = await prisma.question.update({
      where: {
        id: input.questionId
      },
      data: {
        questionText: input.questionText,
        languageLevel: input.languageLevel,
        pointAmount: input.pointAmount,
        rightAnswer: input.rightAnswer,
        wrongAnswers: input.wrongAnswers,
      },
    });
  }),

  newQuestion: teacherProcedure.input(z.object({
    questionText: z.string(),
    languageLevel: z.number().min(0).max(3),
    pointAmount: z.number().min(0).max(10),
    rightAnswer: z.string(),
    wrongAnswers: z.array(z.string()),
  })).mutation(async ({ ctx, input }) => {
    const question = await ctx.prisma.question.create({
      data: {
        questionText: input.questionText,
        languageLevel: input.languageLevel,
        pointAmount: input.pointAmount,
        rightAnswer: input.rightAnswer,
        wrongAnswers: input.wrongAnswers,
      }
    });

    return question;
  }),

  deleteQuestion: teacherProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await prisma.question.delete({
      where: {
        id: input.id,
      }
    });
  }),

  getAllTests: teacherProcedure.query(async ({ ctx }) => {
    const tests = await prisma.test.findMany();

    return {
      tests: tests!,
    };
  }),

  saveTest: teacherProcedure.input(z.object({
    id: z.number(),
    timeLimit: z.number().min(1),
    grammarA2Amount: z.number().min(0),
    grammarB1Amount: z.number().min(0),
    grammarB2Amount: z.number().min(0),
    grammarC1Amount: z.number().min(0),
  })).mutation(async ({ ctx, input }) => {
    await prisma.test.update({
      where: {
        id: input.id
      },
      data: {
        ...input,
      }
    })
  }),

  deleteTest: teacherProcedure.input(z.object({testId: z.number()})).mutation(async ({ ctx, input }) => {
    await prisma.test.delete({
      where: {
        id: input.testId
      }
    })
  }),

  startTest: teacherProcedure.input(z.object({testId: z.number()})).mutation(async ({ ctx, input }) => {
    await prisma.test.update({
      where: {
        id: input.testId
      },
      data: {
        started: true,
      }
    })
  }),
});
