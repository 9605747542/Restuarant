const userwishlist={};
const Productdb=require('../../models/AdminModels/ProductSchema');
const Wishlistdb=require('../../models/UserModels/userwishlistSchema');



userwishlist.getuserwishlist = async (req, res) => {
    try {
        const data = await Wishlistdb.find();
        console.log("again", data);
        
        if (data && data.length > 0) {
            res.render('userViews/wishlist', { data, message: null });
        } else {
            const message = "No Products in the Wishlist";
            res.render('userViews/wishlist', { data: [], message });
        }
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).send("Internal Server Error");
    }
};






userwishlist.postuserwishlist=async (req,res)=>{
const productId=req.body.productId;
console.log("productid from bakend ",productId);
const productDetails=await Productdb.findById(productId).populate('category')
console.log(productDetails);
console.log("Category of productDetails:",productDetails.category.categoryName);
console.log("Category of productDetails:",productDetails.image);
try {
    const data=new Wishlistdb({
       productname:productDetails.productName,
       price:productDetails.price,
       image:productDetails.image,
       description:productDetails.description,
       productCategory:productDetails.category.categoryName

    })
    await data.save();
    console.log("SuccessFully created");
} catch (error) {
    console.log(error);
    console.log("Internal Server Error");
}


}

userwishlist.removewishlist=async(req,res)=>{
    try {
        const pid = req.params.id;
        console.log("Deleting item with ID:", pid);
        
        // Find the document by ID and remove it
        const removedItem = await Wishlistdb.findByIdAndDelete(pid);

        if (removedItem) {
            console.log("Item successfully removed:", removedItem);
          res.redirect('/getwishlist')
        } else {
            console.log("Item not found.");
          
        }
    } catch (error) {
        console.error("Error removing item from wishlist:", error);
        res.status(500).send("Internal Server Error.");
    }
}
module.exports=userwishlist;