const Userdb = require('../models/UserModels/UserSignupSchema')
const Productdb = require('../models/AdminModels/ProductSchema');
const Cartdb = require('../models/UserModels/usercartSchema');
const userlogin = require("../controllers/UserControllers/userlogin")
const userproduct = require('../controllers/UserControllers/userproductController')
const userprofile = require('../controllers/UserControllers/userprofileController')
const usercart = require('../controllers/UserControllers/usercartController');
const usercheckout = require('../controllers/UserControllers/checkoutController')
const orderconform = require('../controllers/UserControllers/orderconform')
const express = require('express')
const userRoute = express();
const isLogged = require('../middleware/userMIddle');


userRoute.get('/', userlogin.showLogin);
userRoute.post('/submit1/:email', userlogin.checkLogin);

userRoute.get('/register', userlogin.signuppage)
userRoute.post('/register1', userlogin.postsignup);
userRoute.get('/otp-page', userlogin.getOtppage);
userRoute.get('/resend-otp', userlogin.getresendotp);

userRoute.get('/forgotpassword', userlogin.getforgotpassword);
userRoute.post('/submit2', userlogin.checkemail);
userRoute.get('/resetpassword/:email', userlogin.getresetpassword);
userRoute.post('/forgot-otp', userlogin.verifyforgototp);
userRoute.get('/resetuser/:email', userlogin.resetuserdetails);
userRoute.post('/submitpassword', userlogin.postnewpassword);



userRoute.get('/home', isLogged, userisBlocked, userlogin.showHome);
// userRoute.get('/signup-otp',userlogin.showOtp);
userRoute.post('/signup-otp', userlogin.verifyOtp);
// userRoute.post('/reset-password',userlogin.resendOtp);
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

userRoute.get('/getcheckout', isLogged, usercheckout.getcheckoutpage);
userRoute.post('/post-userddress-checkout', isLogged, usercheckout.postaddresscheckout)
userRoute.post('/postorderconformdetails', isLogged, orderconform.getorderconform);
userRoute.get('/getorder-conform', isLogged, orderconform.getorderconformpage);
userRoute.get('/getorderdetails', isLogged, orderconform.getorderdetailspage);
userRoute.get('/viewmoredetails', isLogged, orderconform.getmoredetailspage);
userRoute.post('/deleteorder', isLogged, orderconform.deleteorder);



async function userisBlocked(req, res, next) {
    if (req.session && req.session.userid) {
        try {

            const user = await Userdb.findById(req.session.userid);

            if (user && user.isBlocked === true) {

                console.error("User is blocked by admin");
                req.session.Usersession = false;
                res.redirect('/');
            } else {

                next();
            }
        } catch (error) {
            console.error("Error checking user block status:", error);
        }
    }
}
async function checkStock(req, res, next) {
    
    const productId = req.body.productId;
    console.log("ID from middleware:", productId);
    console.log("middleware...");
    console.log("User ID:", req.session.userid);

    // Check if there's a cart for the user
    const cart = await Cartdb.findOne({ userid: req.session.userid });
    // if (!cart || !cart.products || cart.products.length === 0) {
    //     console.log("Cart is empty or not found for the user. Proceeding without stock checks.");
    //     return next();
    // }
    // console.log("Cart from middleware:", cart);

    // Find the product in the cart
    const cartProduct = cart.products.find(p => p.product.toString() === productId.toString());

    // Find the product in the database
    const product = await Productdb.findOne({ _id: productId });
    if (!product) {
        console.log("Product not found");
        return res.json({ message: "Product not found", success: false });
    }

    console.log("Stock:", product.stock);

    // Check if there's enough stock for the product
    if (cartProduct) {
        if (product.stock <= cartProduct.quantity) {
            console.log("Not enough stock available");
            return res.json({ message: "Not enough stock available", success: false });
        }
    } else {
        if (product.stock === 0) {
            console.log("Not enough stock available");
            return res.json({ message: "Not enough stock available", success: false });
        }
    }

    return next();
}

module.exports = userRoute;




