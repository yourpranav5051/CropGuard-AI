const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./src/routes/auth");
const scanRoutes = require("./src/routes/scan");

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Path to the frontend directory (one level up, then into frontend/)
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

const app = express();

// Wide-open CORS for local dev / demo day. Tighten before any real deployment.
app.use(cors());
app.use(express.json());

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);

// --- Serve uploaded files ---
app.use("/uploads", express.static(UPLOAD_DIR));

// --- Serve the frontend UI ---
app.use(express.static(FRONTEND_DIR));

// Catch-all: any route that doesn't match an API or static file serves index.html
app.get("*", (req, res) => {
  const requestedFile = path.join(FRONTEND_DIR, req.path);
  if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    return res.sendFile(requestedFile);
  }
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`CropGuard AI running on http://127.0.0.1:${PORT}`);
  console.log(`  Frontend : http://127.0.0.1:${PORT}`);
  console.log(`  API      : http://127.0.0.1:${PORT}/api`);
});
