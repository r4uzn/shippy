import * as authService from "../services/auth.service.js";
import httpStatus from "http-status";
import { generateToken } from "../utils/jwt.js";
/**
 * 이메일 회원가입을 처리하는 컨트롤러 함수
 */
export const signup = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ message: "이메일과 비밀번호를 모두 입력해주세요." });
        }
        const user = await authService.createUser({
            email,
            password,
            name,
        });
        const token = generateToken(user);
        // 201 Created 상태 코드와 함께 생성된 사용자 정보와 토큰을 응답합니다.
        res.status(httpStatus.CREATED).json({ user, token });
    }
    catch (error) {
        // 서비스에서 발생한 에러를 전역 에러 핸들러로 전달합니다.
        next(error);
    }
};
/**
 * 이메일 로그인을 처리하는 컨트롤러 함수
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ message: "이메일과 비밀번호를 모두 입력해주세요." });
        }
        const user = await authService.validateUserPassword(email, password);
        const token = generateToken(user);
        res.status(httpStatus.OK).json({ user, token });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map