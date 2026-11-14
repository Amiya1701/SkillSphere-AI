const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const {
      technology_id,
      target_level,
      hours_per_week,
      target_date
    } = req.body;

    if (!technology_id) {
      return res.status(400).json({
        message: "Technology is required"
      });
    }

    await db.query(
      `INSERT INTO user_goals
       (user_id, technology_id, target_level,
        hours_per_week, target_date)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,
        technology_id,
        target_level || "Beginner",
        hours_per_week || 7,
        target_date || null
      ]
    );

    res.status(201).json({
      message: "Learning goal created"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create learning goal"
    });
  }
});


router.get("/", auth, async (req, res) => {
  try {
    const [goals] = await db.query(
      `SELECT
          ug.id,
          ug.target_level,
          ug.hours_per_week,
          ug.target_date,
          t.id AS technology_id,
          t.name,
          t.slug
       FROM user_goals ug
       JOIN technologies t
         ON ug.technology_id = t.id
       WHERE ug.user_id = ?
       ORDER BY ug.created_at DESC`,
      [req.user.id]
    );

    res.json(goals);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load goals"
    });
  }
});


module.exports = router;