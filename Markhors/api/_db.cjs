const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/markhors";

if (!MONGODB_URI) {
  throw new Error("Missing required MONGODB_URI environment variable");
}

let cached = global.__mongoose;

async function connectDB() {
  if (cached && cached.conn) {
    return cached.conn;
  }

  mongoose.set("strictQuery", false);

  const conn = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cached = { conn };
  global.__mongoose = cached;

  try {
    const GroundBooking = require("../server/models/GroundBooking");
    if (typeof GroundBooking.syncIndexes === "function") {
      await GroundBooking.syncIndexes();
      console.log("✅ GroundBooking indexes synchronized");
    }
  } catch (syncError) {
    console.warn("Index sync warning:", syncError.message);
  }

  return conn;
}

module.exports = connectDB;
