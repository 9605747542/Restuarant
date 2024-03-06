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
isBlocked:{
    type:Boolean,
    default:false,
}
}
const User=mongoose.model('hotel',userSignup)
module.exports=User;
