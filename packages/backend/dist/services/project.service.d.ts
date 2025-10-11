import type { Project, Prisma, Application } from '@prisma/client';
/**
 * 새로운 프로젝트를 생성합니다.
 */
export declare const createProject: (data: Prisma.ProjectCreateInput) => Promise<Project>;
/**
 * 모든 프로젝트 목록을 조회합니다.
 */
export declare const getProjects: (filters: {
    techStack?: string[];
    positions?: string[];
    progressMethod?: string;
}) => Promise<Project[]>;
/**
 * 인기 프로젝트(최신 3개) 목록을 조회합니다.
 */
export declare const getPopularProjects: () => Promise<Project[]>;
/**
 * ID로 특정 프로젝트를 조회합니다.
 * @param {number} id - 프로젝트 ID
 * @param {number} [userId] - 현재 로그인한 사용자 ID (선택 사항)
 */
export declare const getProjectById: (id: number, userId?: number) => Promise<(Project & {
    hasApplied?: boolean;
}) | null>;
/**
 * 프로젝트에 지원합니다.
 * @param {object} data - projectId와 userId를 포함하는 객체
 * @returns {Promise<Application>}
 */
export declare const applyToProject: ({ projectId, userId }: {
    projectId: number;
    userId: number;
}) => Promise<Application>;
/**
 * 프로젝트 지원자 목록을 조회합니다. (프로젝트 소유자만 가능)
 * @param {number} projectId - 프로젝트 ID
 * @param {number} currentUserId - 현재 로그인한 사용자 ID
 */
export declare const getProjectApplicants: (projectId: number, currentUserId: number) => Promise<({
    user: {
        name: string | null;
        id: number;
        email: string;
        personality: string | null;
        status: string | null;
    };
} & {
    id: number;
    projectId: number;
    userId: number;
    createdAt: Date;
})[]>;
/**
 * 코사인 유사도 기반 매칭 알고리즘 (Placeholder)
 */
export declare const getRecommendedUsersForProject: (projectId: number) => Promise<any[]>;
//# sourceMappingURL=project.service.d.ts.map