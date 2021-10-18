var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/', function (req, res) {
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var id = req.user;
        var sql = 'select * from request where request_code in (select request_code from matching where (requester_id = ? or bureumi_id = ?) and matching_progress = \'완료\' and matching_code not in (select matching_code from review where review_writer = ?))';
        var ids = [id, id, id];

        connection.query(sql, ids, function (err, result) {
            if (err) {console.error(err); res.redirect('/error/connect')}
            res.render('review', { id: id, value: result });
        });
    }
});

module.exports = router;