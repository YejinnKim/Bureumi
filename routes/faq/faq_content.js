var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/content/:faq_code', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var fcode = req.params.faq_code;
        var sql = 'select * from faq where faq_code = ?';

        connection.query(sql, fcode, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            res.render('faq_content', { value: result[0] });
        });
    }
});

module.exports = router;