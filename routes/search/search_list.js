const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const haversine = require('haversine');
const { connect } = require('http2');

router.get('/',function(req,res,next){
    var search = req.query.search_box;
    req.session.search = search
    res.redirect('search_list/1');
})

router.get('/:page', function (req, res) {
    var page = req.params.page;

    var id = req.session.user_info.user_id;
    if (!id) res.render('login');

    var searching = req.session.search;
    console.log(searching)
    var sql = 'select * from request where request_title like ? and not exists(select * from matching where request.request_code = matching.request_code)  order by request_code desc';
    var search_result = [];
    connection.query(sql, ["%" + searching + "%"], function (err, result) {
        if (err) { throw err; }
        else {
            var total_page = Math.ceil(result.length/5)
            res.render('search_list', {
                search: result,
                total_page : total_page,
                page : page,
                length : result.length-1
            });
        }

    });

});


module.exports = router;
