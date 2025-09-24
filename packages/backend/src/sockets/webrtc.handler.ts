import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket) => {
  // WebRTC 시그널링 이벤트 처리 (offer, answer, ice-candidate)
  
  const handleOffer = (payload: { targetSocketId: string; sdp: any }) => {
    io.to(payload.targetSocketId).emit('webrtc:offer', {
      from: socket.id,
      sdp: payload.sdp,
    });
  };

  const handleAnswer = (payload: { targetSocketId:string; sdp: any }) => {
    io.to(payload.targetSocketId).emit('webrtc:answer', {
      from: socket.id,
      sdp: payload.sdp,
    });
  };

  const handleIceCandidate = (payload: { targetSocketId: string; candidate: any }) => {
    io.to(payload.targetSocketId).emit('webrtc:ice-candidate', {
      from: socket.id,
      candidate: payload.candidate,
    });
  };

  socket.on('webrtc:offer', handleOffer);
  socket.on('webrtc:answer', handleAnswer);
  socket.on('webrtc:ice-candidate', handleIceCandidate);
};
