
const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require('../connection');


router.get('/matching', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var sql = 'select m.*, r.request_title from matching as m inner join request as r on m.request_code = r.request_code;';
        connection.query(sql, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            res.render('admin/admin_matching', { 'id': id, matching: result, moment : moment });
        });
    }
});

module.exports = router;