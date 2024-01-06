const mongoose = require("mongoose");



const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  beltNo: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  contactNo: {
    type: String,
    required: true,
  },
  homeNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  designation: {
    type: String,
    required: true,
  },
  courseId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],

}, { timestamps: true });

UserSchema.index({ email: 1, type: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true }, type: { $exists: true } } });


module.exports = mongoose.model("Teacher", UserSchema);
