const mongoose=require('mongoose');
const couponSchema=new mongoose.Schema({
    couponName:{
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },
    price:{
        type:Number,
        required:true
    },
  
    discount:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    expiry:{
        type:Date,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        default:false
    
    }

})
const coupon=mongoose.model('coupons',couponSchema);
module.exports=coupon;
