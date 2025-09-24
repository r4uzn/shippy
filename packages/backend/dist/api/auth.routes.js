import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
const router = Router();
// POST /api/auth/signup 경로로 요청이 오면 authController.signup 함수를 실행합니다.
router.post('/signup', authController.signup);
// 로그인 및 기타 인증 관련 라우트도 여기에 추가됩니다.
router.post('/login', authController.login);
export default router;
//# sourceMappingURL=auth.routes.js.map