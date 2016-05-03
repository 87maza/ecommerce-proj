//handles user login, signup, logout routes

var router = require('express').Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var passport = require('passport');
var passportConf = require('../config/passport');
var async = require('async');
router.get('/login', function(req,res){
    if(req.user) return res.redirect('/');
    res.render('accounts/login',{message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', function(req, res){
   User.findOne({_id: req.user._id}, function(err, user){
       //check if user_id exists
       if(err) return next(err);
       res.render('accounts/profile',{user: user});
       //render the user object
   });
});

router.get('/signup', function(req,res,next){
    res.render('accounts/signup', {
        errors: req.flash('errors')
    });
});

router.post('/signup', function(req,res,next) {
    async.waterfall([
        function (callback) {
            //creating initial user
            var user = new User();
            user.profile.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.profile.picture = user.gravatar();

            User.findOne({email: req.body.email}, function (err, existingUser) {
                //mongoose method, find only one document in the user database
                //we are querying for the users email
                if (existingUser) {
                    //if the req.body.email matches an email in the DB, do this >>
                    // console.log(req.body.email + " is already in use"); not needed anymore
                    req.flash('errors', 'Account with that email address already exists');
                    return res.redirect('/signup');
                }
                else {
                    user.save(function (err, user) {
                        if (err) return next(err);
                        //save user and call callback
                        // res.json('New user has been created') not needed anymore
                        callback(null, user);
                    });
                }
            });
        },
        function (user) {
            //pass in user object as param so this function can get the user object
            var cart = new Cart();
            //create new cart object and store the user id as the cart owner, 1 cart 1 user
            cart.owner = user._id;
            //save cart and login user so the session is created for teh server and cookie for browser
            cart.save(function (err) {
                if (err) return next(err);
                req.logIn(user, function (err) {
                    if (err) return next(err);
                    res.redirect('/profile');
                });
            });
        }
    ]);
});


router.get('/logout', function(req,res,next){
    req.logout();
    //.logout is a passport method
    res.redirect('/');
});

router.get('/edit-profile', function(req,res,next){
    //getting a successfule edit page
   res.render('accounts/edit-profile', {message: req.flash('success')});
});
router.post('/edit-profile', function(req,res,next){
    User.findOne({_id: req.user._id}, function(err, user){
        if (err) return next(err);
        //if user doesnt exist, do this
        if(req.body.name) user.profile.name = req.body.name;
        //body.name, then change the user.name in a database
        if(req.body.address) user.address = req.body.address;
        user.save(function(err){
            //save changes
            if(err) return next(err);
            req.flash('success', 'Successfully edited your profile');
            return res.redirect('/edit-profile');
        });
    });
});
module.exports = router;
