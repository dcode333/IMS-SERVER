const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Upcoming Activity
const activitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: String, // You can use a more appropriate data type for time if needed
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Upcoming', // Set a default value if needed
  },
});

// Create a model for the schema
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
