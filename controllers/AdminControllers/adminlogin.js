const bcrypt=require('bcrypt');
const Swal = require('sweetalert2');
const session=require('express-session');
const admin=require('../../models/AdminModels/AdminloginSchema');
const adminlogin={};
const isAdminLogged=require('../../middleware/adminMiddle');

adminlogin.adminregister=async(req, res) => {
    try {
        const {email,password}=req.body;
        console.log(email);
        const hashedpassword = await bcrypt.hash(password, 10); 
        console.log(hashedpassword);// Use the provided password for hashing
        const newUser = new admin({
            email: email,
            password: hashedpassword
        });
        await newUser.save();

        if (newUser) {
            res.json({ message: "Successfully Saved the data" });
        } else {
            res.json({ message: "Failed to Save the data" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
adminlogin.getlogin=async(req,res)=>{
const {email1,password1}=req.body;

console.log(email1);
try{
    const checkUser=await admin.findOne({email:email1});
    if(checkUser){

// if(checkUser.email===email1 && checkUser.password===password1)
const comparepass= await bcrypt.compare(password1,checkUser.password)
    if(comparepass){
        req.session.admin=true;
    console.log(checkUser.email);
    res.json({ message: "Welcome Admin" });
    console.log(checkUser.email,"this is for testing");
    }else if(comparepass===false){
        console.log(comparepass+"nourii");
        res.json({message:"Not correct",error:'Incorrect Password!'});
      }else if(checkUser===false){
        res.json({message:"Not correct",error:'Incorrect Adminname!' });
      }

}else{
    console.log("Error occuress");

    res.json({ success: false, error: 'Admin is not Found' });
}


}catch(error){
console.log(error);
}

}
adminlogin.adminlogout=async(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            console.log("haii");
        }else{
                  // Redirect to the login page after logout
        res.redirect('/adminlogin');
        console.log("haii");

        }
  
    });
}
module.exports=adminlogin;