const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const wishlistSchema=new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    productCategory:{
        type:'String',
        required:true
    }

})
const wishlistDetails=mongoose.model('wishlists',wishlistSchema);
module.exports=wishlistDetails;
