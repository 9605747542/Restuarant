const express=require('express');
const AdminRouter=express();
const adminlogin=require('../controllers/AdminControllers/adminlogin')
const showusercontroller=require('../controllers/AdminControllers/showuserController')
const userCategory=require('../controllers/AdminControllers/categoryController')
const userproduct=require('../controllers/AdminControllers/productController');
const userorders=require('../controllers/AdminControllers/userorderController')
const upload=require('../multer');
const productdb=require('../models/AdminModels/ProductSchema');
const Orderdb=require('../models/UserModels/userorderSchema');
const Userdb=require('../models/UserModels/UserSignupSchema');
const {isAdminLogged,getdashboard,getadminlogin,getproductlist} = require('../middleware/adminMiddle');
const userorder = require('../controllers/AdminControllers/userorderController');
const usercoupon=require('../controllers/AdminControllers/couponController');
const useroffer=require('../controllers/AdminControllers/offerController');
const usersales=require('../controllers/AdminControllers/salesreportController');
const excelreport=require('../controllers/AdminControllers/excelsalesreportController');




AdminRouter.get('/adminlogin',getadminlogin)
// AdminRouter.post('/adminlogin',adminlogin.adminregister)
AdminRouter.post('/adminlogin',adminlogin.getlogin)
AdminRouter.get('/dashboard',getdashboard);
AdminRouter.get('/adminlogout',adminlogin.adminlogout);


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
AdminRouter.post('/postaddproduct',isAdminLogged,upload.array('ProductImages', 5),userproduct.postaddproduct);
AdminRouter.get('/editadminproduct',isAdminLogged,userproduct.geteditproduct);
AdminRouter.post('/posteditproduct',isAdminLogged, upload.array('ProductImages', 5),userproduct.posteditproduct);
AdminRouter.post('/removeproductimage',isAdminLogged,userproduct.removeproductimage);
AdminRouter.get('/deleteadminproduct/:id', isAdminLogged,userproduct.postdeleteproduct);






AdminRouter.get('/getorders',isAdminLogged,userorders.getuserorderpage);
AdminRouter.get('/editorder',isAdminLogged,userorders.geteditorder);
AdminRouter.post('/updateorder/:id',isAdminLogged,userorders.posteditorder);
AdminRouter.post('/cancelOrder/:id',isAdminLogged,userorders.cancelorder);




AdminRouter.get('/getcoupon',isAdminLogged,usercoupon.getcouponpage);
AdminRouter.get('/getaddcoupon',isAdminLogged,usercoupon.getaddcoupon);
AdminRouter.post('/postaddcoupon',isAdminLogged,usercoupon.addnewcoupon);
AdminRouter.get('/geteditcoupon',isAdminLogged,usercoupon.geteditcoupon);
AdminRouter.post('/posteditcoupon',isAdminLogged,usercoupon.posteditcoupon);
AdminRouter.post('/blockcoupon/:id',isAdminLogged,usercoupon.blockcoupon);
AdminRouter.post('/unblockcoupon/:id',isAdminLogged,usercoupon.unblockcoupon);


AdminRouter.get('/getoffer',isAdminLogged,useroffer.getofferdetails);
AdminRouter.get('/getaddoffer',isAdminLogged,useroffer.getaddoffer);
AdminRouter.post('/postaddoffer',isAdminLogged,useroffer.postaddoffers);


AdminRouter.get('/getMonthlySalesReport/:month/:year',isAdminLogged,usersales.getmonthlysalesReport)
AdminRouter.get('/downloadmonthlyReport/:month',isAdminLogged,usersales.downloadmonthlyReport)

AdminRouter.get('/getWeeklySalesReport/:month/:week/:year',isAdminLogged,usersales.getweeklysalesReport);
AdminRouter.get('/downloadweeklyReport/:month/:week/:year', isAdminLogged, usersales.downloadweeklyReport);

AdminRouter.get('/gettodaySalesreport',isAdminLogged,usersales.gettodaysalesReport);
AdminRouter.get('/downloadtodaysReport',isAdminLogged,usersales.downloadTodaysReport);

AdminRouter.get('/getyearlySalesReport/:year',isAdminLogged,usersales.getyearlysalesReport);
AdminRouter.get('/downloadyearlyReport/:year',isAdminLogged,usersales.downloadYearlyReport);

AdminRouter.get('/getcustomSalesReport/:custom',isAdminLogged,usersales.getcustomsalesReport)
AdminRouter.get('/downloadcustomReport/:custom',isAdminLogged,usersales.downloadCustomReport)

//for getting excel format sales Report
AdminRouter.get('/downloadmonthlyReportinExcel/:month',isAdminLogged,excelreport.getmonthlysalesReport);
AdminRouter.get('/downloadcustomReportinExcel/:custom',isAdminLogged,excelreport.getcustomsalesReport);










module.exports=AdminRouter;



