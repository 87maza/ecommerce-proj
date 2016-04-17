//this file is a middleware
var passport = require('passport');
//passport is for the authentication
var LocalStrategy = require('passport-local').Strategy;
//local strategy is for handrolled authentication
var User = require('../models/user');

//SERIALIZE and DESERIALIZE
passport.serializeUser(function(user,done){
    //serialization is the process of translating data structures or object state into a format that can be stored
    //we want to translate the user object and store it into mongo/connect-db
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        //mongoose method findById
        done(err,user);
    });
});




//middleware
passport.use('local-login', new LocalStrategy({
    //middleware's name is 'local-login', create a new anonymous instance of localstrat
    //pass it required fields
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    //anonymous function that will match the email from the database
    User.findOne({email:email}, function(err, user){
        if(err) return done(err);

        if(!user) {
            return done(null, false, req.flash('loginMessage', 'No user has been found'));
        }
        if(!user.comparePassword(password)){
            return done(null, false, req.flash('loginMessage', 'Wrong Password bRAH'));
        }
        return done(null, user);
        //returns the validated user and the user object which contains user._id, user.profile
        //the request object will now have access to req.user._id, we are now able to pass around
    });
}));



//custom function to validate

exports.isAuthenticated = function(req, res, next){
    //isAuthent is a method we created on the exports object
    if(req.isAuthenticated()){
        //grant access to user if authenticated
        return next();
    }
    res.redirect('/login');
};