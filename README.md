Shippy (쉬피) AI 기반 사이드 프로젝트 팀 매칭 및 협업 플랫폼핵심 가치: 사이드 프로젝트 팀원을 쉽게 구하고, 나와 잘 맞는 사람과 함께할 수 있는 플랫폼을 목표로 합니다. 주요 기능 (Key Features)Shippy는 단순한 모집 공고 게시판을 넘어, 팀 빌딩의 정확도를 높이고 프로젝트 진행을 돕는 통합 협업 환경을 제공합니다.AI 기반 맞춤형 추천 시스템사용자 프로필의 자기소개(Bio)를 분석하여 **LLM(대규모 언어 모델)**을 통해 기술 스택과 숙련도를 자동 추출합니다.사용자 기술과 프로젝트 요구사항 간의 적합도를 코사인 유사도, 자카드 유사도, 유클리드 유사도 등 다중 알고리즘을 사용해 정량적으로 계산하여 보여줍니다.실시간 협업 팀룸 (Team Room)프로젝트 팀원 간의 원활한 소통을 위한 Socket.IO 기반 실시간 채팅 기능과 AI 챗봇 명령어를 지원합니다.프로젝트 문서를 공동으로 관리할 수 있는 실시간 공유 마크다운 메모장을 제공합니다.팀 회의를 위한 WebRTC 기반 화상 채팅 기능을 통합했습니다.프로젝트 관리 및 필터링기술 스택, 포지션, 진행 방식(온라인/오프라인) 등 다양한 조건으로 프로젝트를 검색하고 필터링할 수 있습니다. 기술 스택 (Tech Stack)이 프로젝트는 효율적인 개발과 성능을 위해 Node.js 기반의 Monorepo 구조로 설계되었습니다.Backend (packages/backend)역할기술설명언어TypeScript정적 타입으로 안정성 확보프레임워크Express유연하고 빠른 서버 구축데이터베이스PostgreSQL (Prisma)ORM을 통한 안전한 데이터 모델링 및 접근인증Passport.js (JWT Strategy)안전한 토큰 기반 인증 및 권한 관리실시간 통신Socket.IO채팅, 메모장, WebRTC 시그널링 등 실시간 기능 구현AI/LLMAxios (외부 LLM 연동)외부 LLM API(예: Ollama)와 통신하여 텍스트 생성 및 데이터 추출유틸리티Winston, http-status, Joi로깅, HTTP 상태 코드 관리, 데이터 유효성 검증Frontend (packages/frontend)역할기술설명프레임워크Vue.js 3컴포지션 API를 활용한 반응형 UI 개발언어TypeScriptVue 컴포넌트의 타입 안전성 확보라우팅Vue Router 4SPA(Single Page Application) 라우팅 관리상태 관리useAuth (Composable)로컬 스토리지 및 ref를 활용한 인증 상태 관리API 통신Axios, Socket.IO-clientREST API 호출 및 실시간 서버 통신협업 도구Markdown-it팀룸 내 공유 메모장 마크다운 렌더링 지원 프로젝트 실행 방법 (Getting Started)1. 전제 조건Node.js (v18 이상 권장)PostgreSQL 데이터베이스 (로컬 또는 Docker)LLM 서비스 (예: Ollama 등)2. 환경 설정 파일프로젝트 루트 디렉토리에서 .env 파일을 생성하고, packages/backend/.env.sample 파일을 참고하여 내용을 작성합니다.변수설명DATABASE_URLPostgreSQL 연결 문자열 (Prisma용)JWT_SECRETJWT 서명에 사용할 비밀 키LLM_API_URLAI 기능에 사용할 로컬 또는 외부 LLM API 엔드포인트LLM_MODEL_NAME사용할 LLM 모델 이름 (예: gemma:2b)3. 설치 및 초기화Bash# 1. 모든 패키지 의존성 설치 (루트 디렉토리에서)
npm install

# 2. 백엔드 디렉토리로 이동
cd packages/backend

# 3. 데이터베이스 마이그레이션 실행 및 초기 데이터 시딩
# DB 연결 확인 및 스키마 생성
npx prisma migrate dev --name init 

# 샘플 유저/프로젝트 데이터 추가 (선택 사항)
npm run seed

# 4. 백엔드 서버 실행
npm run dev:server
# 서버가 http://localhost:3000 에서 실행됩니다.


# 5. 프론트엔드 디렉토리로 이동
cd ../frontend 

# 6. 프론트엔드 개발 서버 실행
npm run dev
# Vite 서버가 http://localhost:5173 에서 실행되며, /api 요청은 백엔드로 프록시됩니다.
4. 테스트 실행Bash# 백엔드 테스트 (Jest)
cd packages/backend
npm test

# 프론트엔드 테스트 (Vitest)
cd packages/frontend
npm test
📂 프로젝트 구조 (Project Structure)프로젝트는 모노레포(Monorepo) 형태로 구성되어 있으며, packages/backend와 packages/frontend로 나뉘어 있습니다.shippy/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── api/          # 라우트 정의 (auth, users, projects, recommend)
│   │   │   ├── config/       # DB(Prisma), Passport, 환경 설정
│   │   │   ├── controllers/  # 요청 처리 로직
│   │   │   ├── middlewares/  # 인증 (auth, ensureAuthenticated), 유효성 검사
│   │   │   ├── services/     # 핵심 비즈니스 로직 및 AI/매칭 로직 (user.service.ts, ai.service.ts)
│   │   │   ├── sockets/      # Socket.IO 핸들러 (chat, note, webrtc)
│   │   │   └── utils/        # ApiError, Logger, JWT 유틸리티
│   │   ├── prisma/
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── components/   # 재사용 가능한 UI 컴포넌트
│       │   ├── composables/  # Vue.js 상태 관리 로직 (useAuth, useComments)
│       │   ├── pages/        # 라우팅된 뷰 컴포넌트 (Home, Projects, TeamRoom, Recommend 등)
│       │   └── router/       # Vue Router 설정
│       └── package.json
└── package.json  # Monorepo 루트
