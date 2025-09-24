import type { Request, Response, NextFunction } from 'express';
/**
 * JWT 인증을 수행하는 미들웨어 (선택적 인증)
 * 토큰이 유효하면 req.user에 사용자 정보를 설정하고, 유효하지 않거나 없어도 에러 없이 다음으로 진행합니다.
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map