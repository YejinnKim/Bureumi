## 우리동네 심부름 플랫폼 부름이

### 1. 개요
#### 1-1. 개발 배경 및 필요성
    '편한 것이 프리미엄이다.' 라는 '편리미엄'을 중시하는 소비자가 증가하고 있다.
    이러한 흐름에 맞추어 지역 심부름 플랫폼을 개발하고자 한다.  
    
#### 1-2. 개발 내용
    - HTML 기반 반응형 웹 구현
    - MySQL 데이터베이스, Node.js 기반 서버, Socket.io 채팅 및 GPS위치 모듈 연동 
    
#### 1-3. 팀 구성 및 역할
    - 김시라 : 프론트엔드
    - 조한웅 : 백엔드(서버)
    - 김예진 : 백엔드(DB & 서버)
    
  
### 2. 시스템 설계
#### 2-1. 개발 환경, 도구 및 언어
    - 클라이언트 : HTML5, CSS3, JavaScript, JQuery, Bootstrap
    - 서버 : Node.js(Express), EC2(AWS)
    - 데이터베이스 : MySQL, RDS(AWS)
    - 스토리지 : S3(AWS)
    
#### 2-2. 데이터베이스 설계
    user(id, pw, name, birth, phone, level, location, sex, job, img)
    bureumi(bcode, uid, state)
    request(rcode, rid, rcategory, rtitle, rcontent, rprice, rdate, rimg, rlocation)
    matching(mcode, rcode, rid, bid, mdate, mprogress)
    chatting(room, uid, msg, time)
    review(mcode, uid, score, rvcontent, otherid)
    notice(ncode, ntitle, ncontent, ndate)
    
#### 2-3. 서버 및 통신 설계
    - Node.js Express 서버 구축, socket.io 모듈 활용 채팅 서버 구현
    - AWS RDS 활용 DB 연동
    - AWS EC2 활용하여 최종 배포
    

### 3. 시스템 구현 및 주요 기능
#### 3-1. 회원가입 및 로그인

    - 회원가입 시 문자 인증 API와 GPS 주소 인증 API를 사용
    - Ajax 기반 passport 인증처리를 통하여 사용자 인증 후 메인 화면 접근

#### 3-2. 메인(프로필)

    - AWS S3를 활용한 프로필 사진 업로드
    - 자신의 회원 정보 및 요청 정보 확인 가능

#### 3-3. 요청 작성 및 조회

    - Node.js와 EJS를 사용하여 글 작성
    - 카테고리 별 조회, 위치 기반 조회, 키워드 추천 및 검색 가능

#### 3-4. 요청 진행 및 채팅

    - Node.js의 socket.io 모듈을 사용하여 채팅 서버 구축
    - 채팅 기능과 progress바를 이용한 요청 진행

    
### 4. 시연 영상
https://youtu.be/CVJ8Fiit7iU








