const usercoupon={};
const CouponDB=require('../../models/AdminModels/couponSchema');
usercoupon.getcouponcode = async (req, res) => {
    const total = req.params.value;
    console.log("Total:", total);
    const data = await CouponDB.find();
    let closestCoupon = null;
    let minDifference = Infinity;

    data.forEach(item => {
        const priceDifference = Math.abs(item.price - total);
        if (priceDifference < minDifference) {
            minDifference = priceDifference;
            closestCoupon = item;
        }
    });

    if (closestCoupon) {
        console.log("Closest Coupon:", closestCoupon.couponName);
        req.session.couponcode = closestCoupon.couponName;
        res.json({ success: true, message: 'Successfully Added', value: closestCoupon.couponName,discount:closestCoupon.discount });
    } else {
        res.json({ success: false, message: 'No suitable coupon found.' });
    }
}





module.exports=usercoupon;