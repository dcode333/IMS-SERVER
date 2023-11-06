const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,

    },
    time: {
        type: String,
        required: true,

    },
    day: {
        type: String,
        required: true,

    },
    teacherName: {
        type: String,
        required: true,

    },
});

// Create a compound index to ensure uniqueness of room, time, and day combination
timeTableSchema.index({ room: 1, time: 1, day: 1, courseCode: 1 }, { unique: true });

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;