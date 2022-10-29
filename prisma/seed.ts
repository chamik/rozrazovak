import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // await prisma.question.deleteMany();
    const septima = await prisma.classroom.upsert({
        where: { level: 7 },
        update: {},
        create: {
            level: 7,
            enabled: false,
            questionAmount: 30,
            questions: {
                create: {
                    question: 'Why the fuck does Typescript _.',
                    rightAnswers: ['exist'],
                    wrongAnswers: ['cool', 'feel so nice', 'does work'],
                },
            }
        }
    });
    const prima = await prisma.classroom.upsert({
        where: { level: 1 },
        update: {},
        create: {
            level: 1,
            enabled: false,
            questionAmount: 25,
            questions: {
                create: {
                    question: 'Pomoc.',
                    rightAnswers: ['nevim co dělám'],
                    wrongAnswers: ['a', 'b', 'c'],
                },
            }
        }
    })



    console.log({ septima, prima })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })