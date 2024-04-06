const userorder={};
const Orderdb=require('../../models/UserModels/userorderSchema');
userorder.getuserorderpage=async(req,res)=>{
    const data=await Orderdb.find();
    console.log(data);
    const orders = data.map(cartItem => {
        return {
            orderId: cartItem.orderId,
            customer: cartItem.customer,
            orderDate: cartItem.orderDate,
            OrderStatus: cartItem.OrderStatus,
            paymentMethod: cartItem.paymentMethod,
        totalAmount: cartItem.totalAmount,

        };
    });
    console.log("checking",orders.OrderId);
    res.render('Adminviews/userorders',{orders})
}

userorder.geteditorder=async(req,res)=>{
    const data=await Orderdb.find();
    const orders = data.map(cartItem => {
        return {
            orderId: cartItem.orderId,
            customer: cartItem.customer,
            orderDate: cartItem.orderDate,
            OrderStatus: cartItem.OrderStatus,
            paymentMethod: cartItem.paymentMethod,
        totalAmount: cartItem.totalAmount,


        };
    });
    res.render('Adminviews/editorder',{orders})
}

userorder.postorder=async(req,res)=>{
    const order_Id = req.params.id;
    console.log("data ",order_Id);
    const {orderId,customer,orderDate,OrderStatus,paymentMethod }=req.body;
    console.log("hello",paymentMethod);
    try{
    const existingOrder = await Orderdb.findById(order_Id);
    if (!existingOrder) {
        console.log("Order not found");
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    existingOrder.orderId = orderId;
    existingProduct.customer = customer;
    existingProduct.orderDate = orderDate;
    existingProduct.OrderStatus = OrderStatus;
    existingProduct.paymentMethod = paymentMethod;

    await existingProduct.save();
    console.log('Product updated successfully',);
    return res.json({ success: true, message: "Product updated successfully" });
} catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
}

}
module.exports=userorder;