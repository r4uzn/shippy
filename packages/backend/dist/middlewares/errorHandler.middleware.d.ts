import type { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError.js';
export declare const errorHandler: (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.middleware.d.ts.map