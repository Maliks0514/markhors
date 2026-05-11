const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/markhors";

const GroundBooking = require("./models/GroundBooking");

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB successfully");
    
    // Drop old indexes and sync new ones
    try {
      const collection = mongoose.connection.collection("groundbookings");
      const indexes = await collection.getIndexes();
      
      // Drop the old date_1_time_1 index if it exists
      if (indexes.date_1_time_1) {
        await collection.dropIndex("date_1_time_1");
        console.log("🔄 Dropped old date_1_time_1 index");
      }
      
      // Sync indexes for GroundBooking model
      await GroundBooking.collection.syncIndexes();
      console.log("✅ Ground Booking indexes synchronized");
    } catch (indexError) {
      console.error("Index sync warning (non-critical):", indexError.message);
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// Routes
app.use("/api/videos", require("./routes/videos"));
app.use("/api/articles", require("./routes/articles"));
app.use("/api/players", require("./routes/players"));
app.use("/api/academy", require("./routes/academy"));
app.use("/api/ground", require("./routes/ground"));

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
