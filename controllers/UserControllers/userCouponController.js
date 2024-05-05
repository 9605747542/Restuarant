const usercoupon={};
const CouponDB=require('../../models/AdminModels/couponSchema');
usercoupon.getcouponcode=async(req,res)=>{
const total=req.params.value;
console.log("hhhhhhhhhh",total);
const data=await CouponDB.find();
data.forEach(item=>{
    if(item.price<=total){
        let value= item.couponName;
        console.log("more",value);
      req.session.couponcode=value;
        res.json({ success: true, message: 'Successfully Added', value });
    }else{
        res.json({success:false,message:'Not Added'})
    }
})


}
usercoupon.applycoupon = async (req, res) => {
    const coupon = req.params.coupon;
    console.log("hai", coupon);
    try {
        const data = await CouponDB.findOne({ couponName: coupon });
        console.log(data.discount);
        res.json({ success: true, message: "Successfully getting", data }); // Combine into a single object

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Not Successfully getting" });
    }
}



module.exports=usercoupon;