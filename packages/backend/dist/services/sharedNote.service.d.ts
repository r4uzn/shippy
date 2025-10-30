import { SharedNote } from '@prisma/client';
/**
 * 프로젝트의 공유 노트를 조회하거나, 없으면 빈 노트를 생성합니다.
 */
export declare const getOrCreateNote: (projectId: number) => Promise<SharedNote>;
/**
 * 프로젝트의 공유 노트 내용을 업데이트합니다.
 */
export declare const updateNoteContent: (projectId: number, content: string) => Promise<SharedNote>;
//# sourceMappingURL=sharedNote.service.d.ts.map