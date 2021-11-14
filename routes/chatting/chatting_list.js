const express = require('express');
const router = express.Router();
const connection = require('../connection');
const path = require('path');
const logger = require('../../config/logger');

router.get('/:user_id', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var sql = 'select distinct request_code, writer_id, category, request_title, request_price, room from request right join chatting on request_code = left(room, 4) where request_code in (select distinct left(room, 4) from chatting where uid = ? or left(room,4) in (select request_code from request where writer_id = ?))'
        var id =  req.user;
        var request = null;

        connection.query(sql, [id, id], function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            if(result) request = result;
            res.render('chatting_list', { request: request, id: id });
        });
    }
});

module.exports = router;