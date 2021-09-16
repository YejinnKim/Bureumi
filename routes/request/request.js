var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../../join/connection');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var now = moment().format('YYYY-MM-DD HH:mm:ss');
var rcode;

router.get('/', function (req, res) {
    var sql = 'select request_code from request order by length(request_code) desc, request_code desc limit 1';
    connection.query(sql, function(err, result) {
        if (err) throw err;
        rcode = result[0].request_code;
        rcode = parseInt(rcode.substr(1)) + 1;
    })

    res.render('request');
});

router.post('/data', function(req, res) {
    var code = rcode;
    var id = req.session.user_info.user_id;
    var category = req.body.category;
    var title = req.body.title;
    var content = req.body.content;
    var price = req.body.price;
    var date = now;
    var attach = null; //첨부파일 기능, 나중에 추가
    var datas = [code, id, category, title, content, price, date, attach];
    var sql = 'insert into request values (concat(\'r\', lpad(?, 3, \'0\')), ?, ?, ?, ?, ?, ?, ?)';

    if (code) {
        connection.query(sql, datas, function(err, result) {
            if (err) throw err;
            res.redirect('/search');
        });
    }
    
});

module.exports = router;