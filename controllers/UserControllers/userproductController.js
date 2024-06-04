const productdb=require('../../models/AdminModels/ProductSchema')
const cartdb=require('../../models/UserModels/usercartSchema');
const userdb = require('../../models/UserModels/UserSignupSchema');
const Categorydb=require('../../models/AdminModels/categorySchema')

const userproduct={};
userproduct.getproductpage=async(req,res)=>{
    try{
        const id=req.session.userid;
        console.log(id);
        const user=await userdb.findById(id);
        
      
        const data = await productdb.find();
        const category=await Categorydb.find();
       
        
           
            const carts = await cartdb.find({userid:id});
            let count=0;
         carts.forEach((cart=>{
            cart.products.forEach((product=>{
                count+=product.quantity;
            }))
         }))
     
          console.log(count);
       
            res.render('userViews/orginalproduct',{category,data,count,user,results: []});

    }catch{
        console.error('Error occurs during product');
    }
}
    userproduct.searchproducts=async(req,res)=>{
        const query = req.query.query;
        const id=req.session.userid;
        console.log(query);
    try {
        const data = await productdb.find({
            productName: { $regex: new RegExp(query, 'i') } 
        });
        
        console.log("Dataaaaaa",data);

        const carts = await cartdb.find({userid:id});
        let count=0;
     carts.forEach((cart=>{
        cart.products.forEach((product=>{
            count+=product.quantity;
        }))
     }))
   
     const user=await userdb.findById(id);
     const category=await Categorydb.find()
        // res.redirect(`/getuserproduct?data=${JSON.stringify(data)}`);
       
      
        res.render('userViews/orginalproduct',{category,data,count,user})
    } catch (err) {
        console.error('Error searching collection:', err);
        res.status(500).send('Internal Server Error');
    }
}


userproduct.categoryfilter=async(req,res)=>{
    try{
  const categoryname=req.query.category;
console.log("hhhhhh");
console.log(categoryname);  
const catdata=await Categorydb.find({categoryName:categoryname});
console.log("hhhhhhhhh",catdata);
  const data=await productdb.find({category:catdata})
  console.log("ffffffffff",data);
  const id=req.session.userid;
  const carts = await cartdb.find({userid:id});
  let count=0;
carts.forEach((cart=>{
  cart.products.forEach((product=>{
      count+=product.quantity;
  }))
}))

const user=await userdb.findById(id);
const category=await Categorydb.find()
res.render('userViews/orginalproduct',{category,data,count,user})
} catch (err) {
    console.error('Error searching collection:', err);
    res.status(500).send('Internal Server Error');
}
}











userproduct.sortproducts=async(req,res)=>{
    const sortBy = req.query.sortBy; 
console.log(sortBy);

    try {
        let data={};
        switch (sortBy) {
            case 'popularity':
                // Implement sorting by popularity
                break;
            case 'priceHighToLow':
                data = await productdb.find().sort({ price: -1 })
                console.log("helo"); // Sort by price: High to Low
                break;
            case 'priceLowToHigh':
               
                data = await productdb.find().sort({ price: 1 }) // Sort by price: Low to High
                break;
            case 'aToz':
                data = await productdb.find().sort({ productName: 1 }) // Sort alphabetically A - Z
                break;
            case 'zToa':
                data = await productdb.find().sort({ productName: -1 }) // Sort alphabetically Z - A
                break;
            case 'newArrival':
                data=await productdb.find().sort({createdAt:-1})
                break;
            default:
                // Handle invalid sorting criteria
                return res.status(400).send('Invalid sorting criteria');
        }
        
        // Send the sorted data back to the client
        console.log(data);
        //get the quantity 
        const id=req.session.userid;
        const carts = await cartdb.find({userid:id});
        let count=0;
     carts.forEach((cart=>{
        cart.products.forEach((product=>{
            count+=product.quantity;
        }))
     }))

    
     console.log("userid",id);
     const user=await userdb.findById(id);
     const category=await Categorydb.find();
        res.render('userViews/orginalproduct',{category,data,count,user})
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }

}
        
    
    userproduct.getproductdetails=async(req,res)=>{
     
            const pid=req.query.id;
            console.log(pid);
            const data=await productdb.findById(pid).populate('category');
            console.log(data);
            const image=data.image;
          
            res.render('userViews/viewsingleproduct',{image,data})
       
    }


module.exports=userproduct;