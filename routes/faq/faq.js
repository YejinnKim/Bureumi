const express = require('express');
const router = express.Router();
const connection = require('../connection');
const path = require('path');
const logger = require('../../config/logger');


router.get('/', function (req, res) {
    var id = req.user;
    if (!id) { res.render('login') }
    else {
        var sql = 'select * from faq order by length(faq_code) desc, faq_code desc';

        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            res.render('faq', { id: id, faq: result });
        });
    }
});

module.exports = router;