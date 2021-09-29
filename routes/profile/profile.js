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
    var sql2 = 'select * from request where request_code in (select request_code from matching where (requester_id = ? or bureumi_id = ?) and matching_progress != \'완료\')';
    var sql3 = 'select * from request where request_code in (select request_code from matching where (requester_id = ? or bureumi_id = ?) and matching_progress = \'완료\')';
    var sql4 = 'select * from request where writer_id = ? and request_code not in (select request_code from matching where requester_id = ?) order by length(request_code) desc, request_code desc';
    var sql5 = 'select review_score from review where user_id = ?';
    var userinfo;
    var userscore = 0;
    var matching;
    var matching_cmplt;
    var ids = [id, id]

    connection.query(sql1, id, function(err, result) {
        if (err) throw err;
        userinfo = result;
    });
    connection.query(sql5, id, function(err, result) {
        if (err) throw err;
        result.forEach(element => {
            userscore = userscore + element.review_score;
        });
        userscore = Math.round((userscore / result.length) * 100) / 100;
    });
    connection.query(sql2, ids, function(err, result) {
        if (err) throw err;
        matching = result;
    });
    connection.query(sql3, ids, function(err, result) {
        if (err) throw err;
        matching_cmplt = result;
    });
    connection.query(sql4, ids, function(err, result) {
        if (err) throw err;
        res.render('profile', {'id' : id, userinfo: userinfo, userscore: userscore, matching: matching, matching_cmplt: matching_cmplt, search : result});
    });
    
});

router.get('/:user_id', function(req, res){
    var id = req.params.user_id;

    var sql1 = 'select * from user where user_id = ?';
    var sql2 = 'select * from request where request_code in (select request_code from matching where (requester_id = ? or bureumi_id = ?) and matching_progress != \'완료\')';
    var sql3 = 'select * from request where request_code in (select request_code from matching where (requester_id = ? or bureumi_id = ?) and matching_progress = \'완료\')';
    var sql4 = 'select * from request where writer_id = ? and request_code not in (select request_code from matching where requester_id = ?) order by length(request_code) desc, request_code desc';
    var sql5 = 'select review_score from review where user_id = ?';
    var userinfo;
    var userscore = 0;
    var matching;
    var matching_cmplt;
    var ids = [id, id]

    connection.query(sql1, id, function(err, result) {
        if (err) throw err;
        userinfo = result;
    });
    connection.query(sql5, id, function(err, result) {
        if (err) throw err;
        result.forEach(element => {
            userscore = userscore + element.review_score;
        });
        userscore = Math.round((userscore / result.length) * 100) / 100;
    });
    connection.query(sql2, ids, function(err, result) {
        if (err) throw err;
        matching = result;
    });
    connection.query(sql3, ids, function(err, result) {
        if (err) throw err;
        matching_cmplt = result;
    });
    connection.query(sql4, ids, function(err, result) {
        if (err) throw err;
        res.render('profile_content', {id : id, userinfo: userinfo, userscore: userscore, matching: matching, matching_cmplt: matching_cmplt, search : result});
    });
    
});

module.exports = router;