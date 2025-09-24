import prisma from '../config/prisma.js';
/**
 * ID로 사용자를 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
export const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return null;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
/**
 * 사용자가 지원한 프로젝트 목록을 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<(Application & { project: Project })[]>}
 */
export const getAppliedProjectsByUserId = async (userId) => {
    return prisma.application.findMany({
        where: { userId },
        include: {
            project: {
                include: {
                    owner: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc' // 최신 지원 순으로 정렬
        }
    });
};
//# sourceMappingURL=user.service.js.map