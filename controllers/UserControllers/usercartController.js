const cartdb = require('../../models/UserModels/usercartSchema');
const productdb = require('../../models/AdminModels/ProductSchema')
const { ObjectId } = require('mongoose').Types;
const usercart = {};
const express = require('express');
const { checkLogin } = require('./userlogin');
const app = express();


// Function to handle adding a product to the user cart
usercart.postusercart = async (req, res) => {
    try {
        // Extract productId from request body and userId from session
        const productId = req.body.productId;
        const userId = req.session.userid;
       

        // Log the received IDs for debugging
        console.log("Product ID:", productId, "User ID:", userId);

        // Attempt to find the user's existing cart
        let userCart = await cartdb.findOne({ userid: userId });

        // If a cart exists for the user
        if (userCart) {
            // Find the index of the product in the cart, if it exists
            const existingProductIndex = userCart.products.findIndex(item => item.product && item.product.equals(productId));

            // If product is found in the cart, increase quantity
            if (existingProductIndex !== -1) {
                userCart.products[existingProductIndex].quantity += 1;
            } else {
                // If product is not found, add new product to the cart
                userCart.products.push({ product: productId, quantity: 1});
            }

            // Save the updated cart
            await userCart.save();

            // Send success response
            res.status(200).json({ success: true, message: 'Product added to cart successfully.' });
        } else {
            // If no cart exists for the user, create a new cart with the product
            const newCart = await cartdb.create({
                userid: userId,
                products: [{ product: productId, quantity: 1,total:0}]
            });

            // Send success response
            res.status(200).json({ success: true, message: 'Cart created and product added successfully.' });
        }
    } catch (error) {
        // Log and send error response if an exception occurs
        console.error('Error updating user cart:', error);
        res.status(500).json({ success: false, message: 'Failed to update cart.' });
    }
};





usercart.getusercart = async (req, res) => {
    try {
        const userId = req.session.userid;


        console.log(userId);
        const data = await cartdb.find({ userid: userId });
        const pid = req.session.productId;


        console.log('working');
        const cart = await cartdb.findOne({ userid: userId }).populate('products.product');
        console.log("cart data", cart)
        if (cart && cart.products) {
            const productOne = cart.products[0].product;
            console.log("Single product", productOne);



            const datas = cart.products.map(cartItem => {
                const product1 = cartItem.product;



                if (product1) {
                    const quantity = cartItem.quantity;
                    const total=cartItem.total;
                    console.log(quantity);
                    return {
                        _id: product1._id,
                        image: product1.image,
                        productName: product1.productName,
                        price: product1.price,
                        quantity: quantity

                    };
                }
            });

            console.log(datas);
            res.render('userViews/usercart', { datas });
        } else {
            console.log("No products found in cart.");
        }
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).send('Error fetching cart details');
    }
};
usercart.checkuserstock = async (req, res) => {

}
usercart.changequantity = async (req, res) => {
    console.log("blaaa");
    const userId = req.session.userid;
    const newQuantity = req.body.quantity;
    const total=req.body.total;
    console.log(total);

    const proId = req.body.proId; // Convert proId to a valid ObjectId

    console.log(newQuantity, proId, userId);
    const data = await cartdb.findOne({ userid: userId });
    console.log(data);

    try {
        const result = await cartdb.findOneAndUpdate(
            { "userid": userId, "products.product": proId }, // Query criteria
            { 
                $set: { 
                    "products.$.quantity": newQuantity,
                    "products.$.total": total 
                }
            }, // Update
            { new: true }
        );
    
        console.log("Updated cart with new quantity and total:", result);
    
    
        if (result) {
            console.log("Updated quantity:", result.quantity);
            res.json({ success: true, message: "Successfully updated quantity" });
        } else {
            console.log("No document found with that ID.");
            res.status(404).json({ success: false, message: "No document found with that ID" });
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({ success: false, message: "Failed to update quantity" });
    }

}
usercart.removecartitem = async (req, res) => {
    const id = req.params.id;
    const userid=req.session.userid;
    console.log(id);
    try {
        const removedItem = await cartdb.findOneAndUpdate(
            { userid: userid }, // Filter: Find the cart by its ID
            { $pull: { products: { product: id } } }, // Update: Pull/remove the product with the specified ID from the products array
            { new: true } // Options: Return the modified cart after the update
        );


        console.log(removedItem);
        if (!removedItem) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }
        return res.status(200).json({ success: true, message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
    }
}









module.exports = usercart;