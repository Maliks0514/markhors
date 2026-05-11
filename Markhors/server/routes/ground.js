const express = require("express");
const multer = require("multer");
const path = require("path");
const GroundBooking = require("../models/GroundBooking");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Helper function to check if two time ranges overlap
const timeRangesOverlap = (start1, end1, start2, end2) => {
  const s1 = new Date(`2000-01-01T${start1}`);
  const e1 = new Date(`2000-01-01T${end1}`);
  const s2 = new Date(`2000-01-01T${start2}`);
  const e2 = new Date(`2000-01-01T${end2}`);

  return s1 < e2 && s2 < e1;
};

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await GroundBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Create new booking
router.post("/", upload.single("feeReceipt"), async (req, res) => {
  try {
    const { name, cnic, contactNumber, date, timeFrom, timeTo } = req.body;

    // Validate required fields with detailed error messages
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!cnic) {
      return res.status(400).json({ message: "CNIC is required" });
    }
    if (!contactNumber) {
      return res.status(400).json({ message: "Contact number is required" });
    }
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
    if (!timeFrom) {
      return res.status(400).json({ message: "Start time is required" });
    }
    if (!timeTo) {
      return res.status(400).json({ message: "End time is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Fee receipt image is required" });
    }

    // Validate time range
    if (timeFrom >= timeTo) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const bookingDate = new Date(date);
    const feeReceiptPath = `/uploads/${req.file.filename}`;
    const feeReceiptUrl = `${req.protocol}://${req.get("host")}${feeReceiptPath}`;

    // Check for overlapping bookings on the same date with same time range
    const bookingDateStart = new Date(bookingDate);
    bookingDateStart.setHours(0, 0, 0, 0);
    const bookingDateEnd = new Date(bookingDate);
    bookingDateEnd.setHours(23, 59, 59, 999);

    const existingBookings = await GroundBooking.find({
      date: {
        $gte: bookingDateStart,
        $lte: bookingDateEnd
      },
      status: { $in: ["pending", "confirmed"] }
    });

    for (const booking of existingBookings) {
      if (timeRangesOverlap(timeFrom, timeTo, booking.timeFrom, booking.timeTo)) {
        return res.status(409).json({
          message: "This time slot overlaps with an existing booking"
        });
      }
    }

    const newBooking = new GroundBooking({
      name,
      cnic,
      contactNumber,
      feeReceiptUrl,
      date: bookingDate,
      timeFrom,
      timeTo,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    if (error.code === 11000) {
      res.status(409).json({ message: "This time slot is already booked" });
    } else {
      res.status(500).json({ message: error.message || "Failed to create booking" });
    }
  }
});

// Update booking status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedBooking = await GroundBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
});

// Delete booking
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await GroundBooking.findByIdAndDelete(id);
    res.json({ message: "Booking deleted" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
});

module.exports = router;
