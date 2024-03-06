const userlogin=require("../controllers/UserControllers/userlogin")
const userproduct=require('../controllers/UserControllers/userproductController')
const express=require('express')
const userRoute=express();


userRoute.get('/',userlogin.showLogin);

userRoute.post('/submit1',userlogin.checkLogin);
userRoute.get('/register',userlogin.signuppage)
userRoute.post('/register',userlogin.postsignup);
 userRoute.get('/otp-page',userlogin.getOtppage);
// userRoute.post('/otpPage',userlogin.postsignup);

userRoute.get('/home',userlogin.showHome);
// userRoute.get('/signup-otp',userlogin.showOtp);
userRoute.post('/signup-otp',userlogin.verifyOtp);
// userRoute.post('/reset-password',userlogin.resendOtp);
userRoute.get('/getuserproduct',userproduct.getproductpage);
userRoute.get('/clickproduct',userproduct.getproductdetails);
userRoute.get('/logout',userlogin.userlogout);

module.exports=userRoute;




