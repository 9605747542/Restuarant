const OrderDB = require('../../models/UserModels/userorderSchema');
const Userdb =require('../../models/UserModels/UserSignupSchema');
const CouponDB=require('../../models/AdminModels/couponSchema');
const salesReport = {};
const pdfDocument=require('pdfkit');
const { startOfWeek, addDays } = require('date-fns');
const { PDFTableWrapper } = require('pdfkit-table');

const fs=require('fs');
const { start } = require('repl');
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

salesReport.getmonthlysalesReport = async (req, res) => {
    const monthString = req.params.month.toLowerCase(); 
    const year = req.params.year; 
  
  const month = monthMap[monthString];

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({ message: "Invalid month" });
    }
    if (!year) {
        return res.status(400).json({ message: "Year is required" });
    }

    try {
     
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        const returnedOrders = await OrderDB.countDocuments({
         orderDate: { $gte: startDate, $lt: endDate },
         OrderStatus: "Returned"
     });

     const deliveredOrders = await OrderDB.countDocuments({
         orderDate: { $gte: startDate, $lt: endDate },
         OrderStatus: "Delivered"
     });

     const cancelledOrders = await OrderDB.countDocuments({
         orderDate: { $gte: startDate, $lt: endDate },
         OrderStatus: "Cancelled"
     });

     const salesData = {
      returned: returnedOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
     }


       
    
        console.log("here",salesData);

        res.json(salesData);
    } catch (error) {
        console.error("Error fetching monthly sales data:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};
salesReport.downloadmonthlyReport = async (req, res) => {
    try {
        const monthString = req.params.month.toLowerCase();
        const month = monthMap[monthString];

        if (!month || month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month" });
        }

        const salesData = await OrderDB.find({
            createdAt: {
                $gte: new Date(new Date().getFullYear(), month - 1, 1),
                $lt: new Date(new Date().getFullYear(), month, 1)
            }
        });

        const doc = new pdfDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="monthly-sales-report.pdf"');
        doc.pipe(res);

        doc.fontSize(20).text('Monthly Sales Report', { align: 'center' });
        doc.fontSize(16).text(`Month: ${monthString}`, { align: 'center' });
        doc.moveDown(2);

        // Define table headers and column widths
        const headers = ['Date','Order ID', 'User','OrderStatus', 'Total Amount'];
        const columnWidths = [150, 100, 100, 100,100]; // Adjusted widths for better layout

        // Set starting position
        const startX = doc.x;
        const startY = doc.y;

        // Render table headers
        doc.font('Helvetica-Bold').fontSize(10);
        let xPosition = startX;
        headers.forEach((header, index) => {
            doc.text(header, xPosition, startY, { width: columnWidths[index], align: 'left' });
            xPosition += columnWidths[index];
        });

    
        doc.font('Helvetica').fontSize(10);
        let yPosition = startY + 20;

        salesData.forEach(order => {
            xPosition = startX; 

            const rowData = [
                order.createdAt.toLocaleDateString('en-US'),
                order._id.toString(),
                order.username,
                order.OrderStatus,
                `$${order.totalAmount.toFixed(2)}`, 
               
            ];

            rowData.forEach((data, index) => {
                doc.text(data, xPosition, yPosition, { width: columnWidths[index], align: 'left' });
                xPosition += columnWidths[index];
            });

            yPosition += 20; // Move down to the next row
        });

        // End the document
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
};





//Weakly Sales Report
salesReport.getweeklysalesReport = async (req, res) => {
    const monthString = req.params.month.toLowerCase();
    const year = parseInt(req.params.year);
    const week = parseInt(req.params.week);
    const month = monthMap[monthString];

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({ message: "Invalid month" });
    }
    if (!year) {
        return res.status(400).json({ message: "Year is required" });
    }
    if (!week || week < 1 || week > 5) {  // Assumes there could be up to 5 weeks in a month
        return res.status(400).json({ message: "Invalid week number" });
    }

    try {
        // Calculate the start and end dates of the specified week in the specified month
        const startDate = startOfWeek(new Date(year, month - 1, 1 + (week - 1) * 7), { weekStartsOn: 1 }); // weekStartsOn: 1 (Monday)
        const endDate = addDays(startDate, 7);

        const returnedOrders = await OrderDB.countDocuments({
            orderDate: { $gte: startDate, $lt: endDate },
            OrderStatus: "Returned"
        });

        const deliveredOrders = await OrderDB.countDocuments({
            orderDate: { $gte: startDate, $lt: endDate },
            OrderStatus: "Delivered"
        });

        const cancelledOrders = await OrderDB.countDocuments({
            orderDate: { $gte: startDate, $lt: endDate },
            OrderStatus: "Cancelled"
        });

        const salesData = {
            returned: returnedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
        };
        console.log(salesData);

        res.json(salesData);
    } catch (error) {
        console.error("Error fetching weekly sales data:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};
salesReport.downloadweeklyReport = async (req, res) => {
    try {
        const week = parseInt(req.params.week);
        const monthString = req.params.month.toLowerCase();
        const year = parseInt(req.params.year);
        const month = monthMap[monthString]; // Ensure 'monthMap' is defined elsewhere in your code

        if (!month || month < 1 || month > 12 || !year || !week || week < 1 || week > 5) {
            return res.status(400).json({ message: "Invalid month, year, or week" });
        }

        const startDate = startOfWeek(new Date(year, month - 1, 1 + (week - 1) * 7), { weekStartsOn: 1 });
        const endDate = addDays(startDate, 6);

        const salesData = await OrderDB.find({
            orderDate: { $gte: startDate, $lt: endDate }
        });

        const doc = new pdfDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="weekly-sales-report-${week}-${monthString}-${year}.pdf"`);
        doc.pipe(res);

        doc.fontSize(10).text('Weekly Sales Report', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(8).text(`Week: ${week}, Month: ${monthString}, Year: ${year}`, { align: 'center' });
        doc.moveDown(1);

        const headers = [ 'Date','Order ID', 'User', 'Order Status', 'Total Amount', 'Coupon', 'Discount Value', 'Actual Amount'];
        const columnWidths = [80, 60, 60, 60, 90, 60, 60, 70]; 

        // Draw the headers
        doc.font('Helvetica-Bold').fontSize(8);
        let startX = doc.x;
        let startY = doc.y;

        headers.forEach((header, index) => {
            doc.text(header, startX, startY, { width: columnWidths[index], align: 'center' });
            startX += columnWidths[index];
        });
        startY += 20;

        // Draw the data
        doc.font('Helvetica').fontSize(8);
        salesData.forEach(order => {
            let xPosition = doc.page.margins.left; // Start from the left margin
            const rowData = [
                order.orderDate.toLocaleDateString('en-US'),
                order.orderId,
                order.username,
                order.OrderStatus,
                "₹" + order.totalAmount.toFixed(2),
                order.ActualAmount ? `product / ${order.coupon}` : null,
                "₹" + (order.totalAmount - order.ActualAmount).toFixed(2),
                "₹" + order.ActualAmount.toFixed(2),
              
            ];
           
            // Draw each cell of the row
            rowData.forEach((data, index) => {
                doc.text(data, xPosition, startY, { width: columnWidths[index], align: 'center' });
                xPosition += columnWidths[index];
            });

            startY += 20; // Move to the next row
        });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
};

//today sales report
salesReport.gettodaysalesReport = async (req, res) => {
    try {
        // Get the start and end date of the current day
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // End date is exclusive (next day)

        // Query the database for orders placed today
        const todayOrders = await OrderDB.find({
            orderDate: { $gte: startDate, $lt: endDate }
        });

        // Calculate sales data
        let returnedOrders = 0;
        let deliveredOrders = 0;
        let cancelledOrders = 0;

        todayOrders.forEach(order => {
            if (order.OrderStatus === "Returned") {
                returnedOrders++;
            } else if (order.OrderStatus === "Delivered") {
                deliveredOrders++;
            } else if (order.OrderStatus === "Cancelled") {
                cancelledOrders++;
            }
        });

        const salesData = {
            returned: returnedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
        };

        console.log("salesdata",salesData);

        res.json(salesData);
    } catch (error) {
        console.error("Error fetching today's sales data:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};
salesReport.downloadTodaysReport = async (req, res) => {
    try {
        // Get today's date
        const today = new Date();
        // Set the start and end of the day
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // End date is exclusive

        // Fetch sales data for today
        const salesData = await OrderDB.find({
            orderDate: { $gte: startDate, $lt: endDate }
        });

        // Create a new PDF document
        const doc = new pdfDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="daily-sales-report-${today.toLocaleDateString('en-US')}.pdf"`);
        doc.pipe(res);

        // Add title
        doc.fontSize(10).text('Daily Sales Report', { align: 'center' });
        doc.moveDown(2);

        // Add date
        doc.fontSize(8).text(`Date: ${today.toLocaleDateString('en-US')}`, { align: 'center' });
        doc.moveDown(1);

        // Define headers and column widths
        const headers = ['Date','Order ID', 'User', 'Order Status', 'Total Amount', 'Coupon', 'Discount Value', 'Actual Amount'];
        const columnWidths = [80, 60, 60, 60, 90, 60, 60, 70]; 

        // Draw headers
        doc.font('Helvetica-Bold').fontSize(8);
        let startX = doc.x;
        let startY = doc.y;

        headers.forEach((header, index) => {
            doc.text(header, startX, startY, { width: columnWidths[index], align: 'center' });
            startX += columnWidths[index];
        });
        startY += 20;

        // Draw data
        doc.font('Helvetica').fontSize(8);
        salesData.forEach(order => {
            let xPosition = doc.page.margins.left;
            const rowData = [
                order.orderDate.toLocaleDateString('en-US'),
                order.orderId,
                order.username,
                order.OrderStatus,
                "₹" + order.totalAmount.toFixed(2),
                order.ActualAmount ? `product / ${order.coupon}` : null,
                "₹" + (order.totalAmount - order.ActualAmount).toFixed(2),
                "₹" + order.ActualAmount.toFixed(2),
             
            ];

            rowData.forEach((data, index) => {
                doc.text(data, xPosition, startY, { width: columnWidths[index], align: 'center' });
                xPosition += columnWidths[index];
            });

            startY += 20;
        });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
};



//for doing year-wise sales Report 
salesReport.getyearlysalesReport = async (req, res) => {
    try {
        const selectedYear = req.params.year;
        const startDate = new Date(selectedYear, 0, 1);
        const endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
        const yearlyOrders = await OrderDB.find({
            orderDate: { $gte: startDate, $lte: endDate }
        });
        let returnedOrders = 0;
        let deliveredOrders = 0;
        let cancelledOrders = 0;
        yearlyOrders.forEach(order => {
            if (order.OrderStatus === "Returned") {
                returnedOrders++;
            } else if (order.OrderStatus === "Delivered") {
                deliveredOrders++;
            } else if (order.OrderStatus === "Cancelled") {
                cancelledOrders++;
            }
        });
        const salesData = {
            returned: returnedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
        };
        res.json(salesData);
    } catch (error) {
        console.error("Error fetching yearly sales data:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};

salesReport.downloadYearlyReport = async (req, res) => {
    try {
        // Extract the selected year from request parameters
        const year = req.params.year;

        // Calculate start and end dates for the selected year
        const startDate = new Date(year, 0, 1); // January 1st of the selected year
        const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st of the selected year, last second

        // Fetch sales data for the selected year
        const salesData = await OrderDB.find({
            orderDate: { $gte: startDate, $lte: endDate }
        });

        // Create a new PDF document
        const doc = new pdfDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="yearly-sales-report-${year}.pdf"`);
        doc.pipe(res);

        // Add title
        doc.fontSize(10).text('Yearly Sales Report', { align: 'center' });
        doc.moveDown(2);

        // Add year
        doc.fontSize(8).text(`Year: ${year}`, { align: 'center' });
        doc.moveDown(1);

        // Define headers and column widths
        const headers = ['Date', 'Order ID', 'User', 'Order Status', 'Total Amount', 'Coupon', 'Discount Value', 'Actual Amount'];
        const columnWidths = [80, 60, 60, 60, 90, 60, 60, 70];

        // Draw headers
        doc.font('Helvetica-Bold').fontSize(8);
        let startX = doc.x;
        let startY = doc.y;

        headers.forEach((header, index) => {
            doc.text(header, startX, startY, { width: columnWidths[index], align: 'center' });
            startX += columnWidths[index];
        });
        startY += 20;

        // Draw data
        doc.font('Helvetica').fontSize(8);
        salesData.forEach(order => {
            let xPosition = doc.page.margins.left;
            const rowData = [
                order.orderDate.toLocaleDateString('en-US'),
                order.orderId,
                order.username,
                order.OrderStatus,
                "₹" + order.totalAmount.toFixed(2),
                order.ActualAmount ? `product / ${order.coupon}` : null,
                "₹" + (order.totalAmount - order.ActualAmount).toFixed(2),
                "₹" + order.ActualAmount.toFixed(2),
            ];

            rowData.forEach((data, index) => {
                doc.text(data, xPosition, startY, { width: columnWidths[index], align: 'center' });
                xPosition += columnWidths[index];
            });

            startY += 20;
        });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
};

//for doing custom sales data
salesReport.getcustomsalesReport = async (req, res) => {
    try {
        const custom = req.params.custom;
        const [startYear, startMonth, startDay] = custom.split('-').map(Number);
        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(startDate);
        endDate.setHours(23, 59, 59);
        
        const customOrders = await OrderDB.find({
            orderDate: { $gte: startDate, $lte: endDate }
        });
        
        let returnedOrders = 0;
        let deliveredOrders = 0;
        let cancelledOrders = 0;
        
        customOrders.forEach(order => {
            if (order.OrderStatus === "Returned") {
                returnedOrders++;
            } else if (order.OrderStatus === "Delivered") {
                deliveredOrders++;
            } else if (order.OrderStatus === "Cancelled") {
                cancelledOrders++;
            }
        });
        
        const salesData = {
            returned: returnedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
        };
        
        res.json(salesData);
    } catch (error) {
        console.error("Error fetching custom sales data:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};

salesReport.downloadCustomReport = async (req, res) => {
    try {
        const customDate = req.params.custom;
        console.log(customDate);
        const selectedDate = new Date(customDate);
        console.log("dtt",selectedDate);
        if (isNaN(selectedDate.getTime())) {
            throw new Error('Invalid date format');
        }
        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);

        const salesData = await OrderDB.find({
            orderDate: { $gte: startDate, $lte: endDate }
        });

        const doc = new pdfDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="custom-sales-report-${customDate}.pdf"`);
        doc.pipe(res);

        doc.fontSize(10).text('Custom Sales Report', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(8).text(`Date: ${customDate}`, { align: 'center' });
        doc.moveDown(1);

        const headers = ['Date', 'Order ID', 'User', 'Order Status', 'Total Amount', 'Coupon', 'Discount Value', 'Actual Amount'];
        const columnWidths = [80, 60, 60, 60, 90, 60, 60, 70];

        doc.font('Helvetica-Bold').fontSize(8);
        let startX = doc.x;
        let startY = doc.y;

        headers.forEach((header, index) => {
            doc.text(header, startX, startY, { width: columnWidths[index], align: 'center' });
            startX += columnWidths[index];
        });
        startY += 20;

        doc.font('Helvetica').fontSize(8);
        salesData.forEach(order => {
            let xPosition = doc.page.margins.left;
            const rowData = [
                order.orderDate.toLocaleDateString('en-US'),
                order.orderId,
                order.username,
                order.OrderStatus,
                "₹" + order.totalAmount.toFixed(2),
                order.ActualAmount ? `product / ${order.coupon}` : null,
                "₹" + (order.totalAmount - order.ActualAmount).toFixed(2),
                "₹" + order.ActualAmount.toFixed(2),
            ];

            rowData.forEach((data, index) => {
                doc.text(data, xPosition, startY, { width: columnWidths[index], align: 'center' });
                xPosition += columnWidths[index];
            });

            startY += 20;
        });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
};

























module.exports = salesReport;
