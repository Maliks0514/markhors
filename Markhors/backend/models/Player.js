const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      default: "Player",
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "/main-banner.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
