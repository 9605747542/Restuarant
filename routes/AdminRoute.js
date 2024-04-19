const express=require('express');
const AdminRouter=express();
const adminlogin=require('../controllers/AdminControllers/adminlogin')
const showusercontroller=require('../controllers/AdminControllers/showuserController')
const userCategory=require('../controllers/AdminControllers/categoryController')
const userproduct=require('../controllers/AdminControllers/productController');
const userorders=require('../controllers/AdminControllers/userorderController')
const upload=require('../multer');
const productdb=require('../models/AdminModels/ProductSchema');
const isAdminLogged = require('../middleware/adminMiddle');
const userorder = require('../controllers/AdminControllers/userorderController');



AdminRouter.get('/adminlogin',getadminlogin)
// AdminRouter.post('/adminlogin',adminlogin.adminregister)
AdminRouter.post('/adminlogin',adminlogin.getlogin)
AdminRouter.get('/dashboard',getdashboard);
AdminRouter.get('/logout',adminlogin.adminlogout);


//Admin Side Userdetails
AdminRouter.get('/getUser',isAdminLogged,showusercontroller.getUserdata);
AdminRouter.get('/adminuserblock/:id',isAdminLogged,showusercontroller.blockuser);
AdminRouter.get('/adminuserunblock/:id',isAdminLogged,showusercontroller.unblockuser);


//Admin Side Category
AdminRouter.get('/getcategory',isAdminLogged,userCategory.getcategory)
AdminRouter.post('/postcategory',isAdminLogged,userCategory.postcategory)
AdminRouter.get('/editcategory',isAdminLogged,userCategory.geteditcategory);
AdminRouter.post('/posteditcategory',isAdminLogged,userCategory.posteditcategory);
AdminRouter.get('/deletecategory',isAdminLogged,userCategory.getdeletecategory);
AdminRouter.post('/postdeletecategory',isAdminLogged,userCategory.postdeletecategory);



//Admin Side Product
AdminRouter.get('/getproduct',isAdminLogged,getproductlist);
AdminRouter.get('/getaddproduct',isAdminLogged,userproduct.getaddproduct);
AdminRouter.post('/postaddproduct',isAdminLogged,upload.array('image', 5),userproduct.postaddproduct);
AdminRouter.get('/editadminproduct',isAdminLogged,userproduct.geteditproduct);
AdminRouter.post('/posteditproduct',isAdminLogged, upload.array('productImages', 5),userproduct.posteditproduct);
AdminRouter.post('/removeproductimage',isAdminLogged,userproduct.removeproductimage);
AdminRouter.get('/deleteadminproduct/:id', isAdminLogged,userproduct.postdeleteproduct);






AdminRouter.get('/getorders',isAdminLogged,userorders.getuserorderpage);
AdminRouter.get('/editorder',isAdminLogged,userorders.geteditorder);
AdminRouter.post('/updateorder/:id',isAdminLogged,userorders.posteditorder);
AdminRouter.post('/cancelOrder/:id',isAdminLogged,userorders.cancelorder);


async function getproductlist(req,res,next){
    if(req.session.admin){
        try{
        const data= await productdb.find();
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



