import { router, publicProcedure, protectedProcedure, teacherProcedure } from "../trpc";
import { prisma } from "../../../server/db/client";
import { z } from "zod";
import { TestStatus } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { Workbook } from "exceljs";

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

  getQuestionLevels: teacherProcedure.query(async ({ ctx }) => {
    const questions = await ctx.prisma.question.findMany();
    return [
      questions.filter(x => x.languageLevel == 0).length,
      questions.filter(x => x.languageLevel == 1).length,
      questions.filter(x => x.languageLevel == 2).length,
      questions.filter(x => x.languageLevel == 3).length,
      questions.filter(x => x.languageLevel == 4).length,
      questions.filter(x => x.languageLevel == 5).length,
    ];
  }),

  deleteQuestion: teacherProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await prisma.question.delete({
      where: {
        id: input.id,
      }
    });
  }),

  getAllTests: teacherProcedure.query(async ({ ctx }) => {
    let tests = await prisma.test.findMany();

    if (tests.length == 0) {
      const t = [1, 2, 3, 4, 5, 6, 7, 8].map(c => ({
        class: c,
        timeLimit: 20,
        status: TestStatus.IDLE,
        grammarA1Amount: 0,
        grammarA2Amount: 0,
        grammarB1Amount: 0,
        grammarB2Amount: 0,
        grammarC1Amount: 0,
        grammarC2Amount: 0,
      }));

      await prisma.test.createMany({
        data: t,
      });

      tests = await prisma.test.findMany();
    }

    return {
      tests: tests!,
    };
  }),

  saveTest: teacherProcedure.input(z.object({
    id: z.number(),
    timeLimit: z.number().min(1),
    grammarA1Amount: z.number().min(0),
    grammarA2Amount: z.number().min(0),
    grammarB1Amount: z.number().min(0),
    grammarB2Amount: z.number().min(0),
    grammarC1Amount: z.number().min(0),
    grammarC2Amount: z.number().min(0),
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

  // TODO: this doesn't really deal with the time. Maybe reset it when PENDING -> ACTIVE??
  toggleTest: teacherProcedure.input(z.object({testId: z.number()})).mutation(async ({ ctx, input }) => {
    const test = await prisma.test.findFirst({ where: { id: input.testId }});
    if (!test) return;

    if (test.status == TestStatus.ACTIVE) {
      await prisma.test.update({
        where: {
          id: input.testId
        },
        data: {
          status: TestStatus.PENDING,
        }
      });
    } 
    else {
      await prisma.test.update({
        where: {
          id: input.testId
        },
        data: {
          status: TestStatus.ACTIVE,
        }
      });
    }
    
  }),

  restartTest: teacherProcedure.input(z.object({testId: z.number()})).mutation(async ({ ctx, input }) => {
    const test = await prisma.test.findFirst({ where: { id: input.testId }});
    if (!test) return;
    
    if (test.status != TestStatus.PENDING) return;

    await prisma.testSession.deleteMany({
      where: {
        testId: input.testId,
      }
    });

    await prisma.test.update({
      where: {
        id: input.testId
      },
      data: {
        status: TestStatus.IDLE,
      }
    })
  }),

  areTestsRunning: teacherProcedure.query(async () => {
    return (await prisma.test.findMany({
      where: {
        OR: [
          { status: TestStatus.ACTIVE },
          { status: TestStatus.PENDING },
        ],
      },
    })).length != 0;
  }),

  downloadResults: teacherProcedure.input(z.object({testId: z.number()})).mutation(async ({ ctx, input }) => {
    const test = await prisma.test.findFirst({ where: { id: input.testId }});
    if (!test) return;
    
    if (test.status != TestStatus.PENDING) return;

    const results = await prisma.testSession.findMany({
      where: {
        testId: input.testId,
      }, 
      orderBy: {
        successRate: "desc",
      }
    });

    if (!results) return;

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: results.map(x => x.userId),
        }, 
      },
    })

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Výsledky testu')

    worksheet.columns = [
      { header: "Jméno", key: "name", width: 30 },
      { header: "Úspěšnost", key: "success", width: 10 },
      { header: "E-mail", key: "email", width: 40 },
      { header: "ID špatných odpovědí", key: "wrongIds", width: 200 },
    ];

    const usrs = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as { [key: string]: typeof users[0] });

    results.forEach(s => {
      worksheet.addRow({
        name: usrs[s.userId]?.name ?? "Bezejmenný",
        success: (s.successRate * 100).toFixed(1) + "%",
        email: usrs[s.userId]?.email ?? "???",
        wrongIds: s.wrongAnswers.join(" "),
      });
    });

    const bf = await workbook.xlsx.writeBuffer();
    const st = Buffer.from(bf).toString("base64");

    return st;
  }),
});
