import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = () => {
  mongoose
    .connect(process.env.connection_string)
    .then(() => console.log("DB Connected!"));
};
