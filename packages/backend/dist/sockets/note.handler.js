// packages/backend/src/sockets/note.handler.ts (새로 추가)
import * as sharedNoteService from '../services/sharedNote.service.js';
import logger from '../utils/logger.js';
export default (io, socket) => {
    /**
     * 클라이언트가 노트 룸에 참여
     * @param roomId - 프로젝트 ID
     */
    const joinNoteRoom = (roomId) => {
        socket.join(`note-${roomId}`);
        logger.info(`📝 노트룸 참여: Socket ${socket.id} joined room note-${roomId}`);
    };
    /**
     * 실시간으로 노트 내용을 업데이트하고 저장 및 전파
     * @param payload - { roomId: string, content: string }
     */
    const updateNote = async (payload) => {
        const { roomId, content } = payload;
        const noteRoomId = `note-${roomId}`;
        try {
            // 1. DB에 내용 저장 (실시간 저장)
            await sharedNoteService.updateNoteContent(Number(roomId), content);
            // 2. 메시지를 보낸 클라이언트를 제외한 모든 룸 멤버에게 업데이트된 내용을 전송
            // io.to(noteRoomId).except(socket.id).emit('note:content', payload); // 자신을 제외하고 보내는 경우
            io.to(noteRoomId).emit('note:content', payload); // 모든 클라이언트에게 전송 (자신 포함)
        }
        catch (error) {
            logger.error(`❌ 노트 저장 및 전송 실패 (Room: ${roomId}):`, error);
        }
    };
    // 클라이언트로부터 오는 이벤트를 리스닝합니다.
    socket.on('note:join', joinNoteRoom);
    socket.on('note:update', updateNote);
};
//# sourceMappingURL=note.handler.js.map