// attendanceRoutes.js

const express = require('express');
const { check, validationResult, body } = require('express-validator');
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
router.put('/mark-attendance/:courseId/:teacherId', body("students").isArray(), async (req, res) => {
    const { courseId, teacherId } = req.params;
    const { students } = req.body;

    try {
        // Find attendance based on courseId and teacherId
        const attendance = await Attendance.findOne({ courseId, teacherId });

        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Attendance not found' });
        }


        // Update the entire students field with the data from req.body
        attendance.students = students;

        // Save the updated attendance
        const updatedAttendance = await attendance.save();

        return res.status(200).json({ success: true, data: updatedAttendance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
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

router.get('/attendances/:courseId/:teacherId', async (req, res) => {
    const courseId = req.params.courseId;
    const teacherId = req.params.teacherId;

    try {
        // Find the attendance records related to the course
        const attendanceRecords = await Attendance.find({ courseId, teacherId })
            .populate({
                path: 'students.studentId',
                select: '-password', // Exclude the 'password' field
            })
            .populate('courseId'); // Populate the 'courseId' field

        attendanceRecords.forEach((record) => {
            record.students.forEach((student) => {
                student.attendance.push({
                    date: new Date().toLocaleDateString("en-US"),
                    present: false,
                });
            });
        });

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


module.exports = router;
