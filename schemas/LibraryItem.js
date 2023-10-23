const mongoose = require('mongoose');

const libraryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  publisherName: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true, // Ensure ISBNs are unique
  },
  category: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true, // Default availability is true (available)
  },
  language: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },

});

const LibraryItem = mongoose.model('LibraryItem', libraryItemSchema);

module.exports = LibraryItem;
