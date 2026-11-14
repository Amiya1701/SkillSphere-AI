import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Trophy } from "lucide-react";
import { api } from "./api";

export default function Assessment() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/assessment/questions")
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function submitAssessment() {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer every question.");
      return;
    }

    try {
      const response = await api.post(
        "/assessment/submit",
        { answers }
      );

      setResult(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Assessment submission failed"
      );
    }
  }

  if (loading) {
    return (
      <div className="loading">
        Loading assessment...
      </div>
    );
  }

  if (result) {
    return (
      <section className="page narrow">
        <div className="result-card">
          <Trophy size={45} />

          <h2>Assessment Complete 🎉</h2>

          <p>
            Here is your current skill profile.
          </p>

          <div className="assessment-results">
            {result.recommendations.map(item => (
              <div
                className="assessment-result"
                key={item.slug}
              >
                <div>
                  <b>{item.technology}</b>

                  <span>
                    {item.score}/{item.total} correct
                  </span>
                </div>

                <strong>
                  {item.level}
                </strong>
              </div>
            ))}
          </div>

          <Link
            className="primary-btn"
            to="/goal-setup"
          >
            Create My Personalized Roadmap
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page narrow">

      <Link
        className="back"
        to="/dashboard"
      >
        ← Back to Dashboard
      </Link>

      <div className="section-head">
        <div className="eyebrow">
          SKILL ASSESSMENT
        </div>

        <h2>Discover your level</h2>

        <p>
          Answer the questions honestly. Your results
          will help SkillSphere recommend where to start.
        </p>
      </div>

      <div className="quiz-list">

        {questions.map((q, index) => (
          <div
            className="question"
            key={q.id}
          >

            <b>
              {index + 1}. {q.question}
            </b>

            {[
              ["A", q.option_a],
              ["B", q.option_b],
              ["C", q.option_c],
              ["D", q.option_d]
            ].map(([key, value]) => (

              <label
                className={
                  answers[q.id] === key
                    ? "option selected"
                    : "option"
                }
                key={key}
              >

                <input
                  type="radio"
                  name={`question-${q.id}`}
                  checked={
                    answers[q.id] === key
                  }
                  onChange={() =>
                    setAnswers({
                      ...answers,
                      [q.id]: key
                    })
                  }
                />

                <span>{key}</span>

                {value}

              </label>
            ))}

          </div>
        ))}

      </div>

      <button
        className="primary-btn"
        onClick={submitAssessment}
      >
        Finish Assessment
        <CheckCircle2 size={18} />
      </button>

    </section>
  );
}