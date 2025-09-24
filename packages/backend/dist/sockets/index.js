import { Server } from 'socket.io';
import chatHandler from './chat.handler.js';
import webrtcHandler from './webrtc.handler.js';
import logger from '../utils/logger.js';
export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*', // 실제 프로덕션 환경에서는 프론트엔드 주소로 제한해야 합니다.
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        logger.info(`✅ 소켓 연결 성공: ${socket.id}`);
        // 네임스페이스나 룸을 사용하여 핸들러를 분리할 수 있습니다.
        chatHandler(io, socket);
        webrtcHandler(io, socket);
        socket.on('disconnect', () => {
            logger.info(`❌ 소켓 연결 해제: ${socket.id}`);
        });
    });
};
//# sourceMappingURL=index.js.map