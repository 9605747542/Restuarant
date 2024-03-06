const express=require('express');
const AdminRouter=express();
const adminlogin=require('../controllers/AdminControllers/adminlogin')
const showusercontroller=require('../controllers/AdminControllers/showuserController')
const userCategory=require('../controllers/AdminControllers/categoryController')
const userproduct=require('../controllers/AdminControllers/productController');
const upload=require('../multer');
const productdb=require('../models/AdminModels/ProductSchema');



AdminRouter.get('/adminlogin',getadminlogin)
// AdminRouter.post('/adminlogin',adminlogin.adminregister)
AdminRouter.post('/adminlogin',adminlogin.getlogin)
AdminRouter.get('/dashboard',getdashboard);
AdminRouter.get('/logout',adminlogin.adminlogout);


//Admin Side Userdetails
AdminRouter.get('/getUser',showusercontroller.getUserdata);
AdminRouter.get('/adminuserblock/:id',showusercontroller.blockuser);
AdminRouter.get('/adminuserunblock/:id',showusercontroller.unblockuser);


//Admin Side Category
AdminRouter.get('/getcategory',userCategory.getcategory)
AdminRouter.post('/postcategory',userCategory.postcategory)
AdminRouter.get('/editcategory',userCategory.geteditcategory);
AdminRouter.post('/posteditcategory',userCategory.posteditcategory);
AdminRouter.get('/deletecategory',userCategory.getdeletecategory);
AdminRouter.post('/postdeletecategory',userCategory.postdeletecategory);



//Admin Side Product
AdminRouter.get('/getproduct',getproductlist);
AdminRouter.get('/getaddproduct',userproduct.getaddproduct);
AdminRouter.post('/postaddproduct',upload.array('image', 5),userproduct.postaddproduct);
AdminRouter.get('/editadminproduct',userproduct.geteditproduct);





async function getproductlist(req,res,next){
    if(req.session.admin){
        try{
        const data= await productdb.find();
        console.log(data);
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
async function getdashboard(req,res,next){
    if(req.session.admin){
        res.render('Adminviews/adminhome');
    }else{
        res.redirect('/adminlogin');
    }
  

}

module.exports=AdminRouter;



