const Orderdb=require('../../models/UserModels/userorderSchema');
const Cartdb=require('../../models/UserModels/usercartSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema');
const Productdb=require('../../models/AdminModels/ProductSchema');
const Coupondb=require('../../models/AdminModels/couponSchema');
const Walletdb=require('../../models/UserModels/walletSchema');
const crypto = require('crypto');
const orderconform={};
const Razorpay=require('razorpay');
const { log } = require('console');

var instance = new Razorpay({
    key_id: 'rzp_test_NS5BWa3t52AqKK',
    key_secret: 'GMSqnBq64TOW2XZzruB74jWa',
  });
  orderconform.getorderconformpage = async (req, res) => {
    req.session.checkout = false;
    res.render('userViews/orderconform');
};

// orderconform.getorderconform = async (req, res) => {
//     try {
//         const { addressDetails, selectedOption } = req.body;

//         const user = await Userdb.findById(req.session.userid);
//         const userEmail = user.email;

//         const address = await Userdb.findOne({ 'address._id': addressDetails });
//         const addressObject = address ? address.address.find(a => a._id.toString() === addressDetails) : null;

//         const cart = await Cartdb.findOne({ userid: req.session.userid }).populate('products.product');
//         const products = cart.products.map(item => ({
//             product: item.product._id,
//             quantity: item.quantity,
//             productName: item.product.productName,
//             image: item.product.image,
//             price: item.product.price,
//             category: item.product.category
//         }));
        
//         const totalPrice = cart.products.reduce((total, item) => total + item.total, 0);

//         const couponCode = req.session.couponcode;
//         const coupon = await Coupondb.findOne({ couponName: couponCode });

//         const flatRate = 50;
//         if(!coupon.discount){
//             const ActualAmount = calculateTotalAmount(totalPrice, flatRate);
       
//         }else{
//             const ActualAmount = calculateActualAmount(totalPrice, flatRate, coupon.discount);
//         }
//         const order = new Orderdb({
//             customer: cart._id,
//             address: addressObject,
//             products,
//             totalAmount: totalPrice,
//             shipping: flatRate,
//             ActualAmount,
//             OrderStatus: 'Order Placed',
//             paymentMethod: selectedOption,
//             orderDate: new Date(),
//             orderId: generateOrderId(),
//             useremail: userEmail,
//             username: user.name,
//             coupon: coupon ? coupon.couponName : null
//         });

//         // Save order and update stock
//         await Promise.all([
//             order.save(),
//             updateStock(cart.products)
//         ]);

//         if (selectedOption === 'Cash on Delivery') {
//             res.json({ success: true, message: "Order placed successfully" });
//         } else {
//             const orderData = await generateRazorpay(order._id, ActualAmount);
//             res.status(200).json({ success: true, message: "Razorpay working successfully", orderData });
//         }
//     } catch (error) {
//         console.error('Error placing order:', error);
//         res.status(500).json({ error: 'Failed to place order' });
//     }
// };


orderconform.getorderconform = async (req, res) => {
    try {
        const { addressDetails, selectedOption } = req.body;

        // Fetch user details
        const user = await Userdb.findById(req.session.userid);
        const userEmail = user.email;

        // Fetch address details
        const address = await Userdb.findOne({ 'address._id': addressDetails });
        const addressObject = address ? address.address.find(a => a._id.toString() === addressDetails) : null;

        // Fetch cart details
        const cart = await Cartdb.findOne({ userid: req.session.userid }).populate('products.product');
        const products = cart.products.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            productName: item.product.productName,
            image: item.product.image,
            price: item.product.price,
            category: item.product.category
        }));
        
        // Calculate total price of products in cart
        const totalPrice = cart.products.reduce((total, item) => total + item.total, 0);

        // Fetch coupon details
        const couponCode = req.session.couponcode;
        const coupon = await Coupondb.findOne({ couponName: couponCode });

        // Define flat rate
        const flatRate = 50;

        // Calculate actual amount based on coupon discount
        let ActualAmount;
        if (!coupon || !coupon.discount) {
            ActualAmount = calculateTotalAmount(totalPrice, flatRate);
        } else {
            ActualAmount = calculateActualAmount(totalPrice, flatRate, coupon.discount);
        }

        // Create order object
        const order = new Orderdb({
            customer: cart._id,
            address: addressObject,
            products,
            totalAmount: totalPrice,
            shipping: flatRate,
            ActualAmount,
            OrderStatus: 'Order Placed',
            paymentMethod: selectedOption,
            orderDate: new Date(),
            orderId: generateOrderId(),
            useremail: userEmail,
            username: user.name,
            coupon: coupon ? coupon.couponName : null
        });

        // Save order and update stock
        await Promise.all([
            order.save(),
            updateStock(cart.products)
        ]);

        // Handle response based on payment method
        if (selectedOption === 'Cash on Delivery') {
            res.json({ success: true, message: "Order placed successfully" });
        } else {
            const orderData = await generateRazorpay(order._id, ActualAmount);
            res.status(200).json({ success: true, message: "Razorpay working successfully", orderData });
        }
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
};


