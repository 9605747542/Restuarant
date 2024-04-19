const productModel=require('../../models/AdminModels/ProductSchema');
const categorys=require('../../models/AdminModels/categorySchema');
const multer = require('multer');
const session=require('express-session');
const path=require('path');
const sharp=require('sharp');
const userproduct={};
const Swal=require('sweetalert2');
const fs = require('fs').promises;
const os = require('os');
const { error, log } = require('console');



//add product and post in vendi 
userproduct.getaddproduct=async(req,res)=>{
    const data=await categorys.find();

   
      res.render('Adminviews/addproduct',{data:data});
       
  
}



userproduct.postaddproduct = async (req, res) => {

    try {
        const images = req.files;
        console.log('multiple Images:', images);

        if (!images || images.length===0) {
            return res.status(400).json({ error: "No images provided" });
        }

        let imagePaths = [];

        
        const fs = require('fs');

        for (const image of images) {
                const imagePath = "/admin-assets/product-img/" + image.filename;
                console.log('imagename:', image.filename);
                imagePaths.push(imagePath);
        }
            const { productName, price, description,category,stock} = req.body;
            console.log('blaa');
            console.log(category);
          
           
            const data=await categorys.findOne({categoryName:category});
            if(!data){
                return res.status(400).json({success:false,message: "Category not found" });
            }
            else{
               
            
            
            const product1 = new productModel({
                image: imagePaths, // Assuming imagePaths is an array of file paths
                productName,
                price,
                
                description,
                category:data._id,
                stock
            });
        

            console.log(product1);
           if (product1) {
                await product1.save();
               
                res.redirect('/getproduct');
    

            } else {
                res.json({ success: false ,message:'Product details is not saved '});
            }
        } 
    }catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    
   

}


userproduct.geteditproduct=async(req,res)=>{

    const id=req.query.id;
  
  const data= await productModel.findById(id)




    res.render('Adminviews/editproduct',{data});
}





userproduct.posteditproduct = async (req, res) => {
    try {
        const productId = req.body.id;
        const { productName, price, description, stock } = req.body;
        console.log(productId);

        const existingProduct = await productModel.findById(productId);

        if (!existingProduct) {
            console.log("Product not found");
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        console.log("multiple edited product :",req.files);
        if (req.file) {
            const filePath = req.file.path;

            // Optionally delete the old image file from storage
            const oldPath = existingProduct.imagePath;
            fs.unlinkSync(oldPath);

            // Update product with new image path
            existingProduct.imagePath = filePath;
        }

       
     
        // Update other product details
        existingProduct.productName = productName;
        existingProduct.price = price;
        existingProduct.description = description;
        existingProduct.stock = stock;

        await existingProduct.save();
        console.log('Product updated:', productName);
        return res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};





userproduct.removeproductimage = async (req,res)=>{

console.log("blaaaa");
    
    

};



userproduct.postdeleteproduct = async (req, res) => {
    const id = req.params.id; 
    console.log(id)
        try {
           
            // Access the ID from route parameters
            // console.log("id from unlisting product", id);
            const product = await productModel.findById(id)
            let isUnlist = product.unlist;
            console.log("what a product",isUnlist)
            const val=await productModel.findByIdAndUpdate(id, { unlist: !isUnlist });
            // await productModel.findByIdAndDelete(id);
            console.log("Successfully deleted");
            res.status(200).json({success:true,message:"SuccessFully!!"})
        } 
        catch (error) {
            console.error(error);
            console.log("Error occurs during product deletion");
            res.json({success:false,message:"We can't delete !!"})
        }
};




    module.exports=userproduct;

