const express = require("express");
const AcademyEnrollment = require("../models/AcademyEnrollment");

const router = express.Router();

// Get all enrollments
router.get("/", async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = {};
    if (userEmail) filter.userEmail = userEmail;
    const enrollments = await AcademyEnrollment.find(filter).sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
});

// Submit enrollment
router.post("/", async (req, res) => {
  try {
    const { name, fatherName, address, contactNumber, age, position, cnicBForm, userEmail, userId } = req.body;

    // Validate required fields
    if (!name || !fatherName || !address || !contactNumber || !age || !position || !cnicBForm) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEnrollment = new AcademyEnrollment({
      name,
      fatherName,
      address,
      contactNumber,
      age: parseInt(age),
      position,
      cnicBForm,
      userEmail: userEmail || undefined,
      userId: userId || undefined,
    });

    const savedEnrollment = await newEnrollment.save();
    res.status(201).json(savedEnrollment);
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(500).json({ message: "Failed to submit enrollment" });
  }
});

// Update enrollment status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedEnrollment = await AcademyEnrollment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedEnrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json(updatedEnrollment);
  } catch (error) {
    console.error("Error updating enrollment:", error);
    res.status(500).json({ message: "Failed to update enrollment" });
  }
});

// Delete enrollment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await AcademyEnrollment.findByIdAndDelete(id);
    res.json({ message: "Enrollment deleted" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    res.status(500).json({ message: "Failed to delete enrollment" });
  }
});

module.exports = router;
