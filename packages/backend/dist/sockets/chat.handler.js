// packages/backend/src/sockets/chat.handler.ts
import * as chatService from '../services/chat.service.js';
import prisma from '../config/prisma.js'; // 🚨 [추가] Prisma 인스턴스 임포트
export default (io, socket) => {
    /**
     * 클라이언트가 특정 채팅방(프로젝트 룸)에 참여
     */
    const joinRoom = (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user:joined', { userId: socket.id });
    };
    /**
     * 채팅 메시지 수신 및 전파
     */
    const sendMessage = async (payload) => {
        try {
            const { roomId, message, sender } = payload;
            // sender의 이름으로 사용자를 찾아 authorId를 가져옵니다.
            const user = await prisma.user.findFirst({ where: { name: sender } });
            if (!user) {
                console.error('메시지 저장 실패: 사용자를 찾을 수 없습니다.');
                return;
            }
            // 🚨 [수정] await을 사용하여 메시지 저장 비동기 처리를 기다립니다.
            await chatService.createMessage({
                content: message,
                authorId: user.id,
                projectId: Number(roomId)
            });
            // 저장 후, 방 전체에 메시지를 브로드캐스트
            io.to(roomId).emit('chat:message', payload);
        }
        catch (error) {
            console.error('메시지 저장 및 전송 실패:', error);
        }
    };
    // 클라이언트로부터 오는 이벤트를 리스닝합니다.
    socket.on('chat:join', joinRoom);
    socket.on('chat:send', sendMessage);
};
//# sourceMappingURL=chat.handler.js.map