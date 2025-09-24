import jwt from 'jsonwebtoken';
import config from '../config/index.js';
/**
 * JWT 생성
 * @param user - JWT를 생성할 사용자 정보
 * @returns {string} 생성된 JWT
 */
export const generateToken = (user) => {
    const payload = {
        sub: user.id,
        email: user.email,
    };
    const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
    return token;
};
//# sourceMappingURL=jwt.js.map