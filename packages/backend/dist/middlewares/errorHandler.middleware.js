import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
export const errorHandler = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    const { statusCode, message } = error;
    logger.error(err);
    res.status(statusCode).json({
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
//# sourceMappingURL=errorHandler.middleware.js.map