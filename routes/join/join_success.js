var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var session=require('express-session')  ;
var path = require('path');

router.get('/',function(req,res){
    if(req.session.user){
    req.session.destroy;
    res.sendFile(path.join(__dirname,'../../www/views/join_success.html'));
    }
    else if(req.session.user_info != undefined)
    {
       res.redirect('/error/wrong')
    
    }
    else{
        req.session.destroy();
        res.redirect('/error/info');
    }   
})


module.exports = router;
