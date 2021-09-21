var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../../join/connection');



//로그인 -> 위치정보 변경
router.get('/', (req,res) =>
{
    res.sendFile(path.join(__dirname, '../../www/views/map_update.html')); 

})


module.exports = router;