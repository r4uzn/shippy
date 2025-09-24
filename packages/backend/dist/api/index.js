import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import projectRoutes from './project.routes.js';
const router = Router();
// 각 기능별 라우터를 등록합니다.
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
export default router;
//# sourceMappingURL=index.js.map