
const mongoose = require('mongoose');

function getDate(daysAhead) {
    const currentDate = new Date();
    const threeDaysFromNow = new Date(currentDate);
    threeDaysFromNow.setDate(currentDate.getDate() + daysAhead)
    return threeDaysFromNow.toLocaleDateString();
}

const submissionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to the Student model
        required: true,
    },
    submissionDate: {
        type: Date,
        default: getDate(0), // Use the `Date.now` function to set the default date
    },
    doc: {
        type: String,
        required: true,
    },
});

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true,
    },
    startDate: {
        type: Date,
        default: getDate(0), // Use the `Date.now` function to set the default date
    },
    endDate: {
        type: Date,
        default: getDate(2), // Use the `Date.now` function to set the default date
    },
    doc: {
        type: String,
    },
    submissions: [submissionSchema],
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
