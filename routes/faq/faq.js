var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/', function (req, res) {
    var id = req.user;
    if (!id) { res.render('login') }
    else {
        var sql = 'select * from faq order by length(faq_code) desc, faq_code desc';

        connection.query(sql, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect') }
            res.render('faq', { faq: result });
        });
    }
});

module.exports = router;