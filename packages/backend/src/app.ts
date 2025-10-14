import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import passport from 'passport';
import apiRoutes from './api/index.js'; // src/api/index.ts 에서 통합된 API 라우터를 가져옵니다.
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import ApiError from './utils/ApiError.js';
import './config/passport.js'; // Passport 설정을 로드하여 전략을 등록합니다. 이 라인을 실행하는 것만으로 충분합니다.

// Express 애플리케이션 인스턴스를 생성합니다.
const app = express();

// --- 1. 전역 미들웨어 설정 ---

// CORS(Cross-Origin Resource Sharing)를 활성화합니다.
// 프론트엔드에서의 요청을 허용합니다.
app.use(cors({
  origin: true, // 모든 origin 허용 (개발 환경용)
  credentials: true,
}));

// Passport.js 미들웨어를 초기화합니다.
app.use(passport.initialize());

// 클라이언트 요청의 body를 JSON 형식으로 파싱합니다.
app.use(express.json());
// URL-encoded 형식의 body를 파싱합니다. (form 제출 등)
app.use(express.urlencoded({ extended: true }));


// --- 2. 요청 로깅 미들웨어 ---
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// --- 3. API 라우트 연결 ---

// '/api' 경로로 들어오는 모든 요청을 apiRoutes에서 처리하도록 위임합니다.
app.use('/api', apiRoutes);


// --- 3. 에러 처리 미들웨어 설정 ---

// 위에서 정의된 라우트 중 어느 것과도 일치하지 않는 요청이 들어왔을 때 404 에러를 생성합니다.
app.use((req, res, next) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  next(new ApiError(httpStatus.NOT_FOUND, 'API를 찾을 수 없습니다.'));
});

// 모든 에러를 최종적으로 처리하는 전역 에러 핸들러입니다.
// 컨트롤러나 미들웨어에서 next(error)를 호출하면 이 핸들러가 실행됩니다.
app.use(errorHandler);

// 설정이 완료된 app 객체를 내보내 main.ts에서 사용할 수 있도록 합니다.
export default app;

