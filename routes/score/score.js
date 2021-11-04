const express = require('express');
const router = express.Router();
const connection = require('../connection');
const path = require('path');
const logger = require('../../config/logger');
var userid;

router.get('/:matching_code', async (req, res) => {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var id = req.user;
        var mcode = req.params.matching_code;
        var sql = 'select requester_id, bureumi_id from matching where matching_code=? and (requester_id=? or bureumi_id=?)';
        var datas = [mcode, id, id];


        await connection.query(sql, datas, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            userid = result[0];
            if (userid == undefined) res.redirect('/error/connect')
            else {
                if (userid.requester_id == id) userid = userid.bureumi_id;
                else userid = userid.requester_id;
                res.render('score', { id: id, mcode: mcode });
            }
        });
    }
});

router.post('/:matching_code/data', (req, res) => {
    var id = req.user;
    var mcode = req.params.matching_code;
    var score = req.body.rating;
    score = score[score.length - 1];
    var content = req.body.content;
    var datas = [mcode, id, score, content, userid];
    var sql = 'insert into review values (?, ?, ?, ?, ?)';


    connection.query(sql, datas, function (err, result) {
        if (err) {
            console.error(err);
            logger.error('경로 : ' + __dirname + '  message: ' + err);
            res.redirect('/error/connect')
        }
        else {
            logger.info('<SCORE-review write> [maching code] : ' + mcode + ' [id] : ' + id);
            res.redirect('/review_list');
        }
    });
});

module.exports = router;