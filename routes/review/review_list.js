var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/', function(req, res){
    var id = req.user;
    var userscore = 0;
    var sql1 = 'select review_score from review where user_id = ?';
    var sql2 = 'select * from request where request_code in (select request_code from matching where matching_code in (select matching_code from review where review_writer = ?))';

    connection.query(sql1, id, function(err, result) {
        if (err) throw err;
        result.forEach(element => {
            userscore = userscore + element.review_score;
        });
        userscore = Math.round((userscore / result.length) * 100) / 100;
    });
    connection.query(sql2, id, function(err, result) {
        if (err) throw err;
        res.render('review_list', {id : id, userscore : userscore, value : result});
    });
});

module.exports = router;