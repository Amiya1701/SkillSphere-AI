require("dotenv").config();
const goalRoutes = require("./routes/goals");

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const technologyRoutes = require("./routes/technologies");
const roadmapRoutes = require("./routes/roadmaps");
const assessmentRoutes = require("./routes/assessment");
const quizRoutes = require("./routes/quizzes");
const progressRoutes = require("./routes/progress");
const aiRoutes = require("./routes/ai");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "SkillSphere AI API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/technologies", technologyRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/goals", goalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SkillSphere API running on ${PORT}`);
});
