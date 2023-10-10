import express from "express";
import cors from "cors";
import os from "node:os";
import mongoose from "mongoose";
import 'dotenv/config';
import chalk from "chalk";
const app = express();
app.use(express.urlencoded({ extended: true }));
import fs from "fs";
app.use(express.json());
const PORT = process.env.PORT || 3500;
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// import { handler } from "file://D:/projects/JTVServer github/WEB/build/handler.js";

// let networkInterfaces = os.networkInterfaces();
// let ip = networkInterfaces["eth0"][0]["address"];
// fs["writeFileSync"]("./ipData.jiotv", ip);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  })

if (!fs.existsSync("channel.db")) {
  fs["writeFileSync"]("./channel.db", '{"channel": {}}');
}

if (!fs.existsSync("channel-catchup.db")) {
  fs["writeFileSync"]("./channel-catchup.db", '{"channel": {}}');
}

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.use(cors());

import loginRoute from "./routes/login.mjs";
import ipRoute from "./routes/ip.mjs";
import channelsRoute from "./routes/channel.mjs";
import playlistRoute from "./routes/playlist.mjs";

app.use("/", loginRoute);
app.use("/", ipRoute);
app.use("/", channelsRoute);
app.use("/", playlistRoute);

// app.use(express.static(path.join(__dirname, "public")));
app.get("/favicon.ico", (req, res) => {
  return res.sendFile(path.join(__dirname + "/public/favicon.ico"));
});

app.listen(PORT, () => {
  console.log(
    "==================================================================="
  );
});
