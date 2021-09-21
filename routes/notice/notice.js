var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');

router.get('/', function (req, res) {
    var id = req.user;
    if(!id) res.render('login');
    
    var sql = 'select * from notice order by length(notice_code) desc, notice_code desc';
    
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.render('notice', {notice : result});
    });
});

module.exports = router;