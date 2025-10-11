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
/**
 * 사용자의 성격 정보를 업데이트합니다.
 * @param {number} userId - 사용자 ID
 * @param {string} personality - 새로운 성격 정보
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
export declare const updateUserPersonality: (userId: number, personality: string) => Promise<Omit<User, "password"> | null>;
/**
 * 사용자의 상태 정보를 업데이트합니다.
 * @param {number} userId - 사용자 ID
 * @param {string} status - 새로운 상태 정보
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
export declare const updateUserStatus: (userId: number, status: string) => Promise<Omit<User, "password"> | null>;
//# sourceMappingURL=user.service.d.ts.map