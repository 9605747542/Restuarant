const paymentPending={};
const Productdb=require('../../models/AdminModels/ProductSchema');
const Orderdb=require('../../models/UserModels/userorderSchema');
const Cartdb=require('../../models/UserModels/usercartSchema');
const Walletdb=require('../../models/UserModels/walletSchema');
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: 'rzp_test_NS5BWa3t52AqKK',
    key_secret: 'GMSqnBq64TOW2XZzruB74jWa',
  });


paymentPending.getorderconform1=async(req,res)=>{
   
   
        try {
            const ID=req.body.ID;
            console.log("id in the BACKEND",ID);
            const  selectedOption = req.body.selectedOption;
            // let { coupon1, lastTotal } = req.body;
    
            // console.log("Coupon:", coupon1);
            // console.log("Details:", selectedOption, addressDetails, coupon1, lastTotal);
    
            // if (coupon1 === undefined || lastTotal === null) {
            //     coupon1 = 0;
            //     lastTotal = 0;
            // }
    
            // const user = await Userdb.findById(req.session.userid);
            // const userEmail = user.email;
    
            // const address = await Userdb.findOne({ 'address._id': addressDetails });
            // const addressObject = address ? address.address.find(a => a._id.toString() === addressDetails) : null;
    
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
                    return null;
                }
            }).filter(product => product !== null);
    
            let productNames = products.map(product => product.productName);
            req.session.productNames = productNames;
            console.log("Product Names:", req.session.productNames);
    
            const productDetails = await Productdb.find({ productName: { $in: productNames } });
    
            // Save products sequentially to avoid parallel save errors
            // for (let product of productDetails) {
            //     product.popularity = (product.popularity || 0) + 1;
            //     await product.save();
            // }
            const productSaves = productDetails.map(product => {
                product.popularity = (product.popularity || 0) + 1;
                return product.save();
            });
    
            const productsWithCategories = await Productdb.find({ productName: { $in: productNames } }).populate('category').exec();
            // const categorySaves = productsWithCategories.map(product => {
            //     if (product.category) {
            //         product.category.popularity = (product.category.popularity || 0) + 1;
            //         return product.category.save();
            //     } else {
            //         console.log("Category is null for a product:", product.productName);
            //         return Promise.resolve(); // Return a resolved promise if category is null
            //     }
            // });
            // await Promise.all([...productSaves,...categorySaves]);
    
            // Save categories sequentially to avoid parallel save errors
            for (let product of productsWithCategories) {
                if (product.category) {
                    let category = product.category;
                    category.popularity = (category.popularity || 0) + 1;
                    await category.save();
                } else {
                    console.log("Category is null for a product:", product.productName);
                }
            }
    
            // const totalPrice = cart.products.reduce((total, item) => total + item.total, 0);
            // let flatRate = totalPrice > 1000 ? 100 : 50;
    
            // let ActualAmount;
            // if (!coupon1) {
            //     coupon1 = req.session.couponcode;
            //     ActualAmount = calculateTotalAmount(totalPrice, flatRate);
            // } else {
            //     ActualAmount = lastTotal;
            // }
            
    
            // const couponCode = coupon1;
            // const coupon = await Coupondb.findOne({ couponName: couponCode });
    
            // await updateStock(cart.products);
    
            const order = await Orderdb.findById(ID);
            if (order) {
                order.OrderStatus = selectedOption === 'Razorpay' ? 'Payment Pending' : 'Order Placed';
                order.paymentMethod=selectedOption;
                await order.save();
            } else {
                console.error('Order not found');
            }
            req.session.orderId = ID;
            const Actual=order.ActualAmount;
            console.log("Actual Amount in the BACKEND",Actual);
            // req.session.actual = ActualAmount;
            // req.session.total = totalPrice;
    
          
    
            if (selectedOption === 'Cash on Delivery') {
                res.json({ success: true, message: "Order placed successfully" });
            } else if (selectedOption === 'Razorpay') {
                const orderData = await generateRazorpay(ID,Actual);
                // await Cartdb.findOneAndUpdate({ userid: req.session.userid }, { $set: { products: [] } });
                res.status(200).json({ message: "Razorpay working Successfully", orderData });
            } else if (selectedOption === 'Wallet') {
                let wallet = await Walletdb.findOne({ userId: req.session.userid });
                if (wallet) {
                    wallet.balance -= ActualAmount;
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
            res.status(500).json({ error: 'Failed to place order' });
        }
  
}

// Function to generate Razorpay order
async function generateRazorpay(orderId, amount) {
    const integerAmount=parseInt(amount);
    console.log("session actual amount",integerAmount);
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
module.exports=paymentPending;
