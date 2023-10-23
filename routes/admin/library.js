// libraryRoutes.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const LibraryItem = require('../../schemas/LibraryItem'); // Import your Mongoose model for LibraryItem

// Validation middleware for creating a library item
const validateLibraryItem = [
    body('title').isString().notEmpty(),
    body('authorName').isString().notEmpty(),
    body('isbn').isString().notEmpty(),
    body('category').isString().notEmpty(),
    body('availability').isBoolean(),
    body('language').isString().notEmpty(),
    body('quantity').isNumeric().notEmpty(),
    body('department').isString().notEmpty(),
    body('courseCode').isString().notEmpty(),
];

// POST route to create a new library item
router.post('/library-items', validateLibraryItem, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
        title,
        authorName,
        publisherName,
        isbn,
        category,
        availability,
        language,
        quantity,
        department,
        courseCode
    } = req.body;

    try {
        const newLibraryItem = new LibraryItem({
            title,
            authorName,
            publisherName,
            isbn,
            category,
            availability,
            language,
            quantity,
            department,
            courseCode
        });
        const savedLibraryItem = await newLibraryItem.save();

        res.status(201).json({ success: true, message: 'Library item created', data: savedLibraryItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// GET route to retrieve all library items
router.get('/library-items', async (req, res) => {
    try {
        const libraryItems = await LibraryItem.find();

        res.status(200).json({ success: true, message: 'Library items retrieved', data: libraryItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



// POST route to update a library item by ISBN
router.post('/library-items/edit/:id', validateLibraryItem, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    const id = req.params.id; // ISBN of the library item
    const updateData = req.body; // Updated attributes

    try {
        // Find the library item by ISBN
        const libraryItem = await LibraryItem.findById(id);

        if (!libraryItem) {
            return res.status(404).json({ success: false, error: 'Library item not found' });
        }

        // Update the specified attributes
        libraryItem.title = updateData.title;
        libraryItem.authorName = updateData.authorName;
        libraryItem.publisherName = updateData.publisherName;
        libraryItem.category = updateData.category;
        libraryItem.availability = updateData.availability;

        // Save the updated library item
        await libraryItem.save();

        res.status(200).json({ success: true, message: 'Library item updated', data: libraryItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


// DELETE route to delete a library item by ISBN
router.delete('/library-items/:id', async (req, res) => {
    const id = req.params.id; // ISBN of the library item

    try {
        // Find the library item by ISBN
        const libraryItem = await LibraryItem.findById(id);

        if (!libraryItem) {
            return res.status(404).json({ success: false, error: 'Library item not found' });
        }

        // Delete the library item
        await libraryItem.remove();

        res.status(200).json({ success: true, message: 'Library item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


module.exports = router;
