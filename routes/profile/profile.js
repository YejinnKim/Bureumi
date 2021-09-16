var express = require('express');
var app = express()
var router = express.Router() //라우터 메서드
var path = require('path')  //상대경로는 path 사용
var connection = require('../connection');

//profile page는 login이 될 때만 접근 가능!! 세션에 정보가 있을때!!
router.get('/', function(req, res){
    var id = req.user;
    if(!id) res.render('login');
    if(id=='admin') res.redirect('/admin'); //관리자 로그인시 admin page 이동

    var sql1 = 'select * from user where user_id = ?';
    var sql2 = 'select * from request where writer_id = ?';
    var userinfo;

    connection.query(sql1, id, function(err, result) {
        if (err) throw err;
        userinfo = result;
    });
    connection.query(sql2, id, function(err, result) {
        if (err) throw err;
        res.render('profile', {'id' : id, userinfo: userinfo, search : result});
    });
    
});

module.exports = router;