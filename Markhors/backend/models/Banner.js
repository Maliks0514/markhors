const mongoose = require("mongoose");

const SlideSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  image: { type: String, default: "/main-banner.png" },
});

const BannerSchema = new mongoose.Schema(
  {
    slides: {
      type: [SlideSchema],
      default: [
        { title: "Chitral Markhors", subtitle: "Strength From The Mountains", image: "/8.jpg" },
        { title: "Our Home Our Pride", subtitle: "Representing Chitral With Passion", image: "/9.jpg" },
        { title: "One Team One Dream", subtitle: "Together We Fight Together We Win", image: "/11.jpg" },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);
