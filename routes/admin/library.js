// libraryRoutes.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const LibraryItem = require('../../schemas/LibraryItem'); // Import your Mongoose model for LibraryItem
const IssueLibraryItem = require('../../schemas/IssueLibraryItem');

// Validation middleware for creating a library item
const validateLibraryItem = [
    body('title').isString().notEmpty(),
    body('authorName').isString().notEmpty(),
    body('publisherName').isString().notEmpty(),
    body('isbn').isString().notEmpty(),
    body('category').isString().notEmpty(),
    body('availability').isBoolean(),
    body('language').isString().notEmpty(),
    body('quantity').isNumeric().notEmpty(),
    body('department').isString().notEmpty(),
    body('courseId').isString().notEmpty(),
];

const updateLibraryItem = [
    body('title').isString().notEmpty(),
    body('authorName').isString().notEmpty(),
    body('publisherName').isString().notEmpty(),
    body('category').isString().notEmpty(),
    body('availability').isBoolean(),
    body('language').isString().notEmpty(),
    body('quantity').isNumeric().notEmpty(),
    body('department').isString().notEmpty(),
];

// Validation middleware for issuing a library item
const validateIssueLibraryItem = [
    body('issueLibraryItemId').isMongoId().notEmpty(),
    body('libraryItemId').isMongoId().notEmpty(),
];

// POST route to create a new library item
router.post('/library-items', validateLibraryItem, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
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
        courseId
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
            courseId
        });
        const savedLibraryItem = await newLibraryItem.save();

        res.status(201).json({ success: true, message: 'Library item created', data: savedLibraryItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
});

// GET route to retrieve all library items
router.get('/library-items', async (req, res) => {
    try {
        const libraryItems = await LibraryItem.find();

        res.status(200).json({ success: true, message: 'Library items retrieved', data: libraryItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
});



// POST route to update a library item by ISBN
router.post('/library-items/edit/:id', updateLibraryItem, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    const id = req.params.id; // ISBN of the library item

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
    } = req.body;

    try {

        const editedBook = await LibraryItem.findByIdAndUpdate(id, {
            title,
            authorName,
            publisherName,
            category,
            isbn,
            availability,
            language,
            quantity,
            department,
        }, { new: true });

        if (!editedBook) {
            return res.status(404).json({ success: false, error: 'Library item not found' });
        }

        res.status(200).json({ success: true, message: 'Library item updated', data: editedBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
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
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
});

// GET route to retrieve a All issued library item 

router.get('/library-items/issued', async (req, res) => {
    try {
        const libraryItems = await LibraryItem.find({ availability: false });

        res.status(200).json({ success: true, message: 'Issued library items retrieved', data: libraryItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
});

// GET route to retrieve a All issue requests 

router.get('/library-items/issue-requests', async (req, res) => {
    try {
        const libraryItems = await IssueLibraryItem.find({ status: 'pending' });

        res.status(200).json({ success: true, message: 'requested library items retrieved', data: libraryItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
}
);

// POST route to issue a library item

router.post('/library-items/issue-book', validateIssueLibraryItem, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array() });

    const { issueLibraryItemId, libraryItemId } = req.body;

    try {

        const issueLibraryItem = await IssueLibraryItem.findById(issueLibraryItemId);
        issueLibraryItem.status = 'issued';
        const savedIssueLibraryItem = await issueLibraryItem.save();

        const libraryItem = await LibraryItem.findById(libraryItemId);
        libraryItem.availability = false;
        await libraryItem.save();

        res.status(201).json({ success: true, message: 'Library item issued', data: savedIssueLibraryItem });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }

})







module.exports = router;
