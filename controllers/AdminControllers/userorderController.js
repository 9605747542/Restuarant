const userorder={};
const Orderdb=require('../../models/UserModels/userorderSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema');
userorder.getuserorderpage=async(req,res)=>{
  
   


   
    const data = await Orderdb.find();
    console.log(data);

    const orders = data.map(cartItem => {
        const order = {
            orderId: cartItem.orderId,
            customer: cartItem.customer,
            orderDate: cartItem.orderDate,
            OrderStatus: cartItem.OrderStatus,
            paymentMethod: cartItem.paymentMethod,
            ActualAmount: cartItem.ActualAmount,
            username: cartItem.username,
            orderAddress: []
        };

        // Extract address details one by one
        cartItem.address.forEach(address => {
            const formattedAddress = {
                phone: address.phone,
                streetaddress: address.streetaddress,
                city: address.city,
                House_name: address.House_name
            };
            order.orderAddress.push(formattedAddress);
        });

        return order;
    });

    console.log("checking", orders);

   
    res.render('Adminviews/userorders',{orders})
}

userorder.geteditorder=async(req,res)=>{
    console.log("maaaaaaa");
    const orderId=req.query.id;
    console.log("paste it",orderId);
    const data=await Orderdb.findOne({orderId:orderId});
    console.log("vbjbjbjvf",data);
    // const orders = data.map(cartItem => {
    //     return {
    //         orderId: cartItem.orderId,
    //         customer: cartItem.customer,
    //         orderDate: cartItem.orderDate,
    //         OrderStatus: cartItem.OrderStatus,
    //         paymentMethod: cartItem.paymentMethod,
    //     totalAmount: cartItem.totalAmount,
    //     username:cartItem.username,
    //     _id:cartItem._id


    //     };
    // });
    res.render('Adminviews/editorder',{data})
}

userorder.posteditorder = async (req, res) => {
    console.log("hello");
    const orderid=req.params.id;
    console.log(orderid);
    const { orderId, userName, orderDate, orderStatus, paymentMethod, totalAmount } = req.body;
    console.log("hello", paymentMethod);
    console.log(req.body);

    try {
        const existingOrder = await Orderdb.findOne({ _id: orderid }); // Use findOne here
        if (!existingOrder) {
            console.log("Order not found");
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        // Update the fields
        existingOrder.orderId = orderId;
        existingOrder.username = userName;
        existingOrder.orderDate = orderDate;
        existingOrder.OrderStatus = orderStatus;
        existingOrder.paymentMethod = paymentMethod;
        existingOrder.totalAmount =totalAmount;

        await existingOrder.save();
        console.log('Order updated successfully');
        return res.json({ success: true, message: "Order updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


userorder.cancelorder=async(req,res)=>{
    try {
        console.log("hello");
        const orderId = req.params.id;
        console.log(orderId);
            const result = await Orderdb.deleteOne({ orderId: orderId });
            if (result.deletedCount === 1) {
               
                console.log("SuccessFully deleted");
                res.json({success:true,message:"SuccessFully Deleted"})
            } else {
                // Order not found or not deleted
                console.log("Order not found or not deleted");
                res.json({success:false,message:"Order is not  Deleted"})

            
            }

        
       
    } catch (error) {
   
        console.log(error);
       
    }


}
module.exports=userorder;