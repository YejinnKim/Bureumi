const express = require('express');
const router = express.Router();
const upload = require('./s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const connection = require('../connection');
const logger = require('../../config/logger');
const path = require('path');

router.get('/', (req, res) => {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        sql = 'select * from user where user_id = ?'
        connection.query(sql, req.user, function (err, result) {
            if (err) {console.error(err); res.redirect('/error/connect')}
            res.render('upload', {id: id, userinfo : result});
        });
    }
});

router.post('/', upload.single('image'), (req, res) => {
    sql = 'update user set image = 1 where user_id = ?'
    connection.query(sql, req.user, function (err, result) {
        if (err) {
            console.error(err);
            logger.error('경로 : ' + __dirname + '  message: ' + err);
            res.redirect('/error/connect')
        }
        else {
            logger.info('<UPLOAD-profile image update> [id] : ' + req.user);
            res.redirect('/profile');
        }
    });
});

router.get('/del', (req, res) => {
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        s3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: 'profile/' + req.user
        })

        sql = 'update user set image = null where user_id = ?'

        connection.query(sql, req.user, function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            else {
                logger.info('<UPLOAD-profile image delete> [id] : ' + req.user);
                res.redirect('/profile');
            }
        });
    }
});

module.exports = router;