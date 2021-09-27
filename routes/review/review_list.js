var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/', function(req, res){
    var id = req.user;
    var sql = 'select * from request where request_code in (select request_code from matching where matching_code in (select matching_code from review where review_writer = ?))';

    connection.query(sql, id, function(err, result) {
        if (err) throw err;
        res.render('review_list', {id : id, value : result});
    });
});

module.exports = router;