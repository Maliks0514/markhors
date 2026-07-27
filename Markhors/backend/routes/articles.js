const express = require("express");
const multer = require("multer");
const router = express.Router();
const Article = require("../models/Article");

const upload = multer({ storage: multer.memoryStorage() });

const toDataUrl = (file) => {
  if (!file || !file.buffer) {
    return null;
  }

  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

// GET all articles with optional category filter
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single article by ID
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    // Increment views
    article.views += 1;
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new article
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, category, date, excerpt, content } = req.body;
    const image = toDataUrl(req.file) || req.body.image || "/main-banner.png";

    const article = new Article({
      title,
      category,
      date,
      excerpt,
      content,
      image,
    });

    const savedArticle = await article.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE article
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, category, date, excerpt, content } = req.body;
    const image = toDataUrl(req.file) || req.body.image;

    const updateData = {
      title,
      category,
      date,
      excerpt,
      content,
    };

    if (image) {
      updateData.image = image;
    }

    const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE article
router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
