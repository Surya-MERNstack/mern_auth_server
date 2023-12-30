import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./route/user.route.js";
import authRoute from "./route/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://mernauths.netlify.app"],
    credentials: true,
  })
);


mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("mongoose is connected");
  })
  .catch((err) => { 
    console.log(err);
  });
app.get("/", (req, res) => {
  res.send("<h1>sam what are you going</h1>");
});

app.use("/user", userRoute);
app.use("/auth", authRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
     message,
    statusCode,  
  });   
});

app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
