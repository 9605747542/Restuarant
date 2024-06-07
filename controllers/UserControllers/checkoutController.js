const Product = require('../../models/AdminModels/ProductSchema');
const Cartdb=require('../../models/UserModels/usercartSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema')
const usercheckout={};

usercheckout.getcheckout = async (req, res) => {
    try {
        console.log("Rose");
        const userid = req.session.userid;
       
  
        // Find user by id
        const user = await Userdb.findById(userid);
        const data = user.address;

        const cart = await Cartdb.findOne({ userid }).populate('products.product');

        if (!cart) {
            console.log("No cart found for the user");
            return res.status(404).send("No cart found for the user");
        }

        console.log("Cart products:", cart.products);

        let products=[];

        if (cart.products) {
            products = cart.products.map(cartItem => {
                return {
                    quantity: cartItem.quantity,
                    productName: cartItem.product ? cartItem.product.productName : "", // Check if product is null
                    price: cartItem.product ? cartItem.product.price : 0, // Check if product is null
                    total: cartItem.total
                };
            });
        } else {
            console.log("Cart products are null");
        }
        console.log("here",products,data);
        console.log("Processed products:", products);
        console.log("Product count:", products.length);
        // Render checkout page with user address and cart products
        if (products && products.length !== 0) {
            console.log("checko ut working");
            // res.redirect('/home');
            res.status(200).json({message:'Success',success:true})
          
        } else {
            console.log("when");
            res.status(200).json({message:'Success',success:false})
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
  
};
usercheckout.getcheckoutpage=async(req,res)=>{
    try {
        console.log("Rose");
        const userid = req.session.userid;
        console.log("user",userid);
        req.session.checkout = true;
        // Find user by id
        const user = await Userdb.findById(userid);
        const data = user.address;

        const cart = await Cartdb.findOne({ userid }).populate('products.product');

        if (!cart) {
            console.log("No cart found for the user");
            return res.status(404).send("No cart found for the user");
        }

        console.log("Cart products:", cart.products);

        let products=[];

        if (cart.products) {
            products = cart.products.map(cartItem => {
                return {
                    quantity: cartItem.quantity,
                    productName: cartItem.product ? cartItem.product.productName : "", // Check if product is null
                    price: cartItem.product ? cartItem.product.price : 0, // Check if product is null
                    total: cartItem.total
                };
            });
        } else {
            console.log("Cart products are null");
        }
        console.log("here",products,data);
        console.log("Processed products:", products);
        console.log("Product count:", products.length);
        // Render checkout page with user address and cart products
        if (products && products.length !== 0) {
            console.log("checko ut working");
            // res.redirect('/home');
            // res.status(200).json({message:'Success'})
            res.render('userViews/checkout', { data, products });
        } else {
            console.log("when");
            res.status(200).redirect('/home');
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }

}



usercheckout.postaddresscheckout=async(req,res)=>{
    console.log("blaa");

        const {streetaddress,phone,city,House_name}=req.body;
        const userid=req.session.userid;
        console.log(userid);
        try{
            await Userdb.findByIdAndUpdate(
                userid,
                {
                $push: {
                    address: {
                        streetaddress,
                        city,
                        House_name,
                        phone
                    },
                  },
                })
                res.status(200).send({ message:"Address saved successfully"}); // Respond with success message
            } catch (error) {
                console.error("Error while saving address:", error);
                res.status(500).send({message:"Failed to save address"}); // Respond with error message
            }
        }


module.exports=usercheckout;