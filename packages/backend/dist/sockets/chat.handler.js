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
    const sendMessage = (payload) => {
        // 메시지를 보낸 클라이언트를 제외한 모든 룸 멤버에게 메시지를 전송합니다.
        socket.to(payload.roomId).emit('chat:message', payload);
    };
    // 클라이언트로부터 오는 이벤트를 리스닝합니다.
    socket.on('chat:join', joinRoom);
    socket.on('chat:send', sendMessage);
};
//# sourceMappingURL=chat.handler.js.map