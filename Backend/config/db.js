const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log("MongoDB Atlas Connected");
    console.log("MongoDB connection state:", mongoose.connection.readyState);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;