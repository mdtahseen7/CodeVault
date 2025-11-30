import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create default user
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Demo User',
        },
    })

    // Create subjects
    const subjects = [
        { name: 'Python', color: '#3b82f6', icon: 'python' },     // Blue
        { name: 'R', color: '#10b981', icon: 'bar-chart' },       // Green
        { name: 'Node.js', color: '#22c55e', icon: 'server' },    // Bright Green
        { name: 'C++', color: '#8b5cf6', icon: 'code' },          // Purple
    ]

    for (const subject of subjects) {
        await prisma.subject.upsert({
            where: { name: subject.name },
            update: {},
            create: {
                name: subject.name,
                color: subject.color,
                icon: subject.icon,
            },
        })
    }

    console.log('Seed data created.')
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
