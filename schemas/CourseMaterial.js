const mongoose = require('mongoose');

const courseMaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    doc: {
        type: String, // Assuming you store the document's path or URL
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },

});

const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema);

module.exports = CourseMaterial;
