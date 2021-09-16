var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');
var moment = require('moment');

router.get('/userinfo', function (req, res) {
    var id = req.user;
    if(id != 'admin') res.redirect('/logout'); //관리자만 접근 가능

    var sql = 'select * from user order by length(user_code) desc, user_code desc';
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.render('admin/admin_userinfo', {'id' : id, user : result, moment : moment});
    });
});

router.get('/userinfo/:user_id', function (req, res) {
    var id = req.user;
    if(id != 'admin') res.redirect('/logout'); //관리자만 접근 가능

    var uid = req.params.user_id;
    var sql1 = 'select * from bureumi where user_id = ?';
    var sql2 = 'select * from user where user_id = ?';
    var binfo;

    connection.query(sql1, uid, function(err, result) {
        if(err) throw err;
        binfo = result;
    });

    connection.query(sql2, uid, function(err, result) {
        if (err) throw err;
        res.render('admin/admin_userinfo_content', {'id' : id, user : result[0], bureumi : binfo[0], moment : moment});
    });
});

module.exports = router;