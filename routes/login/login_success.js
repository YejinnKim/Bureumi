const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');

router.get('/', function (req, res) {
    if (req.session.user_info == undefined) {
        res.redirect('/error/info')
    }
    else {
        res.sendFile(path.join(__dirname, '../../www/views/login_success.html'));
    }
});

module.exports = router;