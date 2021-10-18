var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var connection = require('../../join/connection');

router.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../../www/views/update_success.html'));
})


module.exports = router;