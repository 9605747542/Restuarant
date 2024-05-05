const mongoose=require('mongoose');
const offerSchema={
    offerName:{
        required:true,
        type:String,
        unique:true
    },
    discount_on:{
        type:String,
        required:true,

    },
    discount_value:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    item_description:{
        type:String,
        required:true
    }
   

}
const offermodule=mongoose.model('offers',offerSchema);
module.exports=offermodule;