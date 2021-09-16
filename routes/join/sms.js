var express = require('express')
var app = express()
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.urlencoded({extended:true}));
var connection = require('../../join/connection');
var passport = require('passport')
var session=require('express-session');
require('dotenv').config(); 
//
const Vonage = require('@vonage/server-sdk')
const APIKEY = process.env.APIKEY 
,APISECRET = process.env.APISECRET
const vonage = new Vonage({
  apiKey: APIKEY,
  apiSecret: APISECRET
}) 


router.get('/',(req,res)=>{
  console.log(req.session.user)
    res.sendFile(path.join(__dirname,'../../www/views/sms.html'));
});

router.post('/verify',(req,res) =>{

  var query = connection.query('insert into user set ?', req.session.user, function (err, rows) {
    if (err) throw err
    else{
      console.log('본인인증 성공')
      res.redirect('/gps')
    }});

/*    //휴대폰 sms 인증
        vonage.verify.check({
        request_id: verifyRequestId,
        code: req.body.code
      }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(result);
          if(result.status == 0){
              var query = connection.query('insert into user set ?', req.session.user, function (err, rows) {
                if (err) throw err
                else{
                  console.log('본인인증 성공')
                  res.redirect('/gps')
                }
            }) 
          }
          else{
            console.log('본인인증 실패');
            res.redirect('/sms')
          }
        }
      });  */





    

})



module.exports = router;