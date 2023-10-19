const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Attendance = new Schema({
    attendance: {
        type: Number,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
}, { timestamps: true });

const Course = mongoose.model('CouseAttendance', Attendance);

module.exports = Course;
