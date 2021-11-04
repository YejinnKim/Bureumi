const express = require('express');
const app = express();
const router = express.Router();
const path = require('path') ;
const connection = require('../connection');
const logger = require('../../config/logger');
var introduce = null;

//profile page는 login이 될 때만 접근 가능!! 세션에 정보가 있을때!!
router.get('/', function (req, res) {
    var id = req.user;
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else if (id == 'admin') res.redirect('/admin'); //관리자 로그인시 admin page 이동
    else {
        var sql1 = 'select * from user where user_id = ?';
        var sql2 = 'select * from request where request_code in (select request_code from matching where (requester_id = ? or bureumi_id = ?) and matching_progress != \'완료\')';
        var sql3 = 'select * from request where request_code in (select request_code from matching where (requester_id = ? or bureumi_id = ?) and matching_progress = \'완료\')';
        var sql4 = 'select * from request where writer_id = ? and request_code not in (select request_code from matching where requester_id = ?) order by length(request_code) desc, request_code desc';
        var sql5 = 'select review_score from review where user_id = ?';
        var sql6 = 'select * from introduce where user_id = ?'
        var userinfo;
        var userscore = 0;
        var matching;
        var matching_cmplt;
        var intrd = null;
        var ids = [id, id]

        connection.query(sql1, id, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            userinfo = result;
        });
        connection.query(sql5, id, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            result.forEach(element => {
                userscore = userscore + element.review_score;
            });
            userscore = Math.round((userscore / result.length) * 100) / 100;
        });
        connection.query(sql6, id, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            if(result) {
                intrd = result[0];
                introduce = 1;
            } 
        });
        connection.query(sql2, ids, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            matching = result;
        });
        connection.query(sql3, ids, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            matching_cmplt = result;
        });
        connection.query(sql4, ids, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            res.render('profile', { 'id': id, userinfo: userinfo, userscore: userscore, intrd: intrd, matching: matching, matching_cmplt: matching_cmplt, search: result });
        });
    }

});

router.get('/:user_id', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var id = req.params.user_id;

        var sql1 = 'select * from user where user_id = ?';
        var sql2 = 'select * from request where request_code in (select request_code from matching where (requester_id = ? or bureumi_id = ?) and matching_progress != \'완료\')';
        var sql3 = 'select * from request where request_code in (select request_code from matching where (requester_id = ? or bureumi_id = ?) and matching_progress = \'완료\')';
        var sql4 = 'select * from request where writer_id = ? and request_code not in (select request_code from matching where requester_id = ?) order by length(request_code) desc, request_code desc';
        var sql5 = 'select review_score from review where user_id = ?';
        var sql6 = 'select * from introduce where user_id = ?'
        var userinfo;
        var userscore = 0;
        var matching;
        var matching_cmplt;
        var intrd = null;
        var ids = [id, id]

        connection.query(sql1, id, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            userinfo = result;
        });
        connection.query(sql5, id, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            result.forEach(element => {
                userscore = userscore + element.review_score;
            });
            userscore = Math.round((userscore / result.length) * 100) / 100;
        });
        connection.query(sql6, id, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            if(result) intrd = result[0];
        });
        connection.query(sql2, ids, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            matching = result;
        });
        connection.query(sql3, ids, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            matching_cmplt = result;
        });
        connection.query(sql4, ids, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            res.render('profile_content', { id: id, userinfo: userinfo, userscore: userscore, intrd: intrd, matching: matching, matching_cmplt: matching_cmplt, search: result });
        });
    }
});

router.post('/intrd', function (req, res) {
    var id = req.user;
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var sql;
        var datas;
        if (introduce) {
            sql = 'update introduce set content = ? where user_id = ?';
            datas = [req.body.content, id]
        } else {
            sql = 'insert into introduce values (?, ?)';
            datas = [id, req.body.content]
        }
        
        connection.query(sql, datas, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            res.redirect('/profile');
        });
    }
});

module.exports = router;