const router = require("express").Router();
const OpenAI = require("openai");
const auth = require("../middleware/auth");

router.post("/ask", auth, async (req, res) => {
  const { question, topic, technology } = req.body;
  if (!question) return res.status(400).json({ message: "Question is required" });

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      answer: "AI assistant is configured but no API key is set. Add OPENAI_API_KEY to the server environment to enable live AI answers."
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: `You are SkillSphere AI, a patient engineering tutor. Explain concepts clearly for a college learner. Current technology: ${technology || "General"}. Current topic: ${topic || "General"}. Do not assume the learner knows advanced concepts. Use examples and short sections.`,
      input: question
    });

    res.json({ answer: response.output_text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "AI service failed" });
  }
});

module.exports = router;
