const express = require("express");
const multer = require("multer");
const path = require("path");
const Player = require("../models/Player");

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

router.get("/", async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ message: "Failed to fetch players" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, position, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "/main-banner.png";
    const imageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;

    const newPlayer = new Player({
      name,
      position,
      description,
      imageUrl,
    });

    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({ message: "Failed to create player" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Player.findByIdAndDelete(id);
    res.json({ message: "Player deleted" });
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({ message: "Failed to delete player" });
  }
});

module.exports = router;
