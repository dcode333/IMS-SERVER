const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, { timestamps: true });


const UserSchema = mongoose.Schema({
  name: {
    type: String,
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
  courses: [coursesSchema]

}, { timestamps: true });

UserSchema.index({ email: 1, type: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true }, type: { $exists: true } } });


module.exports = mongoose.model("Teacher", UserSchema);
