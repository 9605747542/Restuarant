const Userdb = require('../models/UserModels/UserSignupSchema')
const Productdb = require('../models/AdminModels/ProductSchema');
const Cartdb = require('../models/UserModels/usercartSchema');
const userlogin = require("../controllers/UserControllers/userlogin")
const userproduct = require('../controllers/UserControllers/userproductController')
const userprofile = require('../controllers/UserControllers/userprofileController')
const usercart = require('../controllers/UserControllers/usercartController');
const usercheckout = require('../controllers/UserControllers/checkoutController')
const orderconform = require('../controllers/UserControllers/orderconform')
const userwishlist=require('../controllers/UserControllers/wishlistController');
const express = require('express')
const userRoute = express();
const { isLogged, userisBlocked, checkStock,checkStock1 } = require('../middleware/userMIddle');
const usercoupon=require('../controllers/UserControllers/userCouponController');
const userwallet=require('../controllers/UserControllers/walletController');
const userinvoice=require('../controllers/UserControllers/invoiceDownnloadController');


userRoute.get('/', userlogin.showLogin);
userRoute.post('/submit1/:email', userlogin.checkLogin);

userRoute.get('/register', userlogin.signuppage)
userRoute.post('/register1', userlogin.postsignup);
userRoute.get('/getrefferalcode',userlogin.getrefferalcode)
userRoute.get('/otp-page', userlogin.getOtppage);
userRoute.post('/signup-otp', userlogin.verifyOtp);
userRoute.get('/resend-otp', userlogin.getresendotp);

userRoute.get('/forgotpassword', userlogin.getforgotpassword);
userRoute.post('/submit2', userlogin.checkemail);
userRoute.get('/resetpassword/:email', userlogin.getresetpassword);
userRoute.post('/forgot-otp', userlogin.verifyforgototp);
userRoute.get('/resetuser/:email', userlogin.resetuserdetails);
userRoute.post('/submitpassword', userlogin.postnewpassword);



userRoute.get('/home', isLogged, userisBlocked, userlogin.showHome);



userRoute.get('/getuserproduct', isLogged, userproduct.getproductpage);
userRoute.get('/search', isLogged, userproduct.searchproducts);
userRoute.get('/filter', isLogged, userproduct.categoryfilter);
userRoute.get('/sort', isLogged, userproduct.sortproducts);


userRoute.get('/clickproduct', isLogged, userproduct.getproductdetails);
userRoute.get('/logout', userlogin.userlogout);



userRoute.get('/userprofile', isLogged, userprofile.getuserprofile);
userRoute.get('/changeprofilepassword/:email', userprofile.getchangepasswordpage);
userRoute.post('/postuserprofile', isLogged, userprofile.postuserprofile);
userRoute.post('/postuseraddress', isLogged, userprofile.postuseraddress);
userRoute.get('/getalladdress', isLogged, userprofile.getalladdress);
userRoute.get('/addaddress', isLogged, userprofile.addaddress);
userRoute.get('/geteditaddress/:id', isLogged, userprofile.geteditaddress)
userRoute.post('/posteditaddress', isLogged, userprofile.posteditaddress);
userRoute.post('/postdltaddress', isLogged, userprofile.deleteaddress);




userRoute.post('/postaddtocart', isLogged, checkStock, usercart.postusercart);
userRoute.get('/usercart', isLogged, usercart.getusercart)

userRoute.post('/changequantity', isLogged, checkStock, usercart.changequantity);
userRoute.post('/changetotal', isLogged, usercart.changesubtotal);
userRoute.delete('/removeitemfromcart/:id', isLogged, usercart.removecartitem);

userRoute.get('/getcheckout', isLogged,checkStock1,usercheckout.getcheckout);
userRoute.get('/getcheckoutpage',isLogged,usercheckout.getcheckoutpage)
userRoute.post('/post-userddress-checkout', isLogged, usercheckout.postaddresscheckout)
userRoute.post('/postorderconformdetails', isLogged, orderconform.getorderconform);
userRoute.get('/getorder-conform', isLogged, orderconform.getorderconformpage);
userRoute.post('/verify-payment',isLogged,orderconform.checkrazorpay);
userRoute.get('/getorderdetails', isLogged, orderconform.getorderdetailspage);
userRoute.get('/viewmoredetails', isLogged, orderconform.getmoredetailspage);
userRoute.post('/deleteOrder', isLogged, orderconform.deleteorder);

userRoute.get('/getwishlist',isLogged,userwishlist.getuserwishlist);
userRoute.post('/addtowishlist',isLogged,userwishlist.postuserwishlist);
userRoute.post('/removefromwishlist/:id',isLogged,userwishlist.removewishlist);

userRoute.get('/getcouponcode/:value',isLogged,usercoupon.getcouponcode);



userRoute.get('/getuserwallet',isLogged,userwallet.getwalletpage);
userRoute.get('/continuepayment/:id',isLogged,orderconform.continuePaymentFailed);
userRoute.get('/getcheckout1',isLogged,orderconform.getpaymentpending);

userRoute.get('/downloadinvoice/:id',isLogged,userinvoice.downloadDeliveredInvoice);
userRoute.get('/returnorder/:id',isLogged,userinvoice.getreturnorder);





module.exports = userRoute;




