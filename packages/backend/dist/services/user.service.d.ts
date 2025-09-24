import { User, Application, Project } from '@prisma/client';
/**
 * ID로 사용자를 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
export declare const getUserById: (userId: number) => Promise<Omit<User, "password"> | null>;
/**
 * 사용자가 지원한 프로젝트 목록을 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<(Application & { project: Project })[]>}
 */
export declare const getAppliedProjectsByUserId: (userId: number) => Promise<(Application & {
    project: Project & {
        owner: Omit<User, "password">;
    };
})[]>;
//# sourceMappingURL=user.service.d.ts.map