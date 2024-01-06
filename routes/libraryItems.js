// libraryRoutes.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const LibraryItem = require('../schemas/LibraryItem'); // Import your Mongoose model for LibraryItem
const IssueLibraryItem = require('../schemas/IssueLibraryItem');

// Validation middleware for creating a library item
const validateLibraryItem = [
    body('title').isString().notEmpty(),
    body('authorName').isString().notEmpty(),
    body('publisherName').isString().notEmpty(),
    body('isbn').isString().notEmpty(),
    body('category').isString().notEmpty(),
    body('availability').isBoolean(),
];

// Validation middleware for issuing a library item
const validateIssueLibraryItem = [
    body('studentId').isString().notEmpty(),
    body('libraryItemId').isString().notEmpty(),
];

// POST route to create a new library item

router.post('/library-items', validateLibraryItem, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, authorName, publisherName, isbn, category, availability } = req.body;

    try {
        const newLibraryItem = new LibraryItem({ title, authorName, publisherName, isbn, category, availability });
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

// POST route to issue a library item

router.post('/library-items/issue-request', validateIssueLibraryItem, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array() });

    const { studentId, libraryItemId } = req.body;

    try {
        const alreadyIssued = await IssueLibraryItem.findOne({ studentId, libraryItemId });
        if (alreadyIssued) return res.status(400).json({ success: false, error: 'Library item already requested' });
        const newIssueLibraryItem = new IssueLibraryItem({ studentId, libraryItemId });
        const savedIssueLibraryItem = await newIssueLibraryItem.save();

        res.status(201).json({ success: true, message: 'Library item requested', data: savedIssueLibraryItem });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



module.exports = router;
