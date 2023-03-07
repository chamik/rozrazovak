import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../../server/db/client";
import { z } from "zod";

const isTeacher = async ( ctx: any ) => {
  const user = await prisma.user.findFirst({ where: { email: ctx.session.user.email }});
  return user?.isTeacher;
}

export const adminRouter = router({
  getAllQuestions: protectedProcedure.query(async ({ ctx }) => {
    if (!isTeacher(ctx)) return null;

    const questions = await prisma.question.findMany();

    return {
      questions: questions!,
    };
  }),

  saveQuestion: protectedProcedure.input(z.object({
    questionId: z.number(),
    questionText: z.string().min(1),
    languageLevel: z.number().min(0).max(3),
    pointAmount: z.number().min(0).max(10),
    rightAnswer: z.string().min(1),
    wrongAnswers: z.array(z.string()),
  })).mutation(async ({ ctx, input }) => {
    const user = await prisma.user.findFirst({ where: { email: ctx.session.user.email }});
    if (!user?.isTeacher) return null;

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

  newQuestion: protectedProcedure.input(z.object({
    questionText: z.string().min(1),
    languageLevel: z.number().min(0).max(3),
    pointAmount: z.number().min(0).max(10),
    rightAnswer: z.string().min(1),
    wrongAnswers: z.array(z.string()),
  })).mutation(async ({ ctx, input }) => {
    if (!isTeacher(ctx)) return null;

    const question = await prisma.question.create({
      data: {
        questionText: input.questionText,
        languageLevel: input.languageLevel,
        pointAmount: input.pointAmount,
        rightAnswer: input.rightAnswer,
        wrongAnswers: input.wrongAnswers,
      }
    });
  }),

  deleteQuestion: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    if (!isTeacher(ctx)) return null;

    await prisma.question.delete({
      where: {
        id: input.id,
      }
    });
  }),
});
