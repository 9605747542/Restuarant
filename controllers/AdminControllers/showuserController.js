const userControllers={}
const session=require('express-session');
const userdb=require('../../models/UserModels/UserSignupSchema');




userControllers.getUserdata = async (req, res) => {
    if(req.session.admin){
        try {
            const data = await userdb.find();
            res.render('Adminviews/userdetails', { data });
        } catch (error) {
            console.log(error);
            // Handle the error appropriately, e.g., sending an error response to the client
            res.status(500).send('Internal Server Error');
        }

    }else{
        res.redirect('/adminlogin');
    }
   
}
userControllers.blockuser = async (req, res) => {

    try {
      
        const id = req.params.id;
        console.log("userId",req.params.id)
        const user = await userdb.findById(id);

        console.log("user",user)
        if (user) {
          user.isBlocked = true;
          await user.save();
        res.redirect('/getUser')
        }
  
      
    } catch (error) {
      console.error("Error toggling user block status:", error);
      res.render('serverError')
    }
  };
  
  userControllers.unblockuser = async (req, res) => {
    // unblock userlist
  
    try {
        const id= req.params.id;
        console.log(id);
  
        const user = await userdb.findById(id);
  
        if (user) {
          user.isBlocked = false;
          await user.save();
          res.redirect('/getUser')
        }
      
    } catch (error) {
      console.error("Error toggling user block status:", error);
      res.render('serverError')
    }
  };
  

module.exports=userControllers;