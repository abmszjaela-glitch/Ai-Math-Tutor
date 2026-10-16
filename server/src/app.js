const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const avatarRoutes = require("./routes/avatarRoutes");
const curriculumRoutes = require("./routes/curriculumRoutes");
const progressRoutes = require("./routes/progressRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const tutorRoutes = require("./routes/tutorRoutes");

const app = express();

app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim()),
    credentials: true,
  })
);

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Math Tutor backend is running",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/avatars", avatarRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api", messageRoutes);
app.use("/api/tutor", tutorRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: "API route not found" }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  res.status(status).json({ success: false, message: status === 400 ? "Invalid JSON request" : status === 413 ? "Request body is too large" : "Request failed" });
});
module.exports = app;
