const userinvoice = {};
const Orderdb = require('../../models/UserModels/userorderSchema');
const Userdb = require('../../models/UserModels/UserSignupSchema');
const Productdb = require('../../models/AdminModels/ProductSchema');
const Coupondb = require('../../models/AdminModels/couponSchema');
const pdfDocument = require('pdfkit');

userinvoice.downloadDeliveredInvoice = async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log("Order ID:", orderId);
        
        // Fetch the order details
        const order = await Orderdb.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Fetch the user details
        const user = await Userdb.findById(req.session.userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new PDF document
        const doc = new pdfDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice-${orderId}.pdf"`);
        doc.pipe(res);

        // Add title and move down
        doc.fontSize(20).text('Invoice', { align: 'center' });
        doc.moveDown(1);

        // Add user address
        if (user.address && user.address.length > 0) {
            const addressDetails = user.address[0];
            const username = user.name; // Assuming user has a name field
            const addressString = `${addressDetails.streetaddress}, ${addressDetails.city}, ${addressDetails.state}, ${addressDetails.zipcode}`;
            doc.fontSize(12).text(`Bill to: ${username}`);
            doc.fontSize(12).text(`Address: ${addressString}`);
            doc.moveDown(1);
        } else {
            doc.fontSize(12).text('Address: Not available');
            doc.moveDown(1);
        }

        // Add order details
        doc.fontSize(14).text('Order Details:');
        doc.moveDown(1);
        doc.fontSize(12).text(`Order ID: ${order._id}`);
        doc.fontSize(12).text(`Order Date: ${order.orderDate.toLocaleDateString('en-US')}`);
        doc.moveDown(1);

        // Add order items
        doc.fontSize(14).text('Order Items:');
        doc.moveDown(1);

        // Define table headers and column widths
        const headers = ['Product', 'Quantity', 'Price'];
        const columnWidths = [250, 100, 100]; // Adjusted widths for better layout

        // Set starting position
        const startX = doc.x;
        const startY = doc.y;

        // Render table headers
        doc.font('Helvetica-Bold').fontSize(20);
        let xPosition = startX;
        headers.forEach((header, index) => {
            doc.text(header, xPosition, startY, { width: columnWidths[index], align: 'left' });
            xPosition += columnWidths[index];
        });

        // Render order items
        doc.font('Helvetica').fontSize(10);
        let yPosition = startY + 20;

        for (const item of order.products) {
            try {
                xPosition = startX;
        
                const product = await Productdb.findById(item.product);
                if (!product) return;
        
                const rowData = [
                    product.productName,
                    item.quantity,
                    `$${product.price.toFixed(2)}`,
                ];
        
                rowData.forEach((data, index) => {
                    doc.text(data, xPosition, yPosition, { width: columnWidths[index], align: 'left' });
                    xPosition += columnWidths[index];
                });
        
                yPosition += 20;
            } catch (error) {
                console.error('Error processing item:', error);
            }
        }

        // Add coupon details
        doc.moveDown(1);
        const couponDetails = await Coupondb.findOne({ couponName: order.coupon });
        if (couponDetails) {
            doc.fontSize(14).text(`Coupon Applied: ${couponDetails.couponName}`);
            doc.fontSize(14).text(`Coupon Discount: $${couponDetails.discount}`);
        } else {
            doc.fontSize(14).text('Coupon Applied: No coupon is used');
        }

        // Render total amount
        doc.moveDown(5);
        doc.fontSize(17).text(`Total Amount: $${order.totalAmount.toFixed(2)}`, { align: 'left' });

        // End the document
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
};

userinvoice.getreturnorder=async(req,res)=>{
    const id=req.params.id;
    console.log("val",id);
    const orderDetails=await Orderdb.findById(id).populate('products.product');
    console.log("there",orderDetails);
   

    for (let item of orderDetails.products) {
        const product=await Productdb.findById(item.product);
      
        product.stock += item.quantity;
        item.quantity = 0;
        await product.save();
    }
    orderDetails.OrderStatus='Returned';
    await orderDetails.save();
    res.redirect('/getorderdetails');
}

module.exports = userinvoice;

