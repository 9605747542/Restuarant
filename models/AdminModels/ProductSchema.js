// productModel.js
const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  image:{
    type:Array,
    required:true,
  },
  description: {
    type: String,
    required: true,
  },
  unlist:{
    type:Boolean,
    default:false
  },
  category:{
    type:Schema.Types.ObjectId,
    ref:'categorys'
  },
  stock: {
    type: Number, 
    required: true,
    default: 0, // Assuming new products start with no stock
    min: [0, 'Stock cannot be negative.'] // Prevents stock from being negative
  },
  orginalPrice:{
    required:true,
    type:Number
  },
  discount:{
    required:true,
    type:String
  },
  offertype:{
    required:true,
    type:String
  }
}, { timestamps: true }); 

const Product = mongoose.model('products', productSchema);

module.exports = Product;
