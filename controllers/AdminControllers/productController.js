const productModel=require('../../models/AdminModels/ProductSchema');
const multer = require('multer');
const session=require('express-session');
const path=require('path');
// const sharp=require('sharp');
const userproduct={};
const Swal=require('sweetalert2');



//add product and post in vendi 
userproduct.getaddproduct=async(req,res)=>{
    if(req.session.admin){
      res.render('Adminviews/addproduct');
       
    }else{
       res.redirect('/adminlogin');
    }
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
    if (req.session.admin) {
        try {
            const images = req.files;
            console.log(req.body);
            console.log('multiple Images:', images);

            if (!images) {
                return res.status(400).json({ error: "No images provided" });
            }

            let imagePaths = [];

            
              for (const image of images) {
                console.log(image.filename)
                let imagePath = "/admin-assets/product-img/" + image.filename;
                    console.log('imagename:', image.filename);
                    imagePaths.push(imagePath);
                //     try {
                //         const croppedBuffer = await sharp(req.file.buffer)
                //           .resize({ width: 200, height: 200 })
                //           .toBuffer();
                // }
              }

            const { productName, price, priceInMasala, description } = req.body;
            

            const product1 = new productModel({
                image: imagePaths, // Assuming imagePaths is an array of file paths
                productName,
                price,
                priceInMasala,
                description
            });

            console.log(product1);

            if (product1) {
                await product1.save();
                res.redirect('/getproduct')
            } else {
                res.json({ success: false });
            }
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.redirect('/adminlogin');
    }
};


userproduct.geteditproduct=async(req,res)=>{
if(req.session.admin){
    const id=req.query.id;
  const data= await productModel.findById(id)
    res.render('Adminviews/editproduct',{data});

}else{
    res.redirect('/adminlogin');
}


}



    module.exports=userproduct;

