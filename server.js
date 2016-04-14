var express = require('express');
var morgan = require('morgan');
//morgan is middleware feature for express that helps with HTTP requests on the node server, check the console
//example: GET / 304 3.676 ms - - once we refresh the home screen OR GET /batman 404 3.414 ms - 19
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//takes body of the request and parse it to whatever post/put request you want your server to receive
//this CANT handle multipart uploads like image/video.  format can be json, url-encoded, text, raw
var ejs = require('ejs');
//is a templating engine
var engine = require('ejs-mate');
//ejsMate is an extension of ejs that will help create flexible webpages a supercharger


var User = require('./models/user');

var app = express();

mongoose.connect('mongodb://admin:admin@ds023520.mlab.com:23520/ecom-test', function(err){
    if(err) {
        console.log(err);
    } else {
        console.log("connected to database!")
    }
});

//MIDDLEWARE
app.use(express.static(__dirname + '/public'));
//the public folder is now for static files
//static is an express method, use it declaring it in the middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
//our express app will now be able to parse json data format
app.use(bodyParser.urlencoded({extended: true}));
//urlencoded will only save users with the x-www-form-urlencoded NOT form-data
app.engine('ejs', engine);
//app.engine selects the ejs engine
app.set('view engine', 'ejs');
//app.set sets the engine to ejs



app.post('/create-user', function(req, res, next){
//next parameter is a callback
    
    
    var user = new User();

    user.profile.name = req.body.name;
    //based on UserSchema constructor
    user.password = req.body.password;
    user.email = req.body.email;

    user.save(function(err){
        if (err) next(err);
        res.json('successfully created a new user!');
    })
});


// app.post();
//posting data you entered to the server, server validates and responds back with appropriate data

// app.put();
//updating the data, similar to post

// app.delete();
//delete certain data


// app.get('/catname', function(req, res) {
//     res.json("meow");
// });
//
// app.get('/', function(req, res){
//     var name = "judge";
//     res.json("My name is " + name);
//whenever goes to this url, .get will respond back with something
// });





app.listen(3000, function(err) {
    //listen,post,put,delete
    //function(err) is a validation callback
    if (err) throw err;
    console.log('Server is Running')
});

