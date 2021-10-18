var express = require('express');
var router = express.Router();
var moment = require('moment');
var connection = require('../connection');

router.get('/:request_code', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var id = req.user;
        var rcode = req.params.request_code;
        var mvalue = null;
        var matching;
        var request;
        var img;
        var sql1 = 'select * from matching where request_code = ?';
        var sql2 = 'select * from request where request_code = ?';
        var sql3 = 'select * from review where matching_code in (select matching_code from matching where request_code = ?)';
        var sql4 = 'select image from user where user_id in (select writer_id from request where request_code = ?)';

        connection.query(sql1, rcode, function (err, result) {
            if (err) {console.error(err); res.redirect('/error/connect')}
            if (result != '') mvalue = 1;
            matching = result;
        });
        connection.query(sql2, rcode, function (err, result) {
            if (err) {console.error(err); res.redirect('/error/connect')}
            request = result;
        });
        connection.query(sql4, rcode, function (err, result) {
            if (err) {console.error(err); res.redirect('/error/connect')}
            img = result;
        });
        connection.query(sql3, rcode, function (err, result) {
            if (err) {console.error(err); res.redirect('/error/connect')}
            var i = result.length;
            res.render('request_content', { 'id': id, review: result, request: request[0], matching: matching[0], mvalue: mvalue, i: i, img: img[0].image, moment: moment });
        });
    }
});

router.get('/:request_code/update', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var id = req.user;
        var rcode = req.params.request_code;
        var sql = 'select * from request where request_code = ?';

        connection.query(sql, rcode, function (err, result) {
            if (err) {console.error(err); res.redirect('/error/connect')}
            res.render('request_update', { 'id': id, value: result[0] });
        });
    }
});

router.post('/:request_code/update/data', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var rcode = req.params.request_code;
        var title = req.body.title;
        var content = req.body.content;
        var price = req.body.price;
        var datas = [title, content, price, rcode];
        var sql = 'update request set request_title=?, request_content=?, request_price=? where request_code=?';

        connection.query(sql, datas, function (err, result) {
            if (err) {console.error(err); res.redirect('/error/connect')}
            res.redirect('/request/' + rcode);
        });
    }
});

router.get('/:request_code/delete', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var rcode = req.params.request_code;
        var sql = 'delete from request where request_code = ?'

        connection.query(sql, rcode, function (err, result) {
            if (err) {console.error(err); res.redirect('/error/connect')}
            res.redirect('/profile');
        });
    }
});

module.exports = router;