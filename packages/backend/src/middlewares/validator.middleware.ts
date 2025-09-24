import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';

/**
 * Joi 스키마를 사용하여 요청 데이터를 검증하는 미들웨어
 * @param {Joi.ObjectSchema} schema - 검증에 사용할 Joi 스키마
 */
export const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  Object.assign(req, value);
  return next();
};
