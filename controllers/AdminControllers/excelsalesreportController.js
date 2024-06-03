const excelsalesReport={};
const XLSX = require('xlsx'); 
const Orderdb=require('../../models/UserModels/userorderSchema');
const monthMap = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12
};


excelsalesReport.getmonthlysalesReport=async(req,res)=>{
    try {
        const monthString = req.params.month.toLowerCase();
        const month = monthMap[monthString];

        if (!month || month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month" });
        }

        const salesData = await Orderdb.find({
            createdAt: {
                $gte: new Date(new Date().getFullYear(), month - 1, 1),
                $lt: new Date(new Date().getFullYear(), month, 1)
            }
        });

        // Convert MongoDB documents to a plain array of objects
        const formattedData = salesData.map(order => ({
            'Date': order.orderDate.toLocaleDateString('en-US'),
            'Order ID': order.orderId.toString(),
            'User': order.username,
            'Order Status': order.OrderStatus,
            'Total Amount': `$${order.totalAmount.toFixed(2)}`
        }));

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Sales Report');

        // Write the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="monthly-sales-report.xlsx"');

        // Send the buffer as the response
        res.send(buffer);
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).send('Internal Server Error');
    }
}

excelsalesReport.getcustomsalesReport=async(req,res)=>{
    try {
        const customDate = req.params.custom;
        console.log(customDate);
        const selectedDate = new Date(customDate);
        console.log("dtt", selectedDate);
        if (isNaN(selectedDate.getTime())) {
            throw new Error('Invalid date format');
        }
        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);

        const salesData = await Orderdb.find({
            orderDate: { $gte: startDate, $lte: endDate }
        });

        
        const formattedData = salesData.map(order => ({
            'Date': order.orderDate.toLocaleDateString('en-US'),
            'Order ID': order.orderId.toString(),
            'User': order.username,
            'Order Status': order.OrderStatus,
            'Total Amount': `$${order.totalAmount.toFixed(2)}`,
            'Coupon': order.coupon,
            'Discount Value': `$${(order.totalAmount - order.ActualAmount).toFixed(2)}`,
            'Actual Amount': `$${order.ActualAmount.toFixed(2)}`
        }));

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Custom Sales Report');

        // Write the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="custom-sales-report-${customDate}.xlsx"`);

        // Send the buffer as the response
        res.send(buffer);
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).send('Internal Server Error');
    }

}


module.exports=excelsalesReport;
