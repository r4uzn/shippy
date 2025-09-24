import type { User } from '@prisma/client';
/**
 * 이메일로 사용자 찾기
 * @param email - 사용자 이메일
 * @returns {Promise<User | null>}
 */
export declare const getUserByEmail: (email: string) => Promise<User | null>;
/**
 * 새로운 사용자 생성
 * @param userData - 사용자 데이터
 * @returns {Promise<User>}
 */
export declare const createUser: (userData: Pick<User, "email" | "password" | "name">) => Promise<User>;
/**
 * 이메일과 비밀번호로 사용자 검증
 * @param email
 * @param password
 * @returns {Promise<User>}
 */
export declare const validateUserPassword: (email: string, password: string) => Promise<User>;
//# sourceMappingURL=auth.service.d.ts.map