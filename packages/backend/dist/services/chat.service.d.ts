import { ChatMessage, User } from '@prisma/client';
export declare const createMessage: (data: {
    content: string;
    authorId: number;
    projectId: number;
}) => Promise<ChatMessage>;
export declare const getMessagesByProjectId: (projectId: number) => Promise<(ChatMessage & {
    author: Pick<User, "id" | "name" | "email">;
})[]>;
//# sourceMappingURL=chat.service.d.ts.map