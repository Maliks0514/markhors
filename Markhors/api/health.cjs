const connectDB = require("./_db.cjs");

module.exports = async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({ status: "OK", message: "Chitral Markhors API is running" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};
