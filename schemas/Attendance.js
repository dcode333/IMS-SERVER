const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    present: {
        type: Boolean,
        required: true,
    },
});

const studentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    attendance: {
        type: [studentAttendanceSchema],
        default: [],
    },
});

const courseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    attendancePercentage: {
        type: String,
    },
    students: {
        type: [studentSchema],
        default: [],
    },
});

const Attendance = mongoose.model('Attendance', courseSchema);

module.exports = Attendance;
