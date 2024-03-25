const mongoose=require('mongoose');
const userSignup={
    name:{
        type:String,
    required:true
},
lname:{
    type:String,
   

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
        fname: String,
        phone: Number,
        email: String,
        streetaddress: String,
        city: String,
        zipcode: String,
        state: String,
        addressline1: String,
        addressline2: String,
        House_name: String,
        landmark: String
}]},

isBlocked:{
    type:Boolean,
    default:false,
}
}
const User=mongoose.model('user',userSignup)
module.exports=User;
