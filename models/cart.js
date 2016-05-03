var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CartSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
    //refering to user so each user can have their own Cart
  total: {type: Number, default: 0},
    //total price for cart, default is zero to prevent undefined fields
  items: [{
    //render items so that you can see the items bought
        item: { type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, default: 1},
      //quantity will start at 1
        price: {type: Number, default: 0}
    }]
});
module.exports = mongoose.model('Cart', CartSchema);

//we need to pass in the userid and store it in Cart.owner