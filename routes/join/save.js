var express = require('express');
var router = express.Router();
var connection = require('../../join/connection');
var path = require('path');
const { session } = require('passport');

router.post('/', function(req,res) //회원가입->문자인증->위치인증
{   
    var user_id = req.session.user.user_id;
    const user_location = req.body.user_address;
    const sql = 'update user set user_location=?, latitude=?, longitude=?   where user_id=?'
    const addressLatitude = req.body.addressLatitude;
    const addressLongitude = req.body.addressLongitude;
    const data = [user_location,addressLatitude,addressLongitude,user_id] 
    console.log(user_location)
    const address_length = String(user_location)
    
    if(address_length.length < 10){
        console.log('주소정보가 존재하지 않습니다.')
        res.redirect('/gps')
    }
    else {
        var query = connection.query('select * from user where user_id=?', [user_id], function (err, rows) {
            if (err)  throw err;     
            if (rows.length) {
                // 아이디가 존재할때 -> 로그인을 했을때
                connection.query(sql,data,function(err,result){
                    if(err) throw err;
                 // req.session.user_info.user_address = req.body.user_address 
                   req.session.destroy()
                   res.redirect('/join_success')
                })
            }
            else {       
                console.log('아이디가 존재하지 않습니다.')
                res.redirect('/login')
            }
        })
    }
})

router.post('/save_update', function(req,res) // 로그인->프로필->위치 정보 업데이트
{   
    var user_id = req.session.user_info.user_id
    const user_location = req.body.user_address;
    const address_length = String(user_location)
    
    
    const sql = 'update user set user_location=?, latitude=?, longitude=?  where user_id=? '
    const addressLatitude = req.body.addressLatitude;
    const addressLongitude = req.body.addressLongitude;
    const data = [user_location,addressLatitude,addressLongitude,user_id] 

    req.session.user_info.user_address = user_location; //--------------------------------------------------
    req.session.user_info.addressLatitude = addressLatitude//  위치정보 업데이트 할 때 세션 정보 업데이트 
    req.session.user_info.addressLongitude = addressLongitude//-----------------------------------------
       
    if(address_length.length < 3){

        res.send('<script type="text/javascript">alert("존재하지 않는 주소입니다."); window.history.go(-1)</script>');
        res.redirect('/address_update')
    }
    else {
        var query = connection.query('select * from user where user_id=?', [user_id], function (err, rows) {
            if (err)  throw err;
    
            
            if (rows.length) { // 아이디가 존재할때 -> 로그인을 했을때
                connection.query(sql,data,function(err,result){
                    if(err) throw err;
                   res.redirect('/profile')
                })
            }
            else {       
                console.log('아이디가 존재하지 않습니다.')
                res.redirect('/login')
            }
        })
    }
})

module.exports = router;