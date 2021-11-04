const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const moment = require('moment');
const logger = require('../../config/logger');

router.get('/notice', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var sql = 'select * from notice order by length(notice_code) desc, notice_code desc';
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            res.render('admin/admin_notice', { 'id': id, notice: result, moment: moment });
        });
    }
});

module.exports = router;