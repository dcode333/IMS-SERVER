const express = require('express');
const { check, validationResult, body } = require('express-validator');
const TimeTable = require('../../schemas/TimeTable');
const Teacher = require('../../schemas/Teacher');
const Course = require('../../schemas/Course');
const router = express.Router();

router.get('/contents', async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .select('firstname lastname');
        const courses = await Course.find()
            .select('courseCode');

        const data = {
            teachers,
            courses,
            rooms: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'],
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


// GET route to retrieve timetable entries
router.get('/timetable', async (req, res) => {
    try {

        const timetableEntries = await TimeTable.findById('65a6a45d17dce9099f734ebc');

        res.status(200).json({ success: true, data: timetableEntries });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


// POST route to add a new timetable entry
router.put('/timetable', body("timetable").isArray(), async (req, res) => {

    // Validate input
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(500).json({ success: false, error: errors.array() });

    const timetable = await TimeTable.findById('65a6a45d17dce9099f734ebc');

    try {

        // Update the entire timetable field with the data from req.body
        timetable.timetable = req.body.timetable;

        // Save the updated timetable
        const updatedTimeTable = await timetable.save();

        res.status(201).json({ success: true, data: updatedTimeTable, message: 'TimeTable Updated' })

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
});

module.exports = router;
