import { router, teacherProcedure } from "../trpc";
import { prisma } from "../../../server/db/client";
import { z } from "zod";
import { TestStatus } from "@prisma/client";
import { Workbook } from "exceljs";
import { TRPC_ERROR_CODES_BY_KEY, TRPC_ERROR_CODES_BY_NUMBER } from "@trpc/server/rpc";

type BackupData = {
  questions: {
    questionText: string,
    rightAnswer: string,
    wrongAnswers: string[],
    languageLevel: number,
  }[],
  tests: {
    grammarA1Amount: number,
    grammarA2Amount: number,
    grammarB1Amount: number,
    grammarB2Amount: number,
    grammarC1Amount: number,
    grammarC2Amount: number,
    timeLimit: number,
    class: number,
  }[],
}

const questionAmounts = async () => {
  const questions = await prisma.question.findMany();

  return [
    questions.filter(x => x.languageLevel == 0).length,
    questions.filter(x => x.languageLevel == 1).length,
    questions.filter(x => x.languageLevel == 2).length,
    questions.filter(x => x.languageLevel == 3).length,
    questions.filter(x => x.languageLevel == 4).length,
    questions.filter(x => x.languageLevel == 5).length,
  ];
}

const areTestsRunning = async () => {
  return (await prisma.test.count({
    where: {
      OR: [
        { status: TestStatus.ACTIVE },
        { status: TestStatus.PENDING },
      ],
    },
  })) != 0;
}

export const adminRouter = router({
  getAllQuestions: teacherProcedure.query(async () => {

    const questions = await prisma.question.findMany();

    return {
      questions: questions!,
    };
  }),

  /** This is not a mutation really, just an ugly way to trick trpc */
  getQuestionById: teacherProcedure.input(z.object({ questionId: z.number() })).mutation(async ({ input }) => {
    const question = await prisma.question.findFirst({
      where: {
        id: input.questionId
      }
    });

    return question;
  }),

  /** This is not a mutation really, just an ugly way to trick trpc */
  getTestById: teacherProcedure.input(z.object({ testId: z.number() })).mutation(async ({ input }) => {
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
  })).mutation(async ({ input }) => {
    if (await areTestsRunning()) {
      return;
    }
    
    await prisma.question.update({
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
    if (await areTestsRunning()) {
      return;
    }

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

  getQuestionAmounts: teacherProcedure.query(async () => {
    return await questionAmounts();
  }),

  deleteQuestion: teacherProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    if (await areTestsRunning()) {
      return;
    }

    await prisma.question.delete({
      where: {
        id: input.id,
      }
    });
  }),

  getAllTests: teacherProcedure.query(async () => {
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
  })).mutation(async ({ input }) => {
    if (await areTestsRunning()) {
      return;
    }

    await prisma.test.update({
      where: {
        id: input.id
      },
      data: {
        ...input,
      }
    })
  }),

  deleteTest: teacherProcedure.input(z.object({testId: z.number()})).mutation(async ({ input }) => {
    await prisma.test.delete({
      where: {
        id: input.testId
      }
    })
  }),

  // TODO: this doesn't really deal with the time. Maybe reset it when PENDING -> ACTIVE??
  toggleTest: teacherProcedure.input(z.object({testId: z.number()})).mutation(async ({ input }) => {
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
      const avail = await questionAmounts();

      let isValid = true;
      isValid &&= test.grammarA1Amount <= avail[0]!;
      isValid &&= test.grammarA2Amount <= avail[1]!;
      isValid &&= test.grammarB1Amount <= avail[2]!;
      isValid &&= test.grammarB2Amount <= avail[3]!;
      isValid &&= test.grammarC1Amount <= avail[4]!;
      isValid &&= test.grammarC2Amount <= avail[5]!;

      if (!isValid)
        return TRPC_ERROR_CODES_BY_KEY.BAD_REQUEST;

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

  restartTest: teacherProcedure.input(z.object({testId: z.number()})).mutation(async ({ input }) => {
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
    return await areTestsRunning();
  }),

  downloadResults: teacherProcedure.input(z.object({testId: z.number()})).mutation(async ({ input }) => {
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
      { header: "Jméno", key: "name", width: 25 },
      { header: "E-mail", key: "email", width: 30 },
      { header: "Body gr.", key: "points_gr", width: 10},
      { header: "Úspěšnost gr.", key: "success_gr", width: 15 },
      { header: "ID špatných odpovědí gr.", key: "wrong_ids_gr", width: 40 },
    ];

    const usrs = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as { [key: string]: typeof users[0] });

    results.forEach(s => {
      worksheet.addRow({
        name: usrs[s.userId]?.name ?? "Bezejmenný",
        email: usrs[s.userId]?.email ?? "???",
        points_gr: s.correctAnswers.length,
        success_gr: (s.successRate * 100).toFixed(1) + "%",
        wrong_ids_gr: s.wrongAnswers.join(" "),
      });
    });

    const bf = await workbook.xlsx.writeBuffer();
    const st = Buffer.from(bf).toString("base64");

    return st;
  }),

  getDashboardData: teacherProcedure.query(async () => {
    const runningTests = (await prisma.test.findMany()).filter(x => x.status == "ACTIVE").length;
    const availableQuestions = await prisma.question.count();

    return {
      runningTests,
      availableQuestions,
    }
  }),

  getCurrentlyTested: teacherProcedure.query(async () => {
    const beingTestedIds = (await prisma.testSession.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        userId: true,
      }
    }));

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: beingTestedIds.map(x => x.userId),
        }, 
      },
      orderBy: [
        { classYear: "desc" },
        { name: "asc" },
      ],
      select: {
        name: true,
        email: true,
        classYear: true,
      }
    });

    return users;
  }),

  downloadBackup: teacherProcedure.mutation(async () => {
    const questions = await prisma.question.findMany({
      select: {
        questionText: true,
        rightAnswer: true,
        wrongAnswers: true,
        languageLevel: true,
      }
    });

    const tests = await prisma.test.findMany({
      select: {
        grammarA1Amount: true,
        grammarA2Amount: true,
        grammarB1Amount: true,
        grammarB2Amount: true,
        grammarC1Amount: true,
        grammarC2Amount: true,
        timeLimit: true,
        class: true,
      }
    })

    const backup: BackupData = {
      questions,
      tests,
    };

    const st = Buffer.from(JSON.stringify(backup)).toString("base64");
    return st;
  }),

  uploadBackup: teacherProcedure.input(z.object({base64Backup: z.string()})).mutation(async ({input}) => {
    if (await areTestsRunning()) {
      return;
    }

    const backupText = Buffer.from(input.base64Backup, "base64").toString();
    const backupObj = JSON.parse(backupText) as BackupData;

    // TODO: validate uploaded data?

    await prisma.question.deleteMany({});
    for (const q of backupObj.questions) {
      await prisma.question.create({
        data: {
          questionText: q.questionText,
          rightAnswer: q.rightAnswer,
          wrongAnswers: q.wrongAnswers,
          languageLevel: q.languageLevel,
        }
      });
    }

    await prisma.test.deleteMany({});
    for (const t of backupObj.tests) {
      await prisma.test.create({
        data: {
          class: t.class,
          grammarA1Amount: t.grammarA1Amount,
          grammarA2Amount: t.grammarA2Amount,
          grammarB1Amount: t.grammarB1Amount,
          grammarB2Amount: t.grammarB2Amount,
          grammarC1Amount: t.grammarC1Amount,
          grammarC2Amount: t.grammarC2Amount,
        }
      });
    }
  }),
});
