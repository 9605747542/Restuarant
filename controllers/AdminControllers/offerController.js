const ProductDB=require('../../models/AdminModels/ProductSchema');
const CategoryDB=require('../../models/AdminModels/categorySchema')
const OfferDB=require('../../models/AdminModels/offerSchema')
const useroffer={};
useroffer.getofferdetails=async(req,res)=>{
    const data=await OfferDB.find();
    res.render('Adminviews/offerdetails',{data})
}
useroffer.getaddoffer=async(req,res)=>{
    const data=await ProductDB.find();
    const value=await CategoryDB.find();
    const output=data.map(out=>out.productName);
const result=value.map(val=>val.categoryName);
console.log("Result",result);
console.log("products",output);

    res.render('Adminviews/addoffer',{result,output});
}
useroffer.postaddoffers = async (req, res) => {
    console.log("checking");
    const offerName = req.body.offerName;
    const offertype1 = req.body.offertype1;
    const offertype2 = req.body.offertype2;
    const discount = req.body.discount;
    console.log("discount",discount);
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    try {
        let data;
        if (offertype1 === 'product') {
            console.log("single data",offertype2);
            
            const products = await ProductDB.findOne({productName:offertype2});

            console.log(products);
               
                    products.orginalPrice = products.price;
                    console.log(products.orginalPrice);
                    products.discount = discount; 
                    console.log(products.discount);
                    const discountPercentage = discount / 100;
                    const discountedPrice = products.orginalPrice * (1 - discountPercentage);
                    products.price =Math.ceil(discountedPrice); 
                    products.offertype=offertype1
                    await products.save();
                   
                
                
            
            data = await OfferDB.create({
                offerName: offerName,
                discount_on: offertype1,
                discount_value: discount,
                startDate: startDate,
                endDate: endDate,
                item_description: offertype2
            });
          
         
        }else if(offertype1==='category'){

            const category = await CategoryDB.findOne({ categoryName: offertype2 });
                
            const products = await ProductDB.findOne({category:category._id});

            console.log(products);
               
                    products.orginalPrice = products.price;
                    console.log(products.orginalPrice);
                    products.discount = discount; 
                    console.log(products.discount);
                    const discountPercentage = discount / 100;
                    const discountedPrice = products.orginalPrice * (1 - discountPercentage);
                    products.price = Math.ceil(discountedPrice); 
                    products.offertype=offertype1
                    await products.save();



            data = await OfferDB.create({
                offerName: offerName,
                discount_on: offertype1,
                discount_value: discount,
                startDate: startDate,
                endDate: endDate,
                item_description: offertype2
            });
        }

        if (data) {
            console.log("hai");
            res.json({ success: true, message: "Successfully saved new offer" });
        } else {
            res.json({ success: false, message: "Error occurred while saving the offer" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports=useroffer;