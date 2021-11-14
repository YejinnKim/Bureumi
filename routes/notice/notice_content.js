const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const logger = require('../../config/logger');

router.get('/:notice_code', function (req, res) {
    var ncode = req.params.notice_code;
    var id = req.user;
    var sql = 'select * from notice where notice_code = ?';

    connection.query(sql, ncode, function (err, result) {
        if (err) {
            console.error(err);
            logger.error('경로 : ' + __dirname + '  message: ' + err);
            res.redirect('/error/connect');
        }
        res.render('notice_content', { id: id, value: result[0] });
    });
});

module.exports = router;