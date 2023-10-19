const mongoose = require("mongoose");


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
  rollNo: {
    type: String,
    required: true,
  },
  CourseId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],

}, { timestamps: true });

UserSchema.index({ email: 1, type: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true }, type: { $exists: true } } });


module.exports = mongoose.model("Student", UserSchema);
