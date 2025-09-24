import passport from 'passport';
/**
 * JWT 인증을 수행하는 미들웨어 (선택적 인증)
 * 토큰이 유효하면 req.user에 사용자 정보를 설정하고, 유효하지 않거나 없어도 에러 없이 다음으로 진행합니다.
 */
export const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user) {
            req.user = user; // 인증 성공 시 req.user에 사용자 정보 추가
        }
        next(); // 에러가 없으면 무조건 다음 미들웨어로 진행
    })(req, res, next);
};
//# sourceMappingURL=auth.middleware.js.map