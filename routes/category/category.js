const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../../join/connection');
const haversine = require('haversine');
const logger = require('../../config/logger');

router.get('/:category', async function (req, res) {
    var category = req.params.category;
    var flag = req.query.cag;
    if (req.session.user_info == undefined) {
        res.redirect('/error/info')   
    }
    else {

        switch (category) {
            case 'delivery':
                var __category = "배달";
                break;
            case 'convince':
                var __category = "편의점";
                break;
            case 'installation':
                var __category = "설치조립";
                break;
            case 'shopping':
                var __category = "장보기";
                break;
            case 'lineup':
                var __category = "줄서기";
                break;
            case 'postoffice':
                var __category = "우체국";
                break;
            case 'cleanup':
                var __category = "청소";
                break;
            case 'etc':
                var __category = "기타";
                break;
            default:
                var __category = "배달"
                category = "delivery";
                break;
        }
        var sql = 'select * from request where category = ? and not exists(select * from matching where request.request_code = matching.request_code) order by length(request_code) desc, request_code desc';

        connection.query(sql, __category, function (err, result) {
            if (err) {
                console.error(err); 
                logger.error('경로 : '+__dirname +'  message: '+err); 
                res.redirect('/error/connect')
            }

            const start = {
                latitude: req.session.user_info.addressLat,
                longitude: req.session.user_info.addressLon
            }
            var sorted_by_gps_result = [];
            var end = [];
            for (var n = 0; n < result.length ; n++) {
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

            if (flag == undefined || flag == 0) req.session.search_category = result;
            else req.session.search_category = sorted_by_gps_result
            req.session.category_page = category

            res.redirect('/' + category + '/1');

        });
    }
});




module.exports = router;