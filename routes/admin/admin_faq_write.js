var express = require('express');
var router = express.Router();
var connection = require('../connection');
var fcode;

router.get('/faq_write/:faq_code', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        fcode = req.params.faq_code;
        var sql = 'select * from faq where faq_code = ?';

        connection.query(sql, fcode, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            res.render('admin/admin_faq_write', { id : id, faq : result[0] });
        });
    }
});

router.post('/faq_write/data', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var answer = req.body.answer;
        var datas = [answer, fcode];
        var sql = 'update faq set answer = ? where faq_code = ?';

        connection.query(sql, datas, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            res.redirect('/admin/faq');
        });
    }
});

module.exports = router;