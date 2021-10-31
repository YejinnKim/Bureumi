const express = require('express');
const router = express.Router();
const connection = require('../connection');
const path = require('path');
const logger = require('../../config/logger');

router.get('/:request_code', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var id = req.user;
        var rcode = req.params.request_code;
        var mvalue = null;
        var matching;
        var sql1 = 'select * from matching where request_code = ?';
        var sql2 = 'select * from request where request_code = ?';
        var datas = [rcode, id];

        connection.query(sql1, datas, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            if (result != '') mvalue = 1;
            matching = result;
        });

        connection.query(sql2, rcode, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            logger.info('<CHATTING-chatting matching> [request code] : ' + rcode + ' [id] : ' + id);
            res.render('chatting', { 'id': id, request: result[0], matching: matching[0], mvalue: mvalue });
        });
    }
});

module.exports = router;