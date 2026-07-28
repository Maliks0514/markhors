const express = require("express");
const multer = require("multer");
const Banner = require("../models/Banner");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const toDataUrl = (file) => {
  if (!file || !file.buffer) {
    return null;
  }

  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

router.get("/", async (req, res) => {
  try {
    let banner = await Banner.findOne();
    if (!banner) {
      banner = await Banner.create({});
    }
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/", upload.fields([
  { name: "image0", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]), async (req, res) => {
  try {
    const existingBanner = await Banner.findOne();
    const existingSlides = existingBanner?.slides || [];

    const slides = [0, 1, 2].map((index) => {
      const title = req.body[`title${index}`] || existingSlides[index]?.title || "";
      const subtitle = req.body[`subtitle${index}`] || existingSlides[index]?.subtitle || "";
      const existingImage = req.body[`existingImage${index}`] || existingSlides[index]?.image || "/main-banner.png";
      const file = req.files?.[`image${index}`]?.[0];
      const image = toDataUrl(file) || existingImage;

      return { title, subtitle, image };
    });

    const updatedBanner = await Banner.findOneAndUpdate(
      {},
      { slides },
      { new: true, upsert: true }
    );

    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
