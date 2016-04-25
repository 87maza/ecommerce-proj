//handles home, product, cart, search routes
var router = require('express').Router();
//router is a subpath of a certain route
var User = require('../models/user');
var Product = require('../models/product');


router.get('/', function(req, res){
    res.render('main/home');
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