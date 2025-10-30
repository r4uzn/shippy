// packages/backend/src/controllers/sharedNote.controller.ts (새로 추가)

import { Request, Response, NextFunction } from 'express';
import * as sharedNoteService from '../services/sharedNote.service.js';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = Number(req.params.projectId);
        if (isNaN(projectId)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Project ID is required');
        }

        const note = await sharedNoteService.getOrCreateNote(projectId);
        res.status(httpStatus.OK).json(note);
    } catch (error) {
        next(error);
    }
};