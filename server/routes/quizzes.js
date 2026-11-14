const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/topic/:topicId", async (req, res) => {
  const [questions] = await db.query(
    "SELECT id, question, option_a, option_b, option_c, option_d FROM quiz_questions WHERE topic_id = ? ORDER BY id",
    [req.params.topicId]
  );
  res.json(questions);
});

router.post("/submit", auth, async (req, res) => {
  const { topicId, answers = {} } = req.body;
  const [questions] = await db.query("SELECT id, correct_option FROM quiz_questions WHERE topic_id = ?", [topicId]);

  let score = 0;
  for (const q of questions) if (answers[q.id] === q.correct_option) score++;

  await db.query(
    `INSERT INTO quiz_results (user_id,topic_id,score,total_questions)
     VALUES (?,?,?,?)`,
    [req.user.id, topicId, score, questions.length]
  );

  res.json({ score, total: questions.length, percentage: questions.length ? Math.round(score / questions.length * 100) : 0 });
});

module.exports = router;
