// attendanceRoutes.js

const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Attendance = require('../schemas/Attendance'); // Import your Mongoose model

const router = express.Router();

// Validation middleware for a single attendance record
const validateAttendanceRecord = [
    check('attendance').isNumeric(),
    check('student').isMongoId(),
    check('course').isString(),
];

// POST route to save an array of Attendance records
router.post('/save-attendance', async (req, res) => {
    const attendanceArray = req.body; // Assuming req.body is an array of objects

    try {
        // Validate each attendance record
        for (const attendanceData of attendanceArray) {
            await Promise.all(validateAttendanceRecord.map(validation => validation.run(attendanceData)));
        }

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Iterate through the array and save each attendance record
        const savedAttendance = await Promise.all(
            attendanceArray.map(async (attendanceData) => {
                // Create a new Attendance document
                const newAttendance = new Attendance(attendanceData);
                // Save the document
                return newAttendance.save();
            })
        );

        res.status(201).json({ success: true, data: savedAttendance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/attendance/:courseCode', async (req, res) => {
    const courseCode = req.params.courseCode;

    try {
        // Find the attendance records related to the course
        const attendanceRecords = await Attendance.find({ course: courseCode }).populate({ path: 'student', select: '-password' });

        res.status(200).json({ message: 'Attendance records found', data: attendanceRecords });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/attendance/:courseCode/:studentId', async (req, res) => {
    const courseCode = req.params.courseCode;
    const studentId = req.params.studentId;

    try {
        // Find the attendance records related to the course
        const attendanceRecords = await Attendance.find({ course: courseCode, student: studentId }).populate({ path: 'student', select: '-password' });

        res.status(200).json({ message: 'Attendance records found', data: attendanceRecords });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
