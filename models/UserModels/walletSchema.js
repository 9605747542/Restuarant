const mongoose=require('mongoose');
const  walletSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    balance:{
        type:Number,
        default:0
    },
    transactionHistory:[
        {
            transaction:{
                type:String,
                enum:["Money Added","Money Deducted","Referral Money"]
            },
            amount:{
                type:Number
            }
        }
    ]
})
const wallet=mongoose.model('wallets',walletSchema);
module.exports=wallet;

 