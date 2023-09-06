import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.test.deleteMany();
    
    for (let i = 1; i <= 8; i++) {
        await prisma.test.create({
            data: {
                class: i,
                timeLimit: 20,
                started: false,
                grammarA1Amount: 0,
                grammarA2Amount: 0,
                grammarB1Amount: 0,
                grammarB2Amount: 0,
                grammarC1Amount: 0,
                grammarC2Amount: 0,
            }
        })
    }
    // await prisma.question.deleteMany();
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