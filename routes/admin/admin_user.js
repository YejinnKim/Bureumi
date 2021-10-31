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

router.get('/userinfo/:user_id', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var uid = req.params.user_id;
        var sql1 = 'select * from bureumi where user_id = ?';
        var sql2 = 'select * from user where user_id = ?';
        var binfo;

        connection.query(sql1, uid, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            binfo = result;
        });

        connection.query(sql2, uid, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            res.render('admin/admin_userinfo_content', { 'id': id, user: result[0], bureumi: binfo[0], moment: moment });
        });
    }
});

module.exports = router;