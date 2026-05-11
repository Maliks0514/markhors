const mongoose = require("mongoose");

const academyEnrollmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 5,
      max: 100,
    },
    position: {
      type: String,
      required: true,
    },
    cnicBForm: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademyEnrollment", academyEnrollmentSchema);
