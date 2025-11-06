// packages/backend/src/controllers/user.controller.ts

import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import * as userService from '../services/user.service.js';
import * as projectService from '../services/project.service.js'; // 👈 [수정] projectService 임포트
import * as llmService from '../services/llm.service.js';
import ApiError from '../utils/ApiError.js';
import { User } from '@prisma/client';

/**
 * ID로 사용자 정보 가져오기 (생략)
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    // ... (기존 코드 유지)
    try {
        const { userId: userIdParam } = req.params;

        if (!userIdParam) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'User ID is required.');
        }

        const userId = parseInt(userIdParam, 10);
        if (isNaN(userId)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User ID format.');
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        res.status(httpStatus.OK).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * 현재 로그인된 사용자 정보 가져오기 (생략)
 */
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    // ... (기존 코드 유지)
    try {
        const user = req.user as User;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }
        res.status(httpStatus.OK).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * 현재 로그인한 사용자가 지원한 프로젝트 목록 가져오기 (생략)
 */
export const getMyApplications = async (req: Request, res: Response, next: NextFunction) => {
    // ... (기존 코드 유지)
    try {
        const user = req.user as User;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }
        const applications = await userService.getAppliedProjectsByUserId(user.id);
        res.status(httpStatus.OK).json(applications);
    } catch (error) {
        next(error);
    }
};

/**
 * 현재 로그인한 사용자의 자기소개서를 업데이트하고 LLM으로 스킬을 추출합니다. (임시 Mock 적용)
 */
export const updateMyBio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }

        const { bio } = req.body;
        if (typeof bio !== 'string') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Bio content is required.');
        }

        // 🚨 [임시 Mock 코드 유지] LLM 호출을 건너뛰고, 하드코딩된 스킬 목록을 사용합니다.
        const extractedSkills = [
            'Python:4.5',
            'React:3.0',
            'SQL:3.5',
            'JavaScript:4.0',
            'TypeScript:4.0'
        ];
        // 원본 코드: const extractedSkills = await llmService.extractSkillsFromBio(bio);

        // 2. 사용자 정보(bio와 추출된 스킬)를 DB에 업데이트
        const updatedUser = await userService.updateUserBioAndSkills(user.id, bio, extractedSkills);

        res.status(httpStatus.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * 현재 로그인한 사용자의 성격 정보 업데이트하기 (생략)
 */
export const updateMyPersonality = async (req: Request, res: Response, next: NextFunction) => {
    // ... (기존 코드 유지)
    try {
        const user = req.user as User;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }
        const { personality } = req.body;
        const updatedUser = await userService.updateUserPersonality(user.id, personality);
        res.status(httpStatus.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * 현재 로그인한 사용자의 상태 정보 업데이트하기 (생략)
 */
export const updateMyStatus = async (req: Request, res: Response, next: NextFunction) => {
    // ... (기존 코드 유지)
    try {
        const user = req.user as User;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }
        const { status } = req.body;
        const updatedUser = await userService.updateUserStatus(user.id, status);
        res.status(httpStatus.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * 현재 로그인한 사용자에게 추천 프로젝트 목록을 가져옵니다. (코사인 유사도 적용)
 */
export const getRecommendedProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }

        // 🚨 [수정] projectService를 호출하도록 변경
        const recommendedProjects = await projectService.getRecommendedProjects(user.id);
        res.status(httpStatus.OK).json(recommendedProjects);
    } catch (error) {
        next(error);
    }
};