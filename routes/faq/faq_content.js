var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/content/:faq_code', function (req, res) {
    var fcode = req.params.faq_code;
    var sql = 'select * from faq where faq_code = ?';

    connection.query(sql, fcode, function(err, result) {
        if (err) throw err;
        res.render('faq_content', {value : result[0]});
    });
});

module.exports = router;