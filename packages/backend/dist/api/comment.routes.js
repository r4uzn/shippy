import { Router } from 'express';
import { createComment, deleteComment, updateComment, } from '../controllers/comment.controller.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.middleware.js';
const router = Router({ mergeParams: true });
router.post('/', ensureAuthenticated, createComment);
router.put('/:commentId', ensureAuthenticated, updateComment);
router.delete('/:commentId', ensureAuthenticated, deleteComment);
export default router;
//# sourceMappingURL=comment.routes.js.map