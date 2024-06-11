
const Userdb=require('../models/UserModels/UserSignupSchema');
const Cartdb=require('../models/UserModels/usercartSchema');
const Productdb=require('../models/AdminModels/ProductSchema');
const Orderdb=require('../models/UserModels/userorderSchema');
const Categorydb=require('../models/AdminModels/categorySchema');


const isAdminLogged=(req,res,next)=>{
if(req.session.admin){
    console.log('Working Admin side');
    next();
}else{
    res.redirect('/adminlogin')
}
}
async function getproductlist(req,res,next){
    if(req.session.admin){
        try{
        const data= await Productdb.find().populate('category');
        res.render('Adminviews/productdetails',{data});
        }catch (error) {
            console.log(error);
            // Handle the error appropriately, e.g., sending an error response to the client
            res.status(500).send('Internal Server Error');
        }
    }else{
        res.redirect('/adminlogin');
    }

}



async function getadminlogin(req,res,next){
    if(!req.session.admin){
        res.render('Adminviews/adminlogin');
    }else{
        res.redirect('/dashboard');
    } 
}


async function getdashboard(req, res, next) {
    if (req.session.admin) {
        try {
            // Initialize counters and sums
            let count = 0;
            let totalAmount = 0;
            let userCount = 0;
            let productCount = 0;
            let discountAmount = 0;

          
            const products = await Productdb.find();
            productCount = products.length;

         
            const users = await Userdb.find();
            userCount = users.length;

            const orders = await Orderdb.find();
            orders.forEach(order => {
                count++;
                totalAmount += order.ActualAmount;
                discountAmount += order.totalAmount - order.ActualAmount;
            });
            totalAmount = Math.ceil(totalAmount);
            discountAmount = Math.ceil(discountAmount);
           
            console.log("Orders processed:", count);
            console.log("Total amount:", totalAmount);
            console.log("Discount amount:", discountAmount);
            const productDetails=await Productdb.find().sort({popularity:-1}).populate('category','categoryName').exec();
            console.log("master",productDetails);

            
           
            // Render the admin dashboard view with the data
            res.render('Adminviews/adminhome', {
                count,
             totalAmount,
                userCount,
                productCount,
                discountAmount,
                productDetails
            });
        } catch (error) {
            // Error handling
            console.error('Error fetching data:', error);
            res.status(500).send("Unable to retrieve data.");
        }
    } else {
        // Redirect if not admin
        res.redirect('/adminlogin');
    }
}






module.exports={
    isAdminLogged,
    getproductlist,
    getadminlogin,
    getdashboard



}