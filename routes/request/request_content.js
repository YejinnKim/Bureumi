const express = require('express');
const router = express.Router();
const moment = require('moment');
const connection = require('../connection');
const path = require('path');
const logger = require('../../config/logger');

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
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            if (result != '') mvalue = 1;
            matching = result;
        });
        connection.query(sql2, rcode, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            request = result;
        });
        connection.query(sql4, rcode, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            img = result;
        });
        connection.query(sql3, rcode, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
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
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            else res.render('request_update', { 'id': id, value: result[0] });
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
        var latitude = req.session.user_info.addressLat;
        var longitude = req.session.user_info.addressLon;
        var address = req.session.user_info.user_address;
        var datas = [title, content, price,latitude,longitude,address, rcode];
        var sql = 'update request set request_title=?, request_content=?, request_price=?, latitude = ?, longitude=?, address=? where request_code=?';

        connection.query(sql, datas, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            else {
                logger.info('<REQUEST-request update> [request code]: ' + rcode + ' [id] : ' + req.session.user_info.user_id);
                res.redirect('/request/' + rcode);
            }
        });
    }
});

router.get('/:request_code/delete', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var rcode = req.params.request_code;
        var sql = 'delete from request where request_code = ?'

        connection.query(sql, rcode, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            else {
                logger.info('<REQUEST-request delete> [request code] : ' + rcode + ' [id] : ' + req.session.user_info.user_id);
                res.redirect('/profile');
            }
        });
    }
});

module.exports = router;