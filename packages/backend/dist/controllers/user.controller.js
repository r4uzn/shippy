import httpStatus from 'http-status';
import * as userService from '../services/user.service.js';
import ApiError from '../utils/ApiError.js';
/**
 * ID로 사용자 정보 가져오기
 */
export const getUserById = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
/**
 * 현재 로그인된 사용자 정보 가져오기
 */
export const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }
        res.status(httpStatus.OK).json(user);
    }
    catch (error) {
        next(error);
    }
};
/**
 * 현재 로그인한 사용자가 지원한 프로젝트 목록 가져오기
 */
export const getMyApplications = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }
        const applications = await userService.getAppliedProjectsByUserId(user.id);
        res.status(httpStatus.OK).json(applications);
    }
    catch (error) {
        next(error);
    }
};
/**
 * 현재 로그인한 사용자의 성격 정보 업데이트하기
 */
export const updateMyPersonality = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }
        const { personality } = req.body;
        const updatedUser = await userService.updateUserPersonality(user.id, personality);
        res.status(httpStatus.OK).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
};
/**
 * 현재 로그인한 사용자의 상태 정보 업데이트하기
 */
export const updateMyStatus = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
        }
        const { status } = req.body;
        const updatedUser = await userService.updateUserStatus(user.id, status);
        res.status(httpStatus.OK).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=user.controller.js.map