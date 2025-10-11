import { Request, Response, NextFunction } from 'express';
/**
 * ID로 사용자 정보 가져오기
 */
export declare const getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 현재 로그인된 사용자 정보 가져오기
 */
export declare const getMe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 현재 로그인한 사용자가 지원한 프로젝트 목록 가져오기
 */
export declare const getMyApplications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 현재 로그인한 사용자의 성격 정보 업데이트하기
 */
export declare const updateMyPersonality: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 현재 로그인한 사용자의 상태 정보 업데이트하기
 */
export declare const updateMyStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map