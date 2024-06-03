const userwallet={};
const Walletdb=require('../../models/UserModels/walletSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema');
userwallet.getwalletpage=async(req,res)=>{
    const data=await Walletdb.findOne({userId:req.session.userid})
    const user=await Userdb.findOne({_id:req.session.userid});
    const userName=user.name;
    res.render('userViews/walletdetails',{data,userName})
}




module.exports=userwallet;