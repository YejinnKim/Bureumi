const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const logger = require('../../config/logger');

router.get('/', function (req, res) {
    var id = req.user;
    if (!id) res.render('login');

    var sql = 'select * from notice order by length(notice_code) desc, notice_code desc';

    connection.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            logger.error('경로 : ' + __dirname + '  message: ' + err);
            res.redirect('/error/connect')
        }
        res.render('notice', { id: id, notice: result });
    });
});

module.exports = router;