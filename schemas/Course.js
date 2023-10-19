const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true, // Ensure that course codes are unique
    },
    name: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    strength: {
        type: Number,
        required: true,
    },

});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
