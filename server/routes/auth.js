const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, level = "Beginner" } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(409).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      "INSERT INTO users (name,email,password_hash,level) VALUES (?,?,?,?)",
      [name, email.toLowerCase(), hash, level]
    );

    const token = jwt.sign({ id: result.insertId, email: email.toLowerCase(), name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: result.insertId, name, email: email.toLowerCase(), level } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT id,name,email,password_hash,level FROM users WHERE email = ?", [email?.toLowerCase()]);
    if (!rows.length) return res.status(401).json({ message: "Invalid email or password" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, level: user.level } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
