var router = require('express').Router();
var Category = require('../models/category');

router.get('/add-category', function(req,res,next){
    //getting category page only admins can access

    res.render('admin/add-category', {message: req.flash('success')});
});

router.post('/add-category', function(req, res, next){
    //relies on category schema,
    var category = new Category();
    category.name = req.body.name;

    category.save(function (err) {
        //save data in category.name field
        if(err) return next(err);
        req.flash('success', 'Successfully added a category');
        return res.redirect('/add-category');
    })
});

module.exports = router;