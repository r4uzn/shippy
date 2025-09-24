import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';

/**
 * 이메일로 사용자 찾기
 * @param email - 사용자 이메일
 * @returns {Promise<User | null>}
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

/**
 * 새로운 사용자 생성
 * @param userData - 사용자 데이터
 * @returns {Promise<User>}
 */
export const createUser = async (userData: Pick<User, 'email' | 'password' | 'name'>): Promise<User> => {
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이미 사용 중인 이메일입니다.');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  return user;
};

/**
 * 이메일과 비밀번호로 사용자 검증
 * @param email
 * @param password
 * @returns {Promise<User>}
 */
export const validateUserPassword = async (email: string, password: string): Promise<User> => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    return user;
};

