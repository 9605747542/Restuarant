const productdb=require('../../models/AdminModels/ProductSchema')
const userproduct={};
userproduct.getproductpage=async(req,res)=>{
    try{
      
            const data=await productdb.find();
            console.log(data);
            
            res.render('Userviews/orginalproduct',{data});

    }catch{
        console.error('Error occurs during product');
    }
}
    userproduct.getproductdetails=async(req,res)=>{
     
            const pid=req.query.id;
            console.log(pid);
            const data=await productdb.findById(pid);
            console.log(data);
            const image=data.image;
          
            res.render('userViews/viewsingleproduct',{image,data})
       
    }


module.exports=userproduct;