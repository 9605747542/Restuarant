const mongoose=require('mongoose');
const Products = require('../AdminModels/ProductSchema')
const Schema=mongoose.Schema;
const cartSchema = new mongoose.Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'users' 
    },

    products: [{
        quantity: Number,
        total:Number,
    
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products' 
        }
    }]
    
});

const cartdetails=mongoose.model('carts',cartSchema);
module.exports=cartdetails;
