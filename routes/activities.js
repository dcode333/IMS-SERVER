const express = require('express');
const { check, validationResult } = require('express-validator');
const Activity = require('../schemas/Activity'); // Import your Mongoose model
const router = express.Router();



// GET route to fetch all activities
router.get('/activity', async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST route to create a new activity
router.post('/activity', [
    check('name').not().isEmpty(),
    check('time').not().isEmpty(),
    check('place').not().isEmpty(),
    check('status').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, time, place, status } = req.body;

    try {
        const newActivity = new Activity({
            name,
            time,
            place,
            status,
        });

        await newActivity.save();
        res.json({ success: true, activity: newActivity });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
