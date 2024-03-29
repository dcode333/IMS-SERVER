const express = require('express');
const { body, validationResult } = require('express-validator');
const Sales = require('../../schemas/Sale'); // Import your Mongoose model for Sales
const Product = require('../../schemas/Product'); // Import your Mongoose model for Product
const router = express.Router();

// Validation middleware for creating a sales record
const validateCreateSalesRecord = [
  body('date').isDate().notEmpty(),
  body('quantity').isNumeric().notEmpty(),
  body('customerName').isString().notEmpty(),
  body('customerType').isString().notEmpty(),
  body('productId').isMongoId().notEmpty(),
];


// GET route to retrieve monthly sales quantity
router.get('/monthly-sales', async (req, res) => {
  try {
    const sales = await Sales.find(); // Fetch all sales records

    const groupedSales = Array.from({ length: 12 }, (_, month) => ({ month, totalQuantity: 0 }));

    // Update the quantities for months with sales
    sales.forEach((sale) => {
      const month = sale.date.getMonth(); // Extract the month from the date
      groupedSales[month].totalQuantity += sale.quantity;
    });

    res.status(200).json({ success: true, data: groupedSales });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// POST route to create a new sales record
router.post('/sales', validateCreateSalesRecord, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }

  const { date, quantity, customerName, customerType, productId } = req.body;

  try {

    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.quantity === 0)
      await product.remove();

    if (product.quantity < quantity)
      return res.status(401).json({ success: false, error: "Quantity is not available" });


    product.quantity = product.quantity - quantity;
    await product.save();



    const newSalesRecord = new Sales({
      date,
      quantity,
      customerName,
      customerType,
      productId
    });

    await newSalesRecord.save();

    res.status(201).json({ success: true, message: 'Sales record created', data: newSalesRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET route to retrieve all sales records
router.get('/sales', async (req, res) => {
  try {
    const salesRecords = await Sales.find().populate('productId');

    res.status(200).json({ success: true, data: salesRecords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET route to retrieve a sales record by ID
router.get('/sales/:id', async (req, res) => {
  const salesRecordId = req.params.id;

  try {
    const salesRecord = await Sales.findById(salesRecordId);

    if (!salesRecord) {
      return res.status(404).json({ success: false, message: 'Sales record not found' });
    }

    res.status(200).json({ success: true, data: salesRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Validation middleware for updating a sales record
const validateUpdateSalesRecord = [
  body('date').isISO8601().toDate().optional(),
  body('quantity').isNumeric().optional(),
  body('customerName').isString().optional(),
  body('customerType').isString().optional(),
];

// PUT route to update a sales record by ID
router.post('/edit/:id', validateUpdateSalesRecord, async (req, res) => {
  const salesRecordId = req.params.id;
  const updateData = req.body;

  try {
    const salesRecord = await Sales.findById(salesRecordId);

    if (!salesRecord) {
      return res.status(404).json({ success: false, message: 'Sales record not found' });
    }

    if (updateData.date) salesRecord.date = updateData.date;
    if (updateData.quantity) salesRecord.quantity = updateData.quantity;
    if (updateData.customerName) salesRecord.customerName = updateData.customerName;
    if (updateData.customerType) salesRecord.customerType = updateData.customerType;

    const updatedSalesRecord = await salesRecord.save({ new: true });

    res.status(200).json({ success: true, message: 'Sales record updated', data: updatedSalesRecord });

  } catch (err) {

    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// DELETE route to delete a sales record by ID
router.delete('/sales/:id', async (req, res) => {
  const salesRecordId = req.params.id;

  try {
    const salesRecord = await Sales.findById(salesRecordId);

    if (!salesRecord) {
      return res.status(404).json({ success: false, message: 'Sales record not found' });
    }

    await salesRecord.remove();

    res.status(200).json({ success: true, message: 'Sales record deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
