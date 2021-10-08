const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const haversine = require('haversine');
const { connect } = require('http2');

router.get('/', function (req, res, next) {
    var search = req.query.search_box,
        search_req = req.query.search_req;
    req.session.search = search
    req.session.search_req = search_req // search_list.html 검색창 드롭박스

    res.redirect('search_list/1');
})

router.get('/:page', function (req, res) {
    var page = req.params.page;

    var id = req.session.user_info.user_id;
    if (!id) res.render('login');

    var searching = req.session.search;
    var sql = 'select * from request where request_title like ? and not exists(select * from matching where request.request_code = matching.request_code)  order by request_code desc';

    connection.query(sql, ["%" + searching + "%"], function (err, result) {
        if (err) { throw err; }
        else {
            if (req.session.search_req == 'real_time'){
                 var final_result = result;
                 var search_view = "검색어 : "+searching + "   정렬 : 최신순";
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
                var search_view = "검색어 : "+searching + "   정렬 : 거리순";
                var final_result = sorted_by_gps_result;
            }
            var total_page = Math.ceil(result.length / 5)
            res.render('search_list', {
                search_content : search_view,
                search: final_result,
                total_page: total_page,
                page: page,
                length: result.length - 1
            });

        }

    });

});

module.exports = router;
