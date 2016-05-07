var Cart = require('../models/cart');

module.exports = function( req, res, next){
    //if there is a user, then create a total of products inside cart
    if(req.user) {
        var total = 0;
        Cart.findOne({owner: req.user._id}, function(err, cart){
            if(cart) {
                //increase total items by the amount of quantity of items
                for(var i = 0; i<cart.items.length; i++){
                    total += cart.items[i].quantity;
                }
                res.locals.cart = total;
            }
            else{
                res.locals.cart = 0;
            }
            next();
        })
    }
    else{
        next();
    }
};

