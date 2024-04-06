const Orderdb=require('../../models/UserModels/userorderSchema');
const Cartdb=require('../../models/UserModels/usercartSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema')
const orderconform={};
orderconform.getorderconform=async (req,res)=>{
    console.log("haii");
    const userid=req.session.userid;
    const cartdata=await Cartdb.findOne({userid:userid}).populate('products.product');
    console.log(cartdata.products);
    const total=cartdata.products[0].total;

   // Check the value of cartdata.products
   const products = cartdata.products.map(cartItem => {
    return {
        quantity: cartItem.quantity,
        productName: cartItem.product.productName,
        image: cartItem.product.image,
        price: cartItem.product.price,
        category: cartItem.product.category,
    };
}); // Check the value of productNames
   
console.log("total",total * products.quantity);
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
    console.log("hello",req.session.customer);
    


 
    
        try {
            const data = new Orderdb({
                customer: cartdata._id,
               
                products: products,
                totalAmount: total ,
                OrderStatus: 'Order Placed',
                paymentMethod: 'Cash on Delivery',
                orderDate: new Date(), // Current date and time
                orderId: generateOrderId(), // Generate unique order ID
            });
        
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
    res.render('userViews/orderconform')
}
orderconform.getorderdetailspage=async(req,res)=>{
   
    
    const customerid=req.session.customer;
    console.log(customerid);
  
    const latestOrder = await Orderdb.findOne({customer:customerid}).populate('products._id');
    console.log(latestOrder);
    if (!latestOrder) {
        console.log("No cart found for the user");
        return res.status(404).send("No cart found for the user");
    }

    console.log("Cart products:", latestOrder.products);

    // Extract product information from cart
    const products = latestOrder.products.map(cartItem => {
        return {
            quantity: cartItem.quantity,
         
            


        };
    });
    console.log(latestOrder.totalAmount);

    

    res.render('userViews/orderdetails',{products,latestOrder})
}

 // Assuming you have a model named Order

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