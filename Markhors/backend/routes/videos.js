const express = require("express");
const router = express.Router();
const multer = require("multer");
const Video = require("../models/Video");

const upload = multer({ storage: multer.memoryStorage() });

const toDataUrl = (file) => {
  if (!file || !file.buffer) return null;
  return `data:${file.mimetype || "application/octet-stream"};base64,${file.buffer.toString("base64")}`;
};

// GET all videos with optional category filter
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category && category !== "all") {
      query.category = category;
    }
    
    const videos = await Video.find(query).select("-videoUrl").sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single video by ID
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    video.views += 1;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new video
router.post("/", upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      title,
      category,
      date,
      duration,
      description,
      fileSize,
    } = req.body;
    const videoFile = req.files.video?.[0];
    const thumbnailFile = req.files.thumbnail?.[0];

    const fullVideoUrl = toDataUrl(videoFile) || req.body.videoUrl;
    const fullThumbnailUrl = toDataUrl(thumbnailFile) || req.body.thumbnailUrl;

    const video = new Video({
      title,
      category,
      date,
      duration,
      description,
      videoUrl: fullVideoUrl,
      thumbnailUrl: fullThumbnailUrl,
      fileSize,
    });

    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE video
router.put("/:id", upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      title,
      category,
      date,
      duration,
      description,
      videoUrl,
      thumbnailUrl,
    } = req.body;
    const videoFile = req.files.video?.[0];
    const thumbnailFile = req.files.thumbnail?.[0];

    const updatedVideo = {
      title,
      category,
      date,
      duration,
      description,
      videoUrl: toDataUrl(videoFile) || videoUrl,
      thumbnailUrl: toDataUrl(thumbnailFile) || thumbnailUrl,
    };

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      updatedVideo,
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE video
router.delete("/:id", async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
