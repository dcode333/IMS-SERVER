const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to the Student model
        required: true,
    },
    obtainedMarks: {
        type: Number,
        required: true,
    },
    totalMarks: {
        type: Number,
        default: 100,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true,
    },
    exam: {
        type: String,
        enum: ['assignment', 'quiz', 's1', 's2', 'terminal'],
        required: true,
    },
});

const Marks = mongoose.model('Marks', marksSchema);

module.exports = Marks;
