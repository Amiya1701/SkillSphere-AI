const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.topic_id, p.completed, p.updated_at, rt.title, t.name AS technology
     FROM user_progress p
     JOIN roadmap_topics rt ON rt.id=p.topic_id
     JOIN technologies t ON t.id=rt.technology_id
     WHERE p.user_id=? ORDER BY p.updated_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

router.post("/topic/:topicId", auth, async (req, res) => {
  const completed = req.body.completed ? 1 : 0;
  await db.query(
    `INSERT INTO user_progress (user_id,topic_id,completed)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE completed=VALUES(completed), updated_at=CURRENT_TIMESTAMP`,
    [req.user.id, req.params.topicId, completed]
  );
  res.json({ message: "Progress updated", completed: !!completed });
});

module.exports = router;
