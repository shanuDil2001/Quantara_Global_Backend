import mongoose from "mongoose";
import { env } from "./envValidator.js";


export default async function connectToMongoDB() {
  try {
    mongoose.connect(`${env.MONGO_URI}`);
    console.log(`Successfully connected to MongoDB!`);
  } catch (error) {
    console.log(`Connection failed!`);
    console.error(error);
  }
}