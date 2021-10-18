var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../../join/connection');


//회원가입 -> sms -> 위치인증
router.get('/', (req,res) =>
{
    if(req.session.user != undefined) 
    {res.sendFile(path.join(__dirname, '../../www/views/map.html'));}
    else{
        res.redirect('/error/wrong');
    }
})

module.exports = router;