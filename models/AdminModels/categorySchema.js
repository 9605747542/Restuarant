const mongoose=require('mongoose');
const categorys=new mongoose.Schema({
    categoryName:{
        type:String,
        unique:true,
        required:true
    }
   

})

const categorydetails=mongoose.model('category',categorys);
module.exports=categorydetails;