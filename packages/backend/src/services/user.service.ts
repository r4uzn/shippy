import { User, Application, Project } from '@prisma/client';
import prisma from '../config/prisma.js';

/**
 * ID로 사용자를 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
export const getUserById = async (userId: number): Promise<Omit<User, 'password'> | null> => {
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
export const getAppliedProjectsByUserId = async (userId: number): Promise<(Application & { project: Project & { owner: Omit<User, 'password'> } })[]> => {
  return prisma.application.findMany({
    where: { userId },
    include: {
      project: { // 지원한 프로젝트 정보 포함
        include: {
          owner: { // 프로젝트 소유자 정보 포함
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
