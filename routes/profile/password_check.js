const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const logger = require('../../config/logger');
const path = require('path');

router.get('/', (req, res) => {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else res.render('password_check')
})

router.post('/checking', (req, res) => {
    if (!req.body.password) {
        logger.info('<PROFILE-password null> [id] : '+req.session.user_info.user_id);
        res.send('<script type="text/javascript">alert("비밀번호가 입력되지 않았습니다."); window.history.go(-1)</script>');
    }
    else if (req.body.password === req.session.user_info.user_password) {
        res.redirect('/userinfo')
    }
    else {
        logger.info('<PROFILE-password not correct> [id] : '+req.session.user_info.user_id);
        res.send('<script type="text/javascript">alert("비밀번호가 정확하지 않습니다."); window.history.go(-1)</script>');
    }
})

module.exports = router;