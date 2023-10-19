const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Attendance = new Schema({
    attendance: {
        type: Boolean,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    course: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: new Date().toLocaleDateString() // Use the `Date.now` function to set the default date
    }
}, { timestamps: true });

const Course = mongoose.model('Attendance', Attendance);

module.exports = Course;
