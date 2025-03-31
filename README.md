# Community Client (Next.js + Firebase)

## 프로젝트 소개

이 프로젝트는 Next.js와 Firebase를 기반으로 구축된 커뮤니티 클라이언트입니다.  
자유게시판과 Q&A 게시판 기능을 제공하며, Firebase Authentication을 활용한 로그인 기능을 포함하고 있습니다.

-   게시판(자유게시판, Q&A게시판): 게시글 조회, 작성, 수정, 삭제, 댓글, 대댓글 기능
-   로그인: Firebase 기반 인증 (Google, GitHub, Email 등)
-   검색: 게시글 검색, 검색 텍스트 하이라이팅

## 사용 기술

-   **Next.js 15**
-   **React 19**
-   **TypeScript 5**
-   **Tailwind CSS 4**
-   **Axios**
-   **Firebase**

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
├── package.json
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
