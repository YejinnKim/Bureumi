var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../../join/connection');


//회원가입 -> sms -> 위치인증
router.get('/', (req,res) =>
{
    res.sendFile(path.join(__dirname, '../../www/views/map.html'));

})

module.exports = router;