var express = require('express')
var app = express()
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.urlencoded({extended:true}));
var passport = require('passport')
var session=require('express-session');
var connection = require('../../join/connection');
//
const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "984b5f18",
  apiSecret: "O1S7Mt1ju83oekLQ"
})
//

router.get('/',(req,res)=>{
  console.log(req.session.user)
    res.sendFile(path.join(__dirname,'../../www/smsform_update.html'));
});

router.post('/verify',(req,res) =>{
    vonage.verify.check({
        request_id: verifyRequestId,
        code: req.body.code
      }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(result);
          if(result.status == 0){
              //user_info 세션에 업데이트된 update_user_info 데이터를 덮어씀
            req.session.user_info.user_password = req.session.update_user_info.password
            req.session.user_info.user_phonnumber =req.session.update_user_info.phone_number
            req.session.user_info.birth_date = req.session.update_user_info.user_birth
            req.session.user_info.user_name = req.session.update_user_info.user_name
            var user_id = req.session.user_info.user_id
            var user_password = req.session.user_info.user_password
            var user_name = req.session.user_info.user_name
            var birth_date = req.session.user_info.birth_date
            var phone_number = req.session.user_info.user_phonnumber
            var sql = 'update user set user_password=?, user_name=?, date_birth=?,phone_number=? where user_id=?'
            var data=[user_password,user_name,birth_date,phone_number,user_id]

            connection.query(sql,data,function(err,result)
            {
                if(err) throw err;
                // update_user_info 세션 삭제하는게 좋을거같음 추가필요
                  res.redirect('/user_info')

            })
            //회원정보 수정시 입력한 데이터를 session에 넣어주고 임시 세션 삭제
                  console.log('정보 수정 성공')
              

          }
          else{
            console.log('개인정보 수정 실패');
            res.redirect('/profile')
          }
        }
      });
    

})



module.exports = router;