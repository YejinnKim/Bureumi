var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var path = require('path');

router.get('/', function (req, res) {
    if (req.session.user_info == undefined) {
        res.redirect('/error/info')
    }
    else {
        res.sendFile(path.join(__dirname, '../../www/views/login_success.html'));
    }
});

module.exports = router;