// Function to update stock for products in the cart
async function updateStock(products) {
    const promises = products.map(async item => {
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

    return Promise.all(promises);
}

// Function to generate actual amount considering discount and flat rate
function calculateActualAmount(totalPrice, flatRate, discountValue) {
    const discountPercentage = discountValue / 100;
    const discountedPrice = totalPrice * (1 - discountPercentage);
    return discountedPrice + flatRate;
}
function calculateTotalAmount(totalPrice, flatRate) {
    return totalPrice + flatRate;
}


// Function to generate a random order ID
function generateOrderId() {
    const timestamp = Date.now().toString();
    const randomString = generateRandomString(5);
    return `${timestamp}-${randomString}`;
}

// Function to generate a random string
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Function to generate Razorpay order
async function generateRazorpay(orderId, amount) {
    const options = {
        amount,
        currency: "INR",
        receipt: orderId
    };

    try {
        const order = await instance.orders.create(options);
        console.log("Razorpay order created:", order);
        return order;
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw error;
    }
}
orderconform.checkrazorpay=async(req,res)=>{
    
    console.log("checking",req.body.payment);
    const secret = 'GMSqnBq64TOW2XZzruB74jWa';
    try {
        const user=await Userdb.findById(req.session.userid);
       const order=await Orderdb.findOne({useremail:user.email})
       const orderId=order._id;
      

        // Concatenate data in a specific order
        const concatenatedData = `${orderId}|${paymentId}`;

        // Generate expected signature
        const generatedSignature = hmac_sha256(concatenatedData, secret);

        // Compare signatures
        const isSignatureValid = razorpaySignature === generatedSignature;

        if (isSignatureValid) {
            console.log('Payment transaction is valid.');
            // Proceed with further actions if the payment is valid
            res.status(200).send('Payment transaction is valid.');
        } else {
            console.log('Payment transaction is invalid.');
            res.status(400).send('Payment transaction is invalid.');
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).send('Error verifying payment.');
    }
}
    


function hmac_sha256(data, key) {
    return crypto.createHmac('sha256', key)
        .update(data)
        .digest('hex');
}
orderconform.getorderdetailspage=async(req,res)=>{
   
    const user=req.session.userid;
    console.log(user);
    const data=await Userdb.findById(user)
    const userEmail=data.email;
    console.log(userEmail);
    console.log("debug");
    

  
   
   
    const latestOrder = await Orderdb.find({useremail:userEmail}).populate('products._id');
    
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
        
    })
  
   
    res.render('userViews/orderdetails',{latestOrder,totalQuantity})
}





orderconform.getmoredetailspage = async (req, res) => {
    const orderId = req.params.id;
    console.log("mmmmmmm", orderId);
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
        console.log("order",order);

        const values = await Promise.all(order.products.map(async product1 => {
            const productId = product1.product;
            console.log("product_id",productId);

            const productDetails = await Productdb.findById(productId);
            console.log("doo",productDetails);
            if (!productDetails) {
                console.log(`Product with ID ${productId} not found`);
                return null; // or handle the missing product in a different way
            }
            return {
                productName: productDetails.productName,
                image: productDetails.image,
                quantity: product1.quantity
            };
        }));

        console.log("Allah",values);

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
        console.log("hello");
        const orderId = req.body.id;
        console.log(orderId);
        const order = await Orderdb.findById(orderId);

        if (!order) {
            console.log("Order not found");
            return res.json({ success: false, message: "Order not found" });
        }

        // Update the stock for each product in the order
        for (const item of order.products) {
            const productDetails = await Productdb.findById(item.product);
            if (productDetails) {
                productDetails.stock += item.quantity; // Correctly increment stock based on item quantity
                await productDetails.save();
                console.log("Product found and stock updated:", productDetails);
            } else {
                console.log("Product not found");
            }
        }

        // Mark the order as cancelled
        const result = await Orderdb.findByIdAndUpdate(orderId, { OrderStatus: 'Cancelled' }, { new: true });
        console.log("Order status updated to cancelled:", result);

        if (result) {
            // Update user's wallet if the order is successfully cancelled
            let wallet = await Walletdb.findOne({ userId: req.session.userid });
            if (!wallet) {
                wallet = new Walletdb({
                    userId: req.session.userid,
                    balance: result.totalAmount, // Assuming totalAmount is defined in your Order schema
                    transactionHistory: [{
                        transaction: 'Money Added',
                        amount: result.totalAmount
                    }],
                });
            } else {
                wallet.balance += result.totalAmount;
                wallet.transactionHistory.push({
                    transaction: 'Money Added',
                    amount: result.totalAmount
                });
            }
            await wallet.save();
            console.log("Successfully cancelled order and updated wallet");
            res.json({ success: true, message: "Successfully cancelled order" });
        } else {
            console.log("Failed to update order status");
            res.json({ success: false, message: "Failed to cancel order" });
        }
    } catch (error) {
        console.log("Error processing request:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


  




module.exports=orderconform;