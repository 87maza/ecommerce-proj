var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');

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