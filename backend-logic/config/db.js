const mongoose = require("mongoose");

const TARGET_DB_NAME = "LogicalSystem";

// Disable command buffering so operations fail fast when offline instead of hanging
mongoose.set("bufferCommands", false);

/**
 * Connect to MongoDB Atlas (LogicalSystem database)
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes("admin:admin123@cluster0")) {
    console.log(`[MongoDB Info] Notice: MONGO_URI in .env is using default placeholder.`);
    console.log(`[MongoDB Info] To persist directly to your live Atlas cluster, update MONGO_URI in backend-logic/.env.`);
  }

  try {
    console.log(`[MongoDB] Connecting to database: ${TARGET_DB_NAME}...`);

    await mongoose.connect(uri || "mongodb://localhost:27017/LogicalSystem", {
      dbName: TARGET_DB_NAME,
      serverSelectionTimeoutMS: 3000
    });

    console.log(`[MongoDB] Successfully connected to MongoDB Atlas database: ${TARGET_DB_NAME}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB Atlas: ${error.message}`);
    console.warn(`[MongoDB Warning] In-memory student store active. Update backend-logic/.env with your valid MongoDB Atlas connection string when ready.`);
  }
}

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isDbConnected, TARGET_DB_NAME };
