const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const categorys=new mongoose.Schema({
    categoryName:{
        type:String,
        unique:true,
        required:true
    },
    products:[{
        type:Schema.Types.ObjectId,
        ref:'products',
    }],
    isListed:{
        type:Boolean,
        default:true
    },
    popularity:{
        type:Number,
        default:0
    }
})

const categorydetails=mongoose.model('categorys',categorys);
module.exports=categorydetails;