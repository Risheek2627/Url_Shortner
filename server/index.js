const express = require("express");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
const connectDB = require("./db/db");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 5000;

// Middleware and DB connection first
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// API Routes (FIRST)
app.use("/api", urlRoutes);

// Static Files (SECOND)
app.use(express.static(path.join(__dirname, "../client/dist")));

// SPA Catch-all (LAST - with API exclusion)
app.get(/^\/(?!api|static).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
