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

<img width="300px" src="https://user-images.githubusercontent.com/50562634/158748825-db5e1776-fb2a-4c98-9011-003340d24627.png"/>

    - Node.js Express 서버 구축, socket.io 모듈 활용 채팅 서버 구현
    - AWS RDS 활용 DB 연동
    - AWS EC2 활용하여 최종 배포
    

### 3. 시스템 구현 및 주요 기능
#### 3-1. 회원가입 및 로그인

<img width="100px" src="https://user-images.githubusercontent.com/50562634/158745802-651766aa-1271-4101-a49c-ddb0a6dfe3bd.png"/> <img width="100px" src="https://user-images.githubusercontent.com/50562634/158747559-77c3ddff-4c4c-4575-bde1-ad3ff9969421.png"/> <img width="100px" src="https://user-images.githubusercontent.com/50562634/158745810-c1dbc661-7dd0-46fc-b6c8-919460627270.png"/> <img width="100px" src="https://user-images.githubusercontent.com/50562634/158746923-45e85216-7396-43e1-b016-d628a8840016.png"/><img width="100px" src="https://user-images.githubusercontent.com/50562634/158746916-4e291962-3965-4675-b305-01c3d0c0736c.png"/>

    - 회원가입 시 문자 인증 API와 GPS 주소 인증 API를 사용
    - Ajax 기반 passport 인증처리를 통하여 사용자 인증 후 메인 화면 접근

#### 3-2. 메인(프로필)

<img width="150px" src="https://user-images.githubusercontent.com/50562634/158745844-c7b620eb-c428-4bc8-9f70-8063b0b6e6e6.png"/> <img width="150px" src="https://user-images.githubusercontent.com/50562634/158745854-77302fdf-fd4b-461c-886c-4a1d97c192ee.png"/>
<img width="100px" src="https://user-images.githubusercontent.com/50562634/158745816-25f07a1f-c53d-4ba4-84ed-5db554057701.png"/> <img width="100px" src="https://user-images.githubusercontent.com/50562634/158748035-d7ab3cbb-ba1e-4480-a104-25b3678b3240.png"/>

    - AWS S3를 활용한 프로필 사진 업로드
    - 자신의 회원 정보 및 요청 정보 확인 가능

#### 3-3. 요청 작성 및 조회

<img width="100px" src="https://user-images.githubusercontent.com/50562634/158747612-96df49e4-2a55-479a-a889-6712adc7663c.png"/> <img width="100px" src="https://user-images.githubusercontent.com/50562634/158745823-eec4fd4f-103c-4f0a-acf9-819e17e254f0.png"/> <img width="100px" src="https://user-images.githubusercontent.com/50562634/158747195-d1d8df2c-e221-4444-a17e-4ecb8911c1f3.png"/> <img width="100px" src="https://user-images.githubusercontent.com/50562634/158745830-227f0cb3-d78c-4490-87d8-332f54fde7a2.png"/>

    - Node.js와 EJS를 사용하여 글 작성
    - 카테고리 별 조회, 위치 기반 조회, 키워드 추천 및 검색 가능

#### 3-4. 요청 진행 및 채팅

<img width="100px" src="https://user-images.githubusercontent.com/50562634/158745839-60abf966-5277-41e9-be5a-62180b704d26.png"/> <img width="100px" src="https://user-images.githubusercontent.com/50562634/158748560-f60c5114-9364-42c6-ba43-1c2d225adb68.png"/> <img width="100px" src="https://user-images.githubusercontent.com/50562634/158747804-e3734f89-2485-47f7-b254-e3a7450364bf.png"/> 

    - Node.js의 socket.io 모듈을 사용하여 채팅 서버 구축
    - 채팅 기능과 progress바를 이용한 요청 진행
    
#### 3-5. 관리자 페이지

<img width="150px" src="https://user-images.githubusercontent.com/50562634/158747443-159cb8d2-fd73-4e84-94ac-7565f14b84e8.png"/> <img width="150px" src="https://user-images.githubusercontent.com/50562634/158747433-bb7869aa-3fa0-4381-bc89-86e0c8c16408.png"/> <img width="150px" src="https://user-images.githubusercontent.com/50562634/158747435-8d199edd-eaef-4c2a-9d41-eb38b760adcd.png"/>
    
    
### 4. 시연 영상
https://youtu.be/CVJ8Fiit7iU








