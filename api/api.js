var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');

router.post('/search', function(req,res,next){
    //.search is a mongoosastic method
    console.log(req.body.search_term);
    Product.search({
        query_string: {query: req.body.search_term}
    }, function(err,results){
        if(err) return next(err);
        res.json(results);
        //we'll have an ajax call for the query_string
    });
});

router.get('/:name', function(req,res,next) {
    //search the name of the category db, gadgets/food/books
    async.waterfall([
        //this async has two functions, first we find a category, name
        function(callback) {
            Category.findOne({name: req.params.name}, function(err, category) {
                //if found then pass in the callback below
                if(err) return err;
                callback(null, category);
            });
        },
        function(category, callback) {
            //loops 30 times creating a new category product
            for (var i = 0; i<30; i++){
                var product = new Product();
                product.category = category._id;
                product.name = faker.commerce.productName();
                product.price = faker.commerce.price();
                product.image = faker.image.image();

                product.save();
            }
        }
    ]);
    res.json({message: 'Success'});
});
module.exports = router;