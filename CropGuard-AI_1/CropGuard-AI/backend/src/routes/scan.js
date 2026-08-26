const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const dbReady = require("../db");
const { requireAuth } = require("../auth");
const { predict } = require("../../../ai-model/inference");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
const ALLOWED_MIME = new Set(["image/jpeg", "image/png"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only .jpg, .jpeg, .png images are allowed"));
    }
    cb(null, true);
  },
});

router.post("/analyze", requireAuth, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ detail: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ detail: "Image file is required" });
    }
    if (!req.body.crop_name) {
      return res.status(422).json({ detail: "crop_name is required" });
    }

    try {
      const db = await dbReady;
      const cropName = req.body.crop_name;
      const result = predict(req.file.path, cropName);

      const info = db
        .prepare(
          `INSERT INTO disease_reports
           (user_id, crop_name, image_path, predicted_disease, confidence, severity, recommendation)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          req.user.id,
          cropName,
          req.file.path,
          result.disease,
          result.confidence,
          result.severity,
          result.recommendation
        );

      const report = db
        .prepare("SELECT * FROM disease_reports WHERE id = ?")
        .get(info.lastInsertRowid);

      res.json({
        id: report.id,
        crop_name: report.crop_name,
        predicted_disease: report.predicted_disease,
        confidence: report.confidence,
        severity: report.severity,
        recommendation: report.recommendation,
        created_at: report.created_at,
      });
    } catch (error) {
      console.error("Analyze error:", error);
      res.status(500).json({ detail: "Internal server error" });
    }
  });
});

router.get("/history", requireAuth, async (req, res) => {
  try {
    const db = await dbReady;
    const reports = db
      .prepare("SELECT * FROM disease_reports WHERE user_id = ? ORDER BY created_at DESC")
      .all(req.user.id)
      .map((r) => ({
        id: r.id,
        crop_name: r.crop_name,
        predicted_disease: r.predicted_disease,
        confidence: r.confidence,
        severity: r.severity,
        recommendation: r.recommendation,
        created_at: r.created_at,
      }));

    res.json(reports);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
