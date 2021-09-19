var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');

router.get('/bureumiinfo', function (req, res) {
    var id = req.user;
    if(id != 'admin') res.redirect('/logout'); //관리자만 접근 가능

    var sql = 'select * from bureumi order by length(bureumi_code) desc, bureumi_code desc';
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.render('admin/admin_bureumiinfo', {'id' : id, bureumi : result});
    });
});

router.get('/bureumi_approval/:user_id', function(req, res) {
    var userid = req.params.user_id;
    var sql1 = 'update bureumi set state=\'승인완료\' where user_id=?';
    var sql2 = 'update user set user_level=\'부름이\' where user_id=?';

    connection.query(sql1, userid, function(err, result) {
        if (err) throw err;
        
    });
    connection.query(sql2, userid, function(err, result) {
        if (err) throw err;
        res.redirect('/admin/bureumiinfo');
    });
    
}); 

module.exports = router;