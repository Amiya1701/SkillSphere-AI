import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Target, Clock, CalendarDays, ArrowRight } from "lucide-react";
import { api } from "./api";

export default function GoalSetup() {
  const [technologies, setTechnologies] = useState([]);
  const [technologyId, setTechnologyId] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [hours, setHours] = useState(7);
  const [targetDate, setTargetDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/technologies")
      .then((response) => {
        setTechnologies(response.data);
      })
      .catch((error) => {
        console.error("Failed to load technologies:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function createGoal(event) {
    event.preventDefault();

    if (!technologyId) {
      alert("Please select a technology.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/goals", {
        technology_id: Number(technologyId),
        target_level: level,
        hours_per_week: Number(hours),
        target_date: targetDate || null
      });

      navigate("/roadmap");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to create learning goal."
      );

    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="loading">
        Loading technologies...
      </div>
    );
  }

  return (
    <section className="page narrow">

      <Link
        to="/dashboard"
        className="back"
      >
        ← Back to Dashboard
      </Link>

      <div className="section-head">

        <div className="eyebrow">
          PERSONALIZED LEARNING
        </div>

        <h1>
          Set Your Learning Goal
        </h1>

        <p>
          Tell SkillSphere what you want to learn.
          We'll use this information to build your
          learning journey.
        </p>

      </div>

      <form
        className="goal-card"
        onSubmit={createGoal}
      >

        <div className="form-group">

          <label>
            <Target size={18} />
            What do you want to learn?
          </label>

          <select
            value={technologyId}
            onChange={(e) =>
              setTechnologyId(e.target.value)
            }
          >

            <option value="">
              Select a technology
            </option>

            {technologies.map((technology) => (
              <option
                key={technology.id}
                value={technology.id}
              >
                {technology.name}
              </option>
            ))}

          </select>

        </div>


        <div className="form-group">

          <label>
            What is your target level?
          </label>

          <div className="level-options">

            {[
              "Beginner",
              "Intermediate",
              "Advanced"
            ].map((item) => (

              <button
                type="button"
                key={item}
                className={
                  level === item
                    ? "level-option active"
                    : "level-option"
                }
                onClick={() => setLevel(item)}
              >
                {item}
              </button>

            ))}

          </div>

        </div>


        <div className="form-group">

          <label>
            <Clock size={18} />
            How much time can you spend?
          </label>

          <div className="hours-input">

            <input
              type="number"
              min="1"
              max="168"
              value={hours}
              onChange={(e) =>
                setHours(e.target.value)
              }
            />

            <span>
              hours / week
            </span>

          </div>

        </div>


        <div className="form-group">

          <label>
            <CalendarDays size={18} />
            Target date
          </label>

          <input
            type="date"
            value={targetDate}
            onChange={(e) =>
              setTargetDate(e.target.value)
            }
          />

        </div>


        <button
          className="primary-btn"
          type="submit"
          disabled={saving}
        >

          {saving
            ? "Creating your roadmap..."
            : "Create My Roadmap"
          }

          {!saving && (
            <ArrowRight size={18} />
          )}

        </button>

      </form>

    </section>
  );
}