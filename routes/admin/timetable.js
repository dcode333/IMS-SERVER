const express = require('express');
const { check, validationResult } = require('express-validator');
const TimeTable = require('../../schemas/TimeTable'); 
const Teacher = require('../../schemas/Teacher');
const Course = require('../../schemas/Course');
const router = express.Router();

// GET route to retrieve timetable entries
router.get('/timetable', async (req, res) => {
    try {
        const timetableEntries = await TimeTable.find();
        res.status(200).json({ success: true, data: timetableEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

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


// POST route to add a new timetable entry
router.post('/timetable', [
    check('courseCode').not().isEmpty(),
    check('room').not().isEmpty(),
    check('time').not().isEmpty(),
    check('day').not().isEmpty(),
    check('teacherName').not().isEmpty(),
], async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { courseCode, room, time, day, teacherName } = req.body;

    try {
        // Check if a document with the same room, time, and day combination already exists
        const existingEntry = await TimeTable.findOne({ room, time, day, courseCode });

        if (existingEntry) {
            return res.status(400).json({ success: false, error: 'A timetable entry with the same room, time, and day already exists.' });
        }

        // Create and save the new timetable entry
        const newTimetableEntry = new TimeTable({
            courseCode,
            room,
            time,
            day,
            teacherName,
        });

        await newTimetableEntry.save();
        res.status(201).json({ success: true, data: newTimetableEntry })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
