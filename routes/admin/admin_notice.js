var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');
var moment = require('moment');

router.get('/notice', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var sql = 'select * from notice order by length(notice_code) desc, notice_code desc';
        connection.query(sql, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            res.render('admin/admin_notice', { 'id': id, notice: result, moment: moment });
        });
    }
});

module.exports = router;