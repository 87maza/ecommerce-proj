var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic');

var ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    name: String,
    price: Number,
    image: String
});


ProductSchema.plugin(mongoosastic,{
    //standard elasticsearch server is 9200
    hosts: [
        'localhost:9200'
    ]
})
//each product will have one category
module.exports = mongoose.model('Product', ProductSchema);

//objectId = unique mongo generated _id, we reference the product base on the category objectID so that we can populate
//the data inside the Category Schema

//ProductSchema, has category that has type:objectid and refer to Category Schema only

