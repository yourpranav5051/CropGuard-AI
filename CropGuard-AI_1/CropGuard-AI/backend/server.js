const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./src/routes/auth");
const scanRoutes = require("./src/routes/scan");

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();

// Wide-open CORS for local dev / demo day. Tighten before any real deployment.
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);

app.get("/", (req, res) => {
  res.json({ status: "CropGuard AI backend running" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`CropGuard AI backend running on http://127.0.0.1:${PORT}`);
});
