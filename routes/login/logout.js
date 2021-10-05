var express = require('express')
var app = express()
var router = express.Router() //라우터 메서드

router.get('/', function(req, res){
    console.log('logout')
    req.logout();
    req.session.destroy()
    res.redirect('/login');
});

module.exports = router;    