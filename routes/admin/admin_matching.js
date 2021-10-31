const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');

router.get('/matching', function (req, res) {
    var id = req.user;
    if (id != 'admin') { // 관리자만 접근 가능
        res.redirect('/error/wrong');
    }
    else {
        res.render('admin/admin_matching', { 'id': id });
    }
});

module.exports = router;