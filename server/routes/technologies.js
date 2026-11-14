const router = require("express").Router();
const db = require("../config/db");

router.get("/", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM technologies ORDER BY category, name");
  res.json(rows);
});

router.get("/:slug", async (req, res) => {
  const [tech] = await db.query("SELECT * FROM technologies WHERE slug = ?", [req.params.slug]);
  if (!tech.length) return res.status(404).json({ message: "Technology not found" });

  const [topics] = await db.query(
    "SELECT * FROM roadmap_topics WHERE technology_id = ? ORDER BY order_no",
    [tech[0].id]
  );
  res.json({ technology: tech[0], topics });
});

module.exports = router;
