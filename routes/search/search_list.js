const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../connection');
const haversine = require('haversine');
const { connect } = require('http2');

router.get('/', function (req, res) {
    var id = req.user;
    if (!id) res.render('login');

    var searching = req.query.search_box;
    console.log(searching)
    var sql = 'select * from request where request_title like ? order by request_code desc';

    connection.query(sql, ["%" + searching + "%"], function (err, result) {
        if (err) { throw err; }
        else {
            res.render('search_list', {
                search: result,
            });
        }

    });

});





module.exports = router;