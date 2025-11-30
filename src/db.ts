import mongoose from "mongoose";

/**
 * Conecta no MongoDB usando mongoose.
 * @param uri string de conexão Mongo (mongodb://...)
 */
export async function connectDB(uri: string) {
  if (!uri) throw new Error("MONGO_URI not provided");
  // Evita warnings com queries no mongoose
  mongoose.set("strictQuery", false);
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}
