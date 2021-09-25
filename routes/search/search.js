var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../connection');
const distance = require('gps-distance');//9.24 추가 : 경도와 위도를 변수로 받아 두 위치가이의 거리 계산 모듈

router.get('/', function (req, res) {
    var id = req.user;
    if(!id) res.render('login');
    
    var sql = 'select * from request order by length(request_code) desc, request_code desc limit 4';
    
    connection.query(sql, function(err, result) {
        if (err) throw err;

        /*                      test 9.25 
             req.session.user_info에 저장된 로그인한 사용자의 경도와 위도와 request테이블에서 불러온 요청글에 저장된 경도와 위도를 비교하여 
             비교값이 작은 순으로 재배열 한 후 render해줌(DB결과값인 result를 sorted_by_gps_result라는 변수로 복사하여 사용)
        */ 
        const user_lat = req.session.user_info.addressLat
        const user_lon = req.session.user_info.addressLon
        var sorted_by_gps_result = result;
        for(var n=0;n<sorted_by_gps_result.length;n++) // sorted_by_gps_result에 distance라는 변수를 추가하고 유저와의 거리를 저장
        {
            sorted_by_gps_result[n].distance = distance(user_lat,user_lon,sorted_by_gps_result[n].latitude,sorted_by_gps_result[n].longitude)
        }
        for(var i=0;i<sorted_by_gps_result.length-1;i++){
            for(var j=1;j<sorted_by_gps_result.length-i;j++)
            {
                if(sorted_by_gps_result[j].distance < sorted_by_gps_result[j-1].distance){
                   var temp = sorted_by_gps_result[j-1];
                   sorted_by_gps_result[j-1] = sorted_by_gps_result[j];
                   sorted_by_gps_result[j] = temp;
                } 
            }
        }
        
        //-------------------
        
        res.render('search', {search : sorted_by_gps_result});
    });
});

module.exports = router;