const productModel=require('../../models/AdminModels/ProductSchema');
const categorys=require('../../models/AdminModels/categorySchema');
const multer = require('multer');
const session=require('express-session');
const path=require('path');
const sharp=require('sharp');
const userproduct={};
const Swal=require('sweetalert2');
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
            
                    
                    // Check if file exists
                   
            
                    imagePaths.push(imagePath);
            }
            
                  

            const { productName, price, priceInMasala, description,category,stock} = req.body;
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
                priceInMasala,
                description,
                category:data._id,
                stock
            });
        

            console.log(product1);


            // const data=await productModel.find();
          

            // const productNamesArray = data.map(product => product.productName);
            // console.log(productNamesArray);


            // if(productNamesArray.includes(product1.productName)){
            //     res.json({ success: false, message: 'Duplicate ProductName' });

            // }

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
    
   
};


userproduct.geteditproduct=async(req,res)=>{

    const id=req.query.id;
  
  const data= await productModel.findById(id)




    res.render('Adminviews/editproduct',{data});
}


// userproduct.posteditproduct=async(req,res)=>{
//     try{
//     const productId=req.body.id;
//     const {productName,price,priceInMasala,description,stock}=req.body;
//     console.log(productId);
//     if(req.files){
//     const  image1=req.files;
//     console.log(image1);
//     // image1.mv("/admin-assets/product-img/".jpg)
// }


        

    
//     const existingProduct = await productModel.findById(productId);

//     if (existingProduct) {
//         // Update the category's name
//         existingProduct.productName = productName;
//         existingProduct.price = price;
//         existingProduct.priceInMasala = priceInMasala;
//         existingProduct.description = description;
//         existingProduct.stock=stock

//         await existingProduct.save();
//         console.log('Product updated:', productName);
//         return res.json({ success: true, message: "Product updated successfully" });
//     } else {
//         console.log("Product not found");
//         return res.status(404).json({ success: false, message: 'Product not found' });
//     }
// } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
// }

// }


userproduct.posteditproduct = async (req, res) => {
    try {
        const productId = req.body.id;
        const { productName, price, priceInMasala, description, stock } = req.body;
        console.log(productId);

        const existingProduct = await productModel.findById(productId);

        if (!existingProduct) {
            console.log("Product not found");
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Assuming a new image was uploaded
        if (req.files && req.files.image) {
            const image = req.files.image;
            // Generate a new filename or use the existing logic from your upload middleware
            const newImageName = `${Date.now()}-${image.originalname}`;
            const newPath = `/admin-assets/product-img/${newImageName}`;

            // Optionally delete the old image from the server
            const fs = require('fs');
            const oldPath = existingProduct.imagePath; // Ensure this path is correct
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            // Move the new image to the desired location
            await image.mv(newPath);

            // Update the product's image path
            existingProduct.imagePath = newPath;
        }

        // Update other product details
        existingProduct.productName = productName;
        existingProduct.price = price;
        existingProduct.priceInMasala = priceInMasala;
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

