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

router.get('/bureumi_approval/:bureumi_code', function(req, res) {
    var bcode = req.params.bureumi_code;
    var userid;
    var sql1 = 'select user_id from bureumi where bureumi_code=?';
    var sql2 = 'update bureumi set state=\'승인완료\' where bureumi_code=?';
    var sql3 = 'update user set user_level=\'부름이\' where user_id=?';

    connection.query(sql1, bcode, function(err, result) {
        if (err) throw err;
        userid = result[0].user_id;
    });
    connection.query(sql2, bcode, function(err, result) {
        if (err) throw err;
        res.redirect('/admin/bureumiinfo'); /* 밑에 수정 후 지우기 */
    });
    /* sql3 오류남, 수정 필요 (userid 파라미터 못받는듯, ? syntax 에러)*/
    /* connection.query(sql3, userid, function(err, result) {
        if (err) throw err;
        res.redirect('/admin/bureumiinfo');
    }); */
}); 

module.exports = router;