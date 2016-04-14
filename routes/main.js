//handles home, product, cart, search routes

router.get('/', function(req, res){
    res.render('main/home');
});
router.get('/about', function(req, res){
    res.render('main/about');
});