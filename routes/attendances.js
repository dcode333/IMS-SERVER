// attendanceRoutes.js

const express = require('express');
const { body } = require('express-validator');
const Attendance = require('../schemas/Attendance'); // Import your Mongoose model

const router = express.Router();


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
        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });

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
                console.log(student)
                student.attendance.push({
                    date: new Date().toLocaleDateString("en-US"),
                    present: false,
                });
            });
        });

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
});


// GET attendance of a student

router.get('/attendance/:studentId/:teacherId/:courseId', async (req, res) => {

    const { courseId, teacherId, studentId } = req.params;

    try {
        const attendanceRecord = await Attendance.findOne({
            courseId: courseId,
            teacherId: teacherId,
            'students.studentId': studentId,
        });

        if (!attendanceRecord) {
            return res.status(404).json({ success: false, error: 'Attendance not found' });
        }

        const student = attendanceRecord.students.find(
            (s) => String(s.studentId) === studentId
        );

        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found for this attendance' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {

        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }

});


module.exports = router;
