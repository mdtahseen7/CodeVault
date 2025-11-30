'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Difficulty } from '@prisma/client'

export async function getPracticals(query?: string, subjectId?: string, tag?: string) {
    try {
        const where: any = {}

        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ]
        }

        if (subjectId) {
            where.subjectId = subjectId
        }

        if (tag) {
            where.tags = { has: tag }
        }

        const practicals = await prisma.practical.findMany({
            where,
            include: {
                subject: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return { success: true, data: practicals }
    } catch (error) {
        console.error('Error fetching practicals:', error)
        return { success: false, error: 'Failed to fetch practicals' }
    }
}

export async function getPracticalById(id: string) {
    try {
        const practical = await prisma.practical.findUnique({
            where: { id },
            include: {
                subject: true,
            },
        })

        if (!practical) {
            return { success: false, error: 'Practical not found' }
        }

        return { success: true, data: practical }
    } catch (error) {
        console.error('Error fetching practical:', error)
        return { success: false, error: 'Failed to fetch practical' }
    }
}

export async function createPractical(data: {
    title: string
    description?: string
    code_content: string
    output_content?: string
    language: string
    tags: string[]
    difficulty: Difficulty
    subjectId: string
    userId: string
}) {
    try {
        const practical = await prisma.practical.create({
            data: {
                title: data.title,
                description: data.description,
                code_content: data.code_content,
                output_content: data.output_content,
                language: data.language,
                tags: data.tags,
                difficulty: data.difficulty,
                subject: { connect: { id: data.subjectId } },
                user: {
                    connectOrCreate: {
                        where: { email: 'user@example.com' },
                        create: { email: 'user@example.com', name: 'Demo User' }
                    }
                },
            },
        })

        revalidatePath('/')
        return { success: true, data: practical }
    } catch (error) {
        console.error('Error creating practical:', error)
        return { success: false, error: 'Failed to create practical' }
    }
}

export async function updatePractical(id: string, data: {
    title?: string
    description?: string
    code_content?: string
    output_content?: string
    language?: string
    tags?: string[]
    difficulty?: Difficulty
}) {
    try {
        const practical = await prisma.practical.update({
            where: { id },
            data,
        })

        revalidatePath(`/practicals/${id}`)
        revalidatePath('/')
        return { success: true, data: practical }
    } catch (error) {
        console.error('Error updating practical:', error)
        return { success: false, error: 'Failed to update practical' }
    }
}

export async function deletePractical(id: string) {
    try {
        await prisma.practical.delete({
            where: { id },
        })

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting practical:', error)
        return { success: false, error: 'Failed to delete practical' }
    }
}

export async function deletePracticals(ids: string[]) {
    try {
        await prisma.practical.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting practicals:', error)
        return { success: false, error: 'Failed to delete practicals' }
    }
}

export async function getSubjects() {
    try {
        const subjects = await prisma.subject.findMany()
        return { success: true, data: subjects }
    } catch (error) {
        console.error('Error fetching subjects:', error)
        return { success: false, error: 'Failed to fetch subjects' }
    }
}
