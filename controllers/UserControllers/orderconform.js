const Orderdb=require('../../models/UserModels/userorderSchema');
const Cartdb=require('../../models/UserModels/usercartSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema');
const Productdb=require('../../models/AdminModels/ProductSchema');
const Coupondb=require('../../models/AdminModels/couponSchema');
const Walletdb=require('../../models/UserModels/walletSchema');
const Categorydb=require('../../models/AdminModels/categorySchema');
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
//     let { coupon1 ,lastTotal} = req.body;
//     console.log("nourii",coupon1);
//         console.log("fffffff",selectedOption,addressDetails,coupon1,lastTotal);
       
//         if(coupon1 ||lastTotal===null ){
//             coupon1=0;
//             lastTotal=0;
//         }

//         // Fetch user details
//         const user = await Userdb.findById(req.session.userid);
//         const userEmail = user.email;

//         // Fetch address details
//         const address = await Userdb.findOne({ 'address._id': addressDetails });
//         const addressObject = address ? address.address.find(a => a._id.toString() === addressDetails) : null;

//         const cart = await Cartdb.findOne({ userid: req.session.userid }).populate('products.product');
//         const products = cart.products.map(item => {
//             if (item.product) {
//                 return {
//                     product: item.product,
//                     quantity: item.quantity,
//                     productName: item.product.productName,
//                     image: item.product.image,
//                     price: item.product.price,
//                     category: item.product.category
//                 };
//             } else {
//                 console.log("Product is null for an item in the cart");
//                 return null; // or handle this case accordingly
//             }
//         }).filter(product => product !== null);
        
//         let productNames = products.map(product => product.productName);
//         req.session.productNames = productNames;
        
//         console.log("9090", req.session.productNames);
  
        
//         const productDetails = await Productdb.find({ productName: { $in: productNames } });
        
//         for (let product of productDetails) {
//             product.popularity = (product.popularity || 0) + 1;
//         }
        
//         await Promise.all(productDetails.map(product => product.save()));
//         const productsWithCategories = await Productdb.find({ productName: { $in: productNames } }).populate('category').exec();

//         // Ensure categories are updated
//         const categoryUpdates = [];
        
//         for (let product of productsWithCategories) {
//             if (product.category) {
//                 let category = product.category;
//                 category.popularity = (category.popularity || 0) + 1;
//                 categoryUpdates.push(category.save());
//             } else {
//                 console.log("Category is null for a product:", product.name);
//             }
//         }
        
//         await Promise.all(categoryUpdates);
        
        
//         // Calculate total price of products in cart
//         const totalPrice = cart.products.reduce((total, item) => total + item.total, 0);

//         // Fetch coupon details
//         console.log("main  price",totalPrice);
//          // Define flat rate
//          let flatRate;
//          if(totalPrice>1000){
//              flatRate=100;
//          }else{
//              flatRate = 50;
//          }

//         let ActualAmount;
//         console.log("safar",lastTotal);
//         if(!coupon1){
//             console.log("war");
//             coupon1=req.session.couponcode;
//             ActualAmount = calculateTotalAmount(totalPrice, flatRate);
//             console.log("calculate",ActualAmount);

//         }else{
//             ActualAmount = lastTotal;
//         }
//         console.log("nothing",ActualAmount);
//         const couponCode = coupon1;
//         console.log("mind",couponCode);
//         const coupon = await Coupondb.findOne({ couponName: couponCode });

       
        
       

        
   
        
//         await Promise.all([
//         updateStock(cart.products)
//     ]);

//         // Create order object
//         const order = new Orderdb({
//             customer: cart._id,
//             address: addressObject,
//             products,
//             totalAmount: totalPrice,
//             shipping: flatRate,
//              ActualAmount,
//             OrderStatus: 'Order Placed',
//             paymentMethod: selectedOption,
//             orderDate: new Date(),
//             orderId: generateOrderId(),
//             useremail: userEmail,
//             username: user.name,
//             coupon: coupon ? coupon.couponName : null,
           
//         });

   
//             await order.save();
//             req.session.orderId=order._id;
//             req.session.actual=ActualAmount;
//             req.session.total=totalPrice;

           
    

