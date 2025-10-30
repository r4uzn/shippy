// packages/backend/src/services/sharedNote.service.ts (새로 추가)
import prisma from '../config/prisma.js';
/**
 * 프로젝트의 공유 노트를 조회하거나, 없으면 빈 노트를 생성합니다.
 */
export const getOrCreateNote = async (projectId) => {
    let note = await prisma.sharedNote.findUnique({
        where: { projectId },
    });
    if (!note) {
        note = await prisma.sharedNote.create({
            data: {
                projectId,
                content: '# 공유 프로젝트 노트',
            },
        });
    }
    return note;
};
/**
 * 프로젝트의 공유 노트 내용을 업데이트합니다.
 */
export const updateNoteContent = async (projectId, content) => {
    return prisma.sharedNote.update({
        where: { projectId },
        data: { content },
    });
};
//# sourceMappingURL=sharedNote.service.js.map