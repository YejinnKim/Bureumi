var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');

router.get('/', function (req, res) {
    var id = req.user;
    if(!id) res.render('login');
    
    var sql = 'select * from request order by length(request_code) desc, request_code desc limit 4';
    
    connection.query(sql, function(err, result) {
        if (err) throw err;
        res.render('search', {search : result});
    });
});

module.exports = router;