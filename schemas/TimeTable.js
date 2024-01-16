const mongoose = require('mongoose');


// Create a schema for the timetable entry
const timeTableEntrySchema = new mongoose.Schema({
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
    courseId: {
        type: String,
        required: true,
    },
    teacherId: {
        type: String,
        required: true,
    },
});

const timeTableSchema = new mongoose.Schema({

    timetable: [timeTableEntrySchema]

}, { timestamps: true });

// Create a compound index to ensure uniqueness of room, time, and day combination
timeTableSchema.index({ room: 1, time: 1, day: 1, courseId: 1 }, { unique: true });

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;