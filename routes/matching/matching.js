var express = require('express');
var router = express.Router();
var connection = require('../connection');
var mcode;
var requester;

router.get('/:request_code', function (req, res) {
    var rcode = req.params.request_code;
    var sql1 = 'select matching_code from matching order by length(matching_code) desc, matching_code desc limit 1';
    var sql2 = 'select writer_id from request where request_code = ?'

    connection.query(sql1, function(err, result) {
        if (err) throw err;
        mcode = result[0].matching_code;
        mcode = parseInt(mcode.substr(1)) + 1;
    });
    connection.query(sql2, rcode, function(err, result) {
        if (err) throw err;
        requester = result[0].writer_id;

        if (req.session.user_info.user_level != '부름이')
            res.redirect('/bureumi_auth');
        else
            res.redirect(rcode + '/data');
    });
});

router.get('/:request_code/data', function (req, res) {
    var code = mcode;
    var rcode = req.params.request_code;
    var rid = requester;
    var id = req.user;
    var date = '2021-09-17';
    var progress = '매칭요청';
    var chat = null;
    var datas = [code, rcode, rid, id, date, progress, chat];
    var sql2 = 'insert into matching values (concat(\'m\', lpad(?, 3, \'0\')), ?, ?, ?, ?, ?, ?)';

    connection.query(sql2, datas, function(err, result) {
        if (err) throw err;
        res.redirect('/request/' + rcode);
    });
});

router.get('/:request_code/accept', function (req, res) {
    var sql = 'update matching set matching_progress = ? where request_code = ?';
    var progress = '진행중';
    var rcode = req.params.request_code;
    var datas = [progress, rcode];
    
    connection.query(sql, datas, function(err, result) {
        if (err) throw err;
        res.redirect('/request/' + rcode);
    });
});

router.get('/:request_code/accept_refusal', function (req, res) {
    var sql = 'delete from matching where request_code = ?';
    var rcode = req.params.request_code;
    
    connection.query(sql, rcode, function(err, result) {
        if (err) throw err;
        res.redirect('/request/' + rcode);
    });
});

router.get('/:request_code/complete_req', function (req, res) {
    var sql = 'update matching set matching_progress = ? where request_code = ?';
    var progress = '완료요청';
    var rcode = req.params.request_code;
    var datas = [progress, rcode];
    
    connection.query(sql, datas, function(err, result) {
        if (err) throw err;
        res.redirect('/request/' + rcode);
    });
});

router.get('/:request_code/complete', function (req, res) {
    var sql = 'update matching set matching_progress = ? where request_code = ?';
    var progress = '완료';
    var rcode = req.params.request_code;
    var datas = [progress, rcode];
    
    connection.query(sql, datas, function(err, result) {
        if (err) throw err;
        res.redirect('/request/' + rcode);
    });
});

module.exports = router;