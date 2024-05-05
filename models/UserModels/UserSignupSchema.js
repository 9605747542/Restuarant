const mongoose=require('mongoose');
const userSignup={
    name:{
        type:String,
    required:true
},

email:{
    type:String,
    required:true,
    unique:true
},
password1:{
    type:String,
    required:true
},
address: {
    type: [{
       
        phone: Number,
        email: String,
        streetaddress: String,
        city: String,
        zipcode: String,
        state: String,
        House_name: String,
        landmark: String
}]},

isBlocked:{
    type:Boolean,
    default:false,
},
referral:{
    type:String,
}
}
const User=mongoose.model('users',userSignup)
module.exports=User;
