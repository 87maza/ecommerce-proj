//handles user login, signup, logout routes

var router = require('express').Router();
var User = require('../models/user');

router.get('/signup', function(req,res,next){
    res.render('accounts/signup', {
        errors: req.flash('errors')
    });
});

router.post('/signup', function(req,res,next){
    //
    var user = new User();
    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    User.findOne({email: req.body.email}, function(err, existingUser){
        //mongoose method, find only one document in the user database
        //we are querying for the users email
        if(existingUser){
            //if the req.body.email matches an email in the DB, do this >>
            // console.log(req.body.email + " is already in use"); not needed anymore
            req.flash('errors', 'Account with that email address already exists');
            return res.redirect('/signup');
        }
        else {
            user.save(function(err, user){
                if(err) return next(err);

                // res.json('New user has been created') not needed anymore
                return res.redirect('/');
            });
        }
    });
});

module.exports = router;
