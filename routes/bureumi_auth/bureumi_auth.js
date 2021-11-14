const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const moment = require('moment');
const { connect } = require('../connection');
const logger = require('../../config/logger');

var bcode;


router.get('/', function (req, res) {
    var id = req.user;
    if (!id) res.render('login');
    else {
        var sql = 'select * from bureumi where user_id = ?';

        connection.query(sql, id, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            if (result.length == 0) {
                result = [{ "state": "미인증", "bureumi_code": "X" }]
            }
            res.render('bureumi_auth', { id: id, value: result });
        });
    }
});

router.get('/form', function (req, res) {
    var id = req.user;
    if (!id) res.render('login');
    else {
        var sql = '(select bureumi_code from bureumi) order by length(bureumi_code) desc, bureumi_code desc limit 1';

        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            bcode = result[0].bureumi_code;
            bcode = parseInt(bcode.substr(1)) + 1;
        })

        res.render('bureumi_auth_form', { 'id': id });
    }
});

router.post('/data', function (req, res) {
    var id = req.user;
    if (!id) res.render('login');
    else {
        var code = bcode;
        var gender = req.body.gender;
        var job = req.body.job;
        var state = '진행중';

        var datas1 = [gender, job, id];
        var sql1 = 'update user set user_gender=?, user_job=? where user_id=?'
        var datas2 = [code, id, state];
        var sql2 = 'insert into bureumi values (concat(\'b\', lpad(?, 3, \'0\')), ?, ?)';

        if (code) {
            connection.query(sql1, datas1, function (err, result) {
                if (err) {
                    console.error(err);
                    logger.error('경로 : ' + __dirname + '  message: ' + err);
                    res.redirect('/error/connect')
                }
            });

            connection.query(sql2, datas2, function (err, result) {
                if (err) {
                    console.error(err);
                    logger.error('경로 : ' + __dirname + '  message: ' + err);
                    res.redirect('/error/connect')
                }
                res.redirect('/bureumi_auth/result');
            });
        }
    }
});

router.get('/result', function (req, res) {
    var id = req.user;
    if (!id) res.render('login');
    else {
        var sql = 'select * from user where user_id = ?';

        connection.query(sql, id, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            logger.info('<BUREUMI_AUTH-bureumi proposal> [id] : ' + id);
            res.render('bureumi_auth_result', { id: id, value: result, moment: moment });
        })
    }
});

module.exports = router;