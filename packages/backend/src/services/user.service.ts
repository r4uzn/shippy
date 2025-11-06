// packages/backend/src/services/user.service.ts

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
              personality: true,
              status: true,
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

/**
 * 사용자의 자기소개서 및 추출된 기술 스킬을 업데이트합니다.
 * @param {number} userId - 사용자 ID
 * @param {string} bio - 자기소개서 내용
 * @param {string[]} skills - LLM이 추출한 기술 스킬 목록
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
export const updateUserBioAndSkills = async (userId: number, bio: string, skills: string[]): Promise<Omit<User, 'password'> | null> => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      bio,
      technicalSkills: skills,
    },
  });

  // 비밀번호 필드를 제거하고 반환
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

/**
 * 사용자의 성격 정보를 업데이트합니다.
 * @param {number} userId - 사용자 ID
 * @param {string} personality - 새로운 성격 정보
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
export const updateUserPersonality = async (userId: number, personality: string): Promise<Omit<User, 'password'> | null> => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { personality },
  });
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

/**
 * 사용자의 상태 정보를 업데이트합니다.
 * @param {number} userId - 사용자 ID
 * @param {string} status - 새로운 상태 정보
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
export const updateUserStatus = async (userId: number, status: string): Promise<Omit<User, 'password'> | null> => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};