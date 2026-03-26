const mongoose = require("mongoose");
const env = require("./env");

async function connectDb() {
  if (env.demoMode) {
    console.log("[db] Demo mode enabled. Using in-memory data store.");
    return;
  }

  try {
    await mongoose.connect(env.mongodbUri);
    console.log("[db] Connected to MongoDB");
  } catch (error) {
    console.error("[db] MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = { connectDb };
