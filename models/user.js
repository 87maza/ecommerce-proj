//models folder will store all the database schemas (blueprint for the db, eg: user schema, cart schema)
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
//bcrypt is a hash library to hash password, pw = abc123 -> hash = 123243151j3khqjkshgl2341
var Schema = mongoose.Schema;
var crypto = require('crypto');

//Create the user schema attributes, characteristics, fields
var UserSchema = new Schema({
   email: { type: String, unique: true, lowercase: true},
    //Each user must have a different email!
   password:String,
    profile: {
        name: { type: String, default: ''},
        //if empty, default is empty string
        picture: { type: String, default: ''}
    },
   address: String,
   history: [{
       date: Date,
       paid: {type: Number, default: 0}
       // item: {type: Scheme.Types.ObjectId, ref: ''}
   }]
});


//Hash the password before we save to DB


UserSchema.pre('save', function(next){
   //pre is a mongoose method that every schema has, pre-save data before saving it to the database, like a pre-party
    var user = this;
    //this refers to the UserSchema object, var user = new User();, this referse to the user variable/object
    if(!user.isModified('password')) return next();
    //isModified is method that checks the password, if not then next
    bcrypt.genSalt(10, function(err, salt){
        //gensalt wil generat 10 different data
      if(err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash){
            //anonymouse function to create hash if no errors
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});



//compare password in the database and the one that the user typed in
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
};
//UserSchema.pre is a built in mongoose methods vs. UserSchema.methods is a custom method by the developer

UserSchema.methods.gravatar = function(size) {
    if (!this.size) size = 200;
    if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', UserSchema);
//exports this whole schema so that server.js can use it