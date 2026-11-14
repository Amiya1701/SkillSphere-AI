const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// Get assessment questions
router.get("/questions", auth, async (req, res) => {
  try {
    const [questions] = await db.query(`
      SELECT
        id,
        technology_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        difficulty
      FROM assessment_questions
      ORDER BY RAND()
      LIMIT 15
    `);

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to load assessment"
    });
  }
});

// Submit assessment
router.post("/submit", auth, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        message: "Answers are required"
      });
    }

    const questionIds = Object.keys(answers);

    if (!questionIds.length) {
      return res.status(400).json({
        message: "No answers submitted"
      });
    }

    const placeholders = questionIds.map(() => "?").join(",");

    const [questions] = await db.query(
      `SELECT id, technology_id, correct_option
       FROM assessment_questions
       WHERE id IN (${placeholders})`,
      questionIds
    );

    const results = {};

    for (const question of questions) {
      if (!results[question.technology_id]) {
        results[question.technology_id] = {
          score: 0,
          total: 0
        };
      }

      results[question.technology_id].total++;

      if (answers[question.id] === question.correct_option) {
        results[question.technology_id].score++;
      }
    }

    const recommendations = [];

    for (const technologyId of Object.keys(results)) {
      const result = results[technologyId];

      const percentage =
        result.total === 0
          ? 0
          : Math.round((result.score / result.total) * 100);

      let level = "Beginner";

      if (percentage >= 75) {
        level = "Advanced";
      } else if (percentage >= 50) {
        level = "Intermediate";
      }

      await db.query(
        `INSERT INTO assessment_results
         (user_id, technology_id, score, total_questions, level)
         VALUES (?, ?, ?, ?, ?)`,
        [
          req.user.id,
          technologyId,
          result.score,
          result.total,
          level
        ]
      );

      const [technology] = await db.query(
        `SELECT name, slug
         FROM technologies
         WHERE id = ?`,
        [technologyId]
      );

      if (technology.length) {
        recommendations.push({
          technology: technology[0].name,
          slug: technology[0].slug,
          score: result.score,
          total: result.total,
          percentage,
          level
        });
      }
    }

    res.json({
      message: "Assessment completed",
      recommendations
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Assessment submission failed"
    });
  }
});

module.exports = router;