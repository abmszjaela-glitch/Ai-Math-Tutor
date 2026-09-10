const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const prisma = require("./config/prisma");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const avatarRoutes = require("./routes/avatarRoutes");
const curriculumRoutes = require("./routes/curriculumRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Math Tutor backend is running",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT current_database() AS database
    `;

    res.json({
      success: true,
      message: "Database connection successful",
      database: result[0].database,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/avatars", avatarRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/progress", progressRoutes);

module.exports = app;
