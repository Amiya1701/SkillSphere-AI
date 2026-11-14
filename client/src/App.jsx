import GoalSetup from "./GoalSetup";
import Assessment from "./Assessment";
import React from "react";
import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle2, CircleUserRound, GraduationCap, LogIn, LogOut, Menu, PlayCircle, Sparkles, Target, Trophy, X } from "lucide-react";
import { api } from "./api";

const techColors = ["violet", "cyan", "pink", "amber", "emerald", "blue"];

function Layout({ children }) {
  const nav = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("skillsphere_user") || "null"));
  function logout() { localStorage.clear(); setUser(null); nav("/"); }
  return <div className="app-shell">
    <header className="nav">
      <Link className="brand" to="/"><span className="brand-mark">S</span> SkillSphere <b>AI</b></Link>
      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/technologies">Explore</Link>
        {user ? <button className="ghost-btn" onClick={logout}><LogOut size={16} /> Logout</button> : <Link className="primary-btn small" to="/login"><LogIn size={16} /> Login</Link>}
      </nav>
    </header>
    <main>{children}</main>
    <footer>SkillSphere AI • Learn smarter, one roadmap at a time.</footer>
  </div>
}

function Home() {
  const bubbles = ["AI", "Machine Learning", "DSA", "DBMS", "Deep Learning", "Computer Networks", "Java", "Python", "React"];
  return <Layout><section className="hero">
    <div className="hero-copy">
      <div className="eyebrow"><Sparkles size={15} /> PERSONALIZED ENGINEERING LEARNING</div>
      <h1>Turn every technology into a <span>clear learning journey.</span></h1>
      <p>Explore interactive roadmaps, curated resources, quizzes, progress analytics and an AI learning assistant in one focused platform.</p>
      <div className="hero-actions"><Link className="primary-btn" to="/register">Start Learning <ArrowRight size={18} /></Link><Link className="secondary-btn" to="/technologies">Explore Roadmaps</Link></div>
      <div className="mini-stats"><div><b>10+</b><span>Technologies</span></div><div><b>50+</b><span>Roadmap Topics</span></div><div><b>AI</b><span>Learning Assistant</span></div></div>
    </div>
    <div className="bubble-space">
      {bubbles.map((b, i) => <motion.div key={b} className={`bubble b${i % 6}`} initial={{ opacity: 0, scale: .5 }} animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }} transition={{ delay: i * .08, duration: 4 + i * .15, repeat: Infinity, ease: "easeInOut" }}><span>{i === 1 || i === 4 ? "◉" : "◆"}</span>{b}</motion.div>)}
      <div className="core-orb"><Brain size={34} /><span>Learn</span></div>
    </div>
  </section></Layout>
}

function Auth({ mode = "login" }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", level: "Beginner" });
  const [error, setError] = useState("");
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError(""); try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, form);
      localStorage.setItem("skillsphere_token", data.token); localStorage.setItem("skillsphere_user", JSON.stringify(data.user)); nav("/dashboard");
    } catch (e) { setError(e.response?.data?.message || "Something went wrong"); }
  }
  return <Layout><div className="auth-wrap"><form className="auth-card" onSubmit={submit}>
    <div className="icon-box"><GraduationCap /></div><h2>{mode === "login" ? "Welcome back" : "Create your learning profile"}</h2><p>{mode === "login" ? "Continue your learning journey." : "Start building your engineering roadmap."}</p>
    {mode === "register" && <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />}
    <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
    <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
    {mode === "register" && <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>}
    {error && <div className="error">{error}</div>}<button className="primary-btn full">{mode === "login" ? "Login" : "Create Account"} <ArrowRight size={17} /></button>
    <p className="switch">{mode === "login" ? <>New here? <Link to="/register">Create an account</Link></> : <>Already registered? <Link to="/login">Login</Link></>}</p>
  </form></div></Layout>
}

function Protected({ children }) { return localStorage.getItem("skillsphere_token") ? children : <Navigate to="/login" /> }

