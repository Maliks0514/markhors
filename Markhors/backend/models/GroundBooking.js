const mongoose = require("mongoose");

const groundBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    feeReceiptUrl: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeFrom: {
      type: String,
      required: true,
    },
    timeTo: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: false,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Compound index to prevent overlapping bookings on the same date
// This ensures no two bookings can overlap in time on the same day
groundBookingSchema.index({ date: 1, timeFrom: 1, timeTo: 1 });

module.exports = mongoose.model("GroundBooking", groundBookingSchema);
