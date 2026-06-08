# Team 5
**Notion 링크** : https://app.notion.com/p/899f88fb05a9830f99c7813a4167cfea?v=a42f88fb05a982b38f2088cf57d469d5

# 팀원 구성
김찬희(팀장)
김지훈(부팀장)
권태현
류재은
문치호
전현선

___

# 프로젝트 소개
- 꾸준한 학습 습관을 만드는 스터디 사이트 제작
- 프로젝트 기간: 2026.05.18 ~ 2026.06.08

___

# 기술 스택
- **Frontend**: JavaScript, CSS, React.js
- **Backend**: Node.js, Express.js, Prisma
- **DB**: PostgreSQL
- **공통 Tool**: Github, Discord, Zep, Notion, Figma
- **배포**: Netlify, Render

___

# 팀원별 구현 기능 상세
<details>
  <summary>김찬희</summary>

  #### BE 레포 세팅
  - 브랜치 배포, 초기 세팅 후 팀원들에게 공유
  - 필요한 npm install, Prisma 등

  #### 에러 처리 
  - asyncHandler 로직 구현
  - zod Error 처리 로직 구현

  #### 환경 변수 설정
  - .env 파일 구분
  - CORS 에러 방지 로직 구현

  #### 스터디 수정 페이지
  - Route 및 Controller 로직 구현
  - 스터디 내용 수정 로직(닉네임, 스터디명, 배경, 소개글 등) 구현
</details>

<details>
  <summary>김지훈</summary>

  #### 오늘의 습관 페이지
  - 비밀번호 검증 API 구현
  - 당일 습관 목록 조회 API 구현
  - 이번주 습관 로그 생성 API 구현
  - 당일 습관 달성 상태 업데이트 API 구현
  - 등록된 습관 이름 수정 API 구현
  - 습관 종료 API 구현(이전 기록 유지)
  - 주간 달성 기록 데이터 조회 API 구현(상세 페이지용)
  - 매일 밤 12시 스케줄러 및 요일별 반복 습관 자동 생성 로직 구현
</details>

<details>
  <summary>권태현</summary>

  #### 스터디 상세 페이지
  - 기본 정보(이름, 소개, 포인트, 주간 기록표) 조회 API 구현
  - 응원 이모지 추가 및 업데이트(Upsert) API 구현
  - 스터디 정보 수정 API 구현(비밀번호 확인 로직 포함)
  - 스터디 삭제 API 구현(비밀번호 확인 로직 포함)
</details>

<details>
  <summary>류재은</summary>

  #### 스터디 생성 페이지
  - 라우터 및 컨트롤러 구조 세팅
  - 입력 데이터 검증(Validator) 로직 구현
  - 스터디 생성 서비스 및 DB 연동 로직 구현
</details>

<details>
  <summary>문치호</summary>

  #### 오늘의 집중 페이지
  - 비밀번호 검증 API 구현
  - 당일 집중 현황 조회 API 구현
  - 타이머 집중 세션 시작 API 구현
  - 집중 세션 완료 처리 및 포인트 계산 API 구현
</details>

<details>
  <summary>전현선</summary>

  #### 메인 홈
  - 전체 스터디 목록 조회 API 구현
  - 제목/키워드 기반 스터디 검색 API 구현
  - 스터디 목록 정렬 API 구현(최신순/오래된순/포인트순)
  - 데이터 페이지네이션 API 구현
</details>

___

# 파일 구조
```txt
├── prisma/
│   ├── migrations/
│   └── schema.prisma    
├── src/
│   ├── configs/                
│   │   └── prisma.js
│   │
│   ├── controllers/             
│   │   ├── images/
│   │   ├── icons/
│   │   └── sticker/
│   │
│   ├── components/         
│   │   ├── focusController.js
│   │   ├── habitController.js
│   │   ├── studies.js
│   │   ├── studyController.js
│   │   ├── studyDetailController.js
│   │   ├── studyEmojiController.js
│   │   └── updateController.js
│   │
│   ├── routes/
│   │   ├── emojiRoute.js
│   │   ├── focusRoute.js
│   │   ├── habitRoute.js
│   │   ├── studyDetailRoute.js
│   │   ├── studyListRoute.js
│   │   ├── studyRoute.js
│   │   └── updateRoute.js 
│   │
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── errors.js     
│   │
│   ├── validators/
│   │   └── studyValidator.js       
│   └── server.js
├── .env
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json
├── prisma.config.ts
└── README.md               
```

___

# 구현 홈페이지
https://forest-of-study-team5.netlify.app

____

# 프로젝트 회고록
[5팀_공부의 숲_발표자료.pdf](https://github.com/user-attachments/files/28693694/5._._.pdf)


