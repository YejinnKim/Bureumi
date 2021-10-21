var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');

var bureumi = require('./admin_bureumi');
var user = require('./admin_user');
var request = require('./admin_request');
var notice = require('./admin_notice');
var notice_write = require('./admin_notice_write');
var score = require('./admin_score');
var matching = require('./admin_matching');
var faq = require('./admin_faq');
var faq_write = require('./admin_faq_write');

//moment(data.date_birth).format('YYYY-MM-DD') 날짜 형식 지정

router.get('/', function (req, res) {
    var id = req.user;
    if (id != 'admin') { //관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var sql1 = 'select * from user order by length(user_code) desc, user_code desc limit 3';
        var sql2 = 'select * from bureumi order by length(bureumi_code) desc, bureumi_code desc limit 3';
        var user;

        connection.query(sql1, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            user = result;
        });
        connection.query(sql2, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            res.render('admin/admin_index', { 'id': id, user: user, bureumi: result });
        });
    }

});

router.use(bureumi);
router.use(user);
router.use(request);
router.use(notice);
router.use(notice_write);
router.use(score);
router.use(matching);
router.use(faq);
router.use(faq_write);

module.exports = router;