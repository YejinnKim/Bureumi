const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../config/logger');

router.get('/:problem', async function (req, res) {
    try {
        await errHendler(req.params.problem)
    } catch (error) {
        console.error(error);
        logger.error('경로 : '+__dirname +'  '+error);
    }

    function errHendler(err) { //회원정보 없이 index와 공지사항 이외의 페이지에 접근한 경우
        switch (err) {
            case 'info':
                var msg = "로그인 해주세요"
                var page_location = "login"
                var button = "로그인하러 가기"
                res.render('error_page',
                    {
                        errContent: msg,
                        page_location: page_location,
                        button: button
                    }
                );
                break;
            case 'connect': // 데이터 베이스 접근 중 오류가 발생한 경우
                var msg = "데이터 검색 중 오류가 발생했습니다."
                var page_location = "profile"
                var button = "메인으로 돌아가기"
                res.render('error_page',
                    {
                        errContent: msg,
                        page_location: page_location,
                        button: button
                    }
                );
                break;
            
            case 'wrong' : // 사용자가 로그인한 상태에서 권한 밖 페이지에 접근을 하는경우
                var msg = "잘못된 접근입니다."
                var page_location = "profile"
                var button = "메인으로 돌아가기"
                res.render('error_page',
                    {
                        errContent: msg,
                        page_location: page_location,
                        button: button
                    }
                );
                break;
            default:
                console.error(err);
                logger.error('경로 : '+__dirname +'  '+err);
        }

    }

});





module.exports = router;