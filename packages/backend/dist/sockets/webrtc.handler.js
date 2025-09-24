export default (io, socket) => {
    // WebRTC 시그널링 이벤트 처리 (offer, answer, ice-candidate)
    const handleOffer = (payload) => {
        io.to(payload.targetSocketId).emit('webrtc:offer', {
            from: socket.id,
            sdp: payload.sdp,
        });
    };
    const handleAnswer = (payload) => {
        io.to(payload.targetSocketId).emit('webrtc:answer', {
            from: socket.id,
            sdp: payload.sdp,
        });
    };
    const handleIceCandidate = (payload) => {
        io.to(payload.targetSocketId).emit('webrtc:ice-candidate', {
            from: socket.id,
            candidate: payload.candidate,
        });
    };
    socket.on('webrtc:offer', handleOffer);
    socket.on('webrtc:answer', handleAnswer);
    socket.on('webrtc:ice-candidate', handleIceCandidate);
};
//# sourceMappingURL=webrtc.handler.js.map