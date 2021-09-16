var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');

router.get('/:request_code', function (req, res) {
    var id = req.user;
    var rcode = req.params.request_code;
    var sql = 'select * from request where request_code = ?';

    connection.query(sql, rcode, function(err, result) {
        if (err) throw err;
        res.render('request_content', {'id' : id, value : result[0]});
    });
});

router.get('/:request_code/update', function(req, res) {
    var id = req.user;
    var rcode = req.params.request_code;
    var sql = 'select * from request where request_code = ?';

    connection.query(sql, rcode, function(err, result) {
        if (err) throw err;
        res.render('request', {'id' : id, value : result[0]});
    });
});

router.get('/:request_code/delete', function(req, res) {
    var rcode = req.params.request_code;
    var sql = 'delete from request where request_code = ?'

    connection.query(sql, rcode, function(err, result) {
        if (err) throw err;
        res.redirect('/profile');
    });
});

module.exports = router;