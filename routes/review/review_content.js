var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/:matching_code/:writer', function(req, res){
    var id = req.user;
    var mcode = req.params.matching_code;
    var writer = req.params.writer;
    var datas = [mcode, writer];
    var sql = 'select * from review where matching_code=? and review_writer=?';

    connection.query(sql, datas, function(err, result) {
        if (err) throw err;
        res.render('review_content', {id : id, value : result[0]});
    });
});

module.exports = router;