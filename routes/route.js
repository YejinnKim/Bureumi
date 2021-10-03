const express = require('express');
const router = express.Router();
const path    = require('path');
const bodyParser = require('body-parser');

const login = require('./login/login');
const join = require('./join/join');
const index = require('./index/index');
const sms = require('./join/sms');
const join_success = require('./join/join_success');
const login_success = require('./login/login_success');
const update_success = require('./profile/update_success')
const search = require('./search/search');
const request = require('./request/request');
const category = require('./category/category');
const request_content = require('./request/request_content');
const logout = require('./login/logout');
const profile = require('./profile/profile');
const map =require('./join/gps');
const location_save =require('./join/save');
const pass_check = require('./profile/password_check'); // 개인정보 수정시 비밀번호 체크
const userinfo = require('./profile/info');
const userinfo_update = require('./profile/info_update');
const userinfo_sms = require('./profile/infro_sms');
const score = require('./score/score');
const bureumi_auth = require('./bureumi_auth/bureumi_auth');
const admin = require('./admin/admin');
const notice = require('./notice/notice');
const notice_content = require('./notice/notice_content');
const address_update = require('./join/address_update.js');
const chatting = require('./chatting/chatting.js');
const matching = require('./matching/matching.js');
const review = require('./review/review.js');
const review_list = require('./review/review_list.js');
const review_content = require('./review/review_content.js');
const faq = require('./faq/faq');
const faq_content = require('./faq/faq_content');
const faq_question = require('./faq/faq_question');

//url 라우팅
router.get('/', function(req, res){
    // console.log('indexjs / path loaded')
    res.sendFile(path.join(__dirname, "../www/views/index.html"));
    //console.log(session.useerid)
});

router.use('/login', login);
router.use('/join', join);
router.use('/index', index);
router.use('/sms',sms);
router.use('/join_success',join_success);
router.use('/login_success', login_success);
router.use('/update_success',update_success)
router.use('/search', search);
router.use('/request', request);
router.use('/request', request_content);
router.use('/category', category);
router.use('/gps',map);
router.use('/save',location_save);
router.use('/logout', logout);
router.use('/profile', profile);
router.use('/pass_check', pass_check);
router.use('/userinfo', userinfo);
router.use('/userinfo_update', userinfo_update);
router.use('/userinfo_sms', userinfo_sms);
router.use('/score', score);
router.use('/bureumi_auth', bureumi_auth);
router.use('/admin', admin);
router.use('/notice', notice);
router.use('/notice', notice_content);
/* router.use('/address_save',address_save);
router.use('/address_join',address_join); */
router.use('/address_update',address_update);
router.use('/chatting',chatting);
router.use('/matching',matching);
router.use('/review',review);
router.use('/review_list',review_list);
router.use('/review_content',review_content);
router.use('/faq', faq);
router.use('/faq', faq_content);
router.use('/faq', faq_question);

module.exports = router;