/**
 * Auth helpers: JWT signing/verification + an Express middleware that
 * protects routes by checking the "Authorization: Bearer <token>" header.
 *
 * SECRET_KEY here is a demo placeholder — set a real value via the
 * JWT_SECRET environment variable before deploying anywhere public.
 */
const jwt = require("jsonwebtoken");
const db = require("./db");

const SECRET_KEY = process.env.JWT_SECRET || "cropguard-demo-secret-change-me";
const TOKEN_EXPIRY = "24h";

function createToken(userId) {
  return jwt.sign({ sub: String(userId) }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ detail: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(payload.sub);
    if (!user) {
      return res.status(401).json({ detail: "Could not validate credentials" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ detail: "Could not validate credentials" });
  }
}

module.exports = { createToken, requireAuth };
