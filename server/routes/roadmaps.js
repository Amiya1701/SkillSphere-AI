const router = require("express").Router();
const db = require("../config/db");

router.get("/topic/:id", async (req, res) => {
  const [topics] = await db.query(
    `SELECT rt.*, t.name AS technology_name, t.slug AS technology_slug
     FROM roadmap_topics rt JOIN technologies t ON t.id = rt.technology_id
     WHERE rt.id = ?`, [req.params.id]
  );
  if (!topics.length) return res.status(404).json({ message: "Topic not found" });

  const [resources] = await db.query(
    "SELECT * FROM resources WHERE topic_id = ? ORDER BY type, title", [req.params.id]
  );
  res.json({ topic: topics[0], resources });
});

module.exports = router;
