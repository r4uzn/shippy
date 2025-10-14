/* import express from "express";
import cors from "cors";
import authRoutes from "./api/auth.routes.js";
import projectsRouter from "./routes/projects.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
// import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth
app.use("/api/auth", authRoutes);

// Users

// Projects
app.use("/api/projects", projectsRouter);
 
// Applications

// Global Error Handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
}); */
import express from 'express';

import chatController from './controllers/chat.controller.js';

// 1. Node.js 기본 모듈과 설치한 라이브러리를 가져옵니다.
import http from 'http'; // Socket.IO 연동을 위해 Express 앱을 감쌀 HTTP 서버가 필요합니다.
import app from './app.js'; // Express 앱 설정을 분리한 app.ts 파일을 가져옵니다.
import config from './config/index.js'; // .env 파일의 환경 변수를 관리하는 config 객체입니다.
import logger from './utils/logger.js'; // console.log 대신 사용할 winston 로거입니다.
import { initializeSocket } from './sockets/index.js'; // Socket.IO 서버를 초기화하는 함수입니다.

// 2. Express 앱(app)을 기반으로 Node.js HTTP 서버를 생성합니다.
// 이렇게 해야 Socket.IO가 이 서버 위에서 동작할 수 있습니다.
const server = http.createServer(app);
console.log('🌐 HTTP 서버 생성 완료');

// 3. 생성된 HTTP 서버에 Socket.IO를 연결하여 실시간 통신 기능을 활성화합니다.
console.log('🔌 Socket.IO 초기화 시작...');
try {
  initializeSocket(server);
  console.log('✅ Socket.IO 초기화 완료');
} catch (error) {
  console.error('❌ Socket.IO 초기화 실패:', error);
}

// 4. Express의 app.listen() 대신, 생성한 http 서버(server)를 실행합니다.
// 포트 번호는 하드코딩 대신 config 파일에서 가져와 유연성을 높입니다.
server.listen(config.port, () => {
  logger.info(`서버가 ${config.port} 포트에서 실행 중입니다.`);
  logger.info(`http://localhost:${config.port}`);
});

// 5. (프로덕션 안정성) 처리되지 않은 예외나 거부된 프로미스가 발생했을 때
// 서버가 죽지 않고 에러를 기록하게 하는 안전장치입니다.
const unexpectedErrorHandler = (error: Error) => {
  logger.error('치명적인 에러 발생:', error);
  // 실제 프로덕션에서는 여기서 프로세스를 정상적으로 종료하고
  // PM2 같은 프로세스 매니저가 재시작하도록 설정하는 것이 좋습니다.
  // process.exit(1); 
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

