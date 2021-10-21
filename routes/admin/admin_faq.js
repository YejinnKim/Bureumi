var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/faq', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var sql = 'select * from faq order by length(faq_code) desc, faq_code desc';
        connection.query(sql, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            res.render('admin/admin_faq', { 'id': id, faq: result });
        });
    }
});

module.exports = router;