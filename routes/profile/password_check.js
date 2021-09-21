var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.get('/', (req,res) => {
    res.render('password_check')
})

router.post('/checking', (req,res) => { 


    if(!req.body.password){
        console.log('비밀번호가 입력되지 않았습니다.')
        res.redirect('/pass_check')
    }
    else if(req.body.password === req.session.user_info.user_password){
        res.redirect('/user_info')
    }
    else{
        console.log('password incorrect')
        res.redirect('/pass_check')
    }

})

module.exports = router;