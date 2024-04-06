const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const orderSchema = new mongoose.Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  address:{
    streetaddress: String,
    city: String,
    zipcode: String,
    state: String,
    House_name: String,
    landmark: String,
    phone: Number,
  },
  products: [{
      quantity:Number,
      product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
      }}],
  totalAmount: Number,
  OrderStatus:{
    type:String,
    enum:['Order Placed','Shipped','Delivered','Cancelled','Returned']
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  paymentMethod: String,
  orderId:String,
  deliveredAt:Date
});

const order = mongoose.model('orders', orderSchema);

module.exports = order;