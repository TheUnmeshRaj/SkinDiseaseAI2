import mongoose from "mongoose";
import express from "express";
import { Auth } from "./server.js"; 
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
const PORT = 3002;
app.use(cors());
app.use(bodyParser.json());

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/UserAuthentication");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
};

app.post("/Register", (req, res) => {
  const { username,emailId, password } = req.body;

  Auth.findOne({ $or: [
    { username: username },
    { emailId: emailId }
  ]})
    .then((exists) => {
      if (exists) {
        return res.status(400).json({ err: "Username or Email ID already exists" }); 
      }
      const newAuth = new Auth({
        username,
        emailId,
        password,
      });
      return newAuth.save();
    })
    .then(() => {
      return res.status(201).json({ message: "User registered successfully" }); 
    })
    .catch((err) => {
      console.error("Error creating new user:", err);
      return res.status(500).json({ err: "Error creating new username and password" });
    });
});

app.post("/Login", (req, res) => {
  const { username,emailId, password } = req.body;

  Auth.findOne({ $or: [
    { username: username },
    { emailId: emailId }
  ]})
    .then((user) => {
      if (!user) {
        return res.status(404).json({ err: "User doesn't exist" });
      }
      if (user.password !== password) {
        return res.status(401).json({ err: "Password is incorrect" }); 
      }
      return res.status(200).json({ message: "Logged in successfully" });
    })
    .catch((err) => {
      console.error("Error validating username and password:", err);
      return res.status(500).json({ err: "Error validating username and password" });
    });
});
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
  });
});
