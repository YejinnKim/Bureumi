var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/:matching_code/:writer', function(req, res){
    var id = req.user;
    var mcode = req.params.matching_code;
    var writer = req.params.writer;
    var request;
    var datas = [mcode, writer];
    var sql1 = 'select * from request where request_code in (select request_code from matching where matching_code=?)';
    var sql2 = 'select * from review where matching_code=? and review_writer=?';

    connection.query(sql1, mcode, function(err, result) {
        if (err) throw err;
        request = result;
    });
    connection.query(sql2, datas, function(err, result) {
        if (err) throw err;
        res.render('review_content', {id : id, request: request[0], value : result[0]});
    });
});

module.exports = router;