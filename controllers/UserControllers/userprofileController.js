const userdb=require('../../models/UserModels/UserSignupSchema');
const userprofile={};
userprofile.getuserprofile=async (req,res)=>{
    const userid=req.session.userid;
    const data=await userdb.findById(userid);
    const useraddress=data.address
   
    res.render('userViews/userprofile',{data,useraddress});



}
userprofile.postuserprofile = async (req, res) => {
  console.log("blaa");
  const { name, email } = req.body;
  const id = req.session.userid;
  console.log(id);
  try {
      const user = await userdb.findById(id);
      if (user) {
          user.name = name; 
          user.email = email;
          await user.save(); 
          return res.json({ success: true, message: "Successfully Updated!" }); 
      } else {
          return res.status(404).json({ success: false, message: "User not found" }); 
      }
  } catch (error) {
      console.error("Error while updating user profile:", error);
      return res.status(500).json({ success: false, message: "Failed to update user profile" });
  }
}

// userprofile.postuseraddress=async(req,res)=>{
//     const {streetaddress,phone,city,House_name}=req.body;
//     const userid=req.session.userid;

//     console.log("check the user",userid);
//     try{
//         await userdb.findByIdAndUpdate(
//             userid,
//             {
//             $push: {
//                 address: {
//                     streetaddress,
//                     city,
//                     House_name,
//                     phone
//                 },
//               },
//             })
//             res.status(200).send({ message:"Address saved successfully"}); // Respond with success message
//         } catch (error) {
//             console.error("Error while saving address:", error);
//             res.status(500).send({message:"Failed to save address"}); // Respond with error message
//         }
   

// }
userprofile.postuseraddress = async (req, res) => {
  const { streetaddress, phone, city, House_name } = req.body;
  const userid = req.session.userid;

  console.log("check the user", userid);
  try {
      await userdb.findByIdAndUpdate(
          userid,
          {
              $push: {
                  address: {
                      streetaddress,
                      city,
                      House_name,
                      phone: parseInt(phone, 10) // Ensuring the phone number is an integer
                  }
              }
          },
          { new: true, useFindAndModify: false } // Options to return the updated document
      );
      res.status(200).send({ message: "Address saved successfully" }); // Respond with success message
  } catch (error) {
      console.error("Error while saving address:", error);
      res.status(500).send({ message: "Failed to save address" }); // Respond with error message
  }
}


userprofile.getalladdress=async(req,res)=>{
    const userid=req.session.userid;
    const result=await userdb.findById(userid);
    const data=result.address;

    console.log("Every address",data);
    res.render('userViews/showalladdress',{data});
}
userprofile.addaddress=async (req,res)=>{
    res.render('userViews/addaddress')
}
userprofile.getchangepasswordpage=async(req,res)=>{
  const email=req.params.email;
  res.render('userViews/changepassword',{email})
}


userprofile.geteditaddress=async(req,res)=>{
    const id=req.params.id;
   console.log("id from edit address",id);

    let result=await userdb.findById(req.session.userid);

        
            if (!result) {
                // Handle the case where the user is not found
                return res.status(404).json({success:false,message:'Address not found'});
            }
        
            const data = result.address.find(address => address._id.toString() === id);
            console.log('Found Data:', data);
            
        
        
            res.render('userViews/editaddress',{data})
    
    
}

userprofile.posteditaddress=async(req,res)=>{
    const {streetaddress,phone,city,House_name}=req.body;
   
    const userid=req.session.userid;
    console.log("Hai Welcome to ooty nice to meet you");
    try {
      const userAdr = await userdb.findByIdAndUpdate(
        userid,
        {
          $set: {
            "address": {
              streetaddress,
          
              city,
      
              House_name,
              phone
           
            }
          }
        },
        { new: true } // This option returns the modified document
      );
      
    
      if (!userAdr) {
        return res.json({ success: false, message: 'User not found' });
      } else {
        return res.json({ success: true, message: 'Successfully updated address' });
      }
    } catch (error) {
      console.error("Error while saving address:", error);
      res.status(500).json({ success: false, message: "Failed to save address" });
    }
    
}
userprofile.deleteaddress=async(req,res)=>{
  const id = req.body.addressid.trim();
 
  console.log("review",id);
  try{

  
  const result=await userdb.findByIdAndUpdate(
    req.session.userid,
      {$pull:{address:{_id:id}}
    },{new:true}
  );
  if(result){
    console.log("inside");
    res.json({success:true,message:"SuccessFully deleted"})
  }else{
    res.json({success:false,message:"Can't deleted"})
    
  }
}catch(error){
  console.error("Error while saving address:",error);
  res.status(500).json({ success: false, message: "Failed to save address" });
}
 


}
module.exports=userprofile;