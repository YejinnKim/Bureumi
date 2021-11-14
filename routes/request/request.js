const express = require('express');
const router = express.Router();
const connection = require('../connection');
const upload = require('./s3');
const path = require('path');
const logger = require('../../config/logger');

var rcode;

router.get('/', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else if (req.session.user_info.addressLat == 0 && req.session.user_info.addressLon == 0) { res.send('<script type="text/javascript">alert("위치인증을 해주세요");window.location.href="/profile"</script>'); }
    else {
        var id = req.user;
        var sql = 'select request_code from request order by length(request_code) desc, request_code desc limit 1';
        connection.query(sql, function (err, result) {
            if (err) {
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                console.error();
                res.redirect('/error/connect')
            }
            else {
                rcode = result[0].request_code;
                rcode = parseInt(rcode.substr(1)) + 1;
            }
        })

        res.render('request', { id: id, value: null });
    }
});

router.post('/data', upload.single('image'), async function (req, res) {
    var category = req.body.category;
    var title = req.body.title;
    var content = req.body.content;
    var price = req.body.price;
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else if (title.length < 3) res.send('<script type="text/javascript">alert("제목이 너무 짧습니다.");window.location.href="/request"</script>');
    else if (category == "카테고리를 선택하세요") res.send('<script type="text/javascript">alert("카테고리를 선택하세요");window.location.href="/request"</script>');
    else {

        var code = rcode;
        var id = req.session.user_info.user_id;
        var image;

        if (req.file) {
            image = req.file.location;
        } else {
            image = null;
        }

        var latitude = req.session.user_info.addressLat;
        var longitude = req.session.user_info.addressLon;
        var address = req.session.user_info.user_address;

        var datas = [code, id, category, title, content, price, image, latitude, longitude, address];
        var sql = 'insert into request values (concat(\'r\', lpad(?, 3, \'0\')), ?, ?, ?, ?, ?, now(), ?,?,?,?)';
        if (code) {
            connection.query(sql, datas, function (err, result) {
                if (err) {
                    logger.error('경로 : ' + __dirname + '  message: ' + err);
                    console.error(err); res.redirect('/error/connect');
                }
                else {
                    logger.info('<REQUEST-request write> [request code] : r' + code + ' [id] : ' + id);
                    res.redirect('/search');
                }
            });
        }
    }
});

module.exports = router;