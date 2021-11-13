const express = require('express');
const router = express.Router();
const connection = require('../connection');

// 최신 글 제목 10개 추출
router.get('/', function (req, res, next) {
    var text = '';
    var sql1 = 'truncate recommend';
    var sql2 = 'select request_title from request order by length(request_code) desc, request_code desc limit 10';
    
    connection.query(sql1, function(err, result) {
    })
    connection.query(sql2, function (err, result) {
        result.forEach(element => {
            text += element.request_title + ' ';
        });
        global.text = text;
        next();
    })
});

module.exports = router;