const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
const GroundBooking = require("./models/GroundBooking");

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || true,
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("trust proxy", 1);

let connectPromise = null;

const connectToMongo = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to backend/.env for production deployment.");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectPromise) {
    connectPromise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(async () => {
        console.log("✅ Connected to MongoDB successfully");

        try {
          const collection = mongoose.connection.collection("groundbookings");
          const indexes = await collection.getIndexes();

          if (indexes.date_1_time_1) {
            await collection.dropIndex("date_1_time_1");
            console.log("🔄 Dropped old date_1_time_1 index");
          }

          if (typeof GroundBooking.syncIndexes === "function") {
            await GroundBooking.syncIndexes();
            console.log("✅ Ground Booking indexes synchronized");
          } else if (
            GroundBooking.collection &&
            typeof GroundBooking.collection.syncIndexes === "function"
          ) {
            await GroundBooking.collection.syncIndexes();
            console.log("✅ Ground Booking collection indexes synchronized");
          } else {
            console.warn("Index sync not available for GroundBooking model");
          }
        } catch (indexError) {
          console.error("Index sync warning (non-critical):", indexError.message);
        }
      });
  }

  await connectPromise;
};

app.use(async (req, res, next) => {
  try {
    await connectToMongo();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use("/api/videos", require("./routes/videos"));
app.use("/api/articles", require("./routes/articles"));
app.use("/api/players", require("./routes/players"));
app.use("/api/academy", require("./routes/academy"));
app.use("/api/ground", require("./routes/ground"));
app.use("/api/tours", require("./routes/tours"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Chitral Markhors API is running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== "1" && require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
