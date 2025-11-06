// packages/backend/src/services/project.service.ts

import type { Project, Prisma, Application } from '@prisma/client';
import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';
import { calculateMatchScore } from '../utils/matching.utils.js';
import type { User } from '@prisma/client'; // User 타입 임포트

/**
 * 새로운 프로젝트를 생성합니다.
 */
export const createProject = async (data: Prisma.ProjectCreateInput): Promise<Project> => {
  return prisma.project.create({ data });
};

/**
 * 모든 프로젝트 목록을 조회합니다.
 */
export const getProjects = async (filters: {
  techStack?: string[];
  positions?: string[];
  progressMethod?: string;
}): Promise<Project[]> => {
  const where: Prisma.ProjectWhereInput = {};

  if (filters.techStack && filters.techStack.length > 0) {
    where.techStack = { hasSome: filters.techStack };
  }

  if (filters.positions && filters.positions.length > 0) {
    where.positions = { hasSome: filters.positions };
  }

  if (filters.progressMethod) {
    where.progressMethod = { equals: filters.progressMethod };
  }

  return prisma.project.findMany({
    where,
    include: { owner: { select: { id: true, email: true, name: true } } }, // 소유자 정보 포함
    orderBy: { id: 'desc' }, // 최신순으로 정렬
  });
};

/**
 * 인기 프로젝트(최신 3개) 목록을 조회합니다.
 */
export const getPopularProjects = async (): Promise<Project[]> => {
  return prisma.project.findMany({
    take: 3,
    include: { owner: { select: { id: true, email: true, name: true } } },
    orderBy: { id: 'desc' },
  });
};

/**
 * ID로 특정 프로젝트를 조회합니다.
 * @param {number} id - 프로젝트 ID
 * @param {number} [userId] - 현재 로그인한 사용자 ID (선택 사항)
 */
export const getProjectById = async (id: number, userId?: number): Promise<Project & { hasApplied?: boolean } | null> => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { owner: { select: { id: true, email: true, name: true } } },
  });

  if (!project) return null;

  // userId가 제공되면, 해당 사용자의 지원 여부를 확인합니다.
  if (userId) {
    const application = await prisma.application.findFirst({
      where: { projectId: id, userId: userId },
    });
    (project as any).hasApplied = !!application;
  }

  return project;
};

/**
 * 프로젝트에 지원합니다.
 */
export const applyToProject = async ({ projectId, userId }: { projectId: number; userId: number }): Promise<Application> => {
  // 이미 지원했는지 확인
  const existingApplication = await prisma.application.findFirst({
    where: { projectId, userId },
  });

  if (existingApplication) {
    throw new ApiError(httpStatus.CONFLICT, '이미 지원한 프로젝트입니다.');
  }

  // 지원서 생성
  return prisma.application.create({
    data: {
      projectId,
      userId,
    },
  });
};

/**
 * 프로젝트 지원자 목록을 조회합니다. (프로젝트 소유자만 가능)
 */
export const getProjectApplicants = async (projectId: number, currentUserId: number) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, '프로젝트를 찾을 수 없습니다.');
  }

  if (project.ownerId !== currentUserId) {
    throw new ApiError(httpStatus.FORBIDDEN, '지원자 목록을 볼 권한이 없습니다.');
  }

  return prisma.application.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          personality: true,
          status: true,
        },
      },
    },
  });
};

/**
 * 사용자 스킬 기반 프로젝트 추천 목록을 조회합니다. (코사인 유사도 적용)
 * @param {number} userId - 현재 로그인한 사용자 ID
 */
export const getRecommendedProjects = async (userId: number): Promise<Project[]> => {
  // 1. 현재 사용자 정보 (스킬 포함) 조회
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      technicalSkills: true
    },
  });

  // 🚨 [수정] 스킬 정보가 없거나 비어있는 경우
  if (!user || !user.technicalSkills || user.technicalSkills.length === 0) {
    // 스킬 정보가 없으면 최신 프로젝트 5개를 반환 (오너 정보 포함 필수)
    return prisma.project.findMany({
      take: 5,
      include: { owner: { select: { id: true, email: true, name: true } } },
      orderBy: { id: 'desc' }
    }) as Promise<Project[]>;
  }

  // 2. 모든 프로젝트의 기본 정보 조회 (오너 정보 포함)
  const allProjects = await prisma.project.findMany({
    include: {
      owner: {
        select: { id: true, email: true, name: true }
      }
    }
  }) as Array<Project & { owner: Pick<User, 'id' | 'email' | 'name'> }>;

  // 3. 매칭 점수 계산
  const projectsWithScore = allProjects
    .map(project => {
      const score = calculateMatchScore(user.technicalSkills, project.techStack);

      return {
        ...project,
        matchScore: score,
      };
    })
  // 🚨 [수정] 0점 필터링을 임시 해제합니다. (데이터가 프런트엔드에 전달되는지 확인하기 위함)
  // .filter(project => project.matchScore > 0); 


  // 4. 점수를 기준으로 내림차순 정렬 (높은 점수 우선)
  const sortedProjects = projectsWithScore
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5); // 상위 5개만 반환

  // 반환 시 matchScore 필드 제거
  return sortedProjects.map(({ matchScore, ...project }) => project as Project);
};


/**
 * 코사인 유사도 기반 매칭 알고리즘 (Placeholder)
 */
export const getRecommendedUsersForProject = async (projectId: number): Promise<any[]> => {
  // TODO: 코사인 유사도 알고리즘 구현
  console.log(`Calculating recommendations for project ${projectId}`);
  return prisma.user.findMany({ select: { id: true, email: true } });
};