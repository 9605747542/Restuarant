const productModel=require('../../models/AdminModels/ProductSchema');
const categorys=require('../../models/AdminModels/categorySchema');
const OfferModel=require('../../models/AdminModels/offerSchema');
const multer = require('multer');
const session=require('express-session');
const path=require('path');
const sharp=require('sharp');
const userproduct={};
const fs = require('fs');




//add product and post in vendi 
userproduct.getaddproduct=async(req,res)=>{
    const data=await categorys.find();

   
      res.render('Adminviews/addproduct',{data:data});
       
  
}



// userproduct.postaddproduct = async (req, res) => {
//     try {
//         const images = req.files;
//         console.log('multiple Images:', images);

//         if (!images || images.length === 0) {
//             return res.status(400).json({ error: "No images provided" });
//         }

//         let imagePaths = [];

//         // Assuming image paths are stored in "/admin-assets/product-img/"
//         for (const image of images) {
//             const imagePath = "/admin-assets/product-img/" + image.filename;
//             console.log('imagename:', image.filename);
//             imagePaths.push(imagePath);
//         }

//         const { productName, price, description, category, stock } = req.body;
//         console.log('blaa');
//         console.log(category);
    

//         const categoryData = await categorys.findOne({ categoryName: category });

//         if (!categoryData) {
//             return res.status(400).json({ success: false, message: "Category not found" });
//         } else {
//             const roundedPrice = Math.ceil(price);
//             const product1 = new productModel({
//                 image: imagePaths,
//                 productName,
//                 price: roundedPrice,
//                 description,
//                 category: categoryData._id,
//                 stock,
//                 orginalPrice:0,
//                 discount:0,
//                 offertype:0

//             });

//             console.log(product1);

//             await product1.save();
//             console.log("product id", product1._id);

        

          
//         }
//         console.log('Product added Successfully');
//         res.status(500).json({ success: true, message: 'SuccessFully created a Product' });

//     } catch (error) {
//         console.error('Error adding product:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// }



userproduct.postaddproduct = async (req, res) => {
    try {
        const images = req.files;
        console.log("multiple image:",images[0]);

        if (!images || images.length === 0) {
            return res.status(400).json({ error: "No images provided" });
        }

        let imagePaths = [];

        // Assuming image paths are stored in "/admin-assets/product-img/"
        for (const image of images) {
            const imagePath = "/admin-assets/product-img/" + image.filename;
            imagePaths.push(imagePath);
        }

        const { productName, price, description, category, stock } = req.body;

        const categoryData = await categorys.findOne({ categoryName: category });

        if (!categoryData) {
            return res.status(400).json({ success: false, message: "Category not found" });
        } else {
            const roundedPrice = Math.ceil(price);
            const product1 = new productModel({
                image: imagePaths,
                productName,
                price: roundedPrice,
                description,
                category: categoryData._id,
                stock,
                orginalPrice: 0,
                discount: 0,
                offertype: 0
            });

            await product1.save();

            res.status(200).json({ success: true, message: 'Successfully created a Product' });
        }
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


userproduct.geteditproduct=async(req,res)=>{

    const id=req.query.id;

  
  const data= await productModel.findById(id).populate('category');
  const categoryDetails=await categorys.find();
    res.render('Adminviews/editproduct',{data,categoryDetails});
}















// userproduct.posteditproduct = async (req, res) => {
//     try {
//         console.log("Request received to edit product");
//         console.log("Files received:", req.files);
//         const productId = req.body.id;
//         const { productName, price, description, stock, category, imageIndex } = req.body;
//         console.log("Category:", category);
//         const categoryDetails = await categorys.findOne({ categoryName: category });

//         const existingProduct = await productModel.findById(productId);

//         if (!existingProduct) {
//             return res.status(404).json({ success: false, message: 'Product not found' });
//         }

//         // Handle image updates
//         if (req.files && req.files.length > 0 && typeof imageIndex !== 'undefined') {
//             const newImage = req.files[0].path;
//             const index = parseInt(imageIndex);

//             if (index >= 0 && index < existingProduct.image.length) {
//                 // Optionally delete the old image file
//                 const oldImagePath = path.join(__dirname, '..', existingProduct.image[index]);
//                 console.log(`Attempting to delete old image at index ${index}: ${oldImagePath}`);

//                 try {
//                     if (fs.existsSync(oldImagePath)) {
//                         fs.unlinkSync(oldImagePath);
//                         console.log(`Successfully deleted old image: ${oldImagePath}`);
//                     } else {
//                         console.log(`File does not exist: ${oldImagePath}`);
//                     }
//                 } catch (err) {
//                     console.error(`Error deleting old image ${oldImagePath}:`, err);
//                 }

//                 // Replace the image at the specific index
//                 existingProduct.image[index] = newImage.replace('public\\', '/');
//             } else {
//                 return res.status(400).json({ success: false, message: 'Invalid image index' });
//             }
//         }

//         // Update other product details
//         existingProduct.productName = productName;
//         existingProduct.price = price;
//         existingProduct.description = description;
//         existingProduct.stock = stock;
//         existingProduct.category = categoryDetails._id;

//         await existingProduct.save();
//         return res.json({ success: true, message: "Product updated successfully" });
//     } catch (error) {
//         console.error("An error occurred:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

userproduct.posteditproduct = async (req, res) => {
    try {
        console.log("Request received to edit product");
        console.log("Files received:", req.files);
        const productId = req.body.id;
        const { productName, price, description, stock, category, imageIndex, imagesToDelete } = req.body;
        console.log("Category:", category);
        const categoryDetails = await categorys.findOne({ categoryName: category });

        const existingProduct = await productModel.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Handle image deletions
        if (imagesToDelete && imagesToDelete.length > 0) {
            imagesToDelete.forEach(index => {
                const idx = parseInt(index);
                const oldImagePath = path.join(__dirname, '..', existingProduct.image[idx]);
                console.log(`Attempting to delete old image at index ${idx}: ${oldImagePath}`);

                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log(`Successfully deleted old image: ${oldImagePath}`);
                    } else {
                        console.log(`File does not exist: ${oldImagePath}`);
                    }
                } catch (err) {
                    console.error(`Error deleting old image ${oldImagePath}:`, err);
                }

                // Remove the image from the array
                existingProduct.image.splice(idx, 1);
            });
        }

        // Handle image updates
        if (req.files && req.files.length > 0 && typeof imageIndex !== 'undefined') {
            const newImage = req.files[0].path;
            const index = parseInt(imageIndex);

            if (index >= 0 && index < existingProduct.image.length) {
                // Optionally delete the old image file
                const oldImagePath = path.join(__dirname, '..', existingProduct.image[index]);
                console.log(`Attempting to delete old image at index ${index}: ${oldImagePath}`);

                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log(`Successfully deleted old image: ${oldImagePath}`);
                    } else {
                        console.log(`File does not exist: ${oldImagePath}`);
                    }
                } catch (err) {
                    console.error(`Error deleting old image ${oldImagePath}:`, err);
                }

                // Replace the image at the specific index
                existingProduct.image[index] = newImage.replace('public\\', '/');
            } else {
                return res.status(400).json({ success: false, message: 'Invalid image index' });
            }
        }

        // Update other product details
        existingProduct.productName = productName;
        existingProduct.price = price;
        existingProduct.description = description;
        existingProduct.stock = stock;
        existingProduct.category = categoryDetails._id;

        await existingProduct.save();
        return res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.error("An error occurred:", error);
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

