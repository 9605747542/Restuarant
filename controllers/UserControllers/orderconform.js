const Orderdb=require('../../models/UserModels/userorderSchema');
const Cartdb=require('../../models/UserModels/usercartSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema');
const Productdb=require('../../models/AdminModels/ProductSchema');
const orderconform={};
orderconform.getorderconform=async (req,res)=>{
    console.log("haii");
    const addressID = req.body.addressDetails;
const anonymous = await Userdb.findOne({ 'address._id': addressID });

let addressObject = null;

if (anonymous) {
    // Find the address object with the matching _id
    addressObject = anonymous.address.find(address => address._id.toString() === addressID);
}

console.log("mmmmmmm:", addressObject);


    const userid=req.session.userid;
    // const userData=
    const cartdata=await Cartdb.findOne({userid:userid}).populate('products.product');
    console.log(cartdata.products);
    const total=cartdata.products[0].total;
    console.log("Its me ",total);
   //check the value of cartdata.products
   const products = cartdata.products.map(cartItem => {
    return {
      product:cartItem.product._id,
        quantity: cartItem.quantity,
        productName: cartItem.product.productName,
        image: cartItem.product.image,
        price: cartItem.product.price,
        category: cartItem.product.category,
    };
}); 
let totalPrice=0;
cartdata.products.forEach(data=>{
    totalPrice+=data.total;
})
console.log("totalprice",totalPrice);


    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

//for getting random order id
    function generateOrderId() {
        const timestamp = Date.now().toString(); // Get current timestamp
        const randomString = generateRandomString(5); // Generate a random string
        return `${timestamp}-${randomString}`;
    }
    req.session.customer=cartdata._id;
    
   const user=await Userdb.findById(req.session.userid);
const userEmail=user.email;
    const flatRate=50;
    const today = new Date(); // Get the current date and time


const day = today.getDate().toString().padStart(2, '0');
const month = (today.getMonth() + 1).toString().padStart(2, '0'); 
const year = today.getFullYear();

const formattedDate = `${day}-${month}-${year}`;
const [day1, month1, year1] = formattedDate.split('-');

// Create a new Date object using the components
const convertedDate = new Date(year1, month1 - 1, day1); // Month is zero-based, so subtract 1 from the month

console.log("Converted date:", convertedDate);
const username=await Userdb.findById(req.session.userid);
console.log(username);
    


 
    
        try {
            const data = new Orderdb({
                customer: cartdata._id,
               address:addressObject,
                products: products,
                totalAmount: totalPrice,
                shipping:flatRate,
                ActualAmount:totalPrice + flatRate,
                OrderStatus: 'Order Placed',
                paymentMethod: 'Cash on Delivery',
                orderDate:  convertedDate,
                orderId: generateOrderId(), 
              useremail:userEmail,
              username:username.name
             });
           
           
            cartdata.products.forEach(async (item) => {
                const stock = item.product.stock;
                const quantity = item.quantity;
            
                if (stock >= quantity) {
                    const updatedStock = stock - quantity;
                    item.product.stock = updatedStock;
            
                    try {
                        await item.product.save();
                        console.log("Stock updated for Product ID:", item.product._id, ":", updatedStock);
                    } catch (error) {
                        console.error("Error updating stock for Product ID:", item.product._id, ":", error.message);
                    }
                } else {
                    console.log("Insufficient stock for Product ID:", item.product._id);
                }
            });
            
            const cart=await Cartdb.findOne({ userid:userid});
            cart.products=[];
            cart.save();



            await data.save(); // Don't forget to await the asynchronous operation
            console.log('Order saved successfully!');
            res.json({success:true,message:"Successfully saved"})
        }
 catch (error) {
  // Handle any errors that occur during order placement
  console.error('Error placing order:', error);
  res.status(500).json({ error: 'Failed to place order' });
}
};
orderconform.getorderconformpage=async(req,res)=>{
    req.session.checkout=false;
    res.render('userViews/orderconform')
}
orderconform.getorderdetailspage=async(req,res)=>{
   
    const user=req.session.userid;
    console.log(user);
    const data=await Userdb.findById(user)
    const userEmail=data.email;
    console.log(userEmail);
    console.log("debug");
    

  
   
   
    const latestOrder = await Orderdb.find({useremail:userEmail}).populate('products._id');
    console.log(latestOrder);
    if (!latestOrder) {
        console.log("No cart found for the user");
        return res.status(404).send("No cart found for the user");
    }
  


    const orders = await Orderdb.find({ useremail: userEmail });
    let totalQuantity = 0;
    orders.forEach(order => {
        let totalQuantityPerOrder = 0; // Initialize the total quantity for each order

        order.products.forEach(product => {
            totalQuantityPerOrder += product.quantity; // Add the quantity of each product to the total quantity
        });
      
        totalQuantity += totalQuantityPerOrder;
        console.log("Total Quantity for Order", order._id, ":", totalQuantityPerOrder);
    })

    res.render('userViews/orderdetails',{latestOrder,totalQuantity})
}




orderconform.getmoredetailspage = async (req, res) => {
    const orderId = req.query.id;
    const user = req.session.userid;

    try {
        const userData = await Userdb.findById(user);
        if (!userData) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }
        const userEmail = userData.email;

        const orders = await Orderdb.find({ useremail: userEmail }).populate('products._id');
        const order = orders.find(order => order._id.toString() === orderId.toString());

        if (!order) {
            console.log("Order not found");
            return res.status(404).send("Order not found");
        }

        const values = await Promise.all(order.products.map(async product1 => {
            const productId = product1.product;
            const productDetails = await Productdb.findById(productId);
            return {
                productName: productDetails.productName,
                image: productDetails.image,
                quantity: product1.quantity
            };
        }));

        const orderdetails = await Orderdb.findOne({ useremail: userEmail });
        console.log("Address from orderdb:", orderdetails.address);

        res.render('userViews/viewmore', { values, address: orderdetails.address });
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).send("Internal server error");
    }
}


       




orderconform.deleteorder = async (req, res) => {
    try {
        const orderId = req.body.order_id;
        const result = await Orderdb.deleteOne({ _id: orderId });
        if (result.deletedCount === 1) {
            // Order deleted successfully
            res.redirect('/getorder-conform');
            console.log("SuccessFully deleted"); // Redirect to a success page or route
        } else {
            // Order not found or not deleted
            console.log("Order not found or not deleted");
            // Handle the case where the order is not found or not deleted
           // Redirect to an error page
        }
    } catch (error) {
        // Handle errors
        console.log(error);
        // Redirect to an error page
    }
};

  




module.exports=orderconform;