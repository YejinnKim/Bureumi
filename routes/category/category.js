var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../../join/connection');

router.get('/:category', function (req, res) {
    var category = req.params.category;
    var sql = 'select * from request where category = ? order by length(request_code) desc, request_code desc';

    connection.query(sql, category, function(err, result) {
        if (err) throw err;
        res.render('category', {search : result});
    });
});

module.exports = router;