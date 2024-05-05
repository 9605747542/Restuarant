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
        const productId = req.body.productId;
        const userId = req.session.userid;
       

       
        console.log("Product ID:", productId, "User ID:", userId);

     
        let userCart = await cartdb.findOne({ userid: userId });
        const productData=await productdb.findById(productId);
     
        if (userCart) {
          
            const existingProductIndex = userCart.products.findIndex(item => item.product && item.product.equals(productId));
           
            
       
    

           
            if (existingProductIndex !== -1) {
                userCart.products[existingProductIndex].quantity += 1;
                userCart.products[existingProductIndex].total += productData.price;

            } else {
         
                userCart.products.push({ product: productId, quantity: 1,total:productData.price});
            }

            await userCart.save();

          console.log("heaven");
          
           return res.json({ success: true, message: 'Product added to cart successfully.' });
        } else {
           
            const newCart = await cartdb.create({
                userid: userId,
                products: [{ product: productId, quantity: 1,total:productData.price}]
            });
            return res.json({success: true, message: 'Cart created and product added successfully.' });
        }
    } catch (error) {
       
        console.error('Error updating user cart:', error);
        res.status(500).json({ success: false, message: 'Failed to update cart.' });
    }
};





usercart.getusercart = async (req, res) => {
    try {
        const userId = req.session.userid;
        console.log('User ID:', userId);
        const cart = await cartdb.findOne({ userid: userId }).populate('products.product');

        if (cart && cart.products.length) {
            const datas = cart.products.map(cartItem => {
                if (cartItem.product) {
                    return {
                        _id: cartItem.product._id,
                        image: cartItem.product.image,
                        productName: cartItem.product.productName,
                        price: cartItem.product.price,
                        quantity: cartItem.quantity,
                        total: cartItem.quantity * cartItem.product.price
                    };
                }
            }).filter(item => item !== undefined);

            console.log("Cart Items:", datas);
            res.render('userViews/usercart', { datas: datas, message: '' }); // Pass an empty message
        } else {
            console.log('No products found in cart.');
            res.render('userViews/usercart', { datas: [], message: 'No products found in cart.' });
        }
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).send('Error fetching cart details');
    }
};


usercart.changequantity = async (req, res) => {
    console.log("blaaa");
    const userId = req.session.userid;
    const newQuantity = req.body.quantity;
  
    

    const proId = req.body.productId; // Convert proId to a valid ObjectId

    console.log(newQuantity, proId, userId);
    const data = await cartdb.findOne({ userid: userId });
    console.log(data);

    try {
        if (newQuantity < 1) {
            console.log("New quantity must be at least 1.");
            return res.status(400).json({ success: false, message: "New quantity must be at least 1" });
        }
        const result = await cartdb.findOneAndUpdate(
            { "userid": userId, "products.product": proId }, // Query criteria
            { 
                $set: { 
                    "products.$.quantity": newQuantity,
                    // "products.$.total": total 
                }
            }, // Update
            { new: true }
        );
    
        console.log("Updated cart with new quantity and total:", result);
    
    
        if (result) {
            console.log("Updated quantity:");
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

usercart.changesubtotal=async(req,res)=>{
    const userId = req.session.userid;
    const subtotal = req.body.subtotal;
    const proId = req.body.proId;
    console.log(subtotal,proId, userId);

    const data = await cartdb.findOne({ userid: userId });
    console.log(data);

    try {
        const result = await cartdb.findOneAndUpdate(
            { "userid": userId, "products.product": proId }, // Query criteria
            { 
                $set: { 
                    "products.$.total":subtotal,
                    // "products.$.total": total 
                }
            }, // Update
            { new: true }
        );
    
        if (result) {
            const updatedProduct = result.products.find(p => p.product.toString() === proId.toString());
            if (updatedProduct) {
                console.log("Updated total:", updatedProduct.total);
            } else {
                console.log("Product not found in the updated document.");
            }
        }
        
    
    
        if (result) {
            console.log("Updated total:", result.products.total);
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
    const data=await cartdb.findOne({"products.product":id});
    console.log(data);
    console.log("Finding total",data.total);

    try {
        const removedItem = await cartdb.findOneAndUpdate(
            { userid: userid }, // Filter: Find the cart by its ID
            { $pull: { products: { product: id },total:data.total } },

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