const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');

router.get('/', function (req, res) { // 개인정보 출력
    if (req.session.user_info == undefined) res.redirect('/error/info')
    else {
        var id = req.session.user_info.user_id,
            password = req.session.user_info.user_password,
            user_name = req.session.user_info.user_name,
            birth_date = req.session.user_info.birth_date
        phone_number = req.session.user_info.user_phonnumber

        var year = birth_date.substring(0, 4),
            month = birth_date.substring(5, 7),
            day = birth_date.substring(8, 10)

        res.render('join_update', {
            'user_id': id,
            'user_password': password,
            'user_name': user_name,
            'phone_number': phone_number,
            'year': year,
            'month': month,
            'day': day
        })
    }

})
module.exports = router;