//handles home, product, cart, search routes
var router = require('express').Router();
//router is a subpath of a certain rout

router.get('/', function(req, res){
    res.render('main/home');
});
router.get('/about', function(req, res){
    res.render('main/about');
});

module.exports = router;