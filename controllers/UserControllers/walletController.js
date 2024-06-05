const userwallet={};
const Walletdb=require('../../models/UserModels/walletSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema');
userwallet.getwalletpage=async(req,res)=>{
    const data=await Walletdb.findOne({userId:req.session.userid})
   
    const user=await Userdb.findOne({_id:req.session.userid});
    const userName=user.name;
    if(data){
        res.render('userViews/usercart', {data,userName, message: '' });
    }else{
       
            res.render('userViews/usercart', { datas: [],userName, message: 'No Wallet found in Wallets.' });
        

    }
  
}




module.exports=userwallet;