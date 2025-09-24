import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.middleware.js';
const router = Router();
// 인기 프로젝트 목록 조회
router.get('/popular', projectController.getPopularProjects);
// 프로젝트 생성 (인증 필수)
router.post('/', ensureAuthenticated, projectController.createProject);
// 프로젝트 목록 조회
router.get('/', projectController.getProjects);
// 프로젝트 상세 조회 (선택적 인증)
router.get('/:id', authenticate, projectController.getProjectById);
// 프로젝트 지원 (인증 필수)
router.post('/:id/apply', ensureAuthenticated, projectController.applyToProject);
export default router;
//# sourceMappingURL=project.routes.js.map