
const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../../config/logger');
const connection = require('../connection');

const bureumi = require('./admin_bureumi');
const user = require('./admin_user');
const request = require('./admin_request');
const notice = require('./admin_notice');
const notice_write = require('./admin_notice_write');
const score = require('./admin_score');
const matching = require('./admin_matching');
const faq = require('./admin_faq');
const faq_write = require('./admin_faq_write');

//moment(data.date_birth).format('YYYY-MM-DD') 날짜 형식 지정

router.get('/', function (req, res) {
    var id = req.user;
    if (id != 'admin') { //관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        var sql1 = 'select * from user order by length(user_code) desc, user_code desc limit 3';
        var sql2 = 'select * from bureumi order by length(bureumi_code) desc, bureumi_code desc limit 3';
        var sql3 = 'select * from recommend'
        var keyword;
        var user;

        connection.query(sql1, function (err, result) {
            if (err) { 
                console.error(err); 
                logger.error('경로 : '+__dirname +'  message: '+err); 
                res.redirect('/error/connect') 
            }
            user = result;
        });
        connection.query(sql3, function (err, result) {
            if (err) { 
                console.error(err); 
                logger.error('경로 : '+__dirname +'  message: '+err); 
                res.redirect('/error/connect') 
            }
            keyword = result;
        });
        connection.query(sql2, function (err, result) {
            if (err) { 
                console.error(err); 
                logger.error('경로 : '+__dirname +'  message: '+err); 
                res.redirect('/error/connect'); 
            }
            res.render('admin/admin_index', { 'id': id, user: user, bureumi: result, keyword : keyword });
        });
    }

});

router.use(bureumi);
router.use(user);
router.use(request);
router.use(notice);
router.use(notice_write);
router.use(score);
router.use(matching);
router.use(faq);
router.use(faq_write);

module.exports = router;