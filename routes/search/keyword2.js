const express = require('express');
const request = require('request');
const router = express.Router();
const connection = require('../connection');


// 키워드 추출
router.get('/', function (req, res) {
    var keyword = [];

    var requestJson = {
        'access_key': process.env.ACCESS_KEY,
        'argument': {
            'text': global.text,
            'analysis_code': 'ner'
        }
    };

    var options = {
        url: "http://aiopen.etri.re.kr:8000/WiseNLU_spoken",
        body: JSON.stringify(requestJson),
        headers: {'Content-Type':'application/json; charset=UTF-8'}
    };

    request.post(options, function (error, response, body) {
        var data = JSON.parse((response.body));

        data.return_object.sentence.forEach(element => {
            element.morp.forEach(element => {
                if(element.type == 'NNG' || element.type == 'NNP') {
                    keyword.push(element.lemma);
                }
            });
        });
        keyword = Array.from(new Set(keyword))
        sql = 'insert into recommend values (?)';
        keyword.forEach(element => {
            connection.query(sql, element, function(err, result) {
            })
        })
    });
    
    res.redirect('/admin')
});




// 3. /keyword/check - 키워드 저장 여부 확인
/* var SQL = [];
router.get('/check', function (req, res) {
    var sql = 'select * from recommend where keyword = ?'

    keyword.forEach(element => {
        connection.query(sql, element, function (err, result) {
            if(err) SQL.push('insert into recommend values (?, 1)');
            else SQL.push('update recommend set frequency = frequency + 1 wherhe keyword = ?');
        })
    });
}); */

// 4. /keyword/db - 키워드 DB 저장
/* router.get('/db', function (req, res) {
    for (var i = 0; i < keyword.length; i++) {
        connection.query(SQL[i], keyword[i], function (err, result) {
            console.log(SQL[i])
            console.log(keyword[i])
        })
    }
}); */



module.exports = router;