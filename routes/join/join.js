const express = require('express');
const router = express.Router();
const connection = require('../../join/connection');
const passport = require('../../join/passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const Vonage = require('@vonage/server-sdk');
const { stringify } = require('querystring');
const { data } = require('jquery');
const logger = require('../../config/logger');

require('dotenv').config();
const APIKEY = process.env.APIKEY
    , APISECRET = process.env.APISECRET
const vonage = new Vonage({
    apiKey: APIKEY,
    apiSecret: APISECRET
})

var ucode;

function lpad(str, padLen, padStr) {
    //str += "";
    //padStr += "";
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
};

router.get('/', (req, res) => {

    var msg;
    var errMsg = req.flash('error');
    if (errMsg) msg = errMsg;

    var sql = 'select user_code from user order by length(user_code) desc, user_code desc limit 1';
    connection.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            logger.error('경로 : ' + __dirname + '  message: ' + err);
            res.redirect('/error/connect')
        }
        req.session.destroy();
        ucode = result[0].user_code;
        ucode = String(parseInt(ucode.substr(1)) + 1);
    })

    res.render('join', { 'message': msg });
});

passport.serializeUser(function (user, done) {
    console.log('passport session save : ', user.id);
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    console.log('passport session get id : ', id);
    done(null, id);
})



passport.use('local-join', new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, userid, password, done) {
    userid = req.body.userid
    phone_number = req.body.phonenumber
    user_name = req.body.username
    user_birth_year = req.body.datebirth
    user_birth_month = req.body.birth_mm
    user_birth_date = req.body.dd
    user_birth = user_birth_year + '-' + user_birth_month + '-' + user_birth_date
    user_level = '일반'
    user_code = 'u'.concat(lpad(ucode, 3, '0'))
    var sub_number = phone_number.substring(0, 3)
    var number_length = phone_number.length
    var query_search = connection.query('select * from user where phone_number=?', [phone_number], function (err, rows) {
        if (err) return done(err);

        if (rows.length) {
            console.log('existed phone_number');
            return done(null, false, { message: 'your phone number is already used' })

        }
        else {
            if (sub_number == '010' && number_length == 11) { //번호가 010으로 시작하고 자릿수가 11자리인지 체크
                vonage.verify.request({ //인증 sms 발송
                    number: '82' + phone_number, //01027008033
                    brand: "Bureumi"
                }, (err, result) => {
                    if (err) {
                        logger.error('경로 : ' + __dirname + '  message: ' + err);
                        console.error(err);
                    } else {
                        logger.info('<JOIN-sms transfer> [id] : ' + userid);
                        const verifyRequestId = result.request_id;
                        global.verifyRequestId = result.request_id;
                        console.log('request_id', verifyRequestId);
                    }
                })
                var query = connection.query('select * from user where user_id=?', [userid], function (err, rows) {
                    if (err) {
                        logger.error('경로 : ' + __dirname + '  message: ' + err);
                        return done(err);
                    }

                    if (rows.length) {
                        console.log('existed user');
                        return done(null, false, { message: 'your userid is already used' })
                    }
                    else {
                        req.session.user = {
                            user_id: userid,
                            user_password: password,
                            user_name: user_name,
                            phone_number: phone_number,
                            user_level: user_level,
                            date_birth: user_birth,
                            user_code: user_code
                        }
                        logger.info('<JOIN-sigh up> [id] : ' + userid);
                        return done(null, { 'userid': userid, 'id': rows.insertId });

                    }
                })
            }
            else {
                console.log('sorry, try again')
                return done(null, false, { message: 'you entered Phone numbers cannot be used.' })
            }
        }
    })
}
));

router.post('/', passport.authenticate('local-join', {
    successRedirect: '/sms',
    failureRedirect: '/join',
    failureFlash: true
})
)

module.exports = router;