const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');

router.get('/', async function (req, res) {
    if (req.session.user) {
        await LogOut();
        res.sendFile(path.join(__dirname, '../../www/views/join_success.html'));
    }
    else if (req.session.user_info != undefined) {
        res.redirect('/error/wrong')

    }
    else {
        await LogOut();
        res.redirect('/error/info');
    }
    function LogOut() {
        req.session.destroy(function () {
            req.session;
        });

    }
})


module.exports = router;
