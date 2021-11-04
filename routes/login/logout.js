const express = require('express')
const app = express()
const router = express.Router() //라우터 메서드
const logger = require('../../config/logger');

router.get('/',async function(req, res){
    console.log('logout')
/*     req.logout();
    req.session.destroy(); */
    req.logout();
    await LogOut();
    
    function LogOut(){
        logger.info('<LOGIN-logout> [id] : '+req.session.user_info);
        req.session.destroy(function(){ 
            req.session;
            });
            
    }
    res.redirect('/login');
});

module.exports = router;    