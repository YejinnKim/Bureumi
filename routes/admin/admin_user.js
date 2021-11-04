const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const moment = require('moment');
const logger = require('../../config/logger');

router.get('/userinfo', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var sql = 'select * from user order by length(user_code) desc, user_code desc';
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            res.render('admin/admin_userinfo', { 'id': id, user: result, moment: moment });
        });
    }
});

router.get('/userinfo/search', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var level =  req.query.level;
        var searchtext = req.query.searchtext;
        var sql = 'select * from user where '; 
        var datas = [];
        if (level) {
            datas.push(level)
            sql += 'user_level in (?) '
        }
        if(level && searchtext) sql += 'and '
        if (searchtext) {
            datas.push('%' + searchtext + '%')
            sql += 'user_id like ? '
        }
        sql += 'order by length(user_code) desc, user_code desc'

        connection.query(sql, datas, function (err, result) {
            if (err) { 
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err); 
                res.redirect('/error/connect') 
            }
            res.render('admin/admin_userinfo', { 'id': id, user: result, moment: moment });
        });
    }
});

router.get('/userinfo/:user_id', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var uid = req.params.user_id;
        var sql1 = 'select * from bureumi where user_id = ?';
        var sql2 = 'select * from user where user_id = ?';
        var sql3 = 'select review_score from review where user_id = ?'
        var binfo;
        var score = 0;

        connection.query(sql1, uid, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            binfo = result;
        });
        connection.query(sql3, uid, function (err, result) {
            if (err) { 
                console.error(err); 
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect') 
            }
            result.forEach(element => {
                score = score + element.review_score;
            });
            score = Math.round((score / result.length) * 100) / 100;
            if(!score) score = '후기없음'
        });
        connection.query(sql2, uid, function (err, result) {

            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
           res.render('admin/admin_userinfo_content', { 'id': id, user: result[0], bureumi: binfo[0], score : score, moment: moment });

        });
    }
});

module.exports = router;