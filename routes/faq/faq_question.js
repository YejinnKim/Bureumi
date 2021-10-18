var express = require('express');
var router = express.Router();
var connection = require('../connection');
var fcode;

router.get('/question', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var sql = 'select faq_code from faq order by length(faq_code) desc, faq_code desc limit 1';
        connection.query(sql, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            fcode = result[0].faq_code;
            fcode = parseInt(fcode.substr(1)) + 1;
        });

        res.render('faq_question');
    }
});

router.post('/question/data', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var code = fcode;
        var question = req.body.question;
        var datas = [code, question, null];
        var sql = 'insert into faq values (concat(\'f\', lpad(?, 3, \'0\')), ?, ?)';

        if (code) {
            connection.query(sql, datas, function (err, result) {
                if (err) { console.error(err); res.redirect('/error/connect') }
                res.redirect('/faq')
            });
        }
    }
});

module.exports = router;