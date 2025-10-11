import * as commentService from '../services/comment.service.js';
export const createComment = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { content } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }
        const authorId = req.user.id;
        const comment = await commentService.createComment({
            content,
            authorId,
            projectId: parseInt(projectId, 10),
        });
        res.status(201).json(comment);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!commentId) {
            return res.status(400).json({ message: 'Comment ID is required' });
        }
        const authorId = req.user.id;
        const comment = await commentService.updateComment(parseInt(commentId, 10), content, authorId);
        res.status(200).json(comment);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!commentId) {
            return res.status(400).json({ message: 'Comment ID is required' });
        }
        const authorId = req.user.id;
        await commentService.deleteComment(parseInt(commentId, 10), authorId);
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
//# sourceMappingURL=comment.controller.js.map