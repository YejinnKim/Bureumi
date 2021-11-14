const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const haversine = require('haversine');
const { connect } = require('http2');
const logger = require('../../config/logger');

router.get('/', function (req, res, next) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    var search = req.query.search_box,
        search_req = req.query.search_req;
    req.session.search = search
    req.session.search_req = search_req // search_list.html 검색창 드롭박스
    res.redirect('search_list/1');
})

router.get('/:page', function (req, res) {
    var page = req.params.page;
    var final_result
    var id = req.session.user_info.user_id;
    if (req.session.user_info == undefined) res.redirect('/error/info');
    else {
        var searching = req.session.search;
        var sql = 'select * from request where request_title like ? and not exists(select * from matching where request.request_code = matching.request_code)  order by request_code desc';

        connection.query(sql, ["%" + searching + "%"],async function (err, result) {
            if (err) {
                console.error(err);
                logger.error('경로 : ' + __dirname + '  message: ' + err);
                res.redirect('/error/connect')
            }
            else {
                if (req.session.search_req == 'real_time') {
                    var search_view = "검색어 : " + searching + "   정렬 : 최신순";
                    const start = {
                        latitude: req.session.user_info.addressLat,
                        longitude: req.session.user_info.addressLon
                    }
                    var final_result = [];
                    var end = [];
                    for (var n = 0; n < result.length; n++) {
                        end[n] = {
                            latitude: result[n].latitude,
                            longitude: result[n].longitude
                        }

                        result[n].distance = haversine(start, end[n])
                        final_result[n] = result[n]
                    }
                    await DistanceTranslate(final_result);
                }
                else {
                    const start = {
                        latitude: req.session.user_info.addressLat,
                        longitude: req.session.user_info.addressLon
                    }
                    var sorted_by_gps_result = [];
                    var end = [];
                    for (var n = 0; n < result.length; n++) {
                        end[n] = {
                            latitude: result[n].latitude,
                            longitude: result[n].longitude
                        }

                        result[n].distance = haversine(start, end[n])

                        sorted_by_gps_result[n] = result[n]
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
                    await DistanceTranslate(sorted_by_gps_result);
            
                    var search_view = "검색어 : " + searching + "   정렬 : 거리순";
                    final_result = sorted_by_gps_result;
                }
                var total_page = Math.ceil(result.length / 5)

                res.render('search_list', {
                    id: id, 
                    search_content: search_view,
                    search: final_result,
                    total_page: total_page,
                    page: page,
                    length: result.length - 1
                });
            }
        });
    }
    function DistanceTranslate(n){
        for(var i = 0; i< n.length;i++) 
        {
            var temp =  n[i].distance;
            if(temp.toFixed(1) < 1){
                temp = Math.floor(temp * 1000);
                n[i].distance = temp+"m";
            } 
            else{
                n[i].distance = temp.toFixed(1)+"km";
            }
        }
    }
});

module.exports = router;
