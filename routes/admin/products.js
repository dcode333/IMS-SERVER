const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../../schemas/Product'); // Import your Mongoose model for Product

const router = express.Router();

// Validation middleware for creating a product
const validateCreateProduct = [
    body('name').isString().notEmpty(),
    body('category').isString().notEmpty(),
    body('quantity').isNumeric().notEmpty(),
];

// POST route to create a new product
router.post('/products', validateCreateProduct, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    const { name, category, quantity } = req.body;

    try {
        const newProduct = new Product({
            name,
            category,
            quantity,
        });

        await newProduct.save();

        res.status(201).json({ success: true, message: 'Product created', data: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// GET route to retrieve all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, data: products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// GET route to retrieve a product by ID
router.get('/products/:id', async (req, res) => { 
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Validation middleware for updating a product
const validateUpdateProduct = [
    body('name').isString().optional(),
    body('category').isString().optional(),
    body('quantity').isNumeric().optional(),
];

// PUT route to update a product by ID
router.post('/edit/:id', validateUpdateProduct, async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (updateData.name) product.name = updateData.name;
        if (updateData.category) product.category = updateData.category;
        if (updateData.quantity) product.quantity = updateData.quantity;

        await product.save();

        res.status(200).json({ success: true, message: 'Product updated', data: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// DELETE route to delete a product by ID
router.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.remove();

        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
