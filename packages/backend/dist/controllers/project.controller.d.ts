import type { Request, Response, NextFunction } from 'express';
/**
 * 새 프로젝트 생성
 */
export declare const createProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 프로젝트 목록 조회
 */
export declare const getProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 인기 프로젝트 목록 조회
 */
export declare const getPopularProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 프로젝트 상세 조회
 */
export declare const getProjectById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * 프로젝트에 지원
 */
export declare const applyToProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=project.controller.d.ts.map