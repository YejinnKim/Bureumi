const express = require('express')
const app = express()
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
const connection = require('../../join/connection');
const passport = require('passport')
const session = require('express-session');
const Vonage = require('@vonage/server-sdk')
const logger = require('../../config/logger');

require('dotenv').config();

const APIKEY = process.env.APIKEY
  , APISECRET = process.env.APISECRET
const vonage = new Vonage({
  apiKey: APIKEY,
  apiSecret: APISECRET
})



router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../www/views/sms.html'));
});

router.post('/verify', (req, res) => {
  var userid = req.session.user.user_id;
          vonage.verify.check({
          request_id: verifyRequestId,
          code: req.body.code
        }, (err, result) => {
          if (err) {
            console.error(err);
            logger.error('경로 : '+__dirname +'  message: '+err); 
          } else {
            console.log(result);
            if(result.status == 0){
                var query = connection.query('insert into user set ?', req.session.user, function (err, rows) {
                   if (err) {
                     console.error(err); 
                     logger.error('경로 : '+__dirname +'  message: '+err); 
                     res.redirect('/error/connect')}
                  else{
                    console.log('본인인증 성공')
                    logger.info('<JOIN-sms success> [id] : '+ userid);
                    res.redirect('/gps')
                  }
              }) 
            }
            else{
              logger.info('<JOIN-sms fail> [id] : '+ userid)
              console.log('본인인증 실패');
              res.redirect('/sms')
            }
          }
        }); 
})



module.exports = router;