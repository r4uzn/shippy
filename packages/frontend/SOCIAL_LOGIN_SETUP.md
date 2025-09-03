# 소셜 로그인 설정 가이드

## 📋 개요
SHIPPY 프로젝트에서 Google, Kakao, Naver, Apple 소셜 로그인을 사용하기 위한 설정 가이드입니다.

## 🔧 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Kakao OAuth  
VITE_KAKAO_CLIENT_ID=your-kakao-client-id

# Naver OAuth
VITE_NAVER_CLIENT_ID=your-naver-client-id

# Apple OAuth
VITE_APPLE_CLIENT_ID=your-apple-client-id
```

## 🔑 각 플랫폼별 설정 방법

### 1. Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보" 이동
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID" 선택
5. 애플리케이션 유형: "웹 애플리케이션"
6. 승인된 리디렉션 URI 추가:
   - `http://localhost:5173/auth/google/callback` (개발용)
   - `https://yourdomain.com/auth/google/callback` (프로덕션용)
7. 클라이언트 ID를 `.env.local`에 추가

### 2. Kakao OAuth 설정

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 생성
3. "제품 설정" > "카카오 로그인" 활성화
4. "플랫폼" > "Web" 플랫폼 추가
5. 사이트 도메인 등록:
   - `http://localhost:5173` (개발용)
   - `https://yourdomain.com` (프로덕션용)
6. "제품 설정" > "카카오 로그인" > "Redirect URI" 설정:
   - `http://localhost:5173/auth/kakao/callback` (개발용)
   - `https://yourdomain.com/auth/kakao/callback` (프로덕션용)
7. 앱 키의 REST API 키를 `.env.local`에 추가

### 3. Naver OAuth 설정

1. [Naver Developers](https://developers.naver.com/) 접속
2. 애플리케이션 등록
3. "서비스 환경" > "PC 웹" 환경 추가
4. 서비스 URL 등록:
   - `http://localhost:5173` (개발용)
   - `https://yourdomain.com` (프로덕션용)
5. "Callback URL" 설정:
   - `http://localhost:5173/auth/naver/callback` (개발용)
   - `https://yourdomain.com/auth/naver/callback` (프로덕션용)
6. 클라이언트 ID를 `.env.local`에 추가

### 4. Apple OAuth 설정

1. [Apple Developer](https://developer.apple.com/) 접속
2. "Certificates, Identifiers & Profiles" 이동
3. "Identifiers" > "App IDs"에서 새 App ID 생성
4. "Services"에서 "Sign In with Apple" 활성화
5. "Keys"에서 새 키 생성하고 "Sign In with Apple" 활성화
6. "Services ID" 생성:
   - Identifier: `com.yourcompany.shippy`
   - Domains and Subdomains: `yourdomain.com`
   - Return URLs: 
     - `https://yourdomain.com/auth/apple/callback`
7. Services ID를 `.env.local`에 추가

## 🚀 사용 방법

1. 각 플랫폼에서 위 설정을 완료
2. `.env.local` 파일에 실제 클라이언트 ID 입력
3. 개발 서버 재시작: `npm run dev`
4. 로그인/회원가입 버튼 클릭하여 소셜 로그인 테스트

## ⚠️ 주의사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- 프로덕션 환경에서는 HTTPS를 사용해야 합니다
- 각 플랫폼의 정책 변경에 주의하세요
- 실제 구현 시 서버 사이드에서 토큰 검증이 필요합니다

## 🔄 백엔드 연동

현재는 프론트엔드에서 팝업을 열고 시뮬레이션하는 방식입니다. 실제 서비스에서는:

1. 백엔드에서 OAuth 콜백 처리
2. 사용자 정보 조회 및 저장
3. JWT 토큰 발급
4. 프론트엔드로 토큰 전달

이 과정이 필요합니다.

