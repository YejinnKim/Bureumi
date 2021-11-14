const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    var id = req.user;
    res.render('index', { id: id });
});

module.exports = router;