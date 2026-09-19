const mongoose = require("mongoose");

// Both paradigm backends intentionally share this database and collection.
const TARGET_DB_NAME = "LogicalSystem";

// Fail database operations quickly instead of leaving requests waiting forever.
mongoose.set("bufferCommands", false);

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/LogicalSystem";

  try {
    // dbName ensures the same connection string can target the paradigm database.
    console.log(`[MongoDB] Connecting to database: ${TARGET_DB_NAME}...`);
    await mongoose.connect(uri, {
      dbName: TARGET_DB_NAME,
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Successfully connected to ${TARGET_DB_NAME}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] ${error.message}`);
    console.warn("[MongoDB Warning] In-memory student storage is active.");
  }
}

function isDbConnected() {
  // Mongoose state 1 means the connection is currently open.
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isDbConnected, TARGET_DB_NAME };
