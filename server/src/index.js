import express from "express";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // Explicit path
import cookieParser from "cookie-parser";

// imported files
import v1Router from "./routes/v1/index.js";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || "5000";

app.use("/api/v1", v1Router);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is working",
  });
});

const connectToDB = () => {
  console.log("mongo url: " , process.env.mongoURI)
  const mongoUrl = process.env.mongoURI || "";
  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("MongoDB connected successfully!!");
    })
    .catch((e) => {
      console.error("Error while connection mongoDB: ", e);
    });
};

app.listen(PORT, () => {
  console.log("Server is running on port : ", PORT);
  connectToDB();
});
