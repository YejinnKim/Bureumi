var express = require('express')
var app = express()
var router = express.Router() //라우터 메서드

router.get('/', function(req, res){
    console.log('logout')
    req.logout();
    req.session.destroy()//user_info 삭제
    
    res.redirect('/login');//root는 route.js에 설정해놓음
});

module.exports = router;    