//         await Cartdb.findOneAndUpdate({ userid: req.session.userid }, { $set: { products: [] } });

//         // Handle response based on payment method
//         if (selectedOption === 'Cash on Delivery') {
//             res.json({ success: true, message: "Order placed successfully" });
//         } else if(selectedOption==='Razorpay') {
//             console.log("check",order.OrderStatus);
//             order.OrderStatus='Payment Pending';
//             await order.save();
//             const orderData = await generateRazorpay(order._id, ActualAmount);
         
//             res.status(200).json({  message: "Razorpay working Successfully", orderData });
//         }else if (selectedOption === 'Wallet') {
//             console.log("Vazha");
//             let wallet = await Walletdb.findOne({ userId: req.session.userid });
//             if (wallet) {
//                 console.log("ssssssss",wallet.balance);
//                wallet.balance= wallet.balance - ActualAmount;
//                wallet.transactionHistory.push({
//                 transaction: 'Money Deducted',
//                 amount: ActualAmount
//               }),
//                 await wallet.save();
//             }
//             res.json({ success: true, message: "Order placed throught Wallet successfully" });
//         }
        
//     } catch (error) {
//         console.error('Error placing order:', error);
//         res.status(500).json({ error: 'Failed to place order' });
//     }
// };

orderconform.getorderconform = async (req, res) => {
    try {
        const { addressDetails, selectedOption } = req.body;
        let { coupon1, lastTotal } = req.body;
        console.log("nourii", coupon1);
        console.log("fffffff", selectedOption, addressDetails, coupon1, lastTotal);

        if (coupon1 === undefined || lastTotal === null) {
            coupon1 = 0;
            lastTotal = 0;
        }

        // Fetch user details
        const user = await Userdb.findById(req.session.userid);
        const userEmail = user.email;

        // Fetch address details
        const address = await Userdb.findOne({ 'address._id': addressDetails });
        const addressObject = address ? address.address.find(a => a._id.toString() === addressDetails) : null;

        const cart = await Cartdb.findOne({ userid: req.session.userid }).populate('products.product');
        const products = cart.products.map(item => {
            if (item.product) {
                return {
                    product: item.product,
                    quantity: item.quantity,
                    productName: item.product.productName,
                    image: item.product.image,
                    price: item.product.price,
                    category: item.product.category
                };
            } else {
                console.log("Product is null for an item in the cart");
                return null; // or handle this case accordingly
            }
        }).filter(product => product !== null);

        let productNames = products.map(product => product.productName);
        req.session.productNames = productNames;

        console.log("9090", req.session.productNames);

        const productDetails = await Productdb.find({ productName: { $in: productNames } });

        for (let product of productDetails) {
            product.popularity = (product.popularity || 0) + 1;
        }

        await Promise.all(productDetails.map(product => product.save()));
        const productsWithCategories = await Productdb.find({ productName: { $in: productNames } }).populate('category').exec();

        // Ensure categories are updated
        const categoryUpdates = [];

        for (let product of productsWithCategories) {
            if (product.category) {
                let category = product.category;
                category.popularity = (category.popularity || 0) + 1;
                categoryUpdates.push(category.save());
            } else {
                console.log("Category is null for a product:", product.name);
            }
        }

        await Promise.all(categoryUpdates);

        // Calculate total price of products in cart
        const totalPrice = cart.products.reduce((total, item) => total + item.total, 0);

        // Fetch coupon details
        console.log("main price", totalPrice);
        // Define flat rate
        let flatRate;
        if (totalPrice > 1000) {
            flatRate = 100;
        } else {
            flatRate = 50;
        }

        let ActualAmount;
        console.log("safar", lastTotal);
        if (!coupon1) {
            console.log("war");
            coupon1 = req.session.couponcode;
            ActualAmount = calculateTotalAmount(totalPrice, flatRate);
            console.log("calculate", ActualAmount);

        } else {
            ActualAmount = lastTotal;
        }
        console.log("nothing", ActualAmount);
        const couponCode = coupon1;
        console.log("mind", couponCode);
        const coupon = await Coupondb.findOne({ couponName: couponCode });

        await updateStock(cart.products);

        // Create order object
        const order = new Orderdb({
            customer: cart._id,
            address: addressObject,
            products,
            totalAmount: totalPrice,
            shipping: flatRate,
            ActualAmount,
            OrderStatus: selectedOption === 'Razorpay' ? 'Payment Pending' : 'Order Placed',
            paymentMethod: selectedOption,
            orderDate: new Date(),
            orderId: generateOrderId(),
            useremail: userEmail,
            username: user.name,
            coupon: coupon ? coupon.couponName : null,
        });

        await order.save();
        req.session.orderId = order._id;
        req.session.actual = ActualAmount;
        req.session.total = totalPrice;

        await Cartdb.findOneAndUpdate({ userid: req.session.userid }, { $set: { products: [] } });

        // Handle response based on payment method
        if (selectedOption === 'Cash on Delivery') {
            res.json({ success: true, message: "Order placed successfully" });
        } else if (selectedOption === 'Razorpay') {
            console.log("check", order.OrderStatus);
            const orderData = await generateRazorpay(order._id, ActualAmount);
            res.status(200).json({ message: "Razorpay working Successfully", orderData });
        } else if (selectedOption === 'Wallet') {
            console.log("Vazha");
            let wallet = await Walletdb.findOne({ userId: req.session.userid });
            if (wallet) {
                console.log("ssssssss", wallet.balance);
                wallet.balance = wallet.balance - ActualAmount;
                wallet.transactionHistory.push({
                    transaction: 'Money Deducted',
                    amount: ActualAmount
                });
                await wallet.save();
            }
            res.json({ success: true, message: "Order placed through Wallet successfully" });
        }

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
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


function calculateTotalAmount(totalPrice, flatRate) {
    console.log("here",flatRate);
    return totalPrice + flatRate;
}


// Function to generate a random order ID
function generateOrderId() {
    const timestamp = Date.now().toString().slice(-5);
    const randomString = generateRandomString(2); 
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
    const integerAmount=parseInt(amount);
    console.log("ggg",typeof(integerAmount));
    console.log(integerAmount);
    const options = {
        amount:integerAmount*100,
        currency: "INR",
        receipt: orderId
    };
    console.log("optionss",options)
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
    const paymentDetails=req.body.payment;
    console.log("id of payment",paymentDetails.razorpay_payment_id);
    const paymentId=paymentDetails.razorpay_payment_id;
    const razorpaySignature=paymentDetails.razorpay_signature;
    const secret = 'GMSqnBq64TOW2XZzruB74jWa';
    try {

        
        const user=await Userdb.findById(req.session.userid);
       const order=await paymentDetails.razorpay_order_id;
       const orderId = order // Convert order ID to string for concatenation
      
      

        // Concatenate data in a specific order
        const concatenatedData = `${orderId}|${paymentId}`;
        console.log("Concatenated data:", concatenatedData);

        // Generate expected signature
        const generatedSignature = hmac_sha256(concatenatedData, secret);
        console.log("data checking",generatedSignature);

        // Compare signatures
        const isSignatureValid = razorpaySignature === generatedSignature;
        console.log("Is signature valid?", isSignatureValid);

       
        //for checkout page
        req.session.checkout=false;
        if (isSignatureValid) {
            console.log("hhhh");
            let userOrder=await Orderdb.findById(req.session.orderId);
            console.log("damn",userOrder);
            userOrder.OrderStatus='Order Placed';
            await userOrder.save();
            console.log('Payment transaction is valid.');

            res.status(200).send('Payment transaction is valid.');
            
        } else {
            console.log('Payment transaction is invalid.');
           
           
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
    
orderconform.getorderdetailspage = async (req, res) => {
    try {
        const user = req.session.userid;
        const data = await Userdb.findById(user);
        const userEmail = data.email;
        
        const page = parseInt(req.query.page) || 1;
        const perPage = 10; // Display 10 products per page
        const skip = (page - 1) * perPage;
        
        const totalOrders = await Orderdb.countDocuments({ useremail: userEmail });
        const totalPages = Math.ceil(totalOrders / perPage);
        
        const latestOrder = await Orderdb.find({ useremail: userEmail })
            .sort({ orderDate: -1 })
            .limit(perPage)
            .skip(skip)
            .populate('products.product');
          
        if (!latestOrder || latestOrder.length === 0) {
            let message = "No Orders found for the User";
            return res.render('userViews/orderdetails', { latestOrder: [], totalQuantity: 0, totalPages, currentPage: page, perPage, message });
        }

        let totalQuantity = 0;
        latestOrder.forEach(order => {
            order.products.filter(product => product !== null).forEach(product => {
                if (product && typeof product === 'object' && 'quantity' in product) {
                    totalQuantity += product.quantity;
                }
            });
        });

        res.render('userViews/orderdetails', { latestOrder, totalQuantity, totalPages, currentPage: page, perPage, message: "" });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send("Internal Server Error");
    }
};








orderconform.getmoredetailspage = async (req, res) => {
    const orderId = req.query.id;
    const pid = req.query.pid;
    req.session.pid=pid;
    console.log("Product ID:", pid);
    console.log("Order ID:", orderId);
    const userId = req.session.userid;

    try {
        const user = await Userdb.findById(userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }

        const order = await Orderdb.findOne({_id: orderId }).populate('products');
        if (!order) {
            console.log("Order not found");
            return res.status(404).send("Order not found");
        }
        console.log("Order Details:", order);

        const filteredProducts = order.products.filter(product1 => product1._id.toString() === pid);
        console.log("Filtered Products:", filteredProducts);
        
        if (filteredProducts.length > 0) {
            const productDetails = await Productdb.findById(filteredProducts[0].product);
            console.log("Product Details:", productDetails);

            if (!productDetails) {
                console.log(`Product with ID ${filteredProducts[0].product} not found`);
                return res.status(404).send(`Product with ID ${filteredProducts[0].product} not found`);
            }
            const orderDetails=await Orderdb.findOne({_id:orderId});

            res.render('userViews/viewmore', { productDetails, address: order.address ,orderDetails});
        } else {
            console.log("No matching product found.");
            return res.status(404).send("No matching product found.");
        }
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
                    balance: result.ActualAmount,
                    transactionHistory: [{
                        transaction: 'Money Added',
                        amount: result.ActualAmount
                    }],
                });
            } else {
                wallet.balance += result.ActualAmount;
                wallet.transactionHistory.push({
                    transaction: 'Money Added',
                    amount: result.ActualAmount
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


orderconform.continuePaymentFailed=async(req,res)=>{
    console.log("loves");
    const id=req.params.id;
    console.log("blaa",id);
    const order = await Orderdb.findOne({_id: id}).populate('products');
    console.log("Order Details:", order);
    const pid=req.session.pid;
    const userId=req.session.userid;
        const filteredProducts = order.products.filter(product1 => product1._id.toString() === pid);
const usercart=await Cartdb.findOne({userid:userId});
console.log("filtered",filteredProducts);
const productId=filteredProducts[0].product;
console.log("id of product",productId);
const productData=await Productdb.findById(productId);
console.log("val:",productData);
console.log("price:",productData.price);
if(usercart){
    const existingProductIndex = usercart.products.findIndex(item => item.product && item.product.equals(productId));
    if (existingProductIndex !== -1) {
        usercart.products[existingProductIndex].quantity += 1;
        usercart.products[existingProductIndex].total += productData.price;

    } else {
 
        usercart.products.push({ product: productId, quantity: 1,total:productData.price});
    }

    await usercart.save();
    
}

 else {
   
    const newCart = await Cartdb.create({
        userid: userId,
        products: [{ product: productId, quantity: 1,total:productData.price}]
    });
    
}
req.session.checkout=true;
  res.redirect('/getcheckout1');

}

orderconform.getpaymentpending=async(req,res)=>{
    try {
        const userid = req.session.userid;
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

        let products; 

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
        
        
        // Render checkout page with user address and cart products
        if (products && products.length !== 0) {
            res.render('userViews/checkout1', { data, products });
        } else {
            res.redirect('/usercart');
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
}




module.exports=orderconform;