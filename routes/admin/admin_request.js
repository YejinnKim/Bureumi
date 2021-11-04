const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const moment = require('moment');
const logger = require('../../config/logger');

router.get('/request', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var sql = 'select * from request order by length(request_code) desc, request_code desc';
        connection.query(sql, function (err, result) {
            if (err) { 
                console.error(err); 
                logger.error('경로 : '+__dirname +'  message: '+err); 
                res.redirect('/error/connect') 
            }
            res.render('admin/admin_request', { 'id': id, request: result, moment: moment });
        });
    }
});

module.exports = router;