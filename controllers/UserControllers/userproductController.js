const productdb=require('../../models/AdminModels/ProductSchema')
const cartdb=require('../../models/UserModels/usercartSchema');
const userdb = require('../../models/UserModels/UserSignupSchema');
const Category=require('../../models/AdminModels/categorySchema')

const userproduct={};
userproduct.getproductpage=async(req,res)=>{
    try{
        const id=req.session.userid;
        console.log(id);
        const user=await userdb.findById(id);
        
      
            const data=await productdb.find();
           
            const carts = await cartdb.find({userid:id});
            let count=0;
         carts.forEach((cart=>{
            cart.products.forEach((product=>{
                count+=product.quantity;
            }))
         }))
     
          console.log(count);
       
            res.render('Userviews/orginalproduct',{data,count,user,results: []});

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
            productName: { $regex: new RegExp(query, 'i') } // Case-insensitive search on 'productName' field
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
        // res.redirect(`/getuserproduct?data=${JSON.stringify(data)}`);
        res.render('userViews/orginalproduct',{data,count,user})
    } catch (err) {
        console.error('Error searching collection:', err);
        res.status(500).send('Internal Server Error');
    }
}


userproduct.sortproducts=async(req,res)=>{
    const sortBy = req.query.sortBy; // Get the sorting criteria from the request
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
        res.render('userViews/orginalproduct',{data,count,user})
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
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