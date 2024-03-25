const userdb=require('../../models/UserModels/UserSignupSchema');
const userprofile={};
userprofile.getuserprofile=async (req,res)=>{
    const userid=req.session.userid;
    const data=await userdb.findById(userid);
    const useraddress=data.address
   
    res.render('userViews/userprofile',{data,useraddress});

}
userprofile.postuserprofile=async(req,res)=>{
    const {streetaddress,city,zipcode,state,House_name,landmark}=req.body;
    const userid=req.session.userid;
    console.log(userid);
    try{
        await userdb.findByIdAndUpdate(
            userid,
            {
            $push: {
                address: {
                    streetaddress,
                    city,
                    zipcode,
                    state,
                    House_name,
                    landmark
                },
              },
            })
            res.status(200).send({ message:"Address saved successfully"}); // Respond with success message
        } catch (error) {
            console.error("Error while saving address:", error);
            res.status(500).send({message:"Failed to save address"}); // Respond with error message
        }
   

}

userprofile.getalladdress=async(req,res)=>{
    const userid=req.session.userid;
    const result=await userdb.findById(userid);
    const data=result.address;
    // console.log(data);
    res.render('Userviews/showalladdress',{data});
}
userprofile.addaddress=async (req,res)=>{
    res.render('Userviews/addaddress')
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
            
        
        
            res.render('UserViews/editaddress',{data})
    
    
}

userprofile.posteditaddress=async(req,res)=>{
    const {streetaddress,city,zipcode,state,House_name,landmark}=req.body;
    console.log(streetaddress);
    const userid=req.session.userid;
    console.log("Hai Welcome to ooty nice to meet you");
    try {
      const userAdr = await userdb.findByIdAndUpdate(
        userid,
        {
          $set: {
            "address": {
              streetaddress,
              landmark,
              state,
              city,
              zipcode,
              House_name,
           
            }
          }
        },
        { new: true } // This option returns the modified document
      );
      console.log("eeeeeeeee");
    
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
module.exports=userprofile;