import type { Request, Response, NextFunction } from 'express';
/**
 * JWT 인증을 필수로 요구하는 미들웨어
 * 인증에 실패하면 401 Unauthorized 에러를 반환합니다.
 */
export declare const ensureAuthenticated: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=ensureAuthenticated.middleware.d.ts.map