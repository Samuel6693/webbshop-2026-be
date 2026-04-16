import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  // Check if already connected to avoid multiple connections in development
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
