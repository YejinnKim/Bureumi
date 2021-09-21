var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');
var moment = require('moment');
const { connect } = require('../connection');
var bcode;

router.get('/', function (req, res) {
    var id = req.user;
    if(!id) res.render('login');
    
    var sql = 'select * from bureumi where user_id = ?';
    
    connection.query(sql, id, function(err, result) {
        if (err) throw err;
        if (result.length == 0) {
            result = [{"state" : "미인증", "bureumi_code" : "X"}]
        }
        res.render('bureumi_auth', {value : result});
    });
});

router.get('/form', function (req, res) {
    var id = req.user;
    var sql = '(select bureumi_code from bureumi) order by length(bureumi_code) desc, bureumi_code desc limit 1';
    
    connection.query(sql, function(err, result) {
        if (err) throw err;
        bcode = result[0].bureumi_code;
        bcode = parseInt(bcode.substr(1)) + 1;
    })

    res.render('bureumi_auth_form', {'id' : id});
});

router.post('/data', function(req, res) {
    var code = bcode;
    var id = req.user;
    var gender = req.body.gender;
    var job = req.body.job;
    var state = '진행중';

    var datas1 = [gender, job, id];
    var sql1 = 'update user set user_gender=?, user_job=? where user_id=?'
    var datas2 = [code, id, state];
    var sql2 = 'insert into bureumi values (concat(\'b\', lpad(?, 3, \'0\')), ?, ?)';

    if (code) {
        connection.query(sql1, datas1, function(err, result) {
            if(err) throw err;
        });

        connection.query(sql2, datas2, function(err, result) {
            if (err) throw err;
            res.redirect('/bureumi_auth/result');
        });
    }
});

router.get('/result', function (req, res) {
    var id = req.user;
    var sql = 'select * from user where user_id = ?';

    connection.query(sql, id, function(err, result) {
        if (err) throw err;
        res.render('bureumi_auth_result', {value : result, moment : moment});
    })
});

module.exports = router;