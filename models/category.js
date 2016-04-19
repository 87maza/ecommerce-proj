var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
var CategorySchema = new Schema({
    name: { type: String, unique: true, lowercase: true}
});

module.exports = mongoose.model('Category', CategorySchema);

//'category' is the name of the model
//we need to separate between a category and a product just in case there are 100's of categories with sub products


