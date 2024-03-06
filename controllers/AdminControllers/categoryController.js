const categorys=require('../../models/AdminModels/categorySchema');
const session=require('express-session');
const Swal = require('sweetalert2');
const userCatagory={};
userCatagory.getcategory=async(req,res)=>{
    if(req.session.admin){
        try{
            const catdata = await categorys.find();
            res.render('Adminviews/category',{catdata});
        }catch(error){
            console.log("error occures during database",error);
        }
      
    }else{
        res.redirect('/adminlogin')
    }
}

userCatagory.postcategory=async(req,res)=>{
    if(req.session.admin){
        const categoryname=req.body.categorytype;
        console.log(categoryname);
        // if(categoryname==='  '){
        //     res.json({message:"Write proper category!!",success:false})

            
        // }
        
        try{
            if(categoryname!=="  "){
         const data= await categorys.create({categoryName:categoryname})
        
            res.json({message:"SuccessFully Saved data",success:true })
        }else{
            res.json({message:"Write proper category!!",success:false})
        }
    }catch(error){
            res.json({message:"Cant upload data to db",success:false})
              
    
        }
    }else{
        res.redirect('/adminlogin');
    }
}




//Edit Category

userCatagory.geteditcategory=async(req,res)=>{
    
    if(req.session.admin){
        try{
            const Id=req.query.id;
            console.log(Id);
            const currentcategory=await categorys.findById(Id)
            console.log(currentcategory);
            const catdata = await categorys.find();
            res.render('Adminviews/editcategory',{catdata,currentcategory:currentcategory});
        }catch(error){
            console.log("error occures during database",error);
        }
    }else{
        res.redirect('/adminlogin');
    }
}
userCatagory.posteditcategory=async(req,res)=>{
    if(req.session.admin){
        const {categoryname}=req.body;
        // const currentcategory=await categorys.findById(id)
        console.log(req.body);
         try{
             await categorys.findByIdAndUpdate({categoryName:categoryname});
             res.json({status:"success"})
         }
         catch(error){
             console.log(error);
         }

    }else{
        res.redirect('/adminlogin');
    }
  
}


//Delete category
userCatagory.getdeletecategory=async(req,res)=>{
    
    if(req.session.admin){
        try{
            const Id=req.query.id;
            console.log(Id);
            const currentcategory=await categorys.findById(Id)
            console.log(currentcategory);
            const catdata1 = await categorys.find();

            res.render('Adminviews/deletecategory',{catdata1,currentcategory});
        }catch(error){
            console.log("error occures during database",error);
        }
    }else{
        res.redirect('/adminlogin');
    }
}
userCatagory.postdeletecategory=async(req,res)=>{
    if(req.session.admin){
        try{
            const {id,categoryname}=req.body;
            console.log(categoryname+"nourii")
            const currentcategory=await categorys.findById(id)
       console.log(id);
       
             await categorys.findByIdAndDelete(currentcategory);
             res.json({status:"success"});
         }catch(error){
            console.log(error);
        }
    }else{
        res.redirect('/adminlogin');
    }
 }




module.exports=userCatagory;

