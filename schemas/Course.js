const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
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
    duration: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
