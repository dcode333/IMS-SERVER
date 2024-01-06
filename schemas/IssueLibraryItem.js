const mongoose = require('mongoose');

const issueLibraryItemSchema = new mongoose.Schema({
    libraryItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LibraryItem',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'pending',
    },
}, { timestamps: true });

// Ensure unique pairs of libraryItemId and studentId
issueLibraryItemSchema.index({ libraryItemId: 1, studentId: 1 }, { unique: true });

const IssueLibraryItem = mongoose.model('IssueLibraryItem', issueLibraryItemSchema);

module.exports = IssueLibraryItem;
