const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Marks = require('../schemas/Mark');

// Validation middleware for creating a mark
const validateMark = [
    body('studentId').isMongoId(),
    body('obtainedMarks').isNumeric(),
    body('courseCode').isString(),
    body('exam').isIn(['assignment', 'quiz', 's1', 's2', 'terminal']),
];

// POST route to create a mark
router.post('/create-mark', validateMark, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { studentId, obtainedMarks, totalMarks, courseCode, exam } = req.body;

    try {
        const newMark = new Marks({ studentId, obtainedMarks, totalMarks, courseCode, exam });
        const savedMark = await newMark.save();

        res.status(201).json({ success: true, message: 'Mark created', data: savedMark });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// GET route to get marks by exam and course code
router.get('/mark/:courseCode/:exam', async (req, res) => {
    const exam = req.params.exam;
    const courseCode = req.params.courseCode;

    try {
        // Find marks that match the provided exam and course code
        const marks = await Marks.find({ exam, courseCode });

        res.status(200).json({ success: true, message: 'Marks retrieved', data: marks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/mark/:courseCode/:exam/:studentId', async (req, res) => {
    const exam = req.params.exam;
    const courseCode = req.params.courseCode;
    const studentId = req.params.studentId;

    try {
        // Find marks that match the provided exam and course code
        const marks = await Marks.find({ exam, courseCode, studentId });

        res.status(200).json({ success: true, message: 'Marks retrieved', data: marks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



module.exports = router;
