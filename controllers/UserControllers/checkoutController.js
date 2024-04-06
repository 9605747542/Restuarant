const Product = require('../../models/AdminModels/ProductSchema');
const Cartdb=require('../../models/UserModels/usercartSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema')
const usercheckout={};
usercheckout.getcheckoutpage = async (req, res) => {
    try {
        const userid = req.session.userid;
        
        // Find user by id
        const user = await Userdb.findById(userid);
        const data = user.address;

        // Find cart by userid and populate products
        const cart = await Cartdb.findOne({ userid }).populate('products.product');

        if (!cart) {
            console.log("No cart found for the user");
            return res.status(404).send("No cart found for the user");
        }

        console.log("Cart products:", cart.products);

        // Extract product information from cart
        const products = cart.products.map(cartItem => {
            return {
                quantity: cartItem.quantity,
                productName: cartItem.product.productName,
                price: cartItem.product.price,
                total:cartItem.total
            };
        });
        
        // Render checkout page with user address and cart products
        res.render('userViews/checkout', { data, products});
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
};

usercheckout.postaddresscheckout=async(req,res)=>{
    console.log("blaa");

        const {streetaddress,phone,city,zipcode,state,House_name,landmark}=req.body;
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
                        zipcode,
                        state,
                        House_name,
                        landmark,
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