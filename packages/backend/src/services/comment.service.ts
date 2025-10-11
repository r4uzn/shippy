import db from '../db.js';
import ApiError from '../utils/ApiError.js';

export const createComment = async (data: {
  content: string;
  authorId: number;
  projectId: number;
}) => {
  return db.comment.create({
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateComment = async (
  commentId: number,
  content: string,
  authorId: number
) => {
  const comment = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (comment.authorId !== authorId) {
    throw new ApiError(403, 'You are not authorized to update this comment');
  }

  return db.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const deleteComment = async (commentId: number, authorId: number) => {
  const comment = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (comment.authorId !== authorId) {
    throw new ApiError(403, 'You are not authorized to delete this comment');
  }

  return db.comment.delete({
    where: { id: commentId },
  });
};

export const getCommentsByProjectId = async (projectId: number) => {
  return db.comment.findMany({
    where: { projectId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};
