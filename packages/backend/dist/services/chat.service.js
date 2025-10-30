// packages/backend/src/services/chat.service.ts
import prisma from '../config/prisma.js';
export const createMessage = async (data) => {
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
export const getMessagesByProjectId = async (projectId) => {
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
//# sourceMappingURL=chat.service.js.map