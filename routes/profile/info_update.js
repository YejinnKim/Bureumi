var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var connection = require('../../join/connection');
const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
    apiKey: "984b5f18",
    apiSecret: "O1S7Mt1ju83oekLQ"
})

router.post('/', (req, res) => { //개인정보 처리
    var pass = req.body.password
    var pass_check = req.body.password2
    var s_phone_number = req.session.user_info.user_phonnumber //s는 서버쪽 데이터
    var phone_number = req.body.phonenumber
    var user_birth_year = req.body.year
    var user_birth_month = req.body.month
    var user_birth_date = req.body.day
    var user_birth = user_birth_year + '-' + user_birth_month + '-' + user_birth_date
    var user_name = req.body.username
    var sub_number = phone_number.substring(0, 3)
    var number_length = phone_number.length
    if (pass === pass_check) { // 비밀번호, 비밀번호 확인 내용이 일치해야 진행됨

        if (s_phone_number != phone_number) // 번호가 다를때 : 번호가 다르면 휴대폰 인증을 다시 해야함
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
                            number: '82' + phone_number, //01027008033
                            brand: "Bureumi"
                        }, (err, result) => {
                            if (err) {
                                console.error(err);
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
                        res.redirect('/user_info_sms')

                    }
                    else {
                        console.log('sorry, try again')
                        
                    }
                }

            })
        }
        else //번호가 같을때 
        {
            req.session.user_info.user_password = pass
            req.session.user_info.birth_date = user_birth
            req.session.user_info.user_name = user_name
            var user_id = req.session.user_info.user_id
            var user_password = req.session.user_info.user_password
            var user_name = req.session.user_info.user_name
            var birth_date = req.session.user_info.birth_date
            var sql = 'update user set user_password=?, user_name=?, date_birth=? where user_id=?'
            var data=[user_password,user_name,birth_date,user_id]

            connection.query(sql,data,function(err,result)
            {
                if(err) throw err;
                  res.redirect('/user_info')

            })
            //회원정보 수정시 입력한 데이터를 session에 넣어주고 임시 세션 삭제
                  console.log('정보 수정 성공')
        }

    }
    else {
        console.log('비밀번호를 확인해주세요')
    }

})

module.exports = router;