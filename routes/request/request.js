var express = require('express');
var router = express.Router();
var connection = require('../connection');
var upload = require('./s3');
var rcode;

router.get('/', function (req, res) {
    try { // 9.25 사용자가 로그인을 하지 않았을때 login으로 넘겨버림 - 임시조치
        const user_id = req.session.user_info.user_id; 
    }
    catch (e) {
        res.redirect('/login')
        
    }
    
    
    var sql = 'select request_code from request order by length(request_code) desc, request_code desc limit 1';
    connection.query(sql, function(err, result) {
        if (err) throw err;
        rcode = result[0].request_code;
        rcode = parseInt(rcode.substr(1)) + 1;
    })

    res.render('request', {value : null});
});

router.post('/data', upload.single('image'), function(req, res) {
    var code = rcode;
    var id = req.session.user_info.user_id;
    var category = req.body.category;
    var title = req.body.title;
    var content = req.body.content;
    var price = req.body.price;
    var image;
    if (req.file) {
        image = req.file.location;
    } else {
        image = null;
    }

    //9.24 DB에 경도와 위도를 저장할 칼럼을 추가하여 요청을 저장할 때 같이 저장하려고 함 - 완료
    var latitude = req.session.user_info.addressLat;
    var longitude = req.session.user_info.addressLon;
    var address = req.session.user_info.user_address;
    
    var datas = [code, id, category, title, content, price, image ,latitude,longitude,address];
    var sql = 'insert into request values (concat(\'r\', lpad(?, 3, \'0\')), ?, ?, ?, ?, ?, now(), ?,?,?,?)';
    
    if (code) {
        connection.query(sql, datas, function(err, result) {
            if (err) throw err;
            res.redirect('/search');
        });
    }
    
});

module.exports = router;