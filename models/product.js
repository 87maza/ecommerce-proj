var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
var ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    name: String,
    price: Number,
    image: String
});

//each product will have one category

module.exports = mongoose.model('Product', ProductSchema);

//objectId = unique mongo generated _id, we reference the product base on the category objectID so that we can populate
//the data inside the Category Schema

//ProductSchema, has category that has type:objectid and refer to Category Schema only
