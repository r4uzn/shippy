// packages/backend/src/controllers/chat.controller.ts
import * as chatService from '../services/chat.service.js';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
export const getMessages = async (req, res, next) => {
    try {
        const projectId = Number(req.params.projectId);
        if (isNaN(projectId)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Project ID is required');
        }
        const messages = await chatService.getMessagesByProjectId(projectId);
        res.status(httpStatus.OK).json(messages);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=chat.controller.js.map