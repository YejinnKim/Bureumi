const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../../join/connection');

//프로필에서 위치정보 변경 버튼 클릭
router.get('/', (req, res) => {
    if (req.session.user_info == undefined) {
        res.redirect('/error/info')
    }
    else {
        res.sendFile(path.join(__dirname, '../../www/views/map_update.html'));
    }
})


module.exports = router;