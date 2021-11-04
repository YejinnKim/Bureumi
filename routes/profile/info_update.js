const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('../../join/connection');
const Vonage = require('@vonage/server-sdk');
const logger = require('../../config/logger');

const APIKEY = process.env.APIKEY
    , APISECRET = process.env.APISECRET
const vonage = new Vonage({
    apiKey: APIKEY,
    apiSecret: APISECRET
})

/*개인정보 업데이트 */
router.post('/', (req, res) => {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var pass = req.body.password
        var pass_check = req.body.password2
        var s_phone_number = req.session.user_info.user_phonnumber
        var phone_number = req.body.phonenumber
        var user_birth_year = req.body.year
        var user_birth_month = req.body.month
        var user_birth_date = req.body.day
        var user_birth = user_birth_year + '-' + user_birth_month + '-' + user_birth_date
        var user_name = req.body.username
        var sub_number = phone_number.substring(0, 3)
        var number_length = phone_number.length
        if (pass === pass_check) { // 비밀번호, 비밀번호 확인 내용이 일치해야 진행됨

            if (s_phone_number != phone_number) // 휴대폰 번호 변경 체크 : SMS 재발송을 통해 재인증 시도
            {
                var query_search = connection.query('select * from user where phone_number=?', [phone_number], function (err, rows) {
                    if (err) return done(err);

                    if (rows.length) {
                        console.log('existed phone_number')
                        return done(null, false, { message: 'your phone number is already used' })

                    }
                    else {
                        if (sub_number == '010' && number_length == 11) { //번호가 010으로 시작하고 자릿수가 11자리인지 체크
                            vonage.verify.request({ //인증 sms 발송
                                number: '82' + phone_number,
                                brand: "Bureumi"
                            }, (err, result) => {
                                if (err) {
                                    console.error(err);
                                    logger.error('경로 : ' + __dirname + '  message: ' + err);
                                    res.send('<script type="text/javascript">alert("오류가 발생했습니다.");window.history.go(-1)</script>');
                                } else {
                                    const verifyRequestId = result.request_id;
                                    global.verifyRequestId = result.request_id;
                                    console.log('request_id', verifyRequestId);
                                }
                            })
                            req.session.update_user_info = { // update_user_info 세션으로 업데이트 될 정보를 저장
                                'password': pass,
                                'phone_number': phone_number,
                                'user_birth': user_birth,
                                'user_name': user_name
                            }
                            res.redirect('/userinfo_sms')

                        }
                        else {
                            console.log('사용할 수 없는 휴대폰 번호입니다.');
                            res.send('<script type="text/javascript">alert("사용할 수 없는 휴대폰 번호입니다."); window.history.go(-1)</script>');

                        }
                    }

                })
            }
            else {
                req.session.user_info.user_password = pass
                req.session.user_info.birth_date = user_birth
                req.session.user_info.user_name = user_name
                var user_id = req.session.user_info.user_id
                var user_password = pass
                var user_name = user_name
                var birth_date = user_birth
                var sql = 'update user set user_password=?, user_name=?, date_birth=? where user_id=?'
                var data = [user_password, user_name, birth_date, user_id]

                connection.query(sql, data, function (err, result) {
                    if (err) {
                        console.error(err);
                        logger.error('경로 : ' + __dirname + '  message: ' + err);
                        res.redirect('/error/connect')
                    }
                    else {
                        console.log('정보 수정 성공')
                        logger.info('<PROFILE-profile update> [id] : ' + user_id);
                        req.logout();
                        req.session.destroy()
                        res.redirect('/update_success');
                    }

                })
            }
        }
        else {
            console.log('비밀번호 불일치');
            logger.info('<PROFILE-password mismatch> [id] : '+user_id);
            res.send('<script type="text/javascript">alert("비밀번호가 정확하지 않습니다."); window.history.go(-1)</script>');
        }
    }
})

module.exports = router;