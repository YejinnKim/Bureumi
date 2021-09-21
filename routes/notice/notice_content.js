var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');

router.get('/:notice_code', function (req, res) {
    var ncode = req.params.notice_code;
    var sql = 'select * from notice where notice_code = ?';

    connection.query(sql, ncode, function(err, result) {
        if (err) throw err;
        res.render('notice_content', {value : result[0]});
    });
});

module.exports = router;