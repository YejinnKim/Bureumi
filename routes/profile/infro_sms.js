var express = require('express')
var app = express()
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
var passport = require('passport')
var session = require('express-session');
var connection = require('../../join/connection');
const Vonage = require('@vonage/server-sdk')

const APIKEY = process.env.APIKEY
  , APISECRET = process.env.APISECRET
const vonage = new Vonage({
  apiKey: APIKEY,
  apiSecret: APISECRET
})

router.get('/', (req, res) => {
  if (req.session.user_info == undefined) res.redirect('/error/info')
  else {
    res.sendFile(path.join(__dirname, '../../www/views/smsform_update.html'));
  }
});

router.post('/verify', (req, res) => {
  var user_id = req.session.user_info.user_id
  if (user_id == undefined) res.redirect('/error/info');
  else {
    vonage.verify.check({
      request_id: verifyRequestId,
      code: req.body.code
    }, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
        if (result.status == 0) {

          var user_password = req.session.update_user_info.password
          var user_name = req.session.update_user_info.user_name
          var birth_date = req.session.update_user_info.user_birth
          var phone_number = req.session.update_user_info.phone_number
          var sql = 'update user set user_password=?, user_name=?, date_birth=?,phone_number=? where user_id=?'
          var data = [user_password, user_name, birth_date, phone_number, user_id]

          connection.query(sql, data, function (err, result) {
            if (err) { console.error(err); res.redirect('/error/connect'); }
            else {
              console.log('정보 수정 성공')
              res.redirect('/update_success');
            }
          })
        }
        else {
          console.log('sms 코드 불일치');
          res.send('<script type="text/javascript">alert("코드가 일치하지 않습니다."); window.history.go(-1)</script>');
        }
      }
    });
  }
})



module.exports = router;