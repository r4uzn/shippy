// packages/backend/src/services/chat.service.ts

import prisma from '../config/prisma.js';
import { ChatMessage, User } from '@prisma/client';

export const createMessage = async (data: {
    content: string;
    authorId: number;
    projectId: number;
}): Promise<ChatMessage> => {
    return prisma.chatMessage.create({
        data,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};

export const getMessagesByProjectId = async (
    projectId: number,
): Promise<(ChatMessage & { author: Pick<User, "id" | "name" | "email"> })[]> => {
    return prisma.chatMessage.findMany({
        where: { projectId },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
};