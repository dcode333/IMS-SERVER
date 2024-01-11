const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Marks = require('../schemas/Mark');

// Validation middleware for creating a mark
const validateMark = [
    body('studentId').isMongoId(),
    body('obtainedMarks').isNumeric(),
    body('courseId').isMongoId(),
    body('exam').isIn(['assignment', 'quiz', 's1', 's2', 'terminal']),
];

// POST route to create a mark
router.post('/create-mark', validateMark, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    const { studentId, obtainedMarks, totalMarks, courseId, exam } = req.body;

    try {
        const newMark = new Marks({ studentId, obtainedMarks, totalMarks, courseId, exam });
        const savedMark = await newMark.save();

        res.status(201).json({ success: true, message: 'Mark created', data: savedMark });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// GET route to get marks by exam and course code
router.get('/mark/:courseId/:exam', async (req, res) => {
    const exam = req.params.exam;
    const courseId = req.params.courseId;

    try {
        // Find marks that match the provided exam and course code
        const marks = await Marks.find({ exam, courseId });

        res.status(200).json({ success: true, message: 'Marks retrieved', data: marks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/mark/:courseId/:exam/:studentId', async (req, res) => {
    const exam = req.params.exam;
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;

    try {
        // Find marks that match the provided exam and course code
        const marks = await Marks.find({ exam, courseId, studentId });

        res.status(200).json({ success: true, message: 'Marks retrieved', data: marks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


//GET route to get marks by studentId and courseId

router.get('/marks-summary/:studentId/:courseId', async (req, res) => {
    const studentId = req.params.studentId;
    const courseId = req.params.courseId;

    try {
        // Find marks that match the provided exam and course code
        const marks = await Marks.find({ studentId, courseId });

        const assignments = marks.filter(mark => mark.exam === 'assignment');
        const quizes = marks.filter(mark => mark.exam === 'quiz');
        const s1 = marks.filter(mark => mark.exam === 's1');
        const s2 = marks.filter(mark => mark.exam === 's2');
        const terminals = marks.filter(mark => mark.exam === 'terminal');

        res.status(200).json({
            success: true, message: 'Marks retrieved', data: {
                assignments,
                quizes,
                s1,
                s2,
                terminals
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
}
);



module.exports = router;
