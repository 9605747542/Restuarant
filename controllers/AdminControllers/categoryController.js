const categorys=require('../../models/AdminModels/categorySchema');
const session=require('express-session');
const Swal = require('sweetalert2');
const userCatagory={};
userCatagory.getcategory=async(req,res)=>{
 
        try{
            const catdata = await categorys.find();
            res.render('Adminviews/category',{catdata});
        }catch(error){
            console.log("error occures during database",error);
        }
}

// userCatagory.postcategory = async (req, res) => {
//     try {
//         const categoryname = req.body.categorytype.toLowerCase();
//         console.log(categoryname);
//         const result = await categorys.findOne({ categoryName:categoryname});
//         console.log(result);
//         if (!result) {
//             // If category does not exist, insert it into the database
//             await categorys.insertOne({ categoryName: categoryname }, (err, result) => {
//                 if (err) {
//                     console.error('Error inserting category:', err);
//                     res.status(500).json({ success: false, message: "Failed to insert category" });
//                 } else {
//                     console.log('Category added:', categoryname);
//                     res.json({success: true, message: "Category created successfully" });
//                 }
//             });
//         } else {
//             // If category already exists, send a message indicating that to the user
//             res.status(400).json({ success:false, message: 'Category already exists. Please choose a different one.' });
//         }
//     } catch (err) {
//         console.error('Error finding/inserting category:', err);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// }


userCatagory.postcategory = async (req, res) => {
    try {
        const categoryname = req.body.categorytype;
        console.log(categoryname);

       

        // Check if the category already exists in the database (case-insensitive)
        const existingCategory = await categorys.findOne({ categoryName: { $regex: new RegExp('^' + categoryname + '$', 'i') } });
 
        console.log(existingCategory);
        // console.log(categorys);
        if (existingCategory === null) {
            // If category does not exist, insert it into the database
            console.log(existingCategory);
            console.log(categoryname);
            const result = new categorys({
                categoryName:categoryname
            })
            await result.save()
             
            console.log(result);
            console.log('Category added:', categoryname);
            
            res.json({ success: true, message: "Category created successfully" });
        } else {
            // If category already exists, send a message indicating that to the user
            console.log("Already Exist");
            return res.json({ success: false, message: 'Category already exists. Please choose a different one.' });
        }
    } catch (err) {
        console.error('Error finding/inserting category:', err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}







//Edit Category

userCatagory.geteditcategory=async(req,res)=>{
    
   
        try{
            const Id=req.query.id;
            req.session.category_id=Id;
            console.log(req.session.category_id);
            console.log("id from back in  edit case:",Id);
            
            const currentcategory=await categorys.findById(Id)
            console.log(currentcategory);
            const catdata = await categorys.find();
            res.render('Adminviews/editcategory',{catdata,currentcategory});
        }catch(error){
            console.log("error occures during database",error);
        }
  
}
userCatagory.posteditcategory = async (req, res) => {
    const { categoryname,id } = req.body;
    console.log(id);

    try {
        // Regular expression to match alphanumeric characters and underscores
        const categoryPattern = /^[a-zA-Z0-9_]+$/;

        // Check if the category name matches the regex pattern
        if (!categoryPattern.test(categoryname)) {
            return res.status(400).json({ success: false, message: "Invalid category name. It must contain only alphanumeric characters and underscores." });
        }

        // Check if the category already exists in the database
        // const existingCategory = await categorys.findOne({ categoryName: { $regex: new RegExp('^' + categoryname + '$', 'i') } });

        const existingCategory = await categorys.findById(id);

        if (existingCategory) {
            // Update the category's name
            existingCategory.categoryName = categoryname;
            await existingCategory.save();
            console.log('Category updated:', categoryname);
            return res.json({ success: true, message: "Category updated successfully" });
        } else {
            console.log("Category not found");
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

//Delete category
userCatagory.getdeletecategory=async(req,res)=>{
    
        try{
            const Id=req.query.id;
            console.log("id from backend",Id);
            const currentcategory=await categorys.findById(Id)
            console.log(currentcategory);
            const catdata1 = await categorys.find();

            res.render('Adminviews/deletecategory',{catdata1,currentcategory});
        }catch(error){
            console.log("error occures during database",error);
        }
  
}
userCatagory.postdeletecategory = async (req, res) => {
    try {
        const idValue= req.body.idValue;
        const currentcategory = await categorys.findById(idValue);

        // Check if the category exists
        if (!currentcategory) {
           res.json({ success:false ,message: "Category not found" });
        }

        // Delete the category by its ID
        const result = await categorys.findOneAndDelete({ _id: idValue });
        res.json({ success:true,message:"SuccessFully deleted Category" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}





module.exports=userCatagory;

