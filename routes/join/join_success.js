var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var session=require('express-session')  ;
var path = require('path');

router.get('/',function(req,res){
    req.session.destroy;
    res.sendFile(path.join(__dirname,'../../www/views/join_success.html'));
})


module.exports = router;
