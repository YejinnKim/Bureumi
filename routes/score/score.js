var express = require('express');
var router = express.Router();
var connection = require('../connection');
var userid;

router.get('/:matching_code', (req, res) => {
    var id = req.user;
    var mcode = req.params.matching_code;
    var sql = 'select requester_id, bureumi_id from matching where matching_code=? and (requester_id=? or bureumi_id=?)';
    var datas = [mcode, id, id];

    connection.query(sql, datas, function(err, result) {
        if (err) throw err;
        userid = result[0];
        if(userid.requester_id == id) userid = userid.bureumi_id;
        else userid = userid.requester_id;
        res.render('score', {id : id, mcode : mcode});
    });
});

router.post('/:matching_code/data', (req, res) => {
    var id = req.user;
    var mcode = req.params.matching_code;
    var score = req.body.rating;
    score = score[score.length-1];
    var content = req.body.content;
    var datas = [mcode, id, score, content, userid];
    var sql = 'insert into review values (?, ?, ?, ?, ?)';

    connection.query(sql, datas, function(err, result) {
        if (err) throw err;
        res.redirect('/review_list');
    });
});

module.exports = router;