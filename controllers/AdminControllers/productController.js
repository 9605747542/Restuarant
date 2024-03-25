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
// userproduct.postaddproduct=(multer1.array('file', 5)),async(req,res)=>{
//     if(req.session.admin){

    
//         const images = req.files.map((file) => file.path);
//     console.log(images);

 

//         // const randomInteger = Math.floor(Math.random() * 20000001);
//         const imgDirectory=path.join('pulbic','admin-assets','product-img');


//         const imgFilename="cropped"+randomInteger+".jpg";
//         const imgpath=path.join(imgDirectory,imgFilename);
        
//     //     console.log("imgpath:"+imgpath);
//     //     const croppedImage = await sharp(file.path)
//     //     .resize({
//     //         width: 300, 
//     //         height: 300, 
//     //         fit: "cover",
//     //     })
//     //     .toFile(imgpath);
    
//     // if (croppedImage) {
//     //     imageData.push(imgFilename);
//     // }
    
//     //         }
    

    
//     const{foodname,foodprice,foodpmasala,description}=req.body;
//     const product1=new productModel({
//        image:images,productName:foodname,price:foodprice,priceInMasala:foodpmasala,description:description

//     })
//     console.log(product1);
//     if(product1){
//         await product1.save();
//         res.json({success:true});

//     }else{
//         res.json({success:false});
//     }
// }else{
//     res.redirect('/adminlogin');
// }
   



// }


userproduct.postaddproduct = async (req, res) => {

        try {
            const images = req.files;
            console.log('multiple Images:', images);

            if (!images || images.length===0) {
                return res.status(400).json({ error: "No images provided" });
            }

            let imagePaths = [];

            
              for (const image of images) {
                let imagePath = "/admin-assets/product-img/" + image.filename;
                    console.log('imagename:', image.filename);
                    imagePaths.push(imagePath);
                //     const croppedImagePath = imagePath.replace('.', '-cropped.'); // Appending '-cropped' to the filename
                // console.log("Cropped Images:",croppedImagePath);



                // try {
                //     await sharp(image.buffer)
                //         .resize({ width: 200, height: 200 })
                //         .toFile(croppedImagePath);
            
                //     console.log('Image cropped and saved successfully:', croppedImagePath);
                //     imagePaths.push(croppedImagePath);

                    // if (!image.buffer || image.buffer.length === 0) {
                    //     throw new Error("Image buffer is empty or undefined.");
                    // }

                    // const extension = path.extname(image.filename); // Get the file extension
                    // const filenameWithoutExtension = path.basename(image.filename, extension); // Get the filename without extension
                    // const croppedImagePath = `/admin-assets/product-img/${filenameWithoutExtension}-cropped${extension}`;
        
                    // console.log('Image Name:', image.filename);
                    // console.log('Cropped Image Path:', croppedImagePath);
                    // try {
                    //     console.log('Image Buffer Length:', image.buffer.length);
                    //     const imageResizeResult = await sharp(image.buffer)
                    //         .resize({ width: 200, height: 200 })
                    //         .toFile(croppedImagePath);
                    
                    //     if (!imageResizeResult) {
                    //         console.error('Error: Image resize operation returned null or undefined.');
                    //         return res.status(500).json({ error: 'Image resize operation failed' });
                    //     }
                    
                    //     console.log('Image cropped and saved successfully:', croppedImagePath);
                    //     imagePaths.push(croppedImagePath);
                    // } catch (error) {
                    //     console.error('Error cropping and saving image:', error);
                    //     return res.status(500).json({ error: 'Error cropping and saving image' });
                    // }
                    
                // } catch (error) {
                //     console.error('Error cropping image:', error);
                //     // Handle error appropriately, e.g., return a 500 response
                //     return res.status(500).json({ error: "Error cropping image" });
                // }
            }
                
              

            const { productName, price, priceInMasala, description,category,stock} = req.body;
            console.log(stock);

            const product1 = new productModel({
                image: imagePaths, // Assuming imagePaths is an array of file paths
                productName,
                price,
                priceInMasala,
                description,
                category,
                stock
            });

            console.log(product1);


            const data=await productModel.find();
          

            const productNamesArray = data.map(product => product.productName);


            if(productNamesArray.includes(product1.productName)){
                res.json({ success: false, message: 'Duplicate ProductName' });

            }

            else if (product1) {
                await product1.save();
                res.redirect('/getproduct')
            } else {
                res.json({ success: false });
            }
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
   
};


userproduct.geteditproduct=async(req,res)=>{

    const id=req.query.id;
  
  const data= await productModel.findById(id)


    res.render('Adminviews/editproduct',{data});
}


userproduct.posteditproduct=async(req,res)=>{
    try{
    const productId=req.body.id;
    const {productName,price,priceInMasala,description}=req.body;
    console.log(productId);

        

    
    const existingProduct = await productModel.findById(productId);

    if (existingProduct) {
        // Update the category's name
        existingProduct.productName = productName;
        existingProduct.price = price;
        existingProduct.priceInMasala = priceInMasala;
        existingProduct.description = description;

        await existingProduct.save();
        console.log('Product updated:', productName);
        return res.json({ success: true, message: "Product updated successfully" });
    } else {
        console.log("Product not found");
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
} catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
}

}




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

