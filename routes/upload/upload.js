var express = require('express');
var router = express.Router();
var upload = require('./s3');
var aws = require('aws-sdk');
var s3 = new aws.S3();
var connection = require('../connection');

router.get('/', (req, res) => {
    res.render('upload');
});

router.post('/', upload.single('image'), (req, res) => {
    sql = 'update user set image = 1 where user_id = ?'

    connection.query(sql, req.user, function(err, result) {
        if (err) throw err;
        res.redirect('/profile');
    });
});

router.get('/del', (req, res) => {
    s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: 'profile/' + req.user
    })

    sql = 'update user set image = null where user_id = ?'

    connection.query(sql, req.user, function(err, result) {
        if (err) throw err;
        res.redirect('/profile');
    });
});

module.exports = router;