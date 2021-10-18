var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');
var moment = require('moment');
var now = moment().format('YYYY-MM-DD HH:mm:ss');
var ncode;

router.get('/notice_write', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var sql = 'select notice_code from notice order by length(notice_code) desc, notice_code desc limit 1';
        connection.query(sql, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            ncode = result[0].notice_code;
            ncode = parseInt(ncode.substr(1)) + 1;
        })

        res.render('admin/admin_notice_write', { 'id': id });
    }
});

router.post('/notice_write/data', function (req, res) {
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var code = ncode;
        var id = 'admin' //admin ID 수정 필요
        var title = req.body.title;
        var content = req.body.content;
        var date = now;
        var datas = [code, id, title, content, date];
        var sql = 'insert into notice values (concat(\'n\', lpad(?, 3, \'0\')), ?, ?, ?, ?)';

        if (code) {
            connection.query(sql, datas, function (err, result) {
                if (err) { console.error(err); res.redirect('/error/connect') }
                res.redirect('/admin/notice');
            });
        }
    }
});

module.exports = router;