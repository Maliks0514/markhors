const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

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
router.post("/", async (req, res) => {
  try {
    const { title, category, date, excerpt, content, image } = req.body;
    
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
router.put("/:id", async (req, res) => {
  try {
    const { title, category, date, excerpt, content, image } = req.body;
    
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        date,
        excerpt,
        content,
        image,
      },
      { new: true }
    );
    
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
