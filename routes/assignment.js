const express = require('express');
const { body, validationResult } = require('express-validator');
const Assignment = require('../schemas/Assignment'); // Import your Mongoose model for Assignment
const route = express.Router();

// Validation middleware for the assignment
const validateAssignment = [
    body('title').isString().notEmpty(),
    body('courseId').isMongoId().notEmpty(),
    body('teacherId').isMongoId().notEmpty()
];

const validateSubmission = [
    body('studentId').isMongoId(),
    body('assignmentId').isMongoId(),
    body('doc').isString().notEmpty(),
];

// POST route to append a submission to the corresponding assignment
route.post('/add-submission', validateSubmission, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Create a new Submission document
        const { studentId, assignmentId, doc } = req.body;
        const newSubmission = { studentId, doc };

        // Find the assignment by ID and append the new submission
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, error: 'Assignment not found' });
        }

        assignment.submissions.push(newSubmission);
        await assignment.save();

        res.status(201).json({ success: true, data: newSubmission });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// POST route to create a new assignment
route.post('/create-assignment', validateAssignment, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    const { title, courseId, doc, teacherId } = req.body;

    try {
        // Create a new Assignment document
        const newAssignment = new Assignment({
            title,
            courseId,
            teacherId,
            doc
        });

        // Save the assignment to the database
        const savedAssignment = await newAssignment.save();

        res.status(201).json({ success: true, data: savedAssignment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

route.get('/getassignments/:courseId/:teacherId', async (req, res) => {
    const courseId = req.params.courseId;
    const teacherId = req.params.teacherId;


    try {
        // Find assignments with the provided course code
        const assignments = await Assignment.find({ courseId, teacherId }).populate({
            path: 'submissions',
            populate: {
                path: 'studentId',
                model: 'Student',
                select: '-password',
            },
        });

        res.status(200).json({ success: true, data: assignments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = route;



