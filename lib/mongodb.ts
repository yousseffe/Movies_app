import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

// Only throw an error in production environment and when actually connecting
// This allows the build process to complete
if (!MONGODB_URI && process.env.NODE_ENV === "production") {
  console.warn("No MONGODB_URI provided. Database connections will fail.")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export default async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using cached database connection")
    return cached.conn
  }

  if (!cached.promise) {
    console.log("Connecting to MongoDB...")

    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable")
    }

    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully")

      // Force model compilation to ensure schemas are registered
      // Import all models here to ensure they're registered before use
      require("@/models/Genre")
      require("@/models/Movie")
      require("@/models/User")
      require("@/models/Language")
      require("@/models/Watchlist")
      require("@/models/MovieRequest")

      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("MongoDB connection error:", e)
    throw e
  }

  return cached.conn
}

