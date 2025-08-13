import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // Explicit path
import cookieParser from "cookie-parser";

// imported files
import v1Router from "./routes/v1/index.js";
import mongoose from "mongoose";
import cors from "cors";
import { app, server } from "./lib/socket-wss.js";
import path from "path";

// const app = express();
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Put this BEFORE your API routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

// API routes
app.use("/api/v1", v1Router);

// Catch-all route (AFTER API routes)
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

const connectToDB = () => {
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

// Add this at the end of your index.js (before listen)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

server.listen(PORT, () => {
  console.log("Server is running on port : ", PORT);
  connectToDB();
});
