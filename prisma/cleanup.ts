import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanup() {
    // Delete old subjects
    const oldSubjects = ['Java', 'Web Dev', 'Data Structures', 'Machine Learning']

    for (const subjectName of oldSubjects) {
        await prisma.subject.deleteMany({
            where: { name: subjectName }
        })
    }

    console.log('Old subjects removed.')
}

cleanup()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
