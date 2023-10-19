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
    courseCode: {
        type: String,
        required: true,
    },
});

const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema);

module.exports = CourseMaterial;
