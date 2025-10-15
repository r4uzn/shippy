import { Server, Socket } from 'socket.io';

// 방마다 어떤 유저(소켓 ID)들이 있는지 기록
const rooms: Record<string, string[]> = {};

export default (io: Server, socket: Socket) => {

  // 유저가 특정 방에 WebRTC 참가를 요청
  socket.on('webrtc:join', (payload: { roomId: string }) => {
    const { roomId } = payload;
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    // 다른 유저들에게 새로운 유저가 들어왔다고 알림
    const otherUsers = rooms[roomId];
    if (otherUsers) {
      socket.emit('webrtc:all-users', { users: otherUsers });
    }
    rooms[roomId].push(socket.id);
  });

  // Offer를 특정 대상에게 전달
  socket.on('webrtc:offer', (payload: { target: string, sdp: any, from: string, roomId: string }) => {
    io.to(payload.target).emit('webrtc:offer', { sdp: payload.sdp, from: payload.from });
  });

  // Answer를 특정 대상에게 전달
  socket.on('webrtc:answer', (payload: { target: string, sdp: any, from: string, roomId: string }) => {
    io.to(payload.target).emit('webrtc:answer', { sdp: payload.sdp, from: payload.from });
  });

  // ICE Candidate를 특정 대상에게 전달
  socket.on('webrtc:ice-candidate', (payload: { target: string, candidate: any, from: string, roomId: string }) => {
    io.to(payload.target).emit('webrtc:ice-candidate', { candidate: payload.candidate, from: payload.from });
  });

  // 유저가 방을 나갈 때
  const handleLeave = (roomId: string) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      // 방에 남아있는 다른 유저들에게 내가 나갔다고 알림
      socket.to(roomId).emit('webrtc:user-left', { sid: socket.id });
    }
  }

  socket.on('webrtc:leave', (payload: { roomId: string }) => {
    handleLeave(payload.roomId)
  });

  // 소켓 연결이 끊어졌을 때 모든 방에서 해당 유저 제거
  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      handleLeave(roomId);
    }
  });
};