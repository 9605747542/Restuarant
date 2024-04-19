const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const orderSchema = new mongoose.Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  address:{
    type: [{
     
      phone: Number,
      email: String,
      streetaddress: String,
      city: String,
      zipcode: String,
      state: String,
      House_name: String,
      landmark: String
}]
  
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
  },
  shipping:Number,
  ActualAmount:Number,
  paymentMethod: String,
  orderId:String,
  deliveredAt:Date,
  useremail:String,
  username:String
});

const order = mongoose.model('orders', orderSchema);

module.exports = order;