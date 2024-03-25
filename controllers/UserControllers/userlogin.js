
const userdb = require('../../models/UserModels/UserSignupSchema');
const Swal = require('sweetalert2');
const bcrypt = require('bcrypt');
const otpgenerator= require('otp-generator');
const nodemailer=require('nodemailer');
const session = require('express-session');
const productdb = require('../../models/AdminModels/ProductSchema');

const userlogin={};

userlogin.getforgotpassword=async(req,res)=>{

    res.render("userViews/forgetpassword");
}






async function sendOtp1(email,otp){
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nourinvn@gmail.com',
        pass: 'fugx ocdh gxso pzzg',
      },
    });
    // Setup email data
    const mailOptions = {
      from: 'nourinvn@gmail.com',
      to: email,
      subject: 'Your Otp for verification is',
      text: otp,
    };
  
    const info=transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response); 
  } catch (error) {
    console.log('Error sending email:',error);
  }

}




function generateRandomOTP1() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}
const randomOTP1 = generateRandomOTP1();

userlogin.checkemail = async (req, res) => {
  const email = req.body.email;
  console.log(email);


  try {
    // Use findOne with the correct query syntax (assuming userdb is a Mongoose model)
    const data = await userdb.findOne({ email: email });

    console.log("heloooo", data);

    if (data) {
     
     
      // Generate a random OTP
     
      console.log('Random OTP:', randomOTP1);

  
       
       await sendOtp1(email,randomOTP1);
       console.log('Random OTP:', randomOTP1);

      res.json({ success: true, message: "User with this email exists" });

 
   } else {
      res.json({ success: false, message: "User with this email does not exist" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


userlogin.verifyforgototp=async(req,res)=>{
  const {otp}=req.body;
  console.log("otp backend");
  console.log(otp);

 
      console.log('Random OTP:', randomOTP1);
  if(randomOTP1===otp){
    res.json({ success: true, message: "Yes Your OTP is matched" });

  }else{
    res.json({ success: false, message: "Otp is not Match" });

  }
}



userlogin.getresetpassword=async(req,res)=>{
  const email=req.params.email;
  req.session.forgotUser=true;
  res.render('userViews/resetpassword',{email});
}


userlogin.resetuserdetails=async(req,res)=>{
  if(req.session.forgotUser){
  const email=req.params.email;
  res.render('userViews/resetuserdata',{email});
  }else{
    res.redirect('/forgotpassword');
  }
}


userlogin.postnewpassword=async(req,res)=>{
  const newpass=req.body.newpassword;
  const email =req.body.extractedEmail;
  console.log("xdfxgchj",email);
  console.log("ghjbklih",newpass);
  try {
    // Update the user's password in the database
    const hashed = await bcrypt.hash(newpass, 10)
    const updatedUser = await userdb.findOneAndUpdate({ email }, { $set: { password1: hashed } }, { new: true });
    console.log(updatedUser)
    if (updatedUser) {
      // Password reset successful
      console.log("sssss")
      req.session.forgotUser=false;
      res.status(200).json({success:true,message:'Password reset successfully!'});
    } else {
      // User not found
      
      console.log("ffff")
      res.status(400).json({success:false,message:'User not found!'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }

}





userlogin.showLogin=async(req,res)=>{
  if( !req.session.Usersession){
    res.render("userViews/login");
  }else{
    res.redirect('/home')
  }
}

//User login

userlogin.checkLogin=async(req,res)=>{
    const {email,password1}=req.body;
    console.log(email);
     // Check if the username exists in the database
     const user1 = await userdb.findOne({email:email});
     if ( user1?.isBlocked==true) {
      res.json({success:false,error:"User is blocked by admin"})
     }
        if(user1){

       // Compare the provided password with the hashed password from the database
       const passwordMatch = await bcrypt.compare(password1,user1.password1);
       const emailMatch = (email===user1.email);
       console.log(emailMatch);
       console.log(passwordMatch);
       if(passwordMatch && emailMatch){
        console.log("hi");

        //here i am creating a session for storing the id of that particular user
        req.session.userid=user1._id.toString();
        console.log(req.session.userid);
           //session starting from here
        req.session.Usersession=true;
         // go to front-end (Sweet alert)
       
         return res.json({success:true})
       
         
        
       }else if(emailMatch===false && passwordMatch===false){
        return res.json({ success: false, error: 'Incorrect Username!' });
      }else{
        return res.json({ success: false, error: 'Incorrect Password!' });
      }
     }  else {
      return res.json({ success: false, error: 'User is not Found' });
    }
}





//User Signup
async function sendOtp(email,otp){
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nourinvn@gmail.com',
        pass: 'fugx ocdh gxso pzzg',
      },
    });
    // Setup email data
    const mailOptions = {
      from: 'nourinvn@gmail.com',
      to: email,
      subject: 'Your Otp for verification is',
      text: otp,
    };
  
    const info=transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response); 
  } catch (error) {
    console.log('Error sending email:',error);
  }

}






userlogin.postsignup=async(req,res)=>{
         const{name,email,password1} = req.body;
        console.log(name,email,password1);
      
          const existingEmail = await userdb.findOne({email:email})
          if(existingEmail){
            res.json({ status: 'error', error: '' });
          }
        
        // Function to generate a random 6-digit OTP
function generateRandomOTP() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

// Generate a random OTP
const randomOTP = generateRandomOTP();

console.log('Random OTP:', randomOTP);

req.session.signupdata={
  name,
  email,
  password1,
  randomOTP,
  timestamp:Date.now(),
}


try{

 await sendOtp(email,randomOTP);
 console.log('Email send to the otp:',req.session.signupdata.email);
console.log('Form Data',req.session);
  res.json({success:true})

}
catch(error){
  console.error('error during OTP sending',error);
  res.render('register')

}}


userlogin.getresendotp=async(req,res)=>{
  try{
    const email = req.session.signupdata.email;
    console.log(email);
    const OTP =  generateRandomOTP1();
    const subject = 'Your OTP for verification';
    const text = `Your OTP is: ${OTP}. Please use this code to verify your identity.`;
  
    sendOtp(email,OTP);
  
    res.redirect('/otp-page');

  }catch (err) {
    console.error("Error during signup:", err);
    res.redirect('/register');
  }
   
}






userlogin.verifyOtp=async(req,res)=>{
  const {otp}=req.body;
  console.log("otp backend");
  console.log(otp);
  console.log(req.session.signupdata.randomOTP);
  if(req.session.signupdata.randomOTP===otp){
    const hashedPassword = await bcrypt.hash(req.session.signupdata.password1, 10);
   
    const newUser =  userdb({
      name:req.session.signupdata.name,
      email:req.session.signupdata.email,
      password1:hashedPassword
    })
    await newUser.save();
    res.json({success:true})
  }else{
    res.json({success:false})
  }

}








userlogin.showHome=async(req,res)=>{
  
    try{
      const data= await productdb.find();
      
      

    

        res.render('userViews/index',{data});
      

    }catch (error) {

      console.log(error);
      // Handle the error appropriately, e.g., sending an error response to the client
      res.status(500).send('Internal Server Error');
    }

}




userlogin.getOtppage=async(req,res)=>{
  if(!req.session.Usersession){
    res.render('userViews/otp');
  }else{
    res.redirect('/home');
  }

}

userlogin.signuppage=async(req,res)=>{
  res.render("userViews/register");
}

userlogin.userlogout=async(req,res)=>{
  req.session.Usersession=false;
  res.redirect('/')
}



module.exports=userlogin