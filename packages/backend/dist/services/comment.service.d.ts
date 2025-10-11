export declare const createComment: (data: {
    content: string;
    authorId: number;
    projectId: number;
}) => Promise<{
    author: {
        name: string | null;
        id: number;
    };
} & {
    id: number;
    projectId: number;
    createdAt: Date;
    content: string;
    updatedAt: Date;
    authorId: number;
}>;
export declare const updateComment: (commentId: number, content: string, authorId: number) => Promise<{
    author: {
        name: string | null;
        id: number;
    };
} & {
    id: number;
    projectId: number;
    createdAt: Date;
    content: string;
    updatedAt: Date;
    authorId: number;
}>;
export declare const deleteComment: (commentId: number, authorId: number) => Promise<{
    id: number;
    projectId: number;
    createdAt: Date;
    content: string;
    updatedAt: Date;
    authorId: number;
}>;
export declare const getCommentsByProjectId: (projectId: number) => Promise<({
    author: {
        name: string | null;
        id: number;
    };
} & {
    id: number;
    projectId: number;
    createdAt: Date;
    content: string;
    updatedAt: Date;
    authorId: number;
})[]>;
//# sourceMappingURL=comment.service.d.ts.map