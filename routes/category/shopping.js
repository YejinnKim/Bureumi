const express = require('express');
const router = express.Router();


router.get('/:page',async function (req, res) {
    var page = req.params.page;

    var id = req.session.user_info.user_id;
    if (!id) res.render('login');
    
    var search_category = req.session.search_category
    var category_page = req.session.category_page;
    var total_page = Math.ceil(search_category.length / 5)
    var cag_flag = '3';
    res.render('category', {
        id: id, 
        search: search_category,
        category : category_page,
        total_page: total_page,
        page: page,
        length: search_category.length - 1,
        cag_flag : cag_flag
    });


});


module.exports = router;
