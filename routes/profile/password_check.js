var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


router.get('/', (req,res) => {
    try { // 오류처리 - 임시조치
        const user_id = req.session.user_info.user_id; 
     }
     catch (e) {
        console.log('로그인 정보 없음');
        res.send('<script type="text/javascript">alert("로그인을 해주세요."); window.history.go(-1)</script>');
     }
    res.render('password_check')
})

router.post('/checking', (req,res) => { 
    if(!req.body.password){
        console.log('비밀번호가 입력되지 않았습니다.');
        res.send('<script type="text/javascript">alert("비밀번호가 입력되지 않았습니다."); window.history.go(-1)</script>');     
    }
    else if(req.body.password === req.session.user_info.user_password){ 
        res.redirect('/userinfo')
    }
    else{
        console.log('비밀번호가 정확하지 않습니다.');
        res.send('<script type="text/javascript">alert("비밀번호가 정확하지 않습니다."); window.history.go(-1)</script>');
    }

})

module.exports = router;