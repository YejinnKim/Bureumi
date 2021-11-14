const express = require('express');
const router = express.Router();
const connection = require('../connection');
const path = require('path');
const logger = require('../../config/logger');

router.get('/content/:faq_code', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var fcode = req.params.faq_code;
        var sql = 'select * from faq where faq_code = ?';

        connection.query(sql, fcode, function (err, result) {
            if (err) { 
                console.error(err); 
                logger.error('경로 : '+__dirname +'  message: '+err); 
                res.redirect('/error/connect') 
            }
            res.render('faq_content', { id: id, value: result[0] });
        });
    }
});

module.exports = router;