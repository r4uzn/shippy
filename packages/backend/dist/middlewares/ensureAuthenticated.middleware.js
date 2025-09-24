import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
/**
 * JWT 인증을 필수로 요구하는 미들웨어
 * 인증에 실패하면 401 Unauthorized 에러를 반환합니다.
 */
export const ensureAuthenticated = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || info || !user) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, '인증이 필요합니다. 먼저 로그인해주세요.'));
        }
        req.user = user;
        next();
    })(req, res, next);
};
//# sourceMappingURL=ensureAuthenticated.middleware.js.map