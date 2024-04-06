const Userdb=require('../models/UserModels/UserSignupSchema')
const userlogin=require("../controllers/UserControllers/userlogin")
const userproduct=require('../controllers/UserControllers/userproductController')
const userprofile=require('../controllers/UserControllers/userprofileController')
const usercart=require('../controllers/UserControllers/usercartController');
const usercheckout=require('../controllers/UserControllers/checkoutController')
const orderconform=require('../controllers/UserControllers/orderconform')
const express=require('express')
const userRoute=express();
const isLogged = require('../middleware/userMIddle');


userRoute.get('/',userlogin.showLogin);
userRoute.post('/submit1/:email',userlogin.checkLogin);

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



userRoute.get('/home',isLogged,userisBlocked,userlogin.showHome);
// userRoute.get('/signup-otp',userlogin.showOtp);
userRoute.post('/signup-otp',userlogin.verifyOtp);
// userRoute.post('/reset-password',userlogin.resendOtp);
userRoute.get('/getuserproduct',isLogged,userproduct.getproductpage);
userRoute.get('/search',isLogged,userproduct.searchproducts);
userRoute.get('/sort',isLogged,userproduct.sortproducts);


userRoute.get('/clickproduct',isLogged,userproduct.getproductdetails);
userRoute.get('/logout',userlogin.userlogout);



userRoute.get('/userprofile',isLogged,userprofile.getuserprofile)
userRoute.get('/changeprofilepassword/:email',userprofile.getchangepasswordpage)
userRoute.post('/postuserprofile',isLogged,userprofile.postuserprofile)
userRoute.post('/postuseraddress',isLogged,userprofile.postuseraddress)
userRoute.get('/getalladdress',isLogged,userprofile.getalladdress)
userRoute.get('/addaddress',isLogged,userprofile.addaddress)
userRoute.get('/geteditaddress/:id',isLogged,userprofile.geteditaddress)
userRoute.post('/posteditaddress',isLogged,userprofile.posteditaddress);
userRoute.post('/postdltaddress',isLogged,userprofile.deleteaddress);




userRoute.post('/postaddtocart',isLogged,usercart.postusercart);
userRoute.get('/usercart/:id',isLogged,usercart.getusercart)
userRoute.get('/checkstock',isLogged,usercart.checkuserstock);
userRoute.post('/changequantity',isLogged,usercart.changequantity);
userRoute.delete('/removeitemfromcart/:id',isLogged,usercart.removecartitem)

userRoute.get('/getcheckout',isLogged,usercheckout.getcheckoutpage)
userRoute.post('/post-userddress-checkout',isLogged,usercheckout.postaddresscheckout)
userRoute.post('/postorderconformdetails',isLogged,orderconform.getorderconform);
userRoute.get('/getorder-conform',isLogged,orderconform.getorderconformpage);
userRoute.get('/getorderdetails',isLogged,orderconform.getorderdetailspage);
userRoute.post('/deleteorder',isLogged,orderconform.deleteorder);



async function userisBlocked(req, res, next) {
        if (req.session && req.session.userid) {
            try {
                // Fetch the user based on session userid
                const user = await Userdb.findById(req.session.userid);
                
                if (user && user.isBlocked===true) {
                    // If user is found and is blocked, respond with an error
                    console.error("User is blocked by admin" );
                    req.session.Usersession=false;
                    res.redirect('/');
                } else {
                    // If user is not blocked
                    next();
                }
            } catch (error) {
                console.error("Error checking user block status:", error);
               
            }
        } 
    }
    



module.exports=userRoute;




