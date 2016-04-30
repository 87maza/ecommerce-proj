//handles home, product, cart, search routes
var router = require('express').Router();
//router is a subpath of a certain route
var User = require('../models/user');
var Product = require('../models/product');

function paginate(req,res,next) {
    var perPage = 9;
    var page = req.params.page;
    console.log(req.params);
    Product
        .find()
        .skip(perPage * page) //skips amount of documents
        .limit(perPage) //limits how many documents received per query,
        .populate('category')
        .exec(function(err, products){
            if(err) return next(err);
            Product.count().exec(function(err,count){  //count is a mongoose method
                if(err) return next(err);
                res.render('main/product-main', {
                    products: products,
                    pages: count/perPage
                });
            });
        });
}

Product.createMapping(function(err, mapping){
    //creates a bridge between product database and elasticsearch replica set
    if(err){
        console.log('err with mapping');
        console.log(err);
    }
    else{
        console.log("mapping created!");
        console.log(mapping);
    }
});

var stream = Product.synchronize();
var count = 0;

stream.on('data', function(){
    count++
});

stream.on('close', function(){
    console.log('indexed ' + count + ' documents')
});

stream.on('error', function(err){
    console.log(err)
});


router.post('/search', function(req,res,next){
    //go to a search route and pass this req.body.q
    res.redirect('/search?q=' + req.body.q);
});

router.get('/search', function(req,res,next){
    if(req.query.q){
        Product.search({
            query_string: {query: req.query.q}

        }, function(err, results){
            if(err) return next(err);
            var data = results.hits.hits.map(function(hit){
                //hits.hits is the returned object that we need
                return hit;
            });
            res.render('main/search-result', {
                query: req.query.q,
                data: data
            });
        });
    }
});

router.get('/', function(req, res, next){
    //adding pagination to home route upon successful login
    if(req.user) {
        paginate(req, res, next);
    }
    else {
        res.render('main/home');
    }
});

router.get('/page/:page', function(req,res,next){
    paginate(req,res,next);
});
router.get('/about', function(req, res){
    res.render('main/about');
});
router.get('/products/:id', function(req, res, next){
    //:id is a parameter when you want to get a specific url like products/foods, products/books, products/etc
    Product
        .find({ category: req.params.id})
        //querying that contains a specific category id based on :id, look at models/product schema
        .populate('category')
        //gets all the data inside the category(gadgets/books/etc) itself  its an express function
        .exec(function(err, products){
            //execute the anonymous function on all this methods, need to use exec when there are multiple methods
            res.render('main/category', {
                products: products
            });
        });
});


router.get('/product/:id', function(req,res,next){
    //queries under :id, req.params.id = /product/:id, renders to the specific product page
    Product.findById({ _id: req.params.id}, function(err, product){
        if(err)return next(err);
        res.render('main/product', {
            product: product
        });
    });
});


module.exports = router;