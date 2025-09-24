import type { Request, Response, NextFunction } from "express";
/**
 * 이메일 회원가입을 처리하는 컨트롤러 함수
 */
export declare const signup: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 이메일 로그인을 처리하는 컨트롤러 함수
 */
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map