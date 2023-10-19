const express = require('express');
const { check, validationResult, body } = require('express-validator');
const mongoose = require('mongoose');
const Course = require('../schemas/Course'); // Import your Mongoose model
const CourseMaterial = require('../schemas/CourseMaterial'); // Import your Mongoose model

const router = express.Router();

const validateCourseMaterial = [
    body('courseCode').isString().notEmpty(),
    body('title').isString().notEmpty(),
    body('description').isString().notEmpty(),
    body('doc').isString().notEmpty(),
];

router.get('/course', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: true, error: 'Internal Server Error' });
    }
});


// Add this route after your previous routes and imports

// GET a single course by courseCode
router.get('/coursecode/:coursecode', async (req, res) => {
    const courseCode = req.params.coursecode;

    try {
        const course = await Course.findOne({ courseCode });

        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        res.status(200).json({ success: true, course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.post(
    '/course',
    [
        check('courseCode').isString().not().isEmpty(),
        check('name').isString().not().isEmpty(),
        check('department').not().isEmpty(),
        check('strength').isInt({ min: 0 }).not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { courseCode, name, department, strength } = req.body;

        try {
            const newCourse = new Course({
                courseCode,
                name,
                department,
                strength,
            });

            await newCourse.save();
            res.status(201).json({ success: true, course: newCourse });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
);


// POST route to create a new course material
router.post('/create-course-material', validateCourseMaterial, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { courseCode, title, description, doc } = req.body;

    try {
        const newCourseMaterial = new CourseMaterial({ courseCode, title, description, doc });
        const savedCourseMaterial = await newCourseMaterial.save();

        res.status(201).json({ success: true, message: 'Course material created', data: savedCourseMaterial });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.get('/course-materials/:courseCode', async (req, res) => {
    const courseCode = req.params.courseCode;

    try {
        // Find course materials that match the provided course code
        const courseMaterials = await CourseMaterial.find({ courseCode });
        res.status(200).json({ success: true, message: 'Course materials retrieved', data: courseMaterials });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});








module.exports = router;




