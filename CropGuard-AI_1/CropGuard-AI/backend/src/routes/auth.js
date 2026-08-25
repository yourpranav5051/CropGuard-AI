const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { createToken } = require("../auth");

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/register", (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(422).json({ detail: "name, email, and password are required" });
  }
  if (!isValidEmail(email)) {
    return res.status(422).json({ detail: "Invalid email address" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(400).json({ detail: "Email already registered" });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)")
    .run(name, email, hashed);

  const user = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(user);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(422).json({ detail: "email and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.hashed_password)) {
    return res.status(401).json({ detail: "Invalid email or password" });
  }

  const token = createToken(user.id);
  res.json({ access_token: token, token_type: "bearer" });
});

module.exports = router;
