const express = require("express");
const multer = require("multer");
const Tour = require("../models/Tour");
const TourBooking = require("../models/TourBooking");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const toDataUrl = (file) => {
  if (!file || !file.buffer) return null;
  return `data:${file.mimetype || "application/octet-stream"};base64,${file.buffer.toString("base64")}`;
};

const buildImageUrls = (req) => {
  if (!req.files || req.files.length === 0) {
    return [];
  }

  return req.files.map((file) => toDataUrl(file)).filter(Boolean);
};

router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ message: "Failed to fetch tours" });
  }
});

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const { title, venueName, description, advancePaymentDetails } = req.body;

    if (!title || !venueName || !description || !advancePaymentDetails) {
      return res.status(400).json({ message: "Please fill all tour details" });
    }

    const uploadedImages = buildImageUrls(req);
    const tour = new Tour({
      title,
      venueName,
      description,
      advancePaymentDetails,
      images: uploadedImages,
    });

    const savedTour = await tour.save();
    res.status(201).json(savedTour);
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(500).json({ message: "Failed to create tour" });
  }
});

router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    const { title, venueName, description, advancePaymentDetails } = req.body;
    const updatePayload = {
      title,
      venueName,
      description,
      advancePaymentDetails,
    };

    if (req.files && req.files.length > 0) {
      updatePayload.images = buildImageUrls(req);
    }

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.json(updatedTour);
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({ message: "Failed to update tour" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    await TourBooking.deleteMany({ tourId: req.params.id });
    res.json({ message: "Tour deleted" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({ message: "Failed to delete tour" });
  }
});

router.post("/:id/book", upload.single("paymentReceipt"), async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const { name, phoneNumber, idCardNumber, address, userEmail, userId } = req.body;
    if (!name || !phoneNumber || !idCardNumber || !address || !req.file) {
      return res.status(400).json({ message: "Please complete all required fields and upload a payment receipt" });
    }

    const paymentReceiptUrl = toDataUrl(req.file);

    const booking = new TourBooking({
      tourId: tour._id,
      tourTitle: tour.title,
      name,
      phoneNumber,
      idCardNumber,
      address,
      paymentReceiptUrl,
      userEmail: userEmail || undefined,
      userId: userId || undefined,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating tour booking:", error);
    res.status(500).json({ message: "Failed to submit tour booking" });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = {};
    if (userEmail) filter.userEmail = userEmail;
    const bookings = await TourBooking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching tour bookings:", error);
    res.status(500).json({ message: "Failed to fetch tour bookings" });
  }
});

router.put("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await TourBooking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: "Tour booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error updating tour booking status:", error);
    res.status(500).json({ message: "Failed to update tour booking" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    await TourBooking.findByIdAndDelete(req.params.id);
    res.json({ message: "Tour booking deleted" });
  } catch (error) {
    console.error("Error deleting tour booking:", error);
    res.status(500).json({ message: "Failed to delete tour booking" });
  }
});

module.exports = router;
