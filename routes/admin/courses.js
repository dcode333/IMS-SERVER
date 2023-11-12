const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator');
const Course = require('../../schemas/Course');

route.post(
    '/course',
    [
        check('courseCode').isString().not().isEmpty(),
        check('name').isString().not().isEmpty(),
        check('department').not().isEmpty(),
        check('strength').isInt({ min: 0 }).not().isEmpty(),
        check('duration').isNumeric().isIn([7, 14, 30]),
        check('author').isString().not().isEmpty(),
        check('category').isString().not().isEmpty(),
        check('description').isString().not().isEmpty(),
    
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const {
            courseCode,
            name,
            department,
            strength,
            duration,
            author,
            category,
            description,
        } = req.body;

        try {
            const newCourse = new Course({
                courseCode,
                name,
                department,
                strength,
                duration,
                author,
                category,
                description,
            });

            const newAddedCourse = await newCourse.save();
            res.status(201).json({ success: true, course: newAddedCourse });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
);

route.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ success: true, data: courses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: true, error: 'Internal Server Error' });
    }
});


route.delete('/course/:id', async (req, res) => {

    const courseId = req.params.id;

    try {
        const course = await Course.findByIdAndDelete(courseId);
        res.status(200).json({ success: true, message: 'Course deleted', data: course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: true, error: 'Internal Server Error' });
    }

})

module.exports = route;
