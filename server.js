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
var session = require('express-session');
//uses cookie to store session-id, session-id is an encryption signature on the users browser
//on subsequent requests, it uses the value of the cookie to retrieve session information stored on the server
//this server side storage can be a memory store  default or connect-redis/connect-mongo
var cookieParser = require('cookie-parser');
//session is stored on the server, cookie is stored on the browser, once browser is closed, need to re-login, re identify
//http is stateless, we need a way store user data between http requests, store this data server side
var flash = require('express-flash');
//checks error logic
var secret = require('./config/secret');
var MongoStore = require('connect-mongo')(session);
//need to pass in session object to mongoStore so that it knows that the session will be passion on express-session library
//mongostore depends on express-session library, it won't work without it
var User = require('./models/user');
//module from user.js
var app = express();

mongoose.connect(secret.database, function(err){
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
app.use(cookieParser());
app.use(session({
    //send an object
    resave: true,
    //resave forces the session to be saved back to the session stores, even if the session wasn't modified during req
    saveUninitialized: true,
    //forces a session that is unintialized to be saved to the memory store
    //a session is unintialized when it is new but not modified
    secret: secret.secretKey,
    store: new MongoStore({url:secret.database, autoReconnect:true})
    //session will be saved in the mongoStore, passing in the url and autorecc
}));
app.use(flash());
//flash is depending on session and cookie because you want to save a flash message on a session so it can be used 
//on another request route

app.engine('ejs', engine);
//app.engine selects the ejs engine
app.set('view engine', 'ejs');
//app.set sets the engine to ejs


var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
//can also take multiple params
app.use(userRoutes);





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





app.listen(secret.port, function(err) {
    //listen,post,put,delete
    //function(err) is a validation callback
    if (err) throw err;
    console.log('Server is Running on ' + secret.port);
});

