var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');
var moment = require('moment');

router.get('/request', function (req, res) {
    var id = req.user;
    if(id != 'admin') res.redirect('/logout'); //관리자만 접근 가능

    var sql = 'select * from request order by length(request_code) desc, request_code desc';
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.render('admin/admin_request', {'id' : id, request : result, moment : moment});
    });
});

module.exports = router;