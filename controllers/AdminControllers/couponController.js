const CouponDB=require('../../models/AdminModels/couponSchema');
const usercoupon={};

usercoupon.getcouponpage=async(req,res)=>{
    console.log("hello");
    const data=await CouponDB.find();
    res.render('Adminviews/coupondetails',{data})
}

usercoupon.getaddcoupon=async(req,res)=>{
    res.render('Adminviews/addcoupon');
}

usercoupon.addnewcoupon = async (req, res) => {
    const { couponcode, price, discount, expiryDate: endDate,startDate:startDate } = req.body;
  
    console.log("data", couponcode, price, discount, endDate,startDate);
    
    try {
      const couponDetails = await CouponDB.findOne({ couponName: couponcode });
      console.log("then", couponDetails);
      
      if (couponDetails) {
        return res.json({ success: false, message: "Coupon is already there" });
      }
  
      const data = new CouponDB({
        couponName: couponcode,
        price: price,
        discount: discount,
        expiry: endDate,
        startDate:startDate
      });
  
      await data.save();
      res.json({ success: true, message: "Successfully saved" });
  
    } catch (error) {
      res.status(500).json({ success: false, message: "Not saved", error: error.message });
      console.log(error);
    }
  };
  

usercoupon.geteditcoupon=async(req,res)=>{
    const couponID=req.query.id;
    console.log("id in the backend",couponID);
    const data=await CouponDB.findById(couponID);
    console.log("data ",data);
    res.render('Adminviews/editcoupon',{data});

}

usercoupon.posteditcoupon=async(req,res)=>{
    const couponcode=req.body.couponcode;
    const price=req.body.price;
    const discount=req.body.discount;
    const expiry_date=req.body.date;
    console.log(expiry_date);
    console.log("editing");
    console.log("data",couponcode,price,discount,expiry_date);
    try {
        const data=await CouponDB .findOne({couponName:couponcode});
        console.log("checking",data);

        data.couponName=couponcode;
        data.price=price;
        data.discount=discount;
        data.expiry=expiry_date;
        

        await data.save();
        res.json({success:true,message:"SuccessFully edited"})
        
    } catch (error) {
        res.json({success:false,mesage:'Not edited'})
        console.log(error);
        
    }
}

usercoupon.blockcoupon=async(req,res)=>{
   const couponId=req.params.id;
    const data=await CouponDB.findById(couponId);
    console.log("coupon data",data);
    if(data.isBlocked===false){
        data.isBlocked=true;
       await data.save();
       res.json({success:true,message:"Blocked"})

    }else{
        res.json({success:false,message:"Not working"})
    }

}
usercoupon.unblockcoupon=async(req,res)=>{
    const couponId=req.params.id;
    console.log("wast",couponId);
    const data=await CouponDB.findById(couponId);
    if(data.isBlocked===true){
        data.isBlocked=false;
       await data.save();
       res.json({success:true,message:"Blocked"})

    }else{
        res.json({success:false,message:"Not working"})
    }

}



module.exports=usercoupon;