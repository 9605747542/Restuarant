const userlogin=require("../controllers/UserControllers/userlogin")
const userproduct=require('../controllers/UserControllers/userproductController')
const userprofile=require('../controllers/UserControllers/userprofileController')
const express=require('express')
const userRoute=express();
const isLogged = require('../middleware/userMIddle');


userRoute.get('/',userlogin.showLogin);

userRoute.post('/submit1',userlogin.checkLogin);
userRoute.get('/register',userlogin.signuppage)
userRoute.post('/register1',userlogin.postsignup);
 userRoute.get('/otp-page',userlogin.getOtppage);
 userRoute.get('/resend-otp',userlogin.getresendotp);

userRoute.get('/forgotpassword', userlogin.getforgotpassword);
userRoute.post('/submit2',userlogin.checkemail);
userRoute.get('/resetpassword/:email',userlogin.getresetpassword);
userRoute.post('/forgot-otp',userlogin.verifyforgototp);
userRoute.get('/resetuser/:email',userlogin.resetuserdetails);
userRoute.post('/submitpassword',userlogin.postnewpassword);



userRoute.get('/home',isLogged,userlogin.showHome);
// userRoute.get('/signup-otp',userlogin.showOtp);
userRoute.post('/signup-otp',userlogin.verifyOtp);
// userRoute.post('/reset-password',userlogin.resendOtp);
userRoute.get('/getuserproduct',isLogged,userproduct.getproductpage);
userRoute.get('/clickproduct',isLogged,userproduct.getproductdetails);
userRoute.get('/logout',userlogin.userlogout);
userRoute.get('/userprofile',isLogged,userprofile.getuserprofile)
userRoute.post('/postuserprofile',isLogged,userprofile.postuserprofile)
userRoute.get('/getalladdress',isLogged,userprofile.getalladdress)
userRoute.get('/addaddress',isLogged,userprofile.addaddress)
userRoute.get('/geteditaddress/:id',isLogged,userprofile.geteditaddress)
userRoute.post('/posteditaddress',isLogged,userprofile.posteditaddress);

module.exports=userRoute;




