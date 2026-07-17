const mongoose = require("mongoose");

const tourBookingSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    tourTitle: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    idCardNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    paymentReceiptUrl: {
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
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TourBooking", tourBookingSchema);
