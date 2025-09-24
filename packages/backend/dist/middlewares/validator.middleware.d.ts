import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
/**
 * Joi 스키마를 사용하여 요청 데이터를 검증하는 미들웨어
 * @param {Joi.ObjectSchema} schema - 검증에 사용할 Joi 스키마
 */
export declare const validate: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validator.middleware.d.ts.map