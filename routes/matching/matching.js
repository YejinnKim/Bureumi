const express = require('express');
const router = express.Router();
const connection = require('../connection');
const path = require('path');
const logger = require('../../config/logger');

var mcode;
var requester;

router.get('/:request_code', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var rcode = req.params.request_code;
        var sql1 = 'select matching_code from matching order by length(matching_code) desc, matching_code desc limit 1';
        var sql2 = 'select writer_id from request where request_code = ?'

        connection.query(sql1, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
            mcode = result[0].matching_code;
            mcode = parseInt(mcode.substr(1)) + 1;
        });
        connection.query(sql2, rcode, function (err, result) {
            if (err) logger.error('경로 : ' + __dirname + '  message: ' + err);
    
            requester = result[0].writer_id;

            if (req.session.user_info.user_level != '부름이')
                res.redirect('/bureumi_auth');
            else
                res.redirect(rcode + '/data');
        });
    }
});

router.get('/:request_code/data', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var code = mcode;
        var rcode = req.params.request_code;
        var rid = requester;
        var id = req.user;
        var date = '2021-09-17';
        var progress = '매칭요청';
        var chat = null;
        var datas = [code, rcode, rid, id, date, progress, chat];
        var sql2 = 'insert into matching values (concat(\'m\', lpad(?, 3, \'0\')), ?, ?, ?, ?, ?, ?)';

        connection.query(sql2, datas, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            else {
                logger.info('<MATCHING-matching propose> [matching code] : ' + code + ' [request code] : ' + rcode + ' [requester id] : ' + rid + ' [bureumi id] : ' + id);
                res.redirect('/request/' + rcode);
            }
        });
    }
});

router.get('/:request_code/accept', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var sql = 'update matching set matching_progress = ? where request_code = ?';
        var progress = '진행중';
        var rcode = req.params.request_code;
        var datas = [progress, rcode];

        connection.query(sql, datas, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect');
            }
            else {
                logger.info('<MATCHING-matching success> [request code] : ' + rcode);
                res.redirect('/request/' + rcode);
            }
        });
    }
});

router.get('/:request_code/accept_refusal', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var sql = 'delete from matching where request_code = ?';
        var rcode = req.params.request_code;

        connection.query(sql, rcode, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err); res.redirect('/error/connect')
            }
            else {
                logger.info('<MATCHING-matching refuse> [request code] : ' + rcode);
                res.redirect('/request/' + rcode);
            }
        });
    }
});

router.get('/:request_code/complete_req', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var sql = 'update matching set matching_progress = ? where request_code = ?';
        var progress = '완료요청';
        var rcode = req.params.request_code;
        var datas = [progress, rcode];

        connection.query(sql, datas, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err); 
                res.redirect('/error/connect')
            }
            else {
                logger.info('<MATCHING-confirm request> [request id] : ' + rcode);
                res.redirect('/request/' + rcode);
            }
        });
    }
});

router.get('/:request_code/complete', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var sql = 'update matching set matching_progress = ? where request_code = ?';
        var progress = '완료';
        var rcode = req.params.request_code;
        var datas = [progress, rcode];

        connection.query(sql, datas, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err); 
                res.redirect('/error/connect');
            }
            else {
                logger.info('<MATCHING-all complete> [request id] : ' + rcode);
                res.redirect('/request/' + rcode);
            }
        });
    }
});

module.exports = router;