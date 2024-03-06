
const userdb = require('../../models/UserModels/UserSignupSchema')
const Swal = require('sweetalert2');
const bcrypt = require('bcrypt');
const otpgenerator= require('otp-generator');
const nodemailer=require('nodemailer');
const session = require('express-session');
const productdb=require('../../models/AdminModels/ProductSchema');

const userlogin={};


userlogin.showLogin=async(req,res)=>{
        res.render("userViews/login");
}



userlogin.checkLogin=async(req,res)=>{
    const {email,password1}=req.body;
    console.log(email);
     // Check if the username exists in the database
     const user1 = await userdb.findOne({email:email});
     if ( user1.isBlocked==true) {
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
           //session starting from here
        req.session.Usersession=true;
         // go to front-end (Sweet alert)
         res.json({success:true})
       
         
        
       }else if(emailMatch===false && passwordMatch===false){
        res.json({ success: false, error: 'Incorrect Username!' });
      }else{
        res.json({ success: false, error: 'Incorrect Password!' });
      }
     }  else {
      res.json({ success: false, error: 'User is not Found' });
    }
}






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
  //ee line vazhi nammal aadhyam ezhuthiya mailoptions and transporter oke work aakum.karanam redirect to otp page enn parayunath .NJn ee paranath full thettaan.
 await sendOtp(email,randomOTP);
 console.log('Email send to the otp:',req.session.signupdata.email);
console.log('Form Data',req.session);
  res.json({success:true})

}
catch(error){
  console.error('error during OTP sending',error);
  res.render('register')

}}






userlogin.verifyOtp=async(req,res)=>{
  const {otp}=req.body;
  console.log("otp backend");
  console.log(otp);
  console.log(req.session.signupdata.randomOTP);
  if(req.session.signupdata.randomOTP===otp){
    req.session.Usersession=true;
    const newUser =  userdb({
      name:req.session.signupdata.name,
      email:req.session.signupdata.email,
      password1:req.session.signupdata.password1
    })
    await newUser.save();
    res.json({success:true})
  }else{
    res.json({success:false})
  }

}




userlogin.showHome=async(req,res)=>{
  if(req.session.Usersession){
    try{
      const data= await productdb.find();
      console.log(data);
      res.render('userViews/index',data);

    }catch (error) {
      console.log(error);
      // Handle the error appropriately, e.g., sending an error response to the client
      res.status(500).send('Internal Server Error');
  }
   
  }else{
    res.redirect('/');
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
  req.session.destroy((err) => {
    if (err) {
        console.error('Error destroying session:', err);
    }
    // Redirect to the login page after logout
    res.redirect('/');
});
}



module.exports=userlogin