function Technologies() {
  const [techs, setTechs] = useState([]);
  useEffect(() => { api.get("/technologies").then(r => setTechs(r.data)).catch(console.error) }, []);
  return <Layout><section className="page"><div className="section-head"><div><div className="eyebrow">EXPLORE</div><h2>Choose your technology</h2><p>Pick a path and follow a structured roadmap from fundamentals to projects.</p></div></div>
    <div className="tech-grid">{techs.map((t, i) => <Link to={`/technology/${t.slug}`} className="tech-card" key={t.id}><div className={`tech-icon ${techColors[i % 6]}`}>{t.icon}</div><div><h3>{t.name}</h3><p>{t.description}</p><span>{t.category}</span></div><ArrowRight /></Link>)}</div>
  </section></Layout>
}

function Technology() {
  const { slug } = useParams(); const [data, setData] = useState(null);
  useEffect(() => { api.get(`/technologies/${slug}`).then(r => setData(r.data)) }, [slug]);
  if (!data) return <Layout><div className="loading">Loading roadmap…</div></Layout>;
  const { technology, topics } = data;
  return <Layout><section className="page">
    <Link className="back" to="/technologies">← All technologies</Link>
    <div className="roadmap-title"><div><div className="eyebrow">LEARNING ROADMAP</div><h2>{technology.icon} {technology.name}</h2><p>{technology.description}</p></div><div className="roadmap-badge"><Target /> {topics.length} topics</div></div>
    <div className="roadmap">{topics.map((topic, i) => <div className="road-row" key={topic.id}><div className="road-line"><div className="road-dot">{i + 1}</div>{i < topics.length - 1 && <div className="connector" />}</div><Link className="road-card" to={`/topic/${topic.id}`}><div><span className="pill">{topic.difficulty}</span><h3>{topic.title}</h3><p>{topic.description}</p><small>~{topic.estimated_hours} hours</small></div><ArrowRight /></Link></div>)}</div>
  </section></Layout>
}

function Topic() {
  const { id } = useParams(); const [data, setData] = useState(null); const [done, setDone] = useState(false); const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { api.get(`/roadmaps/topic/${id}`).then(r => setData(r.data)); if (localStorage.getItem("skillsphere_token")) api.get("/progress/me").then(r => setDone(r.data.some(x => x.topic_id === Number(id) && x.completed))) }, [id]);
  if (!data) return <Layout><div className="loading">Loading topic…</div></Layout>;
  async function complete() { const next = !done; setDone(next); await api.post(`/progress/topic/${id}`, { completed: next }) }
  async function ask() { if (!question) return; setBusy(true); try { const r = await api.post("/ai/ask", { question, topic: data.topic.title, technology: data.topic.technology_name }); setAnswer(r.data.answer) } catch { setAnswer("Please log in and check the AI service configuration.") } finally { setBusy(false) } }
  return <Layout><section className="page topic-page"><Link className="back" to={`/technology/${data.topic.technology_slug}`}>← Back to roadmap</Link>
    <div className="topic-hero"><div><span className="pill">{data.topic.difficulty}</span><h2>{data.topic.title}</h2><p>{data.topic.description}</p></div><button className={done ? "complete-btn done" : "complete-btn"} onClick={complete}>{done ? <CheckCircle2 /> : <CircleUserRound />}{done ? "Completed" : "Mark Complete"}</button></div>
    <div className="content-grid"><div><div className="content-card"><h3>What you should learn</h3><ul className="learn-list"><li>Understand the core concept and terminology.</li><li>Study one guided explanation and take notes.</li><li>Practice with examples before moving forward.</li><li>Complete the quiz and mark the topic complete.</li></ul></div>
      <div className="content-card"><h3>Learning resources</h3>{data.resources.map(r => <a className="resource" href={r.url} target="_blank" rel="noreferrer" key={r.id}><div className="resource-icon">{r.type === "FREE_VIDEO" ? <PlayCircle /> : <GraduationCap />}</div><div><b>{r.title}</b><p>{r.provider} • {r.type.replaceAll("_", " ")}</p><small>{r.description}</small></div><ArrowRight /></a>)}</div></div>
      <div><div className="ai-card"><div className="ai-title"><Sparkles /> SkillSphere AI</div><h3>Ask about this topic</h3><p>Get a simple, contextual explanation without leaving your roadmap.</p><textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. Explain this concept with a simple example…" /><button className="primary-btn full" onClick={ask} disabled={busy}>{busy ? "Thinking…" : "Ask AI"}</button>{answer && <div className="ai-answer">{answer}</div>}</div><Link className="quiz-banner" to={`/quiz/${id}`}><Trophy /><div><b>Test your knowledge</b><span>Take the topic quiz</span></div><ArrowRight /></Link></div></div>
  </section></Layout>
}

function Quiz() {
  const { id } = useParams(); const [qs, setQs] = useState([]); const [answers, setAnswers] = useState({}); const [result, setResult] = useState(null);
  useEffect(() => { api.get(`/quizzes/topic/${id}`).then(r => setQs(r.data)) }, [id]);
  async function submit() { const r = await api.post("/quizzes/submit", { topicId: id, answers }); setResult(r.data) }
  return <Layout><section className="page narrow"><Link className="back" to={`/topic/${id}`}>← Back to topic</Link><div className="section-head"><div><div className="eyebrow">KNOWLEDGE CHECK</div><h2>Topic Quiz</h2></div></div>{result ? <div className="result-card"><Trophy size={42} /><h2>{result.score}/{result.total}</h2><p>You scored {result.percentage}%.</p><Link className="primary-btn" to="/dashboard">View Progress</Link></div> : <><div className="quiz-list">{qs.map((q, i) => <div className="question" key={q.id}><b>{i + 1}. {q.question}</b>{[["A", q.option_a], ["B", q.option_b], ["C", q.option_c], ["D", q.option_d]].map(([k, v]) => <label key={k} className={answers[q.id] === k ? "option selected" : "option"}><input type="radio" name={q.id} checked={answers[q.id] === k} onChange={() => setAnswers({ ...answers, [q.id]: k })} /><span>{k}</span>{v}</label>)}</div>)}</div><button className="primary-btn" onClick={submit}>Submit Quiz <ArrowRight /></button></>}</section></Layout>
}

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("skillsphere_user") || "{}"); const [progress, setProgress] = useState([]);
  useEffect(() => { api.get("/progress/me").then(r => setProgress(r.data)).catch(() => { }) }, []);
  const completed = progress.filter(x => x.completed).length; const percent = progress.length ? Math.round(completed / progress.length * 100) : 0;
  return <Layout><section className="page"><div className="dash-head"><div><div className="eyebrow">YOUR LEARNING SPACE</div><h2>Hello, {user.name || "Learner"} 👋</h2><p>Keep your momentum going and turn your roadmap into real skills.</p></div><Link
    className="secondary-btn"
    to="/assessment"
  >
    Take Skill Assessment
  </Link><Link className="primary-btn" to="/technologies">Explore Technologies</Link></div>
    <div className="stat-grid"><div className="stat"><Target /><span>Overall progress</span><b>{percent}%</b></div><div className="stat"><CheckCircle2 /><span>Topics completed</span><b>{completed}</b></div><div className="stat"><Trophy /><span>Quiz-ready topics</span><b>{progress.length}</b></div><div className="stat"><Sparkles /><span>AI assistant</span><b>Ready</b></div></div>
    <div className="dashboard-grid"><div className="content-card"><h3>Recent learning</h3>{progress.length ? <div className="progress-list">{progress.slice(0, 6).map(p => <div className="progress-row" key={p.topic_id}><div><b>{p.title}</b><span>{p.technology}</span></div><span className={p.completed ? "status done" : "status"}>{p.completed ? "Completed" : "In progress"}</span></div>)}</div> : <div className="empty">No progress yet. Pick a technology to begin.</div>}</div><div className="content-card insight"><Sparkles /><h3>Personalized next step</h3><p>Start with a beginner roadmap, complete one topic, then take its quiz. Your progress will become the basis for future recommendations.</p><Link to="/technologies">Build my roadmap →</Link></div></div>
  </section></Layout>
}

function App() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/login" element={<Auth mode="login" />} /><Route path="/register" element={<Auth mode="register" />} /><Route path="/technologies" element={<Technologies />} /><Route
    path="/assessment"
    element={
      <Protected>
        <Assessment />
      </Protected>
    }
  /><Route
  path="/goal-setup"
  element={
    <Protected>
      <GoalSetup />
    </Protected>
  }
/><Route path="/technology/:slug" element={<Technology />} /><Route path="/topic/:id" element={<Protected><Topic /></Protected>} /><Route path="/quiz/:id" element={<Protected><Quiz /></Protected>} /><Route path="/dashboard" element={<Protected><Dashboard /></Protected>} /></Routes>
}

export default App;
