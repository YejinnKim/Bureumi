var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');
const haversine = require('haversine');

router.get('/', function (req, res) {
    var id = req.user;
    if (!id) res.render('login');
    var data = [req.session.user_info.user_id]
    var sql = 'select * from request where not writer_id = ? order by length(request_code) desc';

    connection.query(sql, data, function (err, result) {
        if (err) throw err;
        var count = 0;
        const start = {
            latitude: req.session.user_info.addressLat,
            longitude: req.session.user_info.addressLon
        }

        var sorted_by_gps_result = [];
        var end = [];
        for (var n = 0; n < result.length; n++) 
        {
            end[n] = {
                latitude: result[n].latitude,
                longitude: result[n].longitude
            }

            result[n].distance = haversine(start, end[n])

            if (result[n].distance < 5) // 거리 설정
            {
                sorted_by_gps_result[count] = result[n]
                count++;
            }

        }
        for (var i = 0; i < sorted_by_gps_result.length - 1; i++) {
            for (var j = 1; j < sorted_by_gps_result.length - i; j++) {
                if (sorted_by_gps_result[j].distance < sorted_by_gps_result[j - 1].distance) {
                    var temp = sorted_by_gps_result[j - 1];
                    sorted_by_gps_result[j - 1] = sorted_by_gps_result[j];
                    sorted_by_gps_result[j] = temp;

                }
            }
        }

        result.sort(function (a, b) {
            if (a.request_code < b.request_code) return 1;
            else if (a.request_code > b.request_code) return -1;
            else return 0;
        })
        
        var sorted_all = [];
        for(var i=0; i < 5;i++) // i = 모두 조회 탭 클릭시 나타나는 요청의 갯수  
        {
            sorted_all[i] = result[i];

        }

        res.render('search', {
            search: sorted_by_gps_result,
            list: sorted_all
        });
    });
});

module.exports = router;