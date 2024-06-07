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
        streetaddress: String,
        city: String,
        House_name: String,
     
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
