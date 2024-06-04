const Userdb=require('../models/UserModels/UserSignupSchema');
const Cartdb=require('../models/UserModels/usercartSchema');
const Productdb=require('../models/AdminModels/ProductSchema');
const isLogged=(req,res,next)=>{
    if(req.session.Usersession){
        console.log('User Side Working');
        next()
    }else{
        res.redirect('/')
    }
}
async function userisBlocked(req, res, next) {
    if (req.session && req.session.userid) {
        try {

            const user = await Userdb.findById(req.session.userid);

            if (user && user.isBlocked === true) {

                console.error("User is blocked by admin");
                req.session.Usersession = false;
                res.redirect('/');
            } else {

                next();
            }
        } catch (error) {
            console.error("Error checking user block status:", error);
        }
    }
}




async function checkStock(req, res, next) {
    
    const productId = req.body.productId;
    let quantity=req.body.quantity;
    console.log("middle",quantity);
    console.log("ID from middleware:", productId);
    console.log("middleware...");
    console.log("User ID:", req.session.userid);
    if(quantity==null){
        quantity=1;
    }

    // Check if there's a cart for the user
    const cart = await Cartdb.findOne({ userid: req.session.userid });

    if (!cart || !cart.products || cart.products.length === 0) {
        console.log("Cart is empty or not found for the user. Proceeding without stock checks.");
        return next();
      
    }
    // console.log("Cart from middleware:", cart);

    // Find the product in the cart
    console.log("Sree",cart);
    const cartProduct = cart.products.find(p => p.product.toString() === productId.toString());
    if(cartProduct){
        console.log("testing",cart.products[0].quantity);

    }
 

    // Find the product in the database
    const product = await Productdb.findOne({ _id: productId });
    if (!product) {
        console.log("Product not found");
        return res.json({ message: "Product not found", success: false });
    }

    console.log("Stock:", product.stock);

    // Check if there's enough stock for the product
    if (cartProduct) {
        if(quantity===undefined){
            console.log("happen");
            console.log("mail",cart.products[0].quantity);
            if (product.stock < cart.products[0].quantity+1) {
                console.log("God");
                console.log("stock checking");
                console.log("Not enough stock available");
                return res.json({ message: "Not enough stock available", success: false });
            }
            
        }else{
        if (product.stock < quantity) {
            console.log("stock checking");
            console.log("Not enough stock available");
            return res.json({ message: "Not enough stock available", success: false });
        }
    }
    } else {
        if (product.stock === 0) {
            console.log("Not enough stock available");
            return res.json({ message: "Not enough stock available", success: false });
        }
    }

    return next();
}

async function checkStock1(req,res,next){
    const productId = req.query.productId;
    const quantity=req.query.quantity;
    console.log("middle",quantity);
    console.log("ID from middleware:", productId);
    console.log("middleware...");
    console.log("User ID:", req.session.userid);

    const cart = await Cartdb.findOne({ userid: req.session.userid });

    if (!cart || !cart.products || cart.products.length === 0) {
        console.log("Cart is empty or not found for the user. Proceeding without stock checks.");
        return next();
      
    }
    // console.log("Cart from middleware:", cart);

    // Find the product in the cart
    console.log("Sree",cart);
    const cartProduct = cart.products.find(p => p.product.toString() === productId.toString());

    // Find the product in the database
    const product = await Productdb.findOne({ _id: productId });
    if (!product) {
        console.log("Product not found");
        return res.json({ message: "Product not found", success: false });
    }

    console.log("Stock:", product.stock);

    // Check if there's enough stock for the product
    if (cartProduct) {
        if (product.stock < quantity) {
            console.log("Not enough stock available");
            return res.json({ message: "Not enough stock available", success: false });
        }
    } else {
        if (product.stock === 0) {
            console.log("Not enough stock available");
            return res.json({ message: "Not enough stock available", success: false });
        }
    }

    return next();

}


module.exports = {
    isLogged,
    userisBlocked,
    checkStock,
    checkStock1
};