const express = require('express');
const router = express.Router();
const connection = require('../connection');
const passport = require('passport')
const bodyParser = require('body-parser');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');
const { Session } = require('inspector');
const logger = require('../../config/logger');

router.get('/', async (req, res) => {
    var msg;
    var errMsg = req.flash('error');
    if (errMsg) msg = errMsg;

    try {
        await login_check(req.session.user_info);
    }
    catch (error) {
        logger.error('경로 : ' + __dirname + err);
        res.send('<script type="text/javascript">alert("오류가 발생했습니다.");window.location.href="/index"</script>');
    }
    function login_check(info) {
        if (info != undefined) res.send('<script type="text/javascript">alert("이미 로그인 하셨습니다."); window.location.href="/profile"</script>');
        else res.render('login', { 'message': msg });
    }
});
passport.serializeUser(function (user, done) {
    console.log('passport session save : ', user.id);
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    console.log('passport session get id : ', id);
    done(null, id);
})

passport.use('local-login', new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, userid, password, done) {
    var query = connection.query('select * from user where user_id=? and user_password=?', [userid, password], function (err, rows) {
        if (err) return done(err);

        if (rows.length) {

            req.session.user_info = { // 사용자 정보
                user_id: userid,
                user_password: rows[0].user_password,
                user_phonnumber: rows[0].phone_number,
                user_address: rows[0].user_location,
                user_level: rows[0].user_level,
                user_name: rows[0].user_name,
                birth_date: rows[0].date_birth,
                addressLat: rows[0].latitude,
                addressLon: rows[0].longitude
            }
            logger.info('<LOGIN-login> [id] : ' + userid);
            return done(null, { 'id': userid, 'userid': userid, 'password': password })

        } else {
            return done(null, false, { 'message': 'your login info is not found' })
        }
    })
}));

router.post('/', function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        if (err) res.status(500).json(err);
        if (!user) return res.send('<script type="text/javascript">alert("아이디, 비밀번호를 확인하세요");window.location.href="/login"</script>');

        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/login_success');
        });
    })(req, res, next)
})

module.exports = router;