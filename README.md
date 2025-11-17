Shippy (쉬피)
AI 기반 사이드 프로젝트 팀 매칭 및 협업 플랫폼

핵심 가치
Shippy는 사이드 프로젝트 팀원을 쉽고 정확하게 찾고, 나와 잘 맞는 사람과 협업할 수 있도록 돕는 플랫폼입니다.

주요 기능 (Key Features)
1. AI 기반 맞춤형 추천 시스템
- 사용자 프로필(Bio)을 분석하여 LLM(대규모 언어 모델) 기반으로 기술 스택과 숙련도를 자동 추출합니다.
- 사용자 기술과 프로젝트 요구사항 간의 적합도를 코사인, 자카드, 유클리드 유사도 등 다양한 알고리즘으로 정량 평가합니다.

2. 실시간 협업 팀룸 (Team Room)
- Socket.IO 기반 실시간 채팅 기능 제공
- AI 챗봇 명령어 지원
- 공유 마크다운 메모장 제공
- WebRTC 기반 화상 회의 기능

3. 프로젝트 관리 및 필터링
- 기술 스택, 포지션, 진행 방식(온라인/오프라인) 등 다양한 조건으로 프로젝트 검색 및 필터링 가능

기술 스택 (Tech Stack)
Backend (packages/backend)
- 언어: TypeScript
- 프레임워크: Express
- DB: PostgreSQL (Prisma ORM)
- 인증: Passport.js (JWT Strategy)
- 실시간 통신: Socket.IO
- AI/LLM: Axios로 외부 LLM API(Ollama 등) 연동
- 기타: Winston, http-status, Joi

Frontend (packages/frontend)
- 프레임워크: Vue.js 3 (Composition API)
- 언어: TypeScript
- 라우팅: Vue Router 4
- 상태 관리: useAuth (Composable)
- API 통신: Axios, Socket.IO-client
- 협업 도구: markdown-it

프로젝트 실행 방법 (Getting Started)
1. 전제 조건
- Node.js v18 이상
- PostgreSQL
- LLM 서비스 (예: Ollama)

2. 환경 설정 파일
프로젝트 루트에 .env 파일 생성 후 packages/backend/.env.sample 참고

예시 변수:
- DATABASE_URL: PostgreSQL 연결 문자열
- JWT_SECRET: JWT 서명 비밀 키
- LLM_API_URL: LLM API 엔드포인트
- LLM_MODEL_NAME: 사용할 모델명 (예: gemma:2b)

3. 설치 및 초기화
npm install

cd packages/backend
npx prisma migrate dev --name init
npm run seed (선택)

npm run dev:server
# http://localhost:3000

cd ../frontend
npm run dev
# http://localhost:5173

4. 테스트 실행
백엔드 (Jest):
cd packages/backend
npm test

프론트엔드 (Vitest):
cd packages/frontend
npm test

프로젝트 구조
shippy/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── services/
│   │   │   ├── sockets/
│   │   │   └── utils/
│   │   ├── prisma/
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── composables/
│       │   ├── pages/
│       │   └── router/
│       └── package.json
└── package.json
