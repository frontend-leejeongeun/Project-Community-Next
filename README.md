# Community Client (Next.js + Firebase)

## 프로젝트 소개

이 프로젝트는 Next.js와 Firebase를 기반으로 구축된 커뮤니티 클라이언트입니다.  
자유게시판과 Q&A 게시판 기능을 제공하며, Firebase Authentication을 활용한 로그인 기능을 포함하고 있습니다.

-   자유게시판: 게시글 검색, 조회, 작성, 댓글 수 확인
-   로그인: Firebase 기반 인증 (Google, GitHub, Email 등)
-   Q&A: 질문 등록 및 목록 조회 (기능 확장 예정)

## 사용 기술

-   **Next.js 15**: React 기반의 프레임워크로, 서버 사이드 렌더링(SSR)과 정적 사이트 생성(SSG)을 지원합니다. 라우팅 및 최적화된 웹 성능 제공에 강점을 가지고 있습니다.
-   **React 19**: 사용자 인터페이스를 구성하는 핵심 라이브러리입니다. 컴포넌트 기반 구조로 복잡한 UI를 효율적으로 개발할 수 있게 해줍니다.
-   **TypeScript 5**: JavaScript에 타입을 부여하여 코드의 안정성과 유지보수성을 높이는 언어입니다.
-   **Tailwind CSS 4**: 유틸리티 기반 CSS 프레임워크로, 빠르게 UI 스타일을 지정하고 반응형 디자인을 적용할 수 있습니다.
-   **Axios**: 브라우저와 Node.js에서 사용 가능한 Promise 기반의 HTTP 클라이언트로, API 서버와 통신할 때 사용됩니다.
-   **Firebase**: 인증(Authentication), 실시간 데이터베이스(Firestore), 호스팅 등 다양한 백엔드 기능을 제공하는 BaaS(Backend-as-a-Service) 플랫폼입니다.

## 폴더 구조

```plaintext
CAFE-PLATFORM
├── components/             # Header, Login 등 공통 컴포넌트
├── contexts/               # AuthContext: Firebase 인증 전역 관리
│   └── AuthContext.tsx
├── pages/                  # 페이지 구성
│   ├── posts/              # 자유게시판 게시글 상세 페이지
│   │   └── [id].tsx
│   ├── qna/                # Q&A 관련 페이지
│   ├── _app.tsx            # 앱 초기 설정
│   ├── _document.tsx       # HTML 문서 커스터마이징
│   ├── index.tsx           # 메인 && 자유게시판 페이지
│   ├── signup.tsx          # 회원가입 페이지
│   └── write.tsx           # 자유게시판 게시글 작성 페이지
├── public/                 # 정적 자원 (아이콘, 이미지 )
├── services/               # API 및 Firebase 초기화
│   ├── firebase.ts
│   └── qnaApi.ts
├── styles/                 # 글로벌 스타일
│   └── globals.css
├── .env.local              # Firebase 환경 변수 설정
├── package.json
├── README.md
└── ...
```

## 설치 및 실행 방법

1. 레포지토리를 클론합니다:

    ```bash
    git clone https://github.com/frontend-leejeongeun/Project-Community-Next-Client.git
    ```

2. 의존성을 설치합니다:

    ```bash
    npm install
    ```

3. 애플리케이션을 실행합니다:

    ```bash
    # 개발 모드
    npm run dev

    # 프로덕션 실행
    npm start
    ```
