const express = require('express');
const router = express.Router();
const connection = require('../connection');
const path = require('path');
const logger = require('../../config/logger');



router.get('/:matching_code/:writer', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var id = req.user;
        var mcode = req.params.matching_code;
        var writer = req.params.writer;
        var request;
        var datas = [mcode, writer];
        var sql1 = 'select * from request where request_code in (select request_code from matching where matching_code=?)';
        var sql2 = 'select * from review where matching_code=? and review_writer=?';

        connection.query(sql1, mcode, function (err, result) {
            if (err) {console.error(err); logger.error('경로 : '+__dirname +'  message: '+err); res.redirect('/error/connect')}
            request = result;
        });
        connection.query(sql2, datas, function (err, result) {
            if (err) {console.error(err); logger.error('경로 : '+__dirname +'  message: '+err); res.redirect('/error/connect')}
            res.render('review_content', { id: id, request: request[0], value: result[0] });
        });
    }
});

module.exports = router;