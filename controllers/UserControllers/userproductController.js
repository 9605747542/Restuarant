const productdb=require('../../models/AdminModels/ProductSchema')
const userproduct={};
userproduct.getproductpage=async(req,res)=>{
    try{
        if(req.session.Usersession){
            const data=await productdb.find();
            console.log(data);
            
            res.render('Userviews/product1',{data});
        }else{
            res.redirect('/')
        }

    }catch{
        console.error('Error occurs during product');
    }
}
    userproduct.getproductdetails=async(req,res)=>{
        if(req.session.Usersession){
            const pid=req.query.id;
            console.log(pid);
            const data=await productdb.findById(pid);
            console.log(data);
            const image=data.image;
          
            res.render('userViews/viewsingleproduct',{image,data})
        }else{
            res.redirect('/')
        }
    }


module.exports=userproduct;