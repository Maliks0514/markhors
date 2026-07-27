const express = require("express");
const multer = require("multer");
const Player = require("../models/Player");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

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

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const imageUrl = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : req.body.image || req.body.imageUrl || "/main-banner.png";

    const newPlayer = new Player({
      name,
      position: position || "Player",
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

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, position, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const updateData = {
      name,
      position: position || "Player",
      description,
    };

    if (req.file) {
      updateData.imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    } else if (req.body.image || req.body.imageUrl) {
      updateData.imageUrl = req.body.image || req.body.imageUrl;
    }

    const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(updatedPlayer);
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({ message: "Failed to update player" });
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
