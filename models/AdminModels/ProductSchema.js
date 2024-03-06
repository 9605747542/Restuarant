// productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique:true
  },
  price: {
    type: Number,
    required: true,
  },
  priceInMasala:{
    type:Number,
    required:true,
  },
  image:{
    type:Array,
    required:true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
