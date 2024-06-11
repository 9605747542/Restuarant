
const userdb = require('../../models/UserModels/UserSignupSchema');
const Userwalletdb=require('../../models/UserModels/walletSchema');
const Orderdb=require('../../models/UserModels/userorderSchema');
const Swal = require('sweetalert2');
const bcrypt = require('bcrypt');
const otpgenerator= require('otp-generator');
const nodemailer=require('nodemailer');
const session = require('express-session');
const productdb = require('../../models/AdminModels/ProductSchema');
const crypto = require('crypto');
const userlogin={};


userlogin.getforgotpassword=async(req,res)=>{

    res.render("userViews/forgetpassword");
}
function generateRandomOTP() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
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
    // Setup email datareferral
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

const randomOTP1 = generateRandomOTP();

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

  
       
       await sendOtp(email,randomOTP1);
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
       

        //here i am creating a session for storing the id of that particular user
        req.session.userid=user1._id.toString();
        console.log(req.session.userid);
           //session starting from here
        req.session.Usersession=true;
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












userlogin.postsignup=async(req,res)=>{
         const{name,email,password1,refferal} = req.body;
        console.log(name,email,password1,refferal);
      
          const existingEmail = await userdb.findOne({email:email})
          if(existingEmail){
            console.log("linking");
            res.json({ status:false,message:"You are already registered"});
          }
         
        
        // Function to generate a random 6-digit OTP


// Generate a random OTP
const randomOTP = generateRandomOTP();

console.log('Random OTP:', randomOTP);

req.session.signupdata={
  name,
  email,
  password1,
  randomOTP,
  refferal,
  timestamp:Date.now(),
}
try{
console.log("signup",randomOTP);
 await sendOtp(email,randomOTP);
 console.log('Email send to the otp:',req.session.signupdata.email);
console.log('Form Data',req.session);
  res.json({status:true})

}
catch(error){
  console.error('error during OTP sending',error);
  res.render('register')

}}

userlogin.getresendotp=async(req,res)=>{
  try{
    const email = req.session.signupdata.email;
    console.log(email);
    console.log("damn");
    const OTP =  generateRandomOTP();
    console.log("resend",OTP);
    req.session.signupdata.randomOTP=OTP

    console.log('Form Data',req.session);
  
    sendOtp(email,OTP);
    res.json({ success: true });
   

  }catch (err) {
    console.error("Error during signup:", err);
   
    res.json({ success: false });
  }
   
}


userlogin.getrefferalcode = async (req, res)=> {

  const user = await userdb.findById(req.session.userid);
  let referral1;
  if (user.referral) {
    referral1 = user.referral;
  } else {
    referral1 = 0;
  }

  res.render('userViews/shareReferral', { referral: referral1 });
  

}










userlogin.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  console.log("OTP received on backend:", otp);

  // Function to generate referral code
  function generateReferralCode(length = 5) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }

  // Check if the OTP matches
  if (req.session.signupdata && req.session.signupdata.randomOTP === otp) {
      const hashedPassword = await bcrypt.hash(req.session.signupdata.password1, 10);
      
      const newUser = new userdb({
          name: req.session.signupdata.name,
          email: req.session.signupdata.email,
          password1: hashedPassword,
          referral: generateReferralCode()
      });

      await newUser.save();

      if (req.session.signupdata.refferal) {
        const checkReferral = await userdb.findOne({ referral: req.session.signupdata.refferal });

        if (checkReferral) {
          const existingId = checkReferral._id;

          // Update the new user's wallet
          let wallet = await Userwalletdb.findOne({ userId: newUser._id });
          if (!wallet) {
            wallet = new Userwalletdb({
              userId: newUser._id,
              balance: 100,
              transactionHistory: [{
                transaction: 'Referral Money',
                amount: 100
              }],
            });
          } else {
            wallet.balance += 100;
            wallet.transactionHistory.push({
              transaction: 'Referral Added',
              amount: 100
            });
          }
          await wallet.save();

          // Update the referrer's wallet
          let referrerWallet = await Userwalletdb.findOne({ userId: existingId });
          if (!referrerWallet) {
            referrerWallet = new Userwalletdb({
              userId: existingId,
              balance: 50,
              transactionHistory: [{
                transaction: 'Referral Bonus',
                amount: 50
              }],
            });
          } else {
            referrerWallet.balance += 50;
            referrerWallet.transactionHistory.push({
              transaction: 'Referral Bonus',
              amount: 50
            });
          }
          await referrerWallet.save();
        } else {
          console.log('No referrer found with the given referral code');
        }
      } else {
        console.log('No referral code provided');
      }

      res.json({ success: true });
  } else {
      res.json({ success: false });
  }
};

userlogin.showHome=async(req,res)=>{
  
    try{
      const data= await productdb.find();
      console.log(data);
      console.log("where",req.session.userid);
      const order = await productdb.find().sort({ popularity: -1 });
      console.log("vesham",order);
     
        res.render('userViews/index',{data,order});
      

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