const isAdminLogged=(req,res,next)=>{
if(req.session.admin){
    console.log('Working Admin side');
    next();
}else{
    res.redirect('/adminlogin')
}
}
module.exports=isAdminLogged;