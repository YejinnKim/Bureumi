var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');

router.get('/score', function (req, res) {
    var id = req.user;
    if(id != 'admin') res.redirect('/logout'); //관리자만 접근 가능

    res.render('admin/admin_score', {'id' : id});
});

module.exports